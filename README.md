# Financial RAG Application

A financial RAG (Retrieval-Augmented Generation) application with market data and AI-powered Q&A.

## Quick Start

### Option 1: Start Both Servers (Recommended)
```bash
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
- **Backend API**: http://localhost:8001

## Features
- Real-time market data (NIFTY50, SENSEX, Gold, Crude Oil, USD/INR, Silver)
- Interactive price charts with historical data
- AI-powered financial Q&A using RAG
- Economic indicators dashboard
- Responsive web interface

## API Endpoints
- `GET /market` - Get current market prices
- `GET /symbols` - Get available symbols
- `GET /history/{symbol}` - Get historical data
- `POST /ask` - Ask financial questions
- `GET /test` - Health check endpoint

## Requirements
- Python 3.8+ (Backend)
- Node.js 16+ (Frontend)
- Dependencies listed in `backend/requirements.txt` and `frontend/package.json`

## Troubleshooting
1. If backend fails to start, check Python dependencies: `pip install -r backend/requirements.txt`
2. If frontend fails, install Node dependencies: `npm install` in frontend directory
3. Ensure ports 3000 and 8001 are available
4. Check console for CORS errors - should be resolved with current configuration
