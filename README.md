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
- Python 3.11+
- Node.js 20+
- MySQL

### 🐋 Deployment with Docker

```bash
git clone https://github.com/Harry-45/Cognitive-Survival.git
cd Cognitive-Survival
docker-compose up --build -d
```

---

## 💻 Local Development Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Environment Variables

Required variables in `.env`:

- `SECRET_KEY`
- `DEBUG`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `VITE_API_URL`

---

## 📄 License

This project is licensed under the MIT License.
