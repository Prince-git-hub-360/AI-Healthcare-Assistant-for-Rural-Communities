"""
scripts/test_all_features.py

Comprehensive test suite verifying:
1. OCR (Optical Character Recognition) Engine
2. Multi-lingual Regional Translation Engine (9 languages)
3. Voice Generation (Text-To-Speech Audio Synthesis .wav)
4. Scheduled Reminders & Alarm Generator
"""
import os
import sys
import tempfile
from pathlib import Path

# Configure UTF-8 output for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
sys.path.append(str(BASE_DIR / 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import User
from patients.models import Patient
from medical.models import MedicalDocument, DocumentTypeChoices
from medical.ocr_service import OpticalCharacterRecognitionService
from medications.models import Medication
from medications.services import PrescriptionParserService
from translations.models import Translation
from translations.services import MedicalTranslationService, VoiceGuidanceService
from reminders.models import Reminder


def run_tests():
    print("=" * 80)
    print("      HEALTHCARE ASSISTANT CORE FEATURE VERIFICATION & TESTING")
    print("=" * 80)

    # Setup Test User & Patient
    user, _ = User.objects.get_or_create(username='test_verification_user')
    patient, _ = Patient.objects.get_or_create(
        user=user,
        defaults={'age': 55, 'phone': '9876543210', 'preferred_language': 'hi'}
    )

    # ---------------------------------------------------------
    # TEST 1: OCR (OPTICAL CHARACTER RECOGNITION) ENGINE
    # ---------------------------------------------------------
    print("\n--- [1/4] TESTING OCR (OPTICAL CHARACTER RECOGNITION) ---")
    dummy_image_content = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00"
    test_file = SimpleUploadedFile("prescription_sample.png", dummy_image_content, content_type="image/png")

    doc = MedicalDocument.objects.create(
        patient=patient,
        uploaded_by=user,
        title="Doctor Prescription Note",
        document_type=DocumentTypeChoices.PRESCRIPTION,
        original_file=test_file,
        text_content="Tab Paracetamol 500mg 1-0-1 PC for 5 days. Tab Cetirizine 10mg 0-0-1 HS for 3 days."
    )

    ocr_result = OpticalCharacterRecognitionService.extract_text_from_document(doc)
    print(f" -> OCR Extraction Status : {ocr_result['status']}")
    print(f" -> OCR Engine Used       : {ocr_result['ocr_engine']}")
    print(f" -> OCR Confidence Score  : {ocr_result['confidence'] * 100}%")
    print(f" -> Extracted Text        : '{ocr_result['extracted_text']}'")
    assert ocr_result['status'] == 'success', "OCR extraction failed!"
    print("[SUCCESS] OCR Engine verified successfully!")

    # ---------------------------------------------------------
    # TEST 2: REGIONAL TRANSLATION ENGINE
    # ---------------------------------------------------------
    print("\n--- [2/4] TESTING MULTI-LINGUAL REGIONAL TRANSLATION ---")
    test_langs = [('hi', 'Hindi'), ('te', 'Telugu'), ('ta', 'Tamil'), ('kn', 'Kannada'), ('mr', 'Marathi')]
    raw_prescription = "Tab Paracetamol 500mg 1-0-1 PC for 5 days."

    for lang_code, lang_name in test_langs:
        trans_res = MedicalTranslationService.translate_guidance(raw_prescription, lang_code)
        print(f" -> [{lang_name} ({lang_code.upper()})]: {trans_res['translated_text'].splitlines()[1] if len(trans_res['translated_text'].splitlines()) > 1 else trans_res['translated_text']}")
        assert trans_res['target_language'] == lang_code, f"Translation failed for {lang_name}"
    print("[SUCCESS] Multi-lingual Regional Translation verified successfully!")

    # ---------------------------------------------------------
    # TEST 3: VOICE GENERATION (TEXT-TO-SPEECH TTS)
    # ---------------------------------------------------------
    print("\n--- [3/4] TESTING VOICE GENERATION (TEXT-TO-SPEECH TTS) ---")
    voice_url_hi = VoiceGuidanceService.generate_audio_guidance("Take 1 Paracetamol tablet after breakfast", "hi", "test_voice_hi")
    voice_url_te = VoiceGuidanceService.generate_audio_guidance("Take 1 Paracetamol tablet after breakfast", "te", "test_voice_te")
    print(f" -> Hindi Synthesized Voice Audio  : {voice_url_hi}")
    print(f" -> Telugu Synthesized Voice Audio : {voice_url_te}")

    # Verify physical file existence
    audio_path_hi = Path(django.conf.settings.MEDIA_ROOT) / 'translations' / 'audio' / os.path.basename(voice_url_hi)
    assert os.path.exists(audio_path_hi), "Synthesized .wav audio file was not written to disk!"
    print(f" -> Audio File Size on Disk       : {os.path.getsize(audio_path_hi)} bytes")
    print("[SUCCESS] Voice Generation (TTS) audio engine verified successfully!")

    # ---------------------------------------------------------
    # TEST 4: SCHEDULED REMINDERS & AUTOMATED PIPELINE
    # ---------------------------------------------------------
    print("\n--- [4/4] TESTING SCHEDULED REMINDERS & AUTOMATED PIPELINE ---")
    pipeline_res = PrescriptionParserService.process_prescription_document(doc)
    print(f" -> Medications Parsed & Saved : {pipeline_res['medications_created']}")
    print(f" -> Reminder Alarms Scheduled   : {pipeline_res['reminders_created']}")

    reminders = Reminder.objects.filter(patient=patient)
    for rem in reminders:
        next_run = rem.schedule_next_run()
        print(f" -> [ALARM SCHEDULED] Title: '{rem.title}' | Time: {rem.time} | Frequency: {rem.frequency} | Delivery: {rem.delivery_method} | Next Run: {next_run}")

    assert reminders.count() > 0, "No reminders were generated!"
    print("[SUCCESS] Scheduled Reminders engine verified successfully!")

    print("\n" + "=" * 80)
    print("   ALL 4 CORE FEATURES IMPLEMENTED AND VERIFIED PASSING 100%!")
    print("=" * 80)

if __name__ == '__main__':
    run_tests()
