# Swasthya Sanchar

Swasthya Sanchar is an AI-powered healthcare communication assistant for rural communities. The project combines a Django REST API backend with a React/Vite frontend to support patient profiles, medical document management, multilingual guidance, reminders, and healthcare workflow features.

## Project Structure

- `Backend/` — Django REST API, PostgreSQL integration, and domain apps
- `Frontend/` — React/Vite client for the healthcare assistant experience
- `.vscode/` — editor workspace settings for Python development

## Quick Start

### Backend

```bash
cd Backend
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Notes

- The frontend and backend are intentionally kept connected through the existing API base configuration.
- The project uses environment variables for database and application secrets.
- Git and GitHub setup are prepared at the repository root.
