# AI-Powered Healthcare Communication Assistant for Rural Communities

This repository contains the complete backend and frontend artifacts for the "AI-Powered Healthcare Communication Assistant for Rural Communities" project. It is built to help rural patients understand medical prescriptions, manage medication reminders, and receive multilingual health guidance through a scalable Django + React architecture.

## Repository Overview

- `Backend/` — Django REST API backend with PostgreSQL integration, domain apps, JWT authentication, and API routing.
- `Frontend/` — React / Vite client application for user interaction and healthcare task workflows.
- `.vscode/` — VS Code workspace settings for the local developer environment.

## Current Status

This repo is currently configured as a working full-stack project with:

- a connected Django backend using PostgreSQL
- a React frontend using Vite
- dynamic 5-Day Treatment Calendar & Patient Medication Planner
- shared API contract between frontend and backend
- clean modular folder structure for both backend and frontend
- local Git repository initialized and pushed to GitHub

## What evaluators should know

This project is organized into a professional, modular architecture:

- Backend modules are split by feature domain (`accounts`, `patients`, `medical`, `medications`, `reminders`, `translations`, `healthcare_workers`).
- Frontend components are separated into reusable UI, page-level pages, API service layer, and application state context.
- The design supports future AI, OCR, translation, and voice assistant capabilities without changing the core API contract.

## Technology Stack

- Backend: Python, Django 5.2, Django REST Framework, PostgreSQL, Simple JWT, drf-spectacular, django-cors-headers
- Frontend: React 19, Vite, Oxlint
- Environment: `.env` for backend configuration, local Node and Python tools

## Root Repository Structure

```
AI-Healthcare-Assistant-for-Rural-Communities/
├── Backend/
│   ├── apps/                  # Django apps for each domain module
│   ├── config/                # Django configuration and URL routing
│   ├── media/                 # uploaded documents and generated audio files
│   ├── requirements.txt       # Python backend dependencies
│   ├── README.md              # Backend-specific documentation
│   └── manage.py              # Django management entry point
├── Frontend/
│   ├── public/                # frontend static assets
│   ├── src/                   # React source code
│   │   ├── api/               # frontend API service layer
│   │   ├── components/        # reusable UI components
│   │   ├── context/           # auth and app context state
│   │   ├── pages/             # page-level route components
│   │   └── styles/            # shared CSS styles
│   ├── package.json           # frontend dependencies
│   ├── README.md              # Frontend-specific documentation
│   └── requirements.txt       # frontend dependency notes
├── .vscode/                   # recommended VS Code workspace settings
├── .gitignore
└── README.md                  # project-level documentation
```

## How to Run the Project

### Backend

1. Open a terminal and change directory into `Backend`.
2. Create and activate a Python virtual environment:

```powershell
cd Backend
python -m venv venv
.\venv\Scripts\activate
```

3. Install dependencies:

```powershell
pip install -r requirements.txt
```

4. Create or verify the `.env` file contains your database configuration.
5. Apply migrations:

```powershell
python manage.py migrate
```

6. Run the backend server:

```powershell
python manage.py runserver
```

The backend will start on `http://127.0.0.1:8000/`.

### Frontend

1. Open a terminal and change directory into `Frontend`.

```powershell
cd Frontend
```

2. Install dependencies:

```powershell
npm install
```

3. Run the frontend dev server:

```powershell
npm run dev
```

By default, the frontend runs on a Vite development server and consumes backend APIs from `/api/v1/`.

## API Contract Summary

The backend exposes a REST API under `http://127.0.0.1:8000/api/` and `http://127.0.0.1:8000/api/v1/`.

Important API groups:

- Authentication: `/api/v1/auth/`
- Patients: `/api/v1/patients/`
- Healthcare workers: `/api/v1/healthcare-workers/`
- Medical documents: `/api/v1/medical-documents/`
- Medications: `/api/v1/medications/`
- Reminders: `/api/v1/reminders/`
- Translations and voice endpoints: `/api/v1/translations/`, `/api/v1/voice/`
- Offline sync and health check: `/api/v1/sync/`

## Notes for Evaluators

- This is a backend-first MVP architecture that is already integrated with the frontend.
- The current implementation preserves the evaluated backend/frontend contract and adds professional structure.
- Future improvements are designed to fit cleanly into the existing domain architecture.

For more details on the backend and frontend modules, please see `Backend/README.md` and `Frontend/README.md`.
