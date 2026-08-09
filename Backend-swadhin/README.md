# Healthcare Platform — AI-Powered Healthcare Communication (Rural Community)

Phase 1 deliverable: project scaffold, PostgreSQL config, and database design.

## 1. Project Setup

```bash
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # then fill in real values
```

## 2. Git Setup

```bash
git init
git add .
git commit -m "Phase 1: project setup, PostgreSQL config, database design"

# connect to a remote (replace with your repo URL)
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

Recommended branching model:
- `main` — stable/deployable
- `develop` — integration branch
- `feature/<name>` — one branch per task (e.g. `feature/patient-registration`)

## 3. PostgreSQL Configuration

Create the database and user (run in `psql`):

```sql
CREATE DATABASE healthcare_db;
CREATE USER healthcare_user WITH PASSWORD 'changeme';
ALTER ROLE healthcare_user SET client_encoding TO 'utf8';
ALTER ROLE healthcare_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE healthcare_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE healthcare_db TO healthcare_user;
```

Match those values in `.env`.

## 4. Database Design

Defined in `accounts/models.py`:

| Model | Purpose |
|---|---|
| `User` | Custom user (patient / doctor / staff), phone-based login, `language_preference` |
| `PatientProfile` | Demographics, rural locality info, emergency contact, medical basics |
| `MedicalDocument` | Uploaded prescriptions/reports/scans, linked to patient |

Generate and apply migrations once PostgreSQL is running:

```bash
python manage.py makemigrations accounts
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## 5. Running the server

```bash
python manage.py makemigrations accounts
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Visit `http://127.0.0.1:8000/` for a list of all endpoints, or `/admin/` for the Django admin.

## 6. API Reference

### User Management
| Feature | Endpoint | Method |
|---|---|---|
| Patient Registration | `/api/accounts/register/` | POST |
| Healthcare Worker Registration | `/api/accounts/register/worker/` | POST |
| Login | `/api/accounts/login/` | POST |
| Profile Management (patient) | `/api/accounts/profile/patient/` | GET/PUT |
| Profile Management (worker) | `/api/accounts/profile/worker/` | GET/PUT |
| Profile Management (generic) | `/api/accounts/profile/` | GET/PUT |
| Language Preference Configuration | `/api/accounts/profile/language/` | PUT |

Registration returns a token — pass it as `Authorization: Token <token>` on subsequent requests.

### Healthcare Information Repository / Document Management
| Feature | Endpoint | Method |
|---|---|---|
| Upload Medical Documents | `/api/accounts/documents/` | POST (multipart, `file` field) |
| Prescription Management | `/api/accounts/documents/?document_type=prescription` | GET |
| Discharge Summary Upload | `/api/accounts/documents/` (`document_type=discharge_summary`) | POST |
| Medical Report Management | `/api/accounts/documents/?document_type=lab_report` | GET |
| Store Healthcare Records / Document detail | `/api/accounts/documents/<uuid>/` | GET/DELETE |
| Patient History Management | `/api/accounts/history/` | GET |
| Healthcare Content Repository | `/api/accounts/content/` | GET/POST |

`document_type` accepts: `prescription`, `lab_report`, `discharge_summary`, `scan`, `id_proof`, `other`.

## 7. Database Design (updated)

| Model | Purpose |
|---|---|
| `User` | Custom user (patient / doctor / staff), phone-based login, `language_preference` |
| `PatientProfile` | Demographics, rural locality info, emergency contact, medical basics |
| `HealthcareWorkerProfile` | License number, specialization, health center, approval status |
| `MedicalDocument` | Uploaded prescriptions/reports/discharge summaries/scans, linked to patient |
| `HealthContent` | Published educational articles/videos/FAQs/advisories (multi-language) |

## Status

- Phase 1: Project setup, PostgreSQL config, database design — done
- Phase 2: Registration (patient + worker), Login, Profile Management, Language Preference, Authentication — done
- Phase 3: CRUD APIs, Medical Document Upload, Content Repository, Patient History — done
- Phase 4: API testing — pending (run against a live PostgreSQL instance)

**Note:** this backend is built with **Django + Django REST Framework**, not FastAPI. If your task list specifically requires a FastAPI implementation, that would need a separate rewrite — let me know and I can do that instead.
