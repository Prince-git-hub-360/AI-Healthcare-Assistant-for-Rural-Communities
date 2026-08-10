"""
medical.ocr_service

Optical Character Recognition (OCR) Prescription Image Processing Engine.

Inspects uploaded doctor prescription images (.png/.jpeg/.pdf) and extracts
medical prescription text lines to feed directly into the Prescription Parser.
"""
import os
import re
from pathlib import Path
from typing import Dict, Any

try:
    from PIL import Image
except ImportError:
    Image = None


class OpticalCharacterRecognitionService:
    """OCR Image Processing & Text Extraction Engine.

    Implementation notes:
    - Uses pytesseract for OCR when available and Tesseract binary is installed.
    - Uses pdf2image to convert PDFs to images (requires poppler binaries).
    - Gracefully falls back to the existing deterministic stub when dependencies or binaries are missing.
    - Stores extracted text in document_instance.text_content and saves the instance.
    """

    @classmethod
    def _extract_text_from_image(cls, image) -> (str, float):
        """Run pytesseract on a PIL.Image and return (text, confidence).

        Confidence is estimated from pytesseract image_to_data if available; otherwise None.
        """
        try:
            import pytesseract
        except Exception:
            raise

        # Use psm 6 (assume a block of text) by default
        try:
            data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
            # Join the text tokens
            text = "\n".join([w for w in data.get('text', []) if w and w.strip()])
            # Compute mean confidence (values may be -1 for blanks)
            confs = [int(c) for c in data.get('conf', []) if isinstance(c, (int, str)) and str(c).strip().isdigit()]
            confidence = (sum(confs) / len(confs)) / 100.0 if confs else None
            return text, confidence
        except Exception:
            # Fallback to simple image_to_string
            try:
                text = pytesseract.image_to_string(image)
                return text, None
            except Exception:
                raise

    @classmethod
    def extract_text_from_document(cls, document_instance, target_language: str = 'hi') -> Dict[str, Any]:
        """Extracts text from the uploaded document file.

        Returns a dict with status, document_id, extracted_text, confidence, and engine info.
        """
        # Basic validations
        if not document_instance or not getattr(document_instance, 'original_file', None):
            return {
                'status': 'no_file',
                'extracted_text': document_instance.text_content if document_instance else '',
                'confidence': 0.0,
            }

        file_path = document_instance.original_file.path
        if not os.path.exists(file_path):
            return {
                'status': 'file_not_found',
                'extracted_text': document_instance.text_content,
                'confidence': 0.0,
            }

        file_name = os.path.basename(file_path).lower()
        existing_text = (document_instance.text_content or '').strip()

        # Determine target language from document or user profile if not provided
        if not target_language and getattr(document_instance, 'language', None):
            target_language = document_instance.language
        if not target_language and getattr(document_instance, 'patient', None):
            try:
                target_language = document_instance.patient.user.profile.preferred_language or 'hi'
            except Exception:
                target_language = 'hi'
        target_language = target_language or 'hi'


        # 1. Primary Engine: Gemini 2.5 Flash Vision API + Groq Llama 3.3 70B Enhancer
        try:
            from .gemini_ocr_service import GeminiVisionOCRService
            from .groq_ocr_service import GroqVisionOCRService

            gemini_res = GeminiVisionOCRService.extract_prescription_data(file_path, target_language=target_language)
            if gemini_res.get('status') == 'success' and gemini_res.get('extracted_text'):
                extracted = gemini_res.get('extracted_text')
                confidence = gemini_res.get('confidence', 0.95)
                engine = gemini_res.get('ocr_engine', 'gemini-2.5-flash-vision')

                simplified_text = gemini_res.get('simplified_text', '')
                medications = gemini_res.get('medications', [])

                # Enhance with Groq Llama 3.3 70B for superior regional language patient guidance & structured JSON
                try:
                    groq_enhancement = GroqVisionOCRService.process_text_with_groq(extracted, target_language=target_language)
                    if groq_enhancement.get('status') == 'success':
                        if groq_enhancement.get('simplified_text'):
                            simplified_text = groq_enhancement.get('simplified_text')
                        if groq_enhancement.get('medications'):
                            medications = groq_enhancement.get('medications')
                        engine = f"{engine} + {groq_enhancement.get('ocr_engine')}"
                except Exception:
                    pass

                if simplified_text:
                    document_instance.simplified_text = simplified_text
                    document_instance.translated_text = simplified_text

                document_instance.text_content = extracted
                try:
                    document_instance.save()
                except Exception:
                    pass

                return {
                    'status': 'success',
                    'document_id': document_instance.id,
                    'file_name': file_name,
                    'extracted_text': extracted,
                    'simplified_text': simplified_text,
                    'translated_text': simplified_text,
                    'medications': medications,
                    'confidence': confidence,
                    'ocr_engine': engine,
                }
        except Exception:
            pass


        # 2. Secondary Engine: Groq AI Vision API
        try:
            from .groq_ocr_service import GroqVisionOCRService
            groq_res = GroqVisionOCRService.extract_prescription_data(file_path, target_language=target_language)
            if groq_res.get('status') == 'success' and groq_res.get('extracted_text'):
                extracted = groq_res.get('extracted_text')
                confidence = groq_res.get('confidence', 0.95)
                engine = groq_res.get('ocr_engine', 'groq-vision-ai')

                if groq_res.get('simplified_text'):
                    document_instance.simplified_text = groq_res.get('simplified_text')
                    document_instance.translated_text = groq_res.get('simplified_text')

                document_instance.text_content = extracted
                try:
                    document_instance.save()
                except Exception:
                    pass

                return {
                    'status': 'success',
                    'document_id': document_instance.id,
                    'file_name': file_name,
                    'extracted_text': extracted,
                    'simplified_text': groq_res.get('simplified_text', ''),
                    'translated_text': groq_res.get('simplified_text', ''),
                    'medications': groq_res.get('medications', []),
                    'confidence': confidence,
                    'ocr_engine': engine,
                }
        except Exception:
            pass

        # 3. Fallback Engine: pytesseract + pdf2image
        try:
            from PIL import Image
            import pytesseract
            from pdf2image import convert_from_path
            has_pytesseract = True
        except Exception:
            has_pytesseract = False

        extracted = None
        confidence = None
        engine = 'pytesseract'

        try:
            suffix = Path(file_path).suffix.lower()
            if has_pytesseract:
                if suffix in ['.pdf']:
                    poppler_path = os.getenv('POPPLER_PATH')
                    try:
                        images = convert_from_path(file_path, first_page=1, last_page=1, poppler_path=poppler_path) if poppler_path else convert_from_path(file_path, first_page=1, last_page=1)
                    except Exception as e:
                        raise RuntimeError(f'pdf conversion failed: {e}')
                    if images:
                        img = images[0]
                        text, conf = cls._extract_text_from_image(img)
                        extracted = text
                        confidence = conf
                else:
                    try:
                        img = Image.open(file_path)
                        text, conf = cls._extract_text_from_image(img)
                        extracted = text
                        confidence = conf
                    except Exception as e:
                        raise RuntimeError(f'image OCR failed: {e}')

            if extracted:
                document_instance.text_content = extracted
                try:
                    document_instance.save(update_fields=['text_content'])
                except Exception:
                    pass

                return {
                    'status': 'success',
                    'document_id': document_instance.id,
                    'file_name': file_name,
                    'extracted_text': extracted,
                    'simplified_text': '',
                    'translated_text': extracted,
                    'confidence': confidence or 0.8,
                    'ocr_engine': engine,
                }

        except Exception:
            pass

        # If all OCR methods fail, return clear error message rather than fake prescription data
        return {
            'status': 'error',
            'document_id': document_instance.id,
            'file_name': file_name,
            'extracted_text': document_instance.text_content or 'Unable to extract text from this document.',
            'simplified_text': document_instance.simplified_text or '',
            'translated_text': document_instance.translated_text or '',
            'confidence': 0.0,
            'ocr_engine': 'none',
            'error': 'OCR engines failed to parse file text',
        }

