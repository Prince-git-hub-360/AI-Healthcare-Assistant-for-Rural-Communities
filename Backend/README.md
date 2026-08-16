# ⚙️ Enterprise Django Backend — AI-Powered Healthcare Assistant

[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)
[![Framework](https://img.shields.io/badge/django-5.2-green)](https://www.djangoproject.com/)
[![REST Framework](https://img.shields.io/badge/DRF-3.17-red)](https://www.django-rest-framework.org/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-blue)](https://www.postgresql.org/)

> **Infosys Springboard Virtual Internship Project Submission**  
> Scalable, domain-driven Django REST Framework backend powering OCR prescription scanning, multilingual voice synthesis (gTTS), patient health vault (ABHA), medication reminders, and caregiver escalation.

---

## 🏛️ Backend Architecture Overview

The backend uses a modular, domain-driven Django application structure:

```
Backend/
├── apps/
│   ├── accounts/            # JWT authentication, user registration & profiles (Patient/Doctor/Caregiver)
│   ├── healthcare_workers/  # ASHA worker & doctor directory, patient assignments
│   ├── medical/             # Document uploads, PyTesseract OCR processing, emergency SOS
│   ├── medications/         # Prescription records, parsing service & drug directory
│   ├── patients/            # Patient demographics, medical history & ABHA digital card
│   ├── reminders/           # Medication scheduling, visual pillbox & caregiver alerts
│   └── translations/        # Multilingual translation engine & gTTS voice guidance audio (.wav)
├── common/                  # Centralized enums (choices.py), validators, shared helpers
├── config/                  # Django project core (settings.py, urls.py, sync_views.py)
├── media/                   # Uploaded prescription images & generated voice audio files
├── scripts/                 # Data seeders & automated verification tools
├── manage.py                # Django CLI entrypoint
├── requirements.txt         # Python dependencies
└── README.md                # Backend technical specification (This File)
```

---

## ⚡ Core Functionality Implemented

- ✅ **5 Domain Modules:** `accounts`, `patients`, `medical`, `medications`, `reminders`, `translations`, `healthcare_workers`.
- ✅ **PostgreSQL Database Integration:** Configured for `healthcare_assistant_db` on `localhost:5432`.
- ✅ **Master DRF API Router:** Centralized landing interface mounted under `/api/` and `/api/v1/`.
- ✅ **JWT Authentication & Profile Management:** `/api/v1/auth/login/` and `/api/v1/auth/register/` returning Access & Refresh tokens.
- ✅ **Integrated Patient Auto-Creation:** Patient registration auto-provisions `User`, `UserProfile`, and `Patient` database models.
- ✅ **Automated Prescription OCR Engine (`OpticalCharacterRecognitionService`):** Extracts text tokens from doctor prescription uploads using PyTesseract.
- ✅ **Prescription Parsing Engine (`PrescriptionParserService`):** Automatically identifies medicines, dosages, frequencies, and creates reminder schedules.
- ✅ **Multilingual Translation (12+ Regional Languages):** Hindi, Bengali, Tamil, Telugu, Marathi, Kannada, Gujarati, Malayalam, Punjabi, etc.
- ✅ **Voice Guidance Audio Generator (gTTS):** Synthesizes `.wav` voice audio files for non-literate rural patients.
- ✅ **Automated Reminders & Caregiver Alerts:** Visual pillbox schedule generator with automatic caregiver escalation for missed doses.
- ✅ **Offline Sync & Health Diagnostic APIs:** `/api/v1/sync/offline-batch/` and `/api/v1/sync/health-check/`.

---

## 🛠️ Local Setup & Run Commands

### 1. Environment Setup
```powershell
cd Backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Database Migrations & Data Seeding
```powershell
python manage.py makemigrations
python manage.py migrate
python scripts/seed_lakshmi_demo.py
```

### 4. Run Django Dev Server
```powershell
python manage.py runserver
```

> **Backend URL:** `http://127.0.0.1:8000/`  
> **Swagger OpenAPI Specs:** `http://127.0.0.1:8000/api/schema/swagger-ui/`

---

## 🧪 Verification & Audit Scripts

```powershell
# Run platform feature suite
python scripts/test_all_features.py

# Verify API endpoints
python scripts/verify_all_apis.py

# Run Prescription OCR pipeline test
python scripts/test_prescription_pipeline.py

# Run Voice Guidance system test
python scripts/test_voice_guidance_system.py
```

---

## 🌐 API Route Specification

| Route Path | HTTP Methods | Description |
| :--- | :---: | :--- |
| **`/api/v1/auth/register/`** | `POST` | User & Patient Profile Registration |
| **`/api/v1/auth/login/`** | `POST` | User Authentication (Returns JWT Access & Refresh tokens) |
| **`/api/v1/auth/profile/`** | `GET, PUT` | Retrieve and update current user profile |
| **`/api/v1/patients/`** | `GET, POST` | List & Create Patient Records |
| **`/api/v1/patients/profile/`** | `GET, PUT` | ABHA Health Card & Patient Vault Details |
| **`/api/v1/medical-documents/`** | `GET, POST` | List Medical Documents & Upload Prescription Scans |
| **`/api/v1/medications/`** | `GET, POST` | List & Create Medication Records |
| **`/api/v1/medications/parse-prescription/`** | `POST` | Raw Text OCR Prescription Parsing |
| **`/api/v1/reminders/`** | `GET, POST` | List & Schedule Visual Pillbox Reminders |
| **`/api/v1/reminders/trigger-due-reminders/`** | `POST` | Process Alarms & Trigger Caregiver Escalation |
| **`/api/v1/translations/`** | `GET, POST` | List & Request Translations |
| **`/api/v1/translations/generate-voice-guidance/`** | `POST` | Generate Regional Voice Audio (.wav) |
| **`/api/v1/sync/offline-batch/`** | `POST` | Batch Sync Offline Records |
| **`/api/v1/sync/health-check/`** | `GET` | Backend System & Database Connectivity Health Check |