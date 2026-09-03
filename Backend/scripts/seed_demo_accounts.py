import os
import sys
from pathlib import Path

# Setup Django environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
sys.path.insert(0, str(BASE_DIR / 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.contrib.auth.models import User
from accounts.models import UserProfile, RoleChoices, LanguageChoices, GenderChoices
from patients.models import Patient, GenderChoices as PatientGender, BloodGroupChoices

def seed_demo_users():
    print("=" * 60)
    print("[+] SEEDING ALL 4 DEMO ACCOUNTS (DOCTOR, ASHA, PATIENT, CAREGIVER)")
    print("=" * 60)

    # 1. 👨‍⚕️ DOCTOR: dr_vikram
    doc_user, _ = User.objects.get_or_create(
        username='dr_vikram',
        defaults={
            'first_name': 'Dr. Vikram',
            'last_name': 'Sharma',
            'email': 'dr.vikram.sharma@phc.gov.in',
        }
    )
    doc_user.first_name = 'Dr. Vikram'
    doc_user.last_name = 'Sharma'
    doc_user.set_password('Doctor@123')
    doc_user.save()

    doc_profile, _ = UserProfile.objects.get_or_create(user=doc_user)
    doc_profile.role = RoleChoices.DOCTOR
    doc_profile.phone_number = '+91 94480 12345'
    doc_profile.village_or_town = 'Mandya PHC'
    doc_profile.district = 'Mandya'
    doc_profile.state = 'Karnataka'
    doc_profile.preferred_language = LanguageChoices.KANNADA
    doc_profile.save()
    print("  [OK] Seeded Doctor: dr_vikram / Doctor@123")

    # 2. 👩‍⚕️ ASHA WORKER: asha_sunita
    asha_user, _ = User.objects.get_or_create(
        username='asha_sunita',
        defaults={
            'first_name': 'Sunita',
            'last_name': 'Bai',
            'email': 'sunita.asha@phc.gov.in',
        }
    )
    asha_user.first_name = 'Sunita'
    asha_user.last_name = 'Bai'
    asha_user.set_password('Asha@123')
    asha_user.save()

    asha_profile, _ = UserProfile.objects.get_or_create(user=asha_user)
    asha_profile.role = RoleChoices.HEALTHCARE_WORKER
    asha_profile.phone_number = '+91 98123 45678'
    asha_profile.village_or_town = 'Mandya Catchment #2'
    asha_profile.district = 'Mandya'
    asha_profile.state = 'Karnataka'
    asha_profile.preferred_language = LanguageChoices.KANNADA
    asha_profile.save()
    print("  [OK] Seeded ASHA: asha_sunita / Asha@123")

    # 3. 👵 PATIENT: prince_kumar
    patient_user, _ = User.objects.get_or_create(
        username='prince_kumar',
        defaults={
            'first_name': 'Prince',
            'last_name': 'Kumar',
            'email': 'prince.kumar@swasthya.ai',
        }
    )
    patient_user.first_name = 'Prince'
    patient_user.last_name = 'Kumar'
    patient_user.set_password('Patient@123')
    patient_user.save()

    patient_profile, _ = UserProfile.objects.get_or_create(user=patient_user)
    patient_profile.role = RoleChoices.PATIENT
    patient_profile.phone_number = '+91 90088 02105'
    patient_profile.village_or_town = 'Electronic City'
    patient_profile.district = 'Bengaluru Urban'
    patient_profile.state = 'Karnataka'
    patient_profile.preferred_language = LanguageChoices.HINDI
    patient_profile.save()

    # Also make sure Patient record exists
    Patient.objects.get_or_create(
        user=patient_user,
        defaults={
            'phone': '+91 90088 02105',
            'gender': 'male',
            'blood_group': 'O+',
            'preferred_language': 'hi',
        }
    )
    print("  [OK] Seeded Patient: prince_kumar / Patient@123")

    print("\n[+] SUCCESS! All demo accounts are active and ready for 1-click login.")

if __name__ == '__main__':
    seed_demo_users()
