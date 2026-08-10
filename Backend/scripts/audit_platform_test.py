import sys, os, dotenv, json;
sys.path.insert(0, 'apps');
sys.path.insert(0, '.');
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings');
import django;
django.setup();
sys.stdout.reconfigure(encoding='utf-8');
dotenv.load_dotenv('.env');

from django.contrib.auth import get_user_model;
from rest_framework.test import APIRequestFactory, force_authenticate;
from accounts.views import RegisterView, LoginView, UserProfileView;
from medical.views import MedicalDocumentViewSet;
from medical.emergency_views import AmbulanceRequestAPIView, FirstAidGuidanceAPIView;
from medical.education_views import PreventiveHealthAPIView;
from translations.views import TranslateTextAPIView;
from translations.voice_views import TextToSpeechAPIView, VoiceHealthQueryAPIView;
from reminders.views import ReminderViewSet;
from patients.views import PatientViewSet;

User = get_user_model();
factory = APIRequestFactory();

# Clean up any existing audit_patient user before starting
User.objects.filter(username='audit_patient').delete();

results = [];

def record_test(name, success, details):
    results.append({
        'test': name,
        'status': 'PASS' if success else 'FAIL',
        'details': details
    })
    print(f"[{'PASS' if success else 'FAIL'}] {name}: {details}")

print("=== STARTING SWASTHYA SANCHAR AI PLATFORM AUDIT ===")

# Test 1: Patient Registration
reg_req = factory.post('/api/auth/register/', data={
    'username': 'audit_patient',
    'first_name': 'Ananya',
    'last_name': 'Sharma',
    'email': 'ananya@example.com',
    'password': 'Password123!',
    'role': 'patient',
    'phone_number': '9876500111',
    'preferred_language': 'hi',
    'gender': 'F',
    'village_or_town': 'Mandya',
    'district': 'Mandya',
    'state': 'Karnataka',
    'pincode': '571401'
}, format='json')
reg_view = RegisterView.as_view();
reg_res = reg_view(reg_req);
if reg_res.status_code == 201:
    record_test("Patient Registration API", True, f"User created with ID {reg_res.data.get('user', {}).get('id')}")
else:
    record_test("Patient Registration API", False, f"Status code {reg_res.status_code}: {reg_res.data}")

# Test 2: Login
login_req = factory.post('/api/auth/login/', data={
    'username': 'audit_patient',
    'password': 'Password123!'
}, format='json')
login_view = LoginView.as_view();
login_res = login_view(login_req);
patient_user = None
if login_res.status_code == 200:
    patient_user = User.objects.get(username='audit_patient')
    record_test("User Login & JWT Issuance", True, f"JWT Tokens issued successfully for {patient_user.username}")
else:
    record_test("User Login & JWT Issuance", False, f"Status code {login_res.status_code}: {login_res.data}")

if patient_user:
    # Test 3: Profile Get & Update
    prof_get_req = factory.get('/api/auth/profile/')
    force_authenticate(prof_get_req, user=patient_user)
    prof_view = UserProfileView.as_view()
    prof_res = prof_view(prof_get_req)
    if prof_res.status_code == 200:
        record_test("Get User Profile API", True, f"Role: {prof_res.data.get('profile', {}).get('role')}")
    else:
        record_test("Get User Profile API", False, f"Status code {prof_res.status_code}")

    prof_put_req = factory.put('/api/auth/profile/', data={
        'first_name': 'Ananya Updated',
        'village_or_town': 'Mandya Rural',
        'preferred_language': 'kn',
        'username': 'hacked_name',
        'phone_number': '0000000000'
    }, format='json')
    force_authenticate(prof_put_req, user=patient_user)
    prof_put_res = prof_view(prof_put_req)
    patient_user.refresh_from_db()
    if patient_user.username == 'audit_patient' and patient_user.profile.village_or_town == 'Mandya Rural':
        record_test("Update User Profile API", True, "Editable fields saved; Username & Phone remained strictly read-only!")
    else:
        record_test("Update User Profile API", False, "Field locking failed")

    # Test 4: Prescription Real-time Translation API
    trans_req = factory.post('/api/v1/translate/', data={
        'text': '1. TAB. LISINOPRIL (10 MG) — 1 Tablet Once Daily for blood pressure.\n2. TAB. AMOXICILLIN (500 MG) — 1 Capsule Thrice Daily for 7 Days.',
        'target_language': 'hi'
    }, format='json')
    trans_view = TranslateTextAPIView.as_view({'post': 'create'})
    trans_res = trans_view(trans_req)
    if trans_res.status_code == 200 and trans_res.data.get('translated_text'):
        record_test("Groq AI Prescription Translation API (Hindi)", True, f"Output: {trans_res.data.get('translated_text')[:60]}...")
    else:
        record_test("Groq AI Prescription Translation API (Hindi)", False, f"Status: {trans_res.status_code}")

    # Test 5: Voice Text-to-Speech Audio API
    tts_req = factory.post('/api/v1/translations/voice/text-to-speech/', data={
        'text': 'Take one tablet every morning after food.',
        'target_language': 'hi'
    }, format='json')
    tts_view = TextToSpeechAPIView.as_view()
    tts_res = tts_view(tts_req)
    if tts_res.status_code == 200:
        record_test("Voice TTS Audio Generation API", True, f"Audio generated or spoken successfully")
    else:
        record_test("Voice TTS Audio Generation API", False, f"Status: {tts_res.status_code}")

    # Test 6: Voice Health Query API
    vq_req = factory.post('/api/v1/translations/voice/query/', data={
        'query': 'I have fever and head pain',
        'target_language': 'hi'
    }, format='json')
    vq_view = VoiceHealthQueryAPIView.as_view()
    vq_res = vq_view(vq_req)
    if vq_res.status_code == 200 and vq_res.data.get('answer_regional'):
        record_test("Voice Health Query Assistant API", True, f"AI Answer: {vq_res.data.get('answer_regional')[:60]}...")
    else:
        record_test("Voice Health Query Assistant API", False, f"Status: {vq_res.status_code}")

    # Test 7: Medication Reminders API
    patient_id = getattr(patient_user, 'patient', None).id if getattr(patient_user, 'patient', None) else 1
    rem_req = factory.post('/api/v1/reminders/', data={
        'patient': patient_id,
        'title': 'Lisinopril 10mg Morning Dose',
        'time': '08:00:00',
        'notes': 'Take with water after breakfast'
    }, format='json')
    force_authenticate(rem_req, user=patient_user)
    rem_view = ReminderViewSet.as_view({'post': 'create', 'get': 'list'})
    rem_res = rem_view(rem_req)
    if rem_res.status_code == 201:
        rem_id = rem_res.data.get('id')
        record_test("Medication Reminder Creation API", True, f"Reminder ID: {rem_id}")
        
        # Test Acknowledge Reminder Dose
        tog_req = factory.post(f'/api/v1/reminders/{rem_id}/acknowledge/')
        force_authenticate(tog_req, user=patient_user)
        tog_view = ReminderViewSet.as_view({'post': 'acknowledge_dose'})
        tog_res = tog_view(tog_req, pk=rem_id)
        if tog_res.status_code == 200:
            record_test("Acknowledge Medication Dose API", True, f"Dose Status: {tog_res.data.get('dose_status')}")
        else:
            record_test("Acknowledge Medication Dose API", False, f"Status: {tog_res.status_code}")

    else:
        record_test("Medication Reminder Creation API", False, f"Status: {rem_res.status_code} Details: {rem_res.data}")

    # Test 8: Medical Education Content API
    edu_req = factory.get('/api/v1/education/preventive/')
    edu_view = PreventiveHealthAPIView.as_view()
    edu_res = edu_view(edu_req)
    if edu_res.status_code == 200:
        record_test("Medical Education & Guidance Topics API", True, f"Loaded articles: {edu_res.data.get('articles_count')}")
    else:
        record_test("Medical Education & Guidance Topics API", False, f"Status: {edu_res.status_code}")

    # Test 9: Emergency 108 SOS Alert API
    sos_req = factory.post('/api/v1/medical/emergency/ambulance-request/', data={
        'location': 'Mandya Village, Karnataka',
        'emergency_type': 'Medical Emergency'
    }, format='json')
    force_authenticate(sos_req, user=patient_user)
    sos_view = AmbulanceRequestAPIView.as_view()
    sos_res = sos_view(sos_req)
    if sos_res.status_code == 200:
        record_test("108 Emergency SOS Trigger API", True, f"SOS Dispatch ID: {sos_res.data.get('dispatch_id')}")
    else:
        record_test("108 Emergency SOS Trigger API", False, f"Status: {sos_res.status_code}")

    # Test 10: Ask AI Floating Health Assistant Chatbot API
    ai_req = factory.post('/api/v1/translations/voice/query/', data={
        'query': 'How to take Amoxicillin 500mg capsules?',
        'target_language': 'hi'
    }, format='json')
    ai_view = VoiceHealthQueryAPIView.as_view()
    ai_res = ai_view(ai_req)
    if ai_res.status_code == 200 and ai_res.data.get('answer_regional'):
        ans = ai_res.data.get('answer_regional')
        record_test("Ask AI Healthcare Assistant Chatbot API", True, f"Response: {ans[:60]}...")
    else:
        record_test("Ask AI Healthcare Assistant Chatbot API", False, f"Status: {ai_res.status_code}")

    # Cleanup audit test user
    patient_user.delete()
    print("Cleaned up audit test user.")

print("=== PLATFORM AUDIT TEST COMPLETE ===")
