"""
medical.groq_ocr_service

Groq AI Vision & Multimodal Prescription Extraction Service.
Uses Groq API (llama-3.2-11b-vision-preview / llama-3.2-90b-vision-preview / llama-3.3-70b-versatile)
to transcribe handwritten & printed doctor prescriptions, extract medicines (AZITHROMYCIN, LEVOCETIRIZINE, AMBROXOL),
and simplify instructions for rural patients in their native language.
"""
import os
import json
import re
import base64
import urllib.request
import urllib.error
from pathlib import Path
from typing import Dict, Any, List


class GroqVisionOCRService:
    """Multimodal Vision & Prescription Extraction Service utilizing Groq API."""

    ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"
    DEFAULT_API_KEY = "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"

    @classmethod
    def get_api_key(cls) -> str:
        return os.getenv('GROQ_API_KEY', cls.DEFAULT_API_KEY).strip()

    @classmethod
    def clean_json_response(cls, text: str) -> Dict[str, Any]:
        """Extracts and parses JSON object from text that may contain markdown code fences."""
        text = text.strip()
        # Remove ```json ... ``` fences if present
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()

        # Regex search for first '{' to last '}'
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            text = match.group(0)

        return json.loads(text)

    @classmethod
    def process_text_with_groq(cls, raw_prescription_text: str, target_language: str = 'hi') -> Dict[str, Any]:
        """Uses Groq Llama 3.3 70B model to parse raw prescription text into structured JSON and simplified regional advice."""
        api_key = cls.get_api_key()
        if not api_key or not raw_prescription_text:
            return {'status': 'error', 'error': 'Missing API key or text'}

        prompt = (
            f"You are an expert AI medical assistant for rural Indian healthcare.\n"
            f"Parse this doctor prescription text carefully:\n"
            f"1. Extract full raw prescription text.\n"
            f"2. Provide clear, simple, step-by-step patient advice in regional language: '{target_language}'.\n"
            f"3. Extract structured medication items (medicine_name, strength, frequency, meal_rule, duration_days).\n"
            f"Return JSON strictly with format:\n"
            f"{{\n"
            f'  "raw_text": "Full transcribed prescription text",\n'
            f'  "simplified_summary": "Simplified regional explanation for patient",\n'
            f'  "medications": [\n'
            f'    {{"medicine_name": "Medicine", "strength": "500mg", "frequency": "Once daily", "meal_rule": "After food", "duration_days": 7}}\n'
            f'  ],\n'
            f'  "confidence_score": 0.95\n'
            f"}}\n\n"
            f"Prescription Text:\n{raw_prescription_text}"
        )

        candidate_models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
        for model_name in candidate_models:
            try:
                payload = {"model": model_name, "messages": [{"role": "user", "content": prompt}], "temperature": 0.1}
                req = urllib.request.Request(
                    cls.ENDPOINT,
                    data=json.dumps(payload).encode('utf-8'),
                    headers={
                        'Authorization': f'Bearer {api_key}',
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    }
                )
                with urllib.request.urlopen(req, timeout=30) as response:
                    res_data = json.loads(response.read().decode('utf-8'))

                choices = res_data.get('choices', [])
                if choices and choices[0].get('message'):
                    raw_content = choices[0]['message'].get('content', '')
                    parsed_json = cls.clean_json_response(raw_content)
                    return {
                        'status': 'success',
                        'extracted_text': parsed_json.get('raw_text', '') or raw_prescription_text,
                        'simplified_text': parsed_json.get('simplified_summary', ''),
                        'medications': parsed_json.get('medications', []),
                        'confidence': float(parsed_json.get('confidence_score', 0.95)),
                        'ocr_engine': f'groq-{model_name}',
                    }
            except Exception:
                continue

        return {'status': 'error', 'error': 'Groq text processing failed'}

    @classmethod
    def extract_prescription_data(cls, file_path: str, target_language: str = 'hi') -> Dict[str, Any]:
        """Extracts medical text, medication list, and regional simplified guidance from prescription image or PDF."""
        api_key = cls.get_api_key()
        if not api_key:
            return {
                'status': 'error',
                'error': 'GROQ_API_KEY not configured',
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
            }

        if not os.path.exists(file_path):
            return {
                'status': 'error',
                'error': f'Prescription file not found at path: {file_path}',
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
            }

        try:
            ext = Path(file_path).suffix.lower()
            mime_type = 'image/jpeg'
            if ext == '.png':
                mime_type = 'image/png'
            elif ext == '.webp':
                mime_type = 'image/webp'
            elif ext == '.pdf':
                mime_type = 'application/pdf'

            # Read file bytes & encode to base64
            with open(file_path, 'rb') as f:
                file_bytes = f.read()
                base64_data = base64.b64encode(file_bytes).decode('utf-8')

            prompt_text = (
                f"You are an expert AI medical assistant for rural Indian healthcare. Analyze this doctor prescription image carefully.\n"
                f"1. Transcribe the full raw text (Doctor Name, Clinic Name, Patient Details, Clinical Findings/Diagnosis, and all Medication names like Azithromycin, Levocetirizine, Ambroxol, strengths, dosages).\n"
                f"2. Provide clear, simple, step-by-step patient advice in regional language: '{target_language}'.\n"
                f"3. Extract structured medication items (medicine_name, strength, frequency, meal_rule, duration_days).\n"
                f"Return JSON strictly with format:\n"
                f"{{\n"
                f'  "raw_text": "Full transcribed prescription text",\n'
                f'  "simplified_summary": "Simplified regional explanation for patient",\n'
                f'  "medications": [\n'
                f'    {{"medicine_name": "Azithromycin", "strength": "500mg", "frequency": "Once daily", "meal_rule": "After food", "duration_days": 7}}\n'
                f'  ],\n'
                f'  "confidence_score": 0.95\n'
                f"}}\n"
            )

            is_image = ext in ['.png', '.jpg', '.jpeg', '.webp']

            if is_image:
                # 1. Try Groq Vision Models if enabled
                vision_models = ["llama-3.2-11b-vision-preview", "llama-3.2-90b-vision-preview"]
                content_list = [
                    {"type": "text", "text": prompt_text},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{base64_data}"
                        }
                    }
                ]
                for model_name in vision_models:
                    try:
                        messages = [{"role": "user", "content": content_list}]
                        payload = {"model": model_name, "messages": messages, "temperature": 0.1}
                        req = urllib.request.Request(
                            cls.ENDPOINT,
                            data=json.dumps(payload).encode('utf-8'),
                            headers={
                                'Authorization': f'Bearer {api_key}',
                                'Content-Type': 'application/json',
                                'User-Agent': 'Mozilla/5.0'
                            }
                        )
                        with urllib.request.urlopen(req, timeout=30) as response:
                            res_data = json.loads(response.read().decode('utf-8'))
                        choices = res_data.get('choices', [])
                        if choices and choices[0].get('message'):
                            raw_content = choices[0]['message'].get('content', '')
                            parsed_json = cls.clean_json_response(raw_content)
                            return {
                                'status': 'success',
                                'extracted_text': parsed_json.get('raw_text', '') or raw_content,
                                'simplified_text': parsed_json.get('simplified_summary', ''),
                                'medications': parsed_json.get('medications', []),
                                'confidence': float(parsed_json.get('confidence_score', 0.95)),
                                'ocr_engine': f'groq-{model_name}',
                            }
                    except Exception:
                        continue

                # 2. Extract image text via pytesseract/PIL if available and send to llama-3.3-70b-versatile
                extracted_image_text = ""
                try:
                    from PIL import Image
                    import pytesseract
                    img = Image.open(file_path)
                    extracted_image_text = pytesseract.image_to_string(img)
                except Exception:
                    pass

                text_content = extracted_image_text

            else:
                # Text/PDF models
                pdf_text = ""
                try:
                    import pypdf
                    reader = pypdf.PdfReader(file_path)
                    for page in reader.pages:
                        pdf_text += page.extract_text() or ""
                except Exception:
                    pass

                text_content = pdf_text

            if text_content and text_content.strip():
                return cls.process_text_with_groq(text_content, target_language=target_language)

            return {
                'status': 'error',
                'error': 'Groq Vision OCR model execution returned empty response',
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
            }

        except Exception as exc:
            return {
                'status': 'error',
                'error': f'Groq OCR Exception: {str(exc)}',
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
            }

