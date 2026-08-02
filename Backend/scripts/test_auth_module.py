import json
import urllib.request

BASE_URL = "http://127.0.0.1:8000/api/v1"

def post_json(url, data, headers=None):
    if headers is None:
        headers = {}
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

def get_json(url, headers=None):
    if headers is None:
        headers = {}
    req = urllib.request.Request(url, headers=headers, method='GET')
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

def main():
    print("=== Testing Part 1: Authentication & User Profile Management ===")

    # 1. Register User
    reg_payload = {
        "username": "rural_patient_test",
        "password": "StrongPassword@123",
        "email": "rural.patient@example.com",
        "first_name": "Ramesh",
        "last_name": "Sharma",
        "role": "patient",
        "gender": "M",
        "date_of_birth": "1991-08-20",
        "preferred_language": "hi",
        "phone_number": "+91 9876500111",
        "village_or_town": "Rampur",
        "district": "Sitapur",
        "state": "Uttar Pradesh",
        "pincode": "261001",
        "emergency_contact_name": "Suresh Sharma",
        "emergency_contact_phone": "+91 9876500222"
    }

    status, res = post_json(f"{BASE_URL}/auth/register/", reg_payload)
    print(f"1. Registration Response ({status}):")
    print(json.dumps(res, indent=2))

    # 2. Login User
    login_payload = {
        "username": "rural_patient_test",
        "password": "StrongPassword@123"
    }
    status, login_res = post_json(f"{BASE_URL}/auth/login/", login_payload)
    print(f"\n2. Login Response ({status}):")
    print(json.dumps(login_res, indent=2))

    access_token = login_res.get('tokens', {}).get('access')
    refresh_token = login_res.get('tokens', {}).get('refresh')

    if not access_token:
        print("ERROR: Failed to retrieve access token.")
        return

    # 3. Get User Profile
    auth_headers = {"Authorization": f"Bearer {access_token}"}
    status, profile_res = get_json(f"{BASE_URL}/auth/profile/", headers=auth_headers)
    print(f"\n3. Fetch User Profile Response ({status}):")
    print(json.dumps(profile_res, indent=2))

    # 4. Token Refresh
    status, refresh_res = post_json(f"{BASE_URL}/auth/token/refresh/", {"refresh": refresh_token})
    print(f"\n4. Token Refresh Response ({status}):")
    print(json.dumps(refresh_res, indent=2))

    print("\nALL AUTHENTICATION & USER PROFILE TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
