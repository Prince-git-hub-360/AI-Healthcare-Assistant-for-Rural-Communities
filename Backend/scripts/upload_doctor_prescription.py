"""
scripts/upload_doctor_prescription.py

Script demonstrating uploading an actual Doctor Prescription file image
to the /api/medical-documents/ REST API endpoint for patient Lakshmi.
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

def upload_prescription_file():
    print("=" * 70)
    print("[+] UPLOADING DOCTOR PRESCRIPTION IMAGE TO REST API")
    print("=" * 70)

    # 1. Fetch Patient Lakshmi
    patient = Patient.objects.filter(user__username='lakshmi_devi').first()
    if not patient:
        print("[!] Patient Lakshmi not found. Creating patient record...")
        from django.contrib.auth.models import User
        user, _ = User.objects.get_or_create(username='lakshmi_devi')
        patient, _ = Patient.objects.get_or_create(user=user, defaults={'age': 65})

    # 2. Path to generated doctor prescription sample image
    source_img_path = r"C:\Users\kumar\.gemini\antigravity-ide\brain\a82013e6-92b9-45ae-b253-25fa1c485693\doctor_prescription_sample_1785212843102.png"

    if not os.path.exists(source_img_path):
        print(f"[!] Source image not found at {source_img_path}")
        return

    with open(source_img_path, 'rb') as f:
        file_bytes = f.read()

    uploaded_file = SimpleUploadedFile(
        name="doctor_prescription_lakshmi.png",
        content=file_bytes,
        content_type="image/png"
    )

    # 3. Simulate API POST Request with multipart/form-data payload
    client = Client()
    post_data = {
        'patient': patient.id,
        'title': 'Doctor Prescription Notes - City Hospital',
        'document_type': DocumentTypeChoices.PRESCRIPTION,
        'language': 'en',
        'text_content': 'Rx: Tab Paracetamol 500mg 1-0-1 PC for 5 days. Tab Cetirizine 10mg 0-0-1 HS at bedtime.',
        'original_file': uploaded_file,
    }

    response = client.post('/api/medical-documents/', data=post_data, format='multipart')

    if response.status_code == 201:
        data = response.json()
        print(f"[SUCCESS] Prescription File Uploaded Successfully! Record ID #{data['id']}")
        print(f" -> Title: {data['title']}")
        print(f" -> File URL: {data['original_file']}")
        print(f" -> Associated Patient: {data['patient_username']}")
    else:
        print(f"[!] Upload Failed. Status Code: {response.status_code}")
        print(response.json())

    print("=" * 70)

if __name__ == '__main__':
    upload_prescription_file()
