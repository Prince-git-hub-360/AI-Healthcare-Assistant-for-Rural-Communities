"""
scripts/seed_lakshmi_demo.py

Seed script demonstrating the end-to-end patient workflow for Lakshmi across all 5 core apps:
1. Patient Profile (patients)
2. Medical Document / Prescription (medical)
3. Medication Extracted / Added (medications)
4. Simplified & Translated Text (translations)
5. Reminder Schedule (reminders)

Run with:
    python scripts/seed_lakshmi_demo.py
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

from django.contrib.auth.models import User
from patients.models import Patient, GenderChoices, BloodGroupChoices
from medical.models import MedicalDocument, DocumentTypeChoices
from medications.models import Medication, FrequencyChoices, SourceChoices
from translations.models import Translation
from reminders.models import Reminder, DeliveryMethodChoices, FrequencyChoices as ReminderFrequency


def seed_lakshmi_flow():
    print("=" * 70)
    print("[+] SEEDING LAKSHMI DEMO DATA ACROSS ALL 5 BACKEND MODULES")
    print("=" * 70)

    # 1. User & Patient Creation
    user, created = User.objects.get_or_create(
        username='lakshmi_devi',
        defaults={
            'first_name': 'Lakshmi',
            'last_name': 'Devi',
            'email': 'lakshmi.village@example.com',
        }
    )
    if created:
        user.set_password('LakshmiPass123!')
        user.save()

    patient, _ = Patient.objects.get_or_create(
        user=user,
        defaults={
            'age': 65,
            'gender': GenderChoices.FEMALE,
            'phone': '+919876543210',
            'address': 'House 42, Rampur Village, District Kanpur, UP',
            'preferred_language': 'hi',
            'blood_group': BloodGroupChoices.O_POS,
            'emergency_contact_name': 'Ramesh (Son)',
            'emergency_contact_phone': '+919876543211',
            'medical_history': 'Fever and mild arthritis',
            'allergies': 'None known',
        }
    )
    print(f"[OK] 1. Patient Profile Created: ID #{patient.id} - {user.get_full_name()} (Age: {patient.age}, Language: Hindi)")

    # 2. Medical Document Upload
    doc, _ = MedicalDocument.objects.get_or_create(
        patient=patient,
        title='Government Hospital Prescription - June 2026',
        defaults={
            'document_type': DocumentTypeChoices.PRESCRIPTION,
            'text_content': 'Tab Paracetamol 500mg 1-0-1 PC for 5 days. Tab Cetirizine 10mg 0-0-1 HS for 3 days.',
            'language': 'en',
        }
    )
    print(f"[OK] 2. Prescription Document Uploaded: ID #{doc.id} - '{doc.title}'")

    # 3. Medications Extracted
    med1, _ = Medication.objects.get_or_create(
        patient=patient,
        document=doc,
        name='Paracetamol',
        defaults={
            'strength': '500 mg',
            'form': 'Tablet',
            'dosage_text': '1-0-1 PC (After Food)',
            'dosage_amount': '1',
            'dosage_unit': 'tablet',
            'frequency': FrequencyChoices.TWICE_DAILY,
            'after_food': True,
            'morning': True,
            'night': True,
            'source': SourceChoices.EXTRACTED,
            'confidence': 0.95,
        }
    )

    med2, _ = Medication.objects.get_or_create(
        patient=patient,
        document=doc,
        name='Cetirizine',
        defaults={
            'strength': '10 mg',
            'form': 'Tablet',
            'dosage_text': '0-0-1 HS (At Bedtime)',
            'dosage_amount': '1',
            'dosage_unit': 'tablet',
            'frequency': FrequencyChoices.ONCE_DAILY,
            'night': True,
            'source': SourceChoices.EXTRACTED,
            'confidence': 0.92,
        }
    )
    print(f"[OK] 3. Medications Parsed: '{med1.name} {med1.strength}' & '{med2.name} {med2.strength}'")

    # 4. Translation & Simplification
    trans, _ = Translation.objects.get_or_create(
        patient=patient,
        document=doc,
        target_language='hi',
        defaults={
            'original_text': 'Tab Paracetamol 500mg 1-0-1 PC; Tab Cetirizine 10mg 0-0-1 HS',
            'simplified_text': (
                '1. Paracetamol 500mg: Take 1 tablet in the morning after breakfast and 1 tablet at night after dinner.\n'
                '2. Cetirizine 10mg: Take 1 tablet at night right before going to sleep.'
            ),
            'translated_text': (
                '1. Paracetamol 500mg: Take 1 tablet in morning and 1 tablet at night after food.\n'
                '2. Cetirizine 10mg: Take 1 tablet before bedtime.'
            ),
        }
    )
    print(f"[OK] 4. Simplified & Hindi Translation Created: ID #{trans.id}")

    # 5. Reminder Alarms Scheduled
    rem1, _ = Reminder.objects.get_or_create(
        patient=patient,
        medication=med1,
        title='Paracetamol Morning Dose',
        defaults={
            'time': '08:00:00',
            'notes': 'Take 1 tablet with warm water after breakfast',
            'frequency': ReminderFrequency.DAILY,
            'delivery_method': DeliveryMethodChoices.SMS,
            'active': True,
        }
    )

    rem2, _ = Reminder.objects.get_or_create(
        patient=patient,
        medication=med1,
        title='Paracetamol Night Dose',
        defaults={
            'time': '20:00:00',
            'notes': 'Take 1 tablet after dinner',
            'frequency': ReminderFrequency.DAILY,
            'delivery_method': DeliveryMethodChoices.SMS,
            'active': True,
        }
    )

    rem3, _ = Reminder.objects.get_or_create(
        patient=patient,
        medication=med2,
        title='Cetirizine Bedtime Dose',
        defaults={
            'time': '21:30:00',
            'notes': 'Take 1 tablet before sleeping',
            'frequency': ReminderFrequency.DAILY,
            'delivery_method': DeliveryMethodChoices.SMS,
            'active': True,
        }
    )
    print(f"[OK] 5. Reminders Scheduled: 3 Alarms Created ({rem1.title} at 8:00 AM, {rem2.title} at 8:00 PM, {rem3.title} at 9:30 PM)")

    print("=" * 70)
    print("[SUCCESS] LAKSHMI DEMO DATA SUCCESSFULLY SEEDED INTO POSTGRESQL DATABASE!")
    print("=" * 70)


if __name__ == '__main__':
    seed_lakshmi_flow()
