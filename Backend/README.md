# AI-Powered Healthcare Communication Assistant for Rural Communities (Enterprise Django Backend)

[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)
[![Framework](https://img.shields.io/badge/django-5.2-green)](https://www.djangoproject.com/)
[![REST Framework](https://img.shields.io/badge/DRF-3.14-red)](https://www.django-rest-framework.org/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-blue)](https://www.postgresql.org/)

> **Infosys Virtual Internship Project Submission**
> This backend is built to support rural healthcare communication, prescription management, multilingual guidance, and reminder workflows in a scalable Django architecture.

---

## Backend Architecture Overview

This backend follows a modular Django application structure to keep each business domain separate and maintainable.

```
Backend/
├── apps/
│   ├── accounts/            # Authentication, JWT, user profiles
│   ├── patients/            # Patient demographics, profiles, caregivers
│   ├── medical/             # Medical document uploads, OCR, emergency and education features
│   ├── medications/         # Prescription parsing, medication records
│   ├── reminders/           # Medication reminders and caregiver alerting
│   ├── translations/        # Translation content, voice guidance APIs
│   ├── healthcare_workers/  # Healthcare provider users and assignments
├── common/                  # Shared utilities, validators, enums
├── config/                  # Django app configuration, URLs, settings
├── media/                   # Uploaded images, documents, audio
├── scripts/                 # Demo seeding and verification scripts
├── requirements.txt         # Python dependency list
└── manage.py                # Django CLI entrypoint
```

### Core Backend Modules

- `accounts`: JWT login, registration, user profile management
- `patients`: patient record management, caregiver assignments, recommendation endpoints
- `medical`: medical document upload, OCR text extraction, emergency guidance, health education endpoints
- `medications`: medication storage and parsing support
- `reminders`: medication schedule management, trigger reminders and caregiver alerts
- `translations`: text translation and voice guidance generation
- `healthcare_workers`: provider role management and directory

---

## What is Already Implemented

- PostgreSQL connection using `healthcare_assistant_db`
- Django REST Framework with app-level modular endpoints
- JWT authentication and profile management
- Backend-first architecture for future OCR, translation, and voice assistant extensions
- API contract with the frontend under `/api/v1/`

---

## Local Installation & Setup

### Run the backend

```powershell
cd Backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Useful developer commands

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py check
python manage.py test
```

---

## Key Backend Endpoints

### Authentication
- `POST /api/v1/auth/register/` — register a new user and profile
- `POST /api/v1/auth/login/` — authenticate and receive JWT access and refresh tokens
- `GET /api/v1/auth/profile/` — retrieve the authenticated user's profile
- `PUT /api/v1/auth/profile/` — update profile details

### Core domain APIs
- `GET /api/v1/patients/` — list patient profiles
- `GET /api/v1/healthcare-workers/` — list health worker profiles
- `GET /api/v1/medical-documents/` — list medical uploads
- `POST /api/v1/medical-documents/` — upload medical documents, prescriptions, or reports
- `GET /api/v1/medications/` — list medication records
- `POST /api/v1/medications/` — create new medication records
- `GET /api/v1/reminders/` — list scheduled reminders
- `POST /api/v1/reminders/` — create medication reminders
- `GET /api/v1/translations/` — list translations
- `POST /api/v1/translations/` — create translation records

### System support APIs
- `POST /api/v1/sync/offline-batch/` — batch sync offline data
- `GET /api/v1/sync/health-check/` — system health and backend health status

---

## Developer Notes

- Keep `Backend/.env` private and do not commit it.
- The database should already be created prior to running migrations.
- App-level routing is configured with `Backend/apps/*/urls.py` for future modular expansion.
- The backend is intentionally architected to support later AI, OCR, and translation module integration.

---

## Future Improvement Areas

The current backend is ready to absorb:
- AI prescription parsing and medical entity extraction
- OCR/vision-based prescription reading
- multilingual medical simplification
- voice guidance (text-to-speech)
- notification services and caregiver alerts
- role-based access control for patients, caregivers, and healthcare workers

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