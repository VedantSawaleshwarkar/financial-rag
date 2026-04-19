# Financial RAG Application

A financial RAG (Retrieval-Augmented Generation) application with market data and AI-powered Q&A.

## Quick Start

### Option 1: Automatic Setup and Start (Recommended)
```bash
# First time setup - installs all dependencies
setup.bat

# Start the application
start-all.bat
```

### Option 2: Start Servers Separately
```bash
# Backend Server
start-backend.bat

# Frontend Server  
start-frontend.bat
```

## Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## Features
- Real-time market data (NIFTY50, SENSEX, Gold, Crude Oil, USD/INR, Silver)
- Interactive price charts with historical data
- AI-powered financial Q&A using RAG with Groq LLaMA 3
- Economic indicators dashboard
- Portfolio tracking with P&L calculations
- Responsive web interface with terminal-style UI

## Setup Instructions

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- Groq API Key (free from https://console.groq.com/)

### Automatic Setup
1. Run `setup.bat` to install all dependencies
2. Edit `backend/.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
3. Run `start-all.bat` to start both servers
4. Open http://localhost:3000 in your browser

### Manual Setup
```bash
# Backend setup
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
cd ..

# Environment setup
# Create backend/.env with your GROQ_API_KEY
```

## API Endpoints
- `GET /market` - Get current market prices
- `GET /symbols` - Get available symbols
- `GET /history/{symbol}` - Get historical data
- `POST /ask` - Ask financial questions (requires Groq API key)
- `GET /test` - Health check endpoint
- `GET /market/summary` - Market status and last update time

## Requirements
- Python 3.8+ (Backend)
- Node.js 16+ (Frontend)
- Groq API Key for AI responses
- Dependencies listed in `requirements.txt` and `frontend/package.json`

## Troubleshooting
1. **Setup Issues**: Run `setup.bat` to ensure all dependencies are installed
2. **Backend Port**: Ensure port 8000 is available (not 8001)
3. **Frontend Port**: Ensure port 3000 is available
4. **API Key Error**: Add valid Groq API key to `backend/.env`
5. **Service Unavailable**: Check backend logs for API authentication errors
6. **Module Not Found**: Run `pip install -r requirements.txt` in backend directory
7. **Node Dependencies**: Run `npm install` in frontend directory
