# Frontend: React + Vite Client for Rural Healthcare Assistant

This frontend application is built with React 19 and Vite to provide the user interface for the AI-Powered Healthcare Communication Assistant. It is designed to interact with the Django backend via REST APIs and present a professional, modular client architecture.

## Frontend Folder Structure

```
Frontend/
├── public/                  # Static HTML and image assets
├── src/
│   ├── api/                 # API service layer for backend communication
│   ├── components/
│   │   ├── auth/            # login and registration components
│   │   ├── layout/          # navigation and shared layout components
│   │   ├── medical/         # medical documents and upload UI
│   │   ├── profile/         # profile dashboard and user settings UI
│   │   └── ui/              # shared UI components such as toast notifications
│   ├── context/             # auth and global application state
│   ├── pages/               # page-level view containers
│   └── styles/              # shared CSS styles
├── package.json             # frontend dependencies and scripts
├── package-lock.json        # generated npm lock file
├── README.md                # frontend documentation
└── requirements.txt         # frontend dependency notes for reviewers
```

## How to Run the Frontend

1. Open a terminal in `Frontend`.
2. Install dependencies:

```powershell
npm install
```

3. Start the development server:

```powershell
npm run dev
```

4. Open the provided Vite URL in your browser.

The frontend is configured to communicate with the backend on `/api/v1/`.

## Key Frontend Features

- `src/context/AuthContext.jsx` — manages authentication state, JWT token refresh, profile refresh, and language preference.
- `src/api/api.js` — centralized API request helper with token handling and refresh retry.
- `src/components/auth/Login.jsx` — login UI with role selection for patient, caregiver, and healthcare worker.
- `src/components/auth/Register.jsx` — multi-step registration UI for profile creation.
- `src/components/profile/ProfileDashboard.jsx` — user profile details, edit form, and JWT refresh helper.
- `src/components/medical/MedicalDocuments.jsx` — medical document upload, listing, filtering, and audio helper logic.
- `src/components/layout/Navbar.jsx` — global navigation, API health indicator, language switcher, and logout.

## Notes for Reviewers

- The frontend is built to reflect clean separation of responsibilities and a scalable component architecture.
- The current implementation supports secure JWT-based communication with the backend.
- `requirements.txt` is included as a reviewer note; the actual frontend dependency manager is `npm`.

## Future Enhancements

The structure supports future additions such as:

- OCR prescription preview screens
- AI-based translation and simplification interfaces
- voice guidance playback controls
- medication reminders dashboard
- role-specific dashboards for patients, providers, and caregivers
