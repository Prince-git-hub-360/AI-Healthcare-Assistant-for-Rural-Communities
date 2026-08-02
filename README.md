# Swasthya Sanchar / AI-Healthcare-Assistant-for-Rural-Communities

Swasthya Sanchar is an AI-powered healthcare communication assistant for rural communities.
This repository contains a Django REST API backend and a React/Vite frontend client. The platform's goal is to help rural patients understand medical information, translate prescriptions, provide voice guidance, and manage medication reminders.

Repository layout

- Backend/  — Django REST API (PostgreSQL, Django REST Framework)
- Frontend/ — React + Vite client application
- .vscode/  — VS Code workspace settings (interpreter path and extraPaths to help local development)

Quick start

Backend:
  cd Backend
  python -m venv venv
  venv\Scripts\activate
  pip install -r requirements.txt
  python manage.py migrate
  python manage.py runserver

Frontend:
  cd Frontend
  npm install
  npm run dev

Notes

- The frontend communicates with the backend on /api/v1/ by default.
- Configure DB credentials and secrets in Backend/.env.
- This README is a merged, reconciled version (conflicts resolved) of both local and remote README contents.
