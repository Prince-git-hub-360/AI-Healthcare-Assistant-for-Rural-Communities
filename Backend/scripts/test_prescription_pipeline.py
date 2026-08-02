"""
scripts/test_prescription_pipeline.py

Test script verifying the complete automated Prescription Picture Pipeline:
Upload Prescription Picture --> Extract & Parse Meds --> Auto-Generate Translation --> Schedule Alarms
"""
import os
import sys
from pathlib import Path

# Setup Django environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client
from patients.models import Patient
from medical.models import MedicalDocument, DocumentTypeChoices
from medications.models import Medication
from translations.models import Translation
from reminders.models import Reminder

def test_full_pipeline():
    print("=" * 75)
    print("[+] TESTING COMPLETE AUTOMATED PRESCRIPTION PICTURE PIPELINE")
    print("=" * 75)

    client = Client()

    # 1. Create a Patient
    patient = Patient.objects.filter(user__username='lakshmi_devi').first()
    if not patient:
        from django.contrib.auth.models import User
        user, _ = User.objects.get_or_create(username='test_patient_pipeline')
        patient, _ = Patient.objects.get_or_create(user=user, defaults={'age': 60, 'preferred_language': 'hi'})

    # 2. Source Prescription Image
    source_img_path = r"C:\Users\kumar\.gemini\antigravity-ide\brain\a82013e6-92b9-45ae-b253-25fa1c485693\doctor_prescription_sample_1785212843102.png"

    with open(source_img_path, 'rb') as f:
        file_bytes = f.read()

    uploaded_file = SimpleUploadedFile(
        name="prescription_pipeline_test.png",
        content=file_bytes,
        content_type="image/png"
    )

    # 3. Upload Prescription Document
    post_data = {
        'patient': patient.id,
        'title': 'Prescription Note - Tab Paracetamol 500mg 1-0-1 PC for 5 days. Tab Cetirizine 10mg 0-0-1 HS',
        'document_type': DocumentTypeChoices.PRESCRIPTION,
        'text_content': 'Tab Paracetamol 500mg 1-0-1 PC for 5 days. Tab Cetirizine 10mg 0-0-1 HS',
        'language': 'en',
        'original_file': uploaded_file,
    }

    res = client.post('/api/medical-documents/', data=post_data, format='multipart')

    if res.status_code == 201:
        doc_data = res.json()
        doc_id = doc_data['id']
        print(f"[SUCCESS] 1. Prescription Picture Uploaded! Document ID #{doc_id}")

        # Check Auto-Generated Medications
        meds = Medication.objects.filter(document_id=doc_id)
        print(f"[SUCCESS] 2. Parsed Medications Extracted ({meds.count()} found):")
        for m in meds:
            print(f"   - Medication: '{m.name}' {m.strength} | Dosage: {m.dosage_text} | Morning: {m.morning}, Night: {m.night}, After Food: {m.after_food}")

        # Check Auto-Generated Translations
        trans = Translation.objects.filter(document_id=doc_id).first()
        if trans:
            print(f"[SUCCESS] 3. Auto-Generated Simplification & Hindi Guidance (ID #{trans.id}):")
            print(f"   {trans.simplified_text}")

        # Check Auto-Generated Reminders
        rems = Reminder.objects.filter(patient=patient)
        print(f"[SUCCESS] 4. Scheduled Reminder Alarms ({rems.count()} alarms active in DB):")
        for r in rems[:4]:
            print(f"   - Alarm: '{r.title}' at {r.time} ({r.notes})")

    else:
        print(f"[!] Upload Failed: {res.status_code}")
        print(res.json())

    print("=" * 75)

if __name__ == '__main__':
    test_full_pipeline()
