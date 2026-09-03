# 📱 Swasthya AI Mobile Application

> **AI-Powered Healthcare Communication Assistant for Rural Communities**  
> Built with **React Native**, **Expo**, **TypeScript**, and **Tailored Indic Multilingual Engine**.

---

## 🚀 Key Features

1. **🧑 5-Day Visual Pillbox & Tactile Reminders**
   - High-contrast visual cards for Morning 🌅, Afternoon ☀️, Evening 🌇, and Night 🌙 doses.
   - Food timing indicators (Before Food 🍽️ / After Food 🍲).
   - "Take Dose" tactile button with instant streak updates and local sound effects.

2. **🗣️ Multilingual Voice Guidance (12+ Indic Languages)**
   - Text-to-Speech audio player (`expo-av`) powered by the Django gTTS audio synthesis engine.
   - Allows semi-literate and illiterate rural patients to *listen* to doctor instructions in **Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, Gujarati, Malayalam, Punjabi, Odia, Assamese**, etc.

3. **📸 AI Prescription Camera Scanner (OCR)**
   - Capture doctor prescriptions directly with device camera or pick from gallery.
   - Uploads to Groq / Gemini Vision API (`/api/v1/medical/prescriptions/upload/`).
   - Automatically breaks down medicines into dosage, frequency, and time of day.

4. **🆔 Offline ABHA Digital Health Card & QR Wallet**
   - National Health Authority (ABDM) standard health card.
   - Offline-cached QR code for instant scanning at Primary Health Centres (PHCs).

5. **🚨 One-Tap Emergency SOS & Caregiver Dispatch**
   - Floating SOS trigger with GPS location capture.
   - Auto-notifies family caregivers and local ASHA health workers.

6. **👩‍⚕️ ASHA Health Worker Field Roster & Offline Sync**
   - Roster of assigned rural patients with live adherence meters.
   - On-field prescription scanner and offline sync queue.

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js `v18+` or `v22+`
- Expo Go App on your Android or iOS device (download from Google Play Store or Apple App Store)

### 2. Running Locally
From the `Mobile/` directory:

```bash
# Start Expo Metro Bundler
npm start

# Or directly target Android
npm run android

# Or web preview
npm run web
```

### 3. Connecting to your Django Backend
- The mobile app connects to your local Django server at `http://<YOUR_LOCAL_IP>:8000/api/v1/`.
- You can change the backend URL directly from the **Sign In** screen anytime.

### 4. 1-Tap Demo Logins Included:
- **🧑‍🌾 Patient**: Lakshmi Devi (Hindi)
- **👩‍⚕️ ASHA Worker**: Sunita Bai
- **👨‍👦 Family Caregiver**: Rajesh Kumar
- **🩺 Doctor**: Dr. Ramesh Sharma
