# Cognitive Survival

**Cognitive Survival** is a state-of-the-art AI-powered survival simulation platform designed to test and analyze subject decision-making under stress. The application features a React-based futuristic dashboard and a Django-powered neural engine.

---

## 🚀 Features

- **Neural Simulation Engine**: Real-time scenario generation based on psychological metrics.
- **Biometric Telemetry**: Interactive charts for monitoring subject stability, resource levels, and survival probability using Recharts.
- **Futuristic UI/UX**: Premium "Cyber-Industrial" design with glassmorphism and motion effects (Framer Motion).
- **Secure Authentication**: Robust JWT-based authentication system.
- **Docker Ready**: Fully containerized for seamless deployment.

---

## 🛠️ Tech Stack

### Backend (Neural Engine)
- **Django & Django REST Framework** (Core API)
- **MySQL** (Relational Database)
- **PyJWT** (Security)
- **Scikit-learn** (ML Logic integration)
- **Gunicorn** (Production Server)
- **WhiteNoise** (Static Asset Management)

### Frontend (Subject Interface)
- **React 19** (Standard Library)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Recharts** (Data Visualization)

---

## 🏁 Getting Started

### Prerequisites
- Docker & Docker Compose (Recommended)
- Python 3.11+ (For local backend dev)
- Node.js 20+ (For local frontend dev)
- MySQL (For local database)

### 🐋 Deployment with Docker (Easiest)
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd cognitive-survival
    ```
2.  **Setup Environment Variables**:
    - Copy `backend/.env.example` to `backend/.env`
    - Copy `frontend/.env.example` to `frontend/.env`
3.  **Launch the stack**:
    ```bash
    docker-compose up --build -d
    ```

### 💻 Local Development Setup

#### Backend
1.  Navigate to `backend/`.
2.  Create and activate a virtual environment.
3.  Install dependencies: `pip install -r requirements.txt`.
4.  Configure `.env` with your seasonal database credentials.
5.  Run migrations: `python manage.py migrate`.
6.  Start server: `python manage.py runserver`.

#### Frontend
1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`.
3.  Configure `.env` with API URL (default: `http://localhost:8000/api/`).
4.  Start dev server: `npm run dev`.

---

## 🔒 Environment Variables

Key variables required in `.env`:
- `SECRET_KEY`: Django security key.
- `DEBUG`: Set to `False` in production.
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database credentials.
- `VITE_API_URL`: Path to the backend API.

---

## 📽️ Documentation & Artifacts
The project includes several readiness artifacts located in `.gemini/antigravity/brain/`:
- [Implementation Plan](.gemini/antigravity/brain/edc7c832-5b6f-4617-b1a6-ee1790f407b2/implementation_plan.md)
- [Deployment Walkthrough](.gemini/antigravity/brain/edc7c832-5b6f-4617-b1a6-ee1790f407b2/walkthrough.md)

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
