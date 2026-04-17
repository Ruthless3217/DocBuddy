# 🩺 DocBuddy AI - Intelligence-Powered Healthcare

DocBuddy AI is a premium, full-stack healthcare platform designed to bridge the gap between AI-driven medical intelligence and human expertise. Built with a modern aesthetic (Orange/Blue theme) and state-of-the-art security.

## 🚀 Core Features

### 1. Patient System
- **Secure Auth**: JWT-based authentication with role-based access.
- **Dashboard**: Track health metrics, upcoming appointments, and community activity.
- **Medical Queries**: Post symptoms anonymously and get dual verification from AI and Doctors.

### 2. AI Health Assistant
- **Context-Aware Chat**: Intelligent conversation powered by LLM.
- **Safety First**: Enforced medical disclaimers and structured non-prescriptive guidance.
- **Structured Output**: AI responses rendered with clear categories and suggestions.

### 3. Doctor Discovery & Booking
- **Smart Filters**: Filter specialists by rating, location, and experience.
- **Seamless Booking**: Real-time availability slots and appointment lifecycle management.
- **Verified Status**: Clear markers for certified medical professionals.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Frontend** | React, Vite, TailwindCSS, Framer Motion |
| **Authentication** | JWT, bcryptjs |
### 2. AI Assistant (Fine-Tuning)
- **Model Support**: Fully integrated for local fine-tuned models (Llama-3, Mistral).
- **Custom Integration**: To use your own model, update `AI_PROVIDER=custom` in `backend/.env`.
- **Connectivity**: Use `node backend/src/scripts/test-ai.js` to verify your model endpoint.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Frontend** | React, Vite, TailwindCSS, Framer Motion |
| **Authentication** | JWT, bcryptjs |
| **AI Integration** | Google Gemini / Custom Fine-Tuned (Llama-3) |
| **State Mgmt** | React Query, Context API |

---

## 📦 Getting Started

### 1. Fast Start (Root)
```bash
npm run dev
```

### 2. Manual Setup
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

### 3. Database Seeding & Tests
```bash
npm run seed
node backend/src/scripts/test-ai.js
```

---

## 🔒 Security & Privacy
- **Encryption**: All medical data is handled with production-grade encryption.
- **RBAC**: Strict role boundaries between Patients, Doctors, and Admins.
- **Compliance**: Designed with HIPAA and GDPR guidelines in mind.

---
Developed by **DocBuddy Engineering Team** 🕊️
