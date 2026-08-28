"""
ai_assistant.services.gemini_service

Swasthya Mitr AI Medicine Assistant Service using Google Gemini API.
"""
import os
import json
import logging
import urllib.request
import urllib.error
from django.conf import settings

logger = logging.getLogger(__name__)

GEMINI_SYSTEM_PROMPT = """You are Swasthya Mitr, an intelligent, empathetic, and concise healthcare communication assistant designed for rural communities.
Your primary role is to help patients understand medicines and prescriptions in simple, accessible language.

CRITICAL INSTRUCTIONS FOR DIRECT & CONCISE ANSWERS:
1. ANSWER ONLY WHAT IS ASKED: Answer the patient's specific question directly, clearly, and concisely in 2 to 4 sentences.
   - If the patient asks "Why should I take this medicine?" -> Answer ONLY what condition it treats and why it helps, in simple words. Do NOT include unasked sections about food, side effects, or schedules.
   - If the patient asks "When should I take it?" -> Answer ONLY the timing/schedule based on the prescription.
   - If the patient asks "With or without food?" -> Answer ONLY the meal rule.
   - If the patient asks "What are the side effects?" -> Answer ONLY the common side effects.
   - Only provide a comprehensive overview if the patient explicitly asks "Explain my prescription" or "Tell me everything about this medicine".
2. NO REPETITIVE GREETINGS OR BOILERPLATE: Do NOT start every single message with "Namaste! I am Swasthya Mitr...". Get straight to the helpful answer.
3. CONVERSATIONAL & EMPATHETIC: Keep tone warm, respectful, and easy to understand for everyday people. Avoid heavy medical jargon.
4. LANGUAGE STRICTNESS: Always respond in the requested language (e.g. English, Hindi, Kannada, Tamil, etc.). Do not mix languages.

CRITICAL HEALTHCARE SAFETY CONSTRAINTS:
1. You are NOT a medical doctor. You MUST NOT diagnose medical conditions, create new prescriptions, or prescribe treatments.
2. DO NOT change, modify, increase, or decrease the doctor's prescribed dosage, frequency, or treatment duration.
3. DO NOT tell the patient to stop taking a prescribed medicine unless explicitly told by their treating doctor.
4. If prescription information is incomplete or missing for a question about dosage/schedule, state: "Your prescription does not specify this. Please confirm with your doctor or pharmacist."
5. Never recommend substituting one medicine for another.
6. UNKNOWN MEDICINES: If you cannot identify a medicine name, politely ask the patient to check the prescription spelling.
"""


class GeminiMedicineAssistantService:
    """Service class for interfacing with Google Gemini API for medicine guidance."""

    MODELS_TO_TRY = [
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-pro",
    ]

    @classmethod
    def get_api_key(cls) -> str:
        """Retrieves Gemini API Key from environment or Django settings."""
        api_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", "")
        return api_key.strip() if api_key else ""

    @classmethod
    def generate_medicine_explanation(
        cls,
        question: str,
        medicine_data: dict = None,
        language: str = "English",
        conversation_history: list = None
    ) -> dict:
        """
        Sends context-aware request to Gemini API and returns structured explanation.
        """
        api_key = cls.get_api_key()

        # Build context prompt
        medicine_context_str = ""
        med_name = ""
        if medicine_data and isinstance(medicine_data, dict):
            med_name = medicine_data.get("medicine_name") or medicine_data.get("name") or ""
            dosage = medicine_data.get("dosage") or medicine_data.get("strength") or "As prescribed"
            frequency = medicine_data.get("frequency") or medicine_data.get("timing") or "As directed"
            duration = medicine_data.get("duration") or medicine_data.get("instructions") or "As directed"
            extra_instructions = medicine_data.get("instructions") or medicine_data.get("prescription_context") or ""

            medicine_context_str = (
                f"CURRENT PRESCRIPTION CONTEXT:\n"
                f"- Medicine Name: {med_name}\n"
                f"- Prescribed Dosage: {dosage}\n"
                f"- Prescribed Frequency: {frequency}\n"
                f"- Prescribed Duration: {duration}\n"
                f"- Additional Prescription Instructions: {extra_instructions}\n"
            )

        history_str = ""
        if conversation_history and isinstance(conversation_history, list):
            formatted_history = []
            for item in conversation_history[-6:]:  # limit last 6 turns
                role = item.get("role") or item.get("sender") or "user"
                text = item.get("text") or item.get("content") or ""
                if text:
                    formatted_history.append(f"{role.upper()}: {text}")
            if formatted_history:
                history_str = "PREVIOUS CONVERSATION HISTORY:\n" + "\n".join(formatted_history) + "\n"

        prompt_body = (
            f"{GEMINI_SYSTEM_PROMPT}\n\n"
            f"TARGET RESPONSE LANGUAGE: {language}\n\n"
            f"{medicine_context_str}\n"
            f"{history_str}\n"
            f"PATIENT QUESTION: {question}\n\n"
            f"Please answer the patient's question in simple {language} adhering strictly to all safety constraints."
        )

        if not api_key:
            logger.warning("GEMINI_API_KEY is not set. Returning safe contextual fallback response.")
            return {
                "success": True,
                "answer": cls._generate_fallback_response(question, med_name, medicine_data, language),
                "medicine": med_name,
                "language": language,
                "is_fallback": True
            }

        # Make HTTP request to Gemini REST API
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt_body}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "topP": 0.8,
                "maxOutputTokens": 1024,
            }
        }

        json_data = json.dumps(payload).encode("utf-8")

        for model_name in cls.MODELS_TO_TRY:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            req = urllib.request.Request(
                url,
                data=json_data,
                headers={"Content-Type": "application/json"},
                method="POST"
            )

            try:
                with urllib.request.urlopen(req, timeout=12) as response:
                    res_body = response.read().decode("utf-8")
                    res_json = json.loads(res_body)

                    candidates = res_json.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            generated_text = parts[0]["text"].strip()
                            return {
                                "success": True,
                                "answer": generated_text,
                                "medicine": med_name,
                                "language": language,
                                "model_used": model_name,
                                "is_fallback": False
                            }
            except urllib.error.HTTPError as http_err:
                logger.warning(f"Gemini API model {model_name} HTTP Error: {http_err.code} {http_err.reason}")
                continue
            except Exception as e:
                logger.warning(f"Gemini API error with model {model_name}: {str(e)}")
                continue

        # If all API calls fail, return clean fallback
        return {
            "success": True,
            "answer": cls._generate_fallback_response(question, med_name, medicine_data, language),
            "medicine": med_name,
            "language": language,
            "is_fallback": True
        }

    @classmethod
    def _generate_fallback_response(cls, question: str, med_name: str, medicine_data: dict, language: str) -> str:
        """Generates a safe structured offline fallback explanation when Gemini API is unavailable."""
        dosage = (medicine_data.get("dosage") if medicine_data else "") or "As prescribed by doctor"
        freq = (medicine_data.get("frequency") if medicine_data else "") or "As directed"
        dur = (medicine_data.get("duration") if medicine_data else "") or "As advised"

        lang_code = language.lower()
        if "kannada" in lang_code or lang_code == "kn":
            if med_name:
                return (
                    f"💊 **{med_name} ಬಗ್ಗೆ ಮಾಹಿತಿ:**\n"
                    f"ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವಿವರದಂತೆ: {dosage}, {freq}, {dur}.\n\n"
                    f"🕐 **ಸೇವಿಸುವ ವಿಧಾನ:**\n"
                    f"ವೈದ್ಯರು ಸೂಚಿಸಿದಂತೆ ಸರಿಯಾದ ಸಮಯಕ್ಕೆ ಉಗುರುಬೆಚ್ಚಗಿನ ನೀರಿನೊಂದಿಗೆ ತೆಗೆದುಕೊಳ್ಳಿ.\n\n"
                    f"🍽️ **ಆಹಾರದ ನಿಯಮ:**\n"
                    f"ಔಷಧಿಯನ್ನು ಸಾಮಾನ್ಯ ಆಹಾರ ಅಥವಾ ತಿಂಡಿಯ ನಂತರ ಸೇವಿಸುವುದು ಸೂಕ್ತ.\n\n"
                    f"❗ **ಪ್ರಮುಖ ಸೂಚನೆ:**\n"
                    f"ವೈದ್ಯರ ಸಲಹೆಯಿಲ್ಲದೆ ಡೋಸೇಜ್ ಬದಲಾಯಿಸಬೇಡಿ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗೆ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಅಥವಾ ಫಾರ್ಮಸಿಸ್ಟ್ ಸಂಪರ್ಕಿಸಿ."
                )
            return (
                "🙏 **ಸ್ವಾಸ್ಥ್ಯ ಮಿತ್ರ ಸಹಾಯ:**\n"
                "ನಿಮ್ಮ ಔಷಧಿಯನ್ನು ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಪ್ರಕಾರ ಸರಿಯಾಗಿ ಸೇವಿಸಿ. ಯಾವುದೇ ಸಂಶಯವಿದ್ದರೆ ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
            )

        if "hindi" in lang_code or lang_code == "hi":
            if med_name:
                return (
                    f"💊 **{med_name} की जानकारी:**\n"
                    f"आपके पर्चे के अनुसार: खुराक {dosage}, समय {freq}, अवधि {dur}।\n\n"
                    f"🕐 **कब लें?**\n"
                    f"डॉक्टर द्वारा बताए गए समय पर ताजे पानी के साथ लें।\n\n"
                    f"🍽️ **भोजन के साथ:**\n"
                    f"दवा को हमेशा हल्के नाश्ते या खाने के बाद लें।\n\n"
                    f"❗ **महत्वपूर्ण:**\n"
                    f"डॉक्टर की सलाह के बिना खुराक न बदलें। किसी भी समस्या के लिए पास के स्वास्थ्य केंद्र (PHC) से संपर्क करें।"
                )
            return (
                "🙏 **स्वास्थ्य मित्र सहायता:**\n"
                "कृपया अपनी दवा डॉक्टर के पर्चे के अनुसार लें। अधिक जानकारी के लिए अपने डॉक्टर या फार्मासिस्ट से संपर्क करें।"
            )

        # Default English fallback
        if med_name:
            return (
                f"💊 **About {med_name}:**\n"
                f"According to your prescription record: Dosage - {dosage}, Frequency - {freq}, Duration - {dur}.\n\n"
                f"🕐 **When to take:**\n"
                f"Take strictly as prescribed by your healthcare provider at scheduled timings.\n\n"
                f"🍽️ **Food Guidelines:**\n"
                f"It is generally advised to take your medicine after meals with plain drinking water unless instructed otherwise.\n\n"
                f"⚠️ **General Guidance:**\n"
                f"If you experience unusual discomfort, notify your doctor or healthcare worker.\n\n"
                f"❗ **Important Safety Note:**\n"
                f"Never alter your dose or stop taking prescribed medication without consulting your doctor or pharmacist."
            )

        return (
            "🙏 **Swasthya Mitr Assistant:**\n"
            "Please follow your prescription instructions carefully. Always consult your doctor or pharmacist if you have questions about your prescribed dosage."
        )
