"""
scripts/verify_all_apis.py

Comprehensive test suite verifying all 28 API endpoints in Django backend with JWT Authentication.
"""
import urllib.request
import urllib.parse
import json

BASE_URL = "http://127.0.0.1:8000"

def get_auth_token():
    reg_url = f"{BASE_URL}/api/v1/auth/register/"
    reg_data = {
        "username": "api_tester",
        "email": "tester@example.com",
        "password": "TestPassword123!",
        "role": "patient",
        "phone_number": "+919876543210",
        "preferred_language": "hi"
    }
    
    req = urllib.request.Request(reg_url, method="POST")
    req.add_header('Content-Type', 'application/json')
    try:
        urllib.request.urlopen(req, data=json.dumps(reg_data).encode('utf-8'))
    except Exception:
        pass  # User already registered

    login_url = f"{BASE_URL}/api/v1/auth/login/"
    login_data = {
        "username": "api_tester",
        "password": "TestPassword123!"
    }
    req = urllib.request.Request(login_url, method="POST")
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, data=json.dumps(login_data).encode('utf-8')) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            return res.get('tokens', {}).get('access')
    except Exception as e:
        print(f"[!] Auth Error: {e}")
        return None

def test_apis():
    print("=" * 80)
    print("[+] TESTING ALL HEALTHCARE BACKEND API ENDPOINTS WITH JWT AUTHENTICATION")
    print("=" * 80)

    jwt_token = get_auth_token()
    print(f"[+] JWT Auth Token Acquired: {jwt_token[:25]}..." if jwt_token else "[!] Operating without token")

    tests = [
        ("Root API Check", "GET", "/"),
        ("OpenAPI Schema", "GET", "/api/schema/"),
        ("Swagger UI Docs", "GET", "/api/docs/"),
        ("Health Check", "GET", "/api/v1/sync/health-check/"),
        
        # User Management & Auth
        ("Auth Root", "GET", "/api/v1/auth/"),
        ("User Profile Info", "GET", "/api/v1/auth/profile/"),
        ("Patients List", "GET", "/api/v1/patients/"),
        ("Healthcare Workers List", "GET", "/api/v1/healthcare-workers/"),

        # Medical Documents & Healthcare Info Repository
        ("Medical Documents List", "GET", "/api/v1/medical-documents/"),
        ("Medications List", "GET", "/api/v1/medications/"),
        ("Reminders List", "GET", "/api/v1/reminders/"),
        ("Caregiver Assignments", "GET", "/api/v1/caregiver-assignments/"),

        # Voice Assistance System
        ("Speech To Text", "POST", "/api/v1/voice/speech-to-text/", {"language": "hi"}),
        ("Text To Speech", "POST", "/api/v1/voice/text-to-speech/", {"text": "कृपया दवा समय पर लें", "target_language": "hi"}),
        ("Voice Health Query", "POST", "/api/v1/voice/query/", {"query": "What should I do for high fever?", "target_language": "te"}),

        # Medical Terminology Simplification & NLP Engine
        ("Medical Terminology Simplification", "POST", "/api/v1/simplification/simplify-terms/", {"medical_text": "Patient has hypertension and dyspnea", "target_language": "hi"}),
        ("NLP Entity Extraction Engine", "POST", "/api/v1/nlp/extract-entities/", {"clinical_text": "Patient diagnosed with fever, prescribed Paracetamol 500mg 1-0-1 for 5 days"}),
        ("Symptom Explanation Module", "POST", "/api/v1/symptoms/explain/", {"symptom": "fever", "language": "hi"}),
        ("Multilingual Knowledge Base FAQs", "GET", "/api/v1/knowledge-base/faqs/?language=te"),

        # Emergency Information Assistance
        ("First Aid Guidance", "GET", "/api/v1/emergency/first-aid/"),
        ("Emergency Contacts", "GET", "/api/v1/emergency/contacts/"),
        ("Nearby Healthcare Facilities", "GET", "/api/v1/emergency/nearby-facilities/"),

        # Health Education Services
        ("Preventive Health Education", "GET", "/api/v1/education/preventive/"),
        ("Maternal Health Education", "GET", "/api/v1/education/maternal/"),
        ("Child Health Education", "GET", "/api/v1/education/child/"),
        ("Elderly Care Education", "GET", "/api/v1/education/elderly/"),

        # AI Recommendation Engine
        ("Personalized AI Recommendations", "GET", "/api/v1/ai/personalized-recommendations/"),
        ("Health Awareness Tips", "GET", "/api/v1/ai/awareness-tips/"),
        ("Follow Up Suggestions", "GET", "/api/v1/ai/follow-up-suggestions/"),
    ]

    passed = 0
    failed = 0

    for name, method, endpoint, *payload in tests:
        url = f"{BASE_URL}{endpoint}"
        body = payload[0] if payload else None
        
        req = urllib.request.Request(url, method=method)
        if jwt_token:
            req.add_header('Authorization', f'Bearer {jwt_token}')

        if body:
            data_bytes = json.dumps(body).encode('utf-8')
            req.add_header('Content-Type', 'application/json')
            req.data = data_bytes

        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                status_code = response.getcode()
                if status_code in [200, 201]:
                    print(f"[OK] {name:<40} ({method} {endpoint}) -> HTTP {status_code}")
                    passed += 1
                else:
                    print(f"[FAIL] {name:<38} ({method} {endpoint}) -> HTTP {status_code}")
                    failed += 1
        except urllib.error.HTTPError as e:
            print(f"[FAIL] {name:<38} ({method} {endpoint}) -> HTTP {e.code}")
            failed += 1
        except Exception as e:
            print(f"[ERROR] {name:<39} ({method} {endpoint}) -> Error: {e}")
            failed += 1

    print("=" * 80)
    print(f"[RESULTS] PASSED: {passed}/{len(tests)} | FAILED: {failed}/{len(tests)}")
    print("=" * 80)

if __name__ == "__main__":
    test_apis()
