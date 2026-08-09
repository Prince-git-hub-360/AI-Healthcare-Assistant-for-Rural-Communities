import os
import requests

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

LANGUAGE_NAMES = {
    "hi": "Hindi", "ta": "Tamil", "te": "Telugu", "bn": "Bengali",
    "mr": "Marathi", "gu": "Gujarati", "kn": "Kannada", "ml": "Malayalam",
    "pa": "Punjabi", "or": "Odia", "en": "English",
}


def translate_and_simplify(source_text: str, target_language: str) -> dict:
    """Calls Groq's LLM to translate medical text and simplify medical terms."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in .env")

    lang_name = LANGUAGE_NAMES.get(target_language, target_language)

    prompt = f"""You are a medical translation assistant helping rural patients understand their prescriptions and medical documents.

Given the following medical text, do two things:
1. Translate it fully into {lang_name}, keeping medicine names and dosages accurate.
2. Provide a short, simple explanation (in {lang_name}) of any medical terms, in plain language a non-medical person can understand.

Respond ONLY in this exact JSON format, nothing else:
{{"translated_text": "...", "simplified_explanation": "..."}}

Medical text:
\"\"\"{source_text}\"\"\"
"""

    response = requests.post(
        GROQ_API_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    content = data["choices"][0]["message"]["content"]

    import json
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {"translated_text": content, "simplified_explanation": ""}

    return parsed


def simplify_medical_text(source_text: str, language: str = "en") -> dict:
    """Converts medical jargon into plain language and gives context-based guidance,
    without necessarily translating (or translates if language != 'en')."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in .env")

    lang_name = LANGUAGE_NAMES.get(language, language)

    prompt = f"""You are a healthcare assistant helping a patient understand their medical text in simple terms.

Given the following medical text, respond in {lang_name} with:
1. A plain-language rewrite avoiding medical jargon (a 12-year-old should understand it).
2. A list of the key medical terms found, each with a one-line simple definition.
3. Brief context-based guidance: what the patient should generally do or watch for (do NOT give a diagnosis, just general safety guidance like "take with food", "contact a doctor if symptoms worsen", etc).

Respond ONLY in this exact JSON format, nothing else:
{{"plain_language": "...", "key_terms": [{{"term": "...", "meaning": "..."}}], "guidance": "..."}}

Medical text:
\"\"\"{source_text}\"\"\"
"""

    response = requests.post(
        GROQ_API_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    content = data["choices"][0]["message"]["content"]

    import json
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {"plain_language": content, "key_terms": [], "guidance": ""}

    return parsed


def extract_medical_entities(source_text: str) -> dict:
    """NLP Processing Engine — extracts diseases, medications, and treatment
    instructions as structured data from medical text."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in .env")

    prompt = f"""You are a medical NLP extraction engine. Extract structured information from the medical text below.

Respond ONLY in this exact JSON format, nothing else:
{{
  "diseases": ["..."],
  "medications": [{{"name": "...", "dosage": "...", "frequency": "..."}}],
  "treatment_instructions": ["..."],
  "other_entities": ["..."]
}}

Rules:
- "diseases": any conditions, diagnoses, or disease names mentioned.
- "medications": drug names with dosage and frequency if given (e.g. "500mg", "twice daily"). Leave dosage/frequency as "" if not mentioned.
- "treatment_instructions": actionable instructions (e.g. "take after food", "rest for 2 weeks", "follow up in 10 days").
- "other_entities": anything medically relevant that doesn't fit above (e.g. test names, body parts, symptoms).
- If a category has nothing, return an empty list for it.

Medical text:
\"\"\"{source_text}\"\"\"
"""

    response = requests.post(
        GROQ_API_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1,
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    content = data["choices"][0]["message"]["content"]

    import json
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {"diseases": [], "medications": [], "treatment_instructions": [], "other_entities": [], "raw": content}

    return parsed
def explain_symptom(query: str, language: str = "en") -> dict:
    """Symptom Explanation Module — gives general symptom information, disease
    awareness content, and preventive care tips. NOT a diagnosis."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in .env")

    lang_name = LANGUAGE_NAMES.get(language, language)

    prompt = f"""You are a public health information assistant for rural patients. You NEVER diagnose.
A user has asked about a symptom or health topic. Respond in {lang_name} with general educational information only.

Respond ONLY in this exact JSON format, nothing else:
{{
  "symptom_information": "...",
  "possible_related_conditions": ["...", "..."],
  "disease_awareness": "...",
  "preventive_care": ["...", "..."],
  "when_to_see_a_doctor": "..."
}}

Rules:
- "symptom_information": explain what the symptom/topic generally means, in plain language.
- "possible_related_conditions": list common, general conditions associated with it (educational only, NOT a diagnosis). Say clearly this is not a diagnosis.
- "disease_awareness": brief general awareness info about the most relevant condition.
- "preventive_care": general prevention/self-care tips (diet, hygiene, lifestyle) — never specific drug dosages.
- "when_to_see_a_doctor": red-flag signs that mean the person should seek medical care.
- Always be cautious, general, and safe. Do not name specific drug names or dosages.

User's question or symptom:
\"\"\"{query}\"\"\"
"""

    response = requests.post(
        GROQ_API_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3,
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    content = data["choices"][0]["message"]["content"]

    import json
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {
            "symptom_information": content,
            "possible_related_conditions": [],
            "disease_awareness": "",
            "preventive_care": [],
            "when_to_see_a_doctor": "",
        }

    return parsed
def generate_knowledge_content(topic: str, content_type: str = "faq", language: str = "en") -> dict:
    """Multilingual Knowledge Base — generates Healthcare FAQs, Common Disease
    Information, or Health Awareness Content on a given topic, in any language."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in .env")

    lang_name = LANGUAGE_NAMES.get(language, language)

    type_instructions = {
        "faq": "Write it as a clear Question & Answer pair (put the question in the title, the answer in the body).",
        "article": "Write it as general disease/health information — causes, symptoms overview, and general care, for public awareness.",
        "advisory": "Write it as a short public health awareness advisory or safety tip.",
    }
    instruction = type_instructions.get(content_type, type_instructions["article"])

    prompt = f"""You are writing public healthcare education content for rural patients in {lang_name}.
Topic: "{topic}"
{instruction}

Keep it simple, non-diagnostic, and safe (no specific drug dosages). Respond ONLY in this exact JSON format, nothing else:
{{"title": "...", "body": "...", "category": "..."}}

Rules:
- "title": short, clear title (or the question, if FAQ).
- "body": the main content, 2-5 sentences, in {lang_name}.
- "category": one short category label, e.g. "Maternal Health", "Nutrition", "First Aid", "Infectious Disease", "Preventive Care".
"""

    response = requests.post(
        GROQ_API_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.4,
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    content = data["choices"][0]["message"]["content"]

    import json
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {"title": topic, "body": content, "category": ""}

    return parsed