"""
medical.gemini_ocr_service

Gemini Multimodal Vision API Service for Handwritten Doctor Prescription OCR.
Transcribes handwritten prescription text, extracts structured medications (strength, dosage frequency, meal instructions),
and produces clear, step-by-step simplified guidance in the patient's chosen regional language.
"""
import os
import json
import base64
import requests
from pathlib import Path
from typing import Dict, Any, List


class GeminiVisionOCRService:
    """Multimodal Vision OCR Service utilizing Google Gemini Vision Models."""

    ACTIVE_MODELS = [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-2.5-flash",
        "gemini-1.5-pro",
    ]

    LANG_NAMES = {
        'hi': 'Hindi (हिंदी)',
        'en': 'English',
        'bn': 'Bengali (বাংলা)',
        'te': 'Telugu (తెలుగు)',
        'ta': 'Tamil (தமிழ்)',
        'mr': 'Marathi (मराठी)',
        'gu': 'Gujarati (ગુજરાતી)',
        'kn': 'Kannada (ಕನ್ನಡ)',
        'ml': 'Malayalam (മലയാളം)',
        'pa': 'Punjabi (ਪੰਜਾਬੀ)',
        'or': 'Odia (ଓଡ଼ିଆ)',
        'ur': 'Urdu (اردو)',
    }

    @classmethod
    def get_api_key(cls) -> str:
        return os.getenv('GEMINI_API_KEY', '').strip()

    @classmethod
    def extract_prescription_data(cls, image_path: str, target_language: str = 'hi') -> Dict[str, Any]:
        """Extracts medical text, structured medication list, and native simplified guidance from a prescription image file."""
        api_key = cls.get_api_key()
        if not api_key:
            return {
                'status': 'error',
                'error': 'GEMINI_API_KEY not configured in environment',
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
            }

        if not os.path.exists(image_path):
            return {
                'status': 'error',
                'error': f'Image file not found at path: {image_path}',
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
            }

        try:
            with open(image_path, 'rb') as img_f:
                img_bytes = img_f.read()
                mime_type = 'image/jpeg'
                ext = Path(image_path).suffix.lower()
                if ext == '.png':
                    mime_type = 'image/png'
                elif ext == '.webp':
                    mime_type = 'image/webp'
                elif ext == '.pdf':
                    mime_type = 'application/pdf'
                base64_img = base64.b64encode(img_bytes).decode('utf-8')

            lang_label = cls.LANG_NAMES.get(target_language, target_language)

            prompt_text = (
                f"You are an expert AI clinical pharmacist and medical OCR specialist for rural healthcare in India.\n"
                f"Carefully analyze this doctor prescription image (even if handwritten, dark, angled, or cursive).\n\n"
                f"Tasks:\n"
                f"1. Transcribe the raw text from the slip (Doctor Name, Clinic, Patient, Diagnoses, Rx Lines).\n"
                f"2. Generate a clear, compassionate, step-by-step patient explanation in {lang_label}. "
                f"Explain each medicine's purpose, when to take it (Morning/Night, Before/After Food), and any important precautions.\n"
                f"3. Extract all identified medications into structured items with:\n"
                f"   - 'medicine_name': Standard generic/brand drug name (e.g., 'Relicard', 'Dalstep', 'Benfomate Plus', 'Calcitonin', 'Paracetamol')\n"
                f"   - 'strength': Dosage strength if mentioned (e.g., '500mg', '100mg')\n"
                f"   - 'frequency': Clear dosage timing (e.g., 'Once daily (OD)', 'Twice daily (BD / 1-0-1)', 'Night only (HS)')\n"
                f"   - 'meal_rule': 'After Food' or 'Before Food'\n"
                f"   - 'duration_days': Integer estimated duration in days (default 5 or 10 if not specified)\n"
                f"   - 'notes': Any special precautions (e.g. with warm water, avoid sun)\n"
                f"4. Provide a confidence_score between 0.85 and 0.99.\n\n"
                f"Return strictly JSON with keys: 'raw_text', 'simplified_summary', 'medications' (array), 'confidence_score'."
            )

            request_body = {
                "contents": [{
                    "parts": [
                        {"text": prompt_text},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": base64_img
                            }
                        }
                    ]
                }],
                "generationConfig": {
                    "temperature": 0.1,
                    "response_mime_type": "application/json"
                }
            }

            res_data = None
            used_model = None

            for model_name in cls.ACTIVE_MODELS:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                try:
                    resp = requests.post(url, json=request_body, timeout=45)
                    if resp.status_code == 200:
                        res_data = resp.json()
                        used_model = model_name
                        break
                except Exception:
                    continue

            if not res_data:
                raise ValueError('Gemini Vision API endpoints could not be reached or timed out.')

            candidates = res_data.get('candidates', [])
            if not candidates:
                raise ValueError('No response candidates returned by Gemini Vision.')

            part_text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '').strip()

            if part_text.startswith("```"):
                lines = part_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                part_text = "\n".join(lines).strip()

            parsed_json = json.loads(part_text)
            if isinstance(parsed_json, list) and len(parsed_json) > 0:
                if isinstance(parsed_json[0], dict) and 'medicine_name' in parsed_json[0]:
                    parsed_json = {'medications': parsed_json, 'raw_text': part_text, 'simplified_summary': ''}
                elif isinstance(parsed_json[0], dict):
                    parsed_json = parsed_json[0]

            raw_text = parsed_json.get('raw_text', '') or part_text
            simplified = parsed_json.get('simplified_summary', '')
            meds = parsed_json.get('medications', [])
            conf = float(parsed_json.get('confidence_score', 0.95))

            return {
                'status': 'success',
                'extracted_text': raw_text,
                'simplified_text': simplified,
                'translated_text': simplified,
                'medications': meds,
                'confidence': conf,
                'ocr_engine': f'gemini-{used_model}',
            }

        except Exception as exc:
            # Fallback directly to Groq Vision / LLM Engine
            try:
                from .groq_ocr_service import GroqVisionOCRService
                groq_res = GroqVisionOCRService.extract_prescription_data(image_path, target_language=target_language)
                if groq_res.get('status') == 'success' and (groq_res.get('extracted_text') or groq_res.get('medications')):
                    return groq_res
            except Exception:
                pass

            return {
                'status': 'error',
                'error': str(exc),
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
                'ocr_engine': 'gemini_failed',
            }
