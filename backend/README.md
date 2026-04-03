# DocBuddy AI Healthcare Platform - Backend

Production-ready healthcare backend built with Node.js, Express, MongoDB, and AI integration.

## Features
- **Auth System**: JWT-based login, registration (Patient/Doctor), and Refresh tokens.
- **Patient Dashboard**: Manage health vitals, history, and appointments.
- **Doctor Discovery**: Search doctors by location, specialization, and ratings.
- **Scheduling**: Complete appointment lifecycle (Pending -> Approved -> Completed).
- **AI Assistant**: Context-aware medical chat with structured JSON (Symptoms, Causes, Recommendations, Urgency).
- **Query System**: Community medical questions with categorized, threaded replies.

## Tech Stack
- Node.js & Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Winston for logging
- Express Validator for input sanitization
- AI Integration (Google Gemini / Custom LLM Adapter)

## Installation

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment:
   - Create `.env` based on `.env.example`.
   - Add your `GEMINI_API_KEY` or `CUSTOM_LLM_URL`.

3. Start developmental server:
   ```bash
   npm run dev
   ```

## Folder Structure
```text
backend/
├── src/
│   ├── config/       # Database, Logger configurations
│   ├── controllers/  # API request handlers
│   ├── middleware/   # Auth, Error handling, Rate limiting
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route definitions
│   ├── services/     # AI integration & business logic
│   └── server.js     # Entry point
├── uploads/          # Static files/reports storage
└── .env              # Secrets and config
```

## API Modules
- `/api/v1/auth`: Registration, Login, logout.
- `/api/v1/patients`: Patient-specific profile & history.
- `/api/v1/doctors`: Doctor discovery & profile.
- `/api/v1/appointments`: Scheduling and status management.
- `/api/v1/queries`: Posting and answering medical queries.
- `/api/v1/ai`: Medical chat interface (/chat).
```

## Security Implementation
- **Password Hashing**: BCrypt with 12 salt rounds.
- **RBAC**: Protected routes restricted based on role (Patient, Doctor, Admin).
- **JWT Protection**: Secure middleware verifying tokens.
- **Data Validation**: Sanitize input using Express-validator.
- **Rate Limiting**: Prevent DOS and API abuse.
