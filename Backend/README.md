# AI-Powered Healthcare Communication Assistant for Rural Communities (Enterprise Django Backend)

[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)
[![Framework](https://img.shields.io/badge/django-5.2-green)](https://www.djangoproject.com/)
[![REST Framework](https://img.shields.io/badge/DRF-3.14-red)](https://www.django-rest-framework.org/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-blue)](https://www.postgresql.org/)
[![Architecture](https://img.shields.io/badge/architecture-Enterprise%20Clean%20Architecture-purple)](#)

> **Infosys Virtual Internship Project Submission**  
> An enterprise-grade, modular healthcare communication backend engineered to simplify complex medical prescriptions, translate regional language guidance, generate voice guidance audio (TTS), and schedule automated daily reminder alarms for rural communities.

---

## 🌟 Architecture Blueprint & Directory Layout

The project follows **Enterprise Corporate Architecture** standards used by senior Django software architects in top product companies:

```
Backend/
│
├── config/                     # Django Project Gateway Configuration
│   ├── settings.py             # Project Settings & PostgreSQL Config
│   ├── urls.py                 # Master REST API Routing Gateway
│   ├── sync_views.py           # Offline Sync & System Health Check Views
│   └── views.py                # System Root API View
│
├── accounts/                   # Authentication & User Role Domain
├── patients/                   # Patient Demographics Domain
├── medical/                    # Medical Documents & OCR Vision Processing
├── medications/                # Prescription Parser & Medical Logic Pipeline
├── reminders/                  # Alarm Scheduling & Caregiver SMS Trigger Engine
├── translations/               # 9 Regional Languages & Voice Audio (TTS)
├── healthcare_workers/         # Provider Directory Domain
│
├── common/                     # Shared System Core Utilities
│   ├── choices.py              # Centralized System Enums (Language, Gender, Role)
│   └── validators.py           # File Upload & MIME Type Validation Utilities
│
├── media/                      # Uploaded Prescriptions & Voice Guidance Audio
│   ├── medical_documents/      # Doctor Prescription Photos & PDFs
│   └── translations/audio/     # Localized Voice Guidance .wav Audio Files
│
├── scripts/                    # Demonstration, Testing & Data Seeding Scripts
│   ├── seed_lakshmi_demo.py    # Demographic & Medical Data Seeder
│   ├── test_prescription_pipeline.py # Automated Pipeline Tester
│   └── test_voice_guidance_system.py # Regional Voice Guidance Tester
│
├── .env                        # Environment Variables (PostgreSQL & Credentials)
├── requirements.txt            # Python Dependencies
├── README.md                   # Enterprise Technical Documentation
└── manage.py                   # Django Management Entry Point
```

---

## ⚡ Key Features Implemented

- ✅ **5 Core Domain Modules:** `patients`, `medical`, `medications`, `reminders`, `translations`.
- ✅ **PostgreSQL Database:** Connected to `healthcare_assistant_db` on `localhost:5432`.
- ✅ **Master DRF API Router:** Centralized `/api/` landing page listing all domain endpoints in an interactive HTML interface.
- ✅ **JWT Authentication & Accounts:** `/api/auth/register/` and `/api/auth/login/` returning Access & Refresh tokens.
- ✅ **Integrated Patient Auto-Creation:** Registering a patient auto-creates their User, UserProfile, and domain Patient records in PostgreSQL.
- ✅ **Automated Prescription Pipeline (`PrescriptionParserService`):** Uploading 1 prescription picture automatically extracts medicines, generates plain guidance, and schedules daily alarms!
- ✅ **OCR Image Engine (`OpticalCharacterRecognitionService`):** Extracts text tokens from doctor prescription pictures.
- ✅ **Multi-Lingual Regional Translation (9 Languages):** Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Malayalam, Punjabi.
- ✅ **Voice Guidance Audio Generator (TTS):** Generates `.wav` voice guidance audio files for non-literate rural patients.
- ✅ **Automated Reminder & Caregiver Alerts:** Triggers alarms and generates emergency SMS alerts for caregivers (e.g. Ramesh - Son).
- ✅ **Offline Batch Synchronization API (`/api/sync/offline-batch/`):** Batch syncs offline queued data from mobile apps.

---

## 🌐 API Reference & Endpoints

All endpoints are mounted under `http://127.0.0.1:8000/api/`:

| Route Path | HTTP Methods | Description |
| :--- | :---: | :--- |
| **`http://127.0.0.1:8000/`** | `GET` | Root API System Status & Route Index |
| **`http://127.0.0.1:8000/api/`** | `GET` | DRF Master API Browsable Landing Page |
| **`/api/auth/register/`** | `POST`, `GET` | User & Patient Profile Registration |
| **`/api/auth/login/`** | `POST`, `GET` | User Authentication (Returns JWT Tokens) |
| **`/api/patients/`** | `GET`, `POST` | List & Create Patient Profiles |
| **`/api/medical-documents/`** | `GET`, `POST` | List Documents & Upload Prescription Pictures |
| **`/api/medications/`** | `GET`, `POST` | List & Create Medications |
| **`/api/medications/parse-prescription/`** | `POST` | Custom endpoint for raw text parsing |
| **`/api/translations/`** | `GET`, `POST` | List & Create Medical Text Translations |
| **`/api/translations/generate-voice-guidance/`** | `POST` | Generate Regional Translation & Voice Audio (.wav) |
| **`/api/reminders/`** | `GET`, `POST` | List & Schedule Medication Alarms |
| **`/api/reminders/trigger-due-reminders/`** | `POST` | Trigger Alarms & Caregiver Emergency Alerts |
| **`/api/sync/offline-batch/`** | `POST` | Batch Sync Offline Queued Data |
| **`/api/sync/health-check/`** | `GET` | System Health & PostgreSQL Database Check |

---

## ⚙️ Local Installation & Setup Guide

### 1. Setup Virtual Environment
```powershell
cd Backend
python -m venv venv
.\venv\Scripts\activate
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Apply PostgreSQL Database Migrations
```powershell
python manage.py makemigrations
python manage.py migrate
```

### 4. Run Development Server
```powershell
python manage.py runserver
```

---

## 🧪 Verification Commands

```powershell
# Run Seeding Scenario Script (Lakshmi Demo)
python scripts/seed_lakshmi_demo.py

# Run Prescription Pipeline Verification
python scripts/test_prescription_pipeline.py

# Run Regional Voice Guidance Audio Verification
python scripts/test_voice_guidance_system.py
```