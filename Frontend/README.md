# 💻 React 19 + Vite Frontend — Rural Healthcare Communication Assistant

[![React Version](https://img.shields.io/badge/react-19.2-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-8.2-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.4-38B2AC)](https://tailwindcss.com/)

> **Infosys Springboard Virtual Internship Project Submission**  
> Modern, accessible Single Page Application (SPA) built for rural patients, healthcare workers (ASHA Workers & Doctors), and family caregivers. Provides voice-guided medication instructions, OCR prescription display, visual pillbox calendars, and ABHA digital health cards.

---

## 📁 Frontend Architecture & Folder Structure

```
Frontend/
├── public/                  # Static HTML & image assets (icons, badges, demo audio)
├── src/
│   ├── api/                 # Axios client with JWT token injection & auto-refresh interceptor
│   ├── app/                 # App initialization, Providers & router configuration
│   ├── assets/              # App images & brand assets
│   ├── components/          # Reusable interface components
│   │   ├── application/     # Application workflow components
│   │   ├── auth/            # Login & multi-step registration forms
│   │   ├── layout/          # Navbar, Sidebar & layout wrappers
│   │   ├── marketing/       # Hero banner & feature overview cards
│   │   ├── medical/         # Medical document upload & OCR display
│   │   ├── profile/         # Profile management & ABHA digital health card view
│   │   └── ui/              # Toast notifications, badges, modals, & buttons
│   ├── context/             # AuthContext (user state, JWT tokens) & Language context
│   ├── features/            # Role-specific feature modules
│   │   ├── auth/            # Role selection & login/register state
│   │   ├── caregiver/       # Caregiver dashboard & patient adherence monitor
│   │   ├── healthcare-worker/# Doctor & ASHA worker portal
│   │   ├── patient/         # Patient vault, voice assistant & pillbox treatment planner
│   │   └── public/          # Public landing pages & educational content
│   ├── hooks/               # Custom React hooks (speech synthesis, auth state, reminders)
│   ├── pages/               # Top-level view pages & authentication routes
│   ├── services/            # API service calls mapping to backend domain endpoints
│   ├── shared/              # Shared UI utility components & icons
│   ├── styles/              # Global & modular CSS styles
│   ├── utils/               # Route constants, speech helpers & formatters
│   ├── App.jsx              # Application root element
│   ├── index.css            # Modern utility & custom CSS styling
│   └── main.jsx             # React DOM entrypoint
├── index.html               # Main HTML entry document
├── package.json             # NPM dependencies & scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite dev server configuration & API proxy settings
└── README.md                # Frontend documentation (This File)
```

---

## 🛠️ How to Run the Frontend

1. Open a terminal in the `Frontend` directory:
   ```powershell
   cd Frontend
   ```
2. Install npm dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
4. Access the web interface in your browser:
   > 🌐 `http://localhost:5173/`

The frontend is configured to communicate with the Django backend REST API running on `http://127.0.0.1:8000/api/v1/`.

---

## ⚡ Key Modules & Features

- 🔐 **Auth Context (`src/context/AuthContext.jsx`)**: Manages JWT authentication state, access token refreshing, role selection (Patient/Caregiver/Doctor), and user session persistence.
- 🌐 **Axios API Layer (`src/api/api.js` & `src/services/`)**: Intercepts requests to inject JWT bearer tokens and automatically handles token refresh retries.
- 🖼️ **OCR Prescription Scanner (`src/components/medical/`)**: Allows users to upload doctor prescriptions and view parsed medication instructions.
- 🗣️ **Voice Guidance Assistant (`src/utils/` & `src/hooks/`)**: Provides voice synthesis (Text-to-Speech) in 12+ Indian regional languages for low-literacy rural patients.
- 📅 **5-Day Visual Treatment Planner (`src/features/patient/`)**: Displays visual pillboxes with morning/afternoon/evening dose badges.
- 🆔 **ABHA Digital Health Vault (`src/components/profile/`)**: Renders interactive digital health cards with downloadable QR codes for quick hospital registration.
