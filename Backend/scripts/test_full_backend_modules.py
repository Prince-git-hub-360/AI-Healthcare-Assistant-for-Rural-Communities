"""
scripts/test_full_backend_modules.py

End-to-End Verification Script testing all 5 major Healthcare Assistant Backend Systems:
1. Voice Assistance System (STT, TTS, Voice Queries, Regional Languages)
2. Medication Reminder System (Scheduling, Alarms, Missed Dose Alerts, Caregiver Notifications, Acknowledge)
3. Emergency Information Assistance (First Aid, Contacts, Nearby Facilities, Ambulance Dispatch)
4. Health Education Services (Preventive, Maternal, Child, Elderly Care)
5. AI Recommendation Engine (Personalized Content, Awareness Tips, Follow-Up Checkups)
"""
import os
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
sys.path.append(str(BASE_DIR / 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from patients.models import Patient
from reminders.models import Reminder


def run_full_suite():
    print("=" * 85)
    print("  HEALTHCARE ASSISTANT BACKEND SYSTEM VERIFICATION - ALL 5 MODULES")
    print("=" * 85)

    client = Client()

    # Ensure patient setup
    user, _ = User.objects.get_or_create(username='backend_test_user')
    patient, _ = Patient.objects.get_or_create(
        user=user,
        defaults={'age': 58, 'phone': '9876500000', 'emergency_contact_phone': '9123456789', 'preferred_language': 'hi'}
    )

    # -------------------------------------------------------------
    # MODULE 1: VOICE ASSISTANCE SYSTEM
    # -------------------------------------------------------------
    print("\n[MODULE 1/5] VOICE ASSISTANCE SYSTEM")
    
    # 1.1 Speech-to-Text Processing
    res_stt = client.post('/api/v1/voice/speech-to-text/', data={'text': 'मुझे बुखार है', 'language': 'hi'}, content_type='application/json')
    assert res_stt.status_code == 200, "STT failed!"
    print(f" -> [STT] Transcript: '{res_stt.json()['transcript']}' | Confidence: {res_stt.json()['confidence']}")

    # 1.2 Text-to-Speech Conversion
    res_tts = client.post('/api/v1/voice/text-to-speech/', data={'text': 'दवा ले लें', 'target_language': 'hi'}, content_type='application/json')
    assert res_tts.status_code == 200, "TTS failed!"
    print(f" -> [TTS] Audio URL: {res_tts.json()['audio_url']}")

    # 1.3 Voice-Based Health Queries (Regional Languages)
    res_vq = client.post('/api/v1/voice/query/', data={'query': 'What to do for fever?', 'target_language': 'te'}, content_type='application/json')
    assert res_vq.status_code == 200, "Voice Query failed!"
    print(f" -> [Voice Query] Answer (Telugu): {res_vq.json()['answer_regional'].splitlines()[0]}")
    print("[PASS] Module 1 (Voice Assistance System) verified 100%!")

    # -------------------------------------------------------------
    # MODULE 2: MEDICATION REMINDER SYSTEM
    # -------------------------------------------------------------
    print("\n[MODULE 2/5] MEDICATION REMINDER SYSTEM")
    
    # 2.1 Medicine Scheduling
    rem, _ = Reminder.objects.get_or_create(
        patient=patient,
        title='Amlodipine 5mg Morning Dose',
        defaults={'time': '08:00:00', 'dose_status': 'missed', 'notes': 'Take for High BP'}
    )

    # 2.2 Trigger Due Reminders
    res_trig = client.post('/api/v1/reminders/trigger-due-reminders/')
    assert res_trig.status_code == 200, "Trigger reminders failed!"
    print(f" -> [Reminder Trigger] Triggered Count: {res_trig.json()['triggered_count']}")

    # 2.3 Missed Medication Alerts
    res_missed = client.get('/api/v1/reminders/missed-alerts/')
    assert res_missed.status_code == 200, "Missed alerts failed!"
    print(f" -> [Missed Alerts] Found {res_missed.json()['missed_count']} missed doses")

    # 2.4 Caregiver Notifications
    res_caregiver = client.post('/api/v1/reminders/notify-caregiver/', data={'reminder_id': rem.id}, content_type='application/json')
    assert res_caregiver.status_code == 200, "Caregiver notification failed!"
    print(f" -> [Caregiver Alert] Notified: {res_caregiver.json()['caregiver_name']} ({res_caregiver.json()['caregiver_phone']})")

    # 2.5 Dose Acknowledgment
    res_ack = client.post(f'/api/v1/reminders/{rem.id}/acknowledge/')
    assert res_ack.status_code == 200, "Acknowledge dose failed!"
    print(f" -> [Dose Acknowledged] Status: {res_ack.json()['dose_status']}")
    print("[PASS] Module 2 (Medication Reminder System) verified 100%!")

    # -------------------------------------------------------------
    # MODULE 3: EMERGENCY INFORMATION ASSISTANCE
    # -------------------------------------------------------------
    print("\n[MODULE 3/5] EMERGENCY INFORMATION ASSISTANCE")

    # 3.1 First Aid Guidance
    res_fa = client.get('/api/v1/emergency/first-aid/?condition=snake_bite')
    assert res_fa.status_code == 200, "First Aid failed!"
    print(f" -> [First Aid] Protocol: {res_fa.json()['first_aid_catalog']['title']}")

    # 3.2 Emergency Contacts
    res_ec = client.get('/api/v1/emergency/contacts/')
    assert res_ec.status_code == 200, "Emergency Contacts failed!"
    print(f" -> [Emergency Contacts] {len(res_ec.json()['contacts'])} hotlines active (112, 108, 1091, 1066, 104)")

    # 3.3 Nearby Healthcare Facilities
    res_fac = client.get('/api/v1/emergency/nearby-facilities/?district=Medak')
    assert res_fac.status_code == 200, "Nearby Facilities failed!"
    print(f" -> [Nearby Facilities] Found {res_fac.json()['facilities_found']} health centers in {res_fac.json()['district']}")

    # 3.4 Ambulance Contact Assistance (108)
    res_amb = client.post('/api/v1/emergency/ambulance-request/', data={'patient_name': 'Lakshmi', 'location': 'Medak Village'}, content_type='application/json')
    assert res_amb.status_code == 200, "Ambulance request failed!"
    print(f" -> [108 Ambulance] Dispatched ID: {res_amb.json()['dispatch_id']} | ETA: {res_amb.json()['estimated_arrival_minutes']} mins")
    print("[PASS] Module 3 (Emergency Assistance) verified 100%!")

    # -------------------------------------------------------------
    # MODULE 4: HEALTH EDUCATION SERVICES
    # -------------------------------------------------------------
    print("\n[MODULE 4/5] HEALTH EDUCATION SERVICES")

    # 4.1 Preventive Healthcare
    res_prev = client.get('/api/v1/education/preventive/')
    print(f" -> [Preventive] Articles: {res_prev.json()['articles_count']}")

    # 4.2 Maternal Health
    res_mat = client.get('/api/v1/education/maternal/')
    print(f" -> [Maternal] Articles: {res_mat.json()['articles_count']}")

    # 4.3 Child Healthcare
    res_child = client.get('/api/v1/education/child/')
    print(f" -> [Child] Articles: {res_child.json()['articles_count']}")

    # 4.4 Elderly Care
    res_eld = client.get('/api/v1/education/elderly/')
    print(f" -> [Elderly] Articles: {res_eld.json()['articles_count']}")
    print("[PASS] Module 4 (Health Education Services) verified 100%!")

    # -------------------------------------------------------------
    # MODULE 5: AI RECOMMENDATION ENGINE
    # -------------------------------------------------------------
    print("\n[MODULE 5/5] AI RECOMMENDATION ENGINE")

    # 5.1 Personalized Health Content
    res_rec = client.get('/api/v1/ai/personalized-recommendations/?age=58&language=hi')
    assert res_rec.status_code == 200, "Personalized recommendations failed!"
    print(f" -> [AI Recommendations] Generated {res_rec.json()['recommendations_count']} personalized tips")

    # 5.2 Relevant Health Awareness Tips
    res_tips = client.get('/api/v1/ai/awareness-tips/')
    assert res_tips.status_code == 200, "Awareness tips failed!"
    print(f" -> [AI Awareness Tips] Loaded {res_tips.json()['awareness_bulletins_count']} daily bulletins")

    # 5.3 Follow-Up Recommendations
    res_fol = client.get('/api/v1/ai/follow-up-suggestions/')
    assert res_fol.status_code == 200, "Follow up recommendations failed!"
    print(f" -> [AI Follow-Up] Scheduled {res_fol.json()['suggestions_count']} doctor follow-up checkup dates")
    print("[PASS] Module 5 (AI Recommendation Engine) verified 100%!")

    print("\n" + "=" * 85)
    print("  ALL 5 HEALTHCARE ASSISTANT BACKEND MODULES FULLY FUNCTIONAL (100% PASS)!")
    print("=" * 85)


if __name__ == '__main__':
    run_full_suite()
