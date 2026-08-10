"""
medical.gemini_ocr_service

Gemini 1.5 Flash Multimodal Vision API Service for Handwritten Doctor Prescription OCR.
Extracts handwritten prescription text, medicine names, strengths, dosage schedules (1-0-1),
and translates into simplified regional language explanations.
"""
import os
import json
import base64
import urllib.request
import urllib.error
from pathlib import Path
from typing import Dict, Any, List


class GeminiVisionOCRService:
    """Multimodal Vision OCR Service utilizing Gemini 1.5 Flash API."""

    ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

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
            # Read and base64-encode image
            with open(image_path, 'rb') as img_f:
                img_bytes = img_f.read()
                mime_type = 'image/jpeg'
                ext = Path(image_path).suffix.lower()
                if ext == '.png':
                    mime_type = 'image/png'
                elif ext == '.pdf':
                    mime_type = 'application/pdf'
                base64_img = base64.b64encode(img_bytes).decode('utf-8')

            prompt_text = (
                f"You are a expert medical NLP assistant for rural healthcare. Analyze this handwritten doctor prescription image carefully.\n"
                f"1. Transcribe the raw doctor handwriting text.\n"
                f"2. Simplify the instructions into clear plain language suitable for a rural patient in language: '{target_language}'.\n"
                f"3. Extract structured medication items (medicine_name, strength, frequency like 1-0-1, meal_rule like After Food, duration_days).\n"
                f"Return strictly JSON with key names: 'raw_text', 'simplified_summary', 'medications' (array of objects), 'confidence_score' (0.0 to 1.0)."
            )

            candidate_endpoints = [
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
            ]

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
                }
            }

            res_data = None
            used_endpoint = None

            for ep in candidate_endpoints:
                try:
                    url = f"{ep}?key={api_key}"
                    req = urllib.request.Request(
                        url,
                        data=json.dumps(request_body).encode('utf-8'),
                        headers={'Content-Type': 'application/json'}
                    )
                    with urllib.request.urlopen(req, timeout=30) as response:
                        res_data = json.loads(response.read().decode('utf-8'))
                        used_endpoint = ep
                        break
                except Exception:
                    continue

            if not res_data:
                raise ValueError('All Gemini API endpoints failed')

            # Extract Gemini JSON text output
            candidates = res_data.get('candidates', [])
            if not candidates:
                raise ValueError('No response candidates returned by Gemini API')

            part_text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '').strip()

            # Clean markdown code fences if present
            if part_text.startswith("```"):
                lines = part_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                part_text = "\n".join(lines).strip()

            parsed_json = json.loads(part_text)

            return {
                'status': 'success',
                'extracted_text': parsed_json.get('raw_text', '') or part_text,
                'simplified_text': parsed_json.get('simplified_summary', ''),
                'medications': parsed_json.get('medications', []),
                'confidence': float(parsed_json.get('confidence_score', 0.95)),
                'ocr_engine': f'gemini-{used_endpoint.split("/")[-1].split(":")[0]}',
            }

        except Exception as exc:
            return {
                'status': 'error',
                'error': str(exc),
                'extracted_text': '',
                'simplified_text': '',
                'medications': [],
                'confidence': 0.0,
                'ocr_engine': 'gemini_failed',
            }

