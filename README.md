# 💹 Financial RAG Application

A financial RAG (Retrieval-Augmented Generation) application with real-time market data, AI-powered Q&A, portfolio tracking, and a full authentication backend.

---

## ⚡ Quick Start (Windows)

```bash
# 1. Clone the repo
git clone https://github.com/VedantSawaleshwarkar/financial-rag.git
cd financial-rag

# 2. First-time setup (installs Python + Node dependencies)
setup.bat

# 3. Add your Groq API key to backend/.env
#    (see Prerequisites section below)

# 4. Start both servers
start-all.bat
```

Then open **http://localhost:3000** in your browser.

---

## ✅ Prerequisites

Make sure these are installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.8+ | https://python.org/downloads |
| Node.js | 16+ | https://nodejs.org |
| Git | any | https://git-scm.com |
| Groq API Key | free | https://console.groq.com |

---

## 🛠 Manual Setup (Step by Step)

If `setup.bat` doesn't work, follow these steps manually:

### Step 1 — Clone the repository
```bash
git clone https://github.com/VedantSawaleshwarkar/financial-rag.git
cd financial-rag
```

### Step 2 — Set up the Python backend
```bash
# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install all Python dependencies (includes bcrypt, PyJWT for auth)
pip install -r requirements.txt
```

### Step 3 — Set up the frontend
```bash
cd frontend
npm install
cd ..
```

### Step 4 — Configure environment variables
Create a file at `backend/.env` with the following content:
```
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=any-long-random-string-you-choose
```

- Get a **free** Groq API key at https://console.groq.com
- `JWT_SECRET` can be any random string (used to sign login tokens)

### Step 5 — Start the servers

**Option A — Start both at once:**
```bash
start-all.bat
```

**Option B — Start separately (in two terminals):**
```bash
# Terminal 1 — Backend
start-backend.bat

# Terminal 2 — Frontend
start-frontend.bat
```

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| Frontend (React app) | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (auto-generated) | http://localhost:8000/docs |

---

## 🔐 Auth API Endpoints (New)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT token |
| `GET` | `/auth/me` | Get current user info (requires token) |

Credentials are stored securely in a local **SQLite database** (`users.db`) with **bcrypt** password hashing. The `users.db` file is created automatically on first run — you don't need to do anything.

---

## 📡 Market & AI API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/market` | Current market prices |
| `GET` | `/market/summary` | Market status |
| `GET` | `/history/{symbol}` | Historical price data |
| `GET` | `/symbols` | Available symbols |
| `GET` | `/top-stocks` | Top stocks list |
| `POST` | `/ask` | Ask AI financial questions |
| `GET` | `/test` | Health check |

---

## 🚀 Features

- 📊 Real-time market data — NIFTY50, SENSEX, Gold, Crude Oil, USD/INR, Silver
- 🤖 AI-powered Q&A using RAG with Groq LLaMA 3
- 🔐 Full auth system — signup/login with hashed passwords & JWT tokens
- 💼 Portfolio tracker with P&L calculations
- 📈 Interactive price charts with historical data
- 🧠 Economic indicators dashboard
- 🌙 Terminal-style dark UI

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` inside `backend/` with venv activated |
| `npm: command not found` | Install Node.js from https://nodejs.org |
| `GROQ_API_KEY` error | Add valid key to `backend/.env` |
| Port 8000 already in use | Kill the process using port 8000 or change the port in `start-backend.bat` |
| Port 3000 already in use | Kill the process using port 3000 |
| Login/Signup not working | Make sure the backend is running on port 8000 |
| `users.db` missing | It's created automatically on first backend startup — just restart the backend |
