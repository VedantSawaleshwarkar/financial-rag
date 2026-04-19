# FinAI RAG - Quick Start Guide

## 🚀 Quick Start Instructions

### Option 1: Using Batch Files (Recommended)

1. **Start Backend:**
   - Double-click: `start_backend.bat`
   - Or run: `cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000`

2. **Start Frontend:**
   - Double-click: `start_frontend.bat`
   - Or run: `cd frontend && npm run dev`

3. **Access Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - WebSocket: ws://localhost:8000/ws/market

### Option 2: Manual Commands

**Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 📊 Features Available

- ✅ Real-time WebSocket data updates (every 15 seconds)
- ✅ Price flash animations (green/red)
- ✅ Live market status (NSE OPEN/CLOSED)
- ✅ OHLC data display
- ✅ Volume formatting (K/M notation)
- ✅ Intraday candlestick charts
- ✅ Indian number formatting
- ✅ Enhanced mock data system
- ✅ Auto-reconnection on WebSocket disconnect
- ✅ Demo mode fallback

## 🌐 Application Pages

- **Home**: http://localhost:3000/ (Landing page)
- **Dashboard**: http://localhost:3000/dashboard (Live trading terminal)
- **Market**: http://localhost:3000/market (Market overview with charts)
- **Advisor**: http://localhost:3000/advisor (AI financial advisor)
- **Portfolio**: http://localhost:3000/portfolio (Portfolio tracker)
- **Learn**: http://localhost:3000/learn (RAG pipeline explainer)

## 🔧 Troubleshooting

**If backend shows "not live":**
1. Check if backend is running (should see "Uvicorn running on http://0.0.0.0:8000")
2. Check browser console for WebSocket errors
3. Try restarting backend with `start_backend.bat`

**If frontend shows connection errors:**
1. Check if frontend is running (should see "Local: http://localhost:3000/")
2. Check browser console for API errors
3. Try restarting frontend with `start_frontend.bat`

**If WebSocket fails:**
1. Backend will auto-fallback to HTTP polling
2. Price updates will still work (every 15 seconds)
3. Flash animations will still function

## 📝 Notes

- Backend uses enhanced mock data system to avoid yfinance rate limiting
- Real yfinance data attempted every 5th call
- All prices update automatically without page refresh
- System works in demo mode when backend is offline
