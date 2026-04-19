from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
from datetime import datetime
from market_data import get_all_prices, get_history, get_market_summary, price_cache, SYMBOLS
from rag_engine import init_knowledge_base, ask_rag

app = FastAPI(title="FinAI RAG Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "ws://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Store active WebSocket connections
active_connections = []

@app.on_event("startup")
def startup():
    init_knowledge_base()

@app.websocket("/ws/market")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time market data"""
    try:
        await websocket.accept()
        active_connections.append(websocket)
        print(f"WebSocket connected. Total connections: {len(active_connections)}")
        
        # Send initial data immediately
        initial_data = get_all_prices()
        await websocket.send_text(json.dumps(initial_data))
        
        # Send periodic updates every 15 seconds
        while True:
            await asyncio.sleep(15)
            try:
                market_data = get_all_prices()
                await websocket.send_text(json.dumps(market_data))
            except Exception as e:
                print(f"Error sending WebSocket data: {e}")
                break
                
    except WebSocketDisconnect:
        print("WebSocket disconnected gracefully")
    except Exception as e:
        print(f"WebSocket connection error: {e}")
    finally:
        if websocket in active_connections:
            active_connections.remove(websocket)
            print(f"WebSocket removed. Total connections: {len(active_connections)}")

@app.get("/test")
def test():
    return {"status": "ok", "message": "Backend is working"}

@app.get("/market")
def market():
    return get_all_prices()

@app.get("/market/summary")
def market_summary():
    """Get market status and summary"""
    return get_market_summary()

@app.get("/history/{symbol}")
def history(symbol: str, period: str = "1mo", interval: str = "1d"):
    """Get historical data with intraday support"""
    # Convert symbol to proper format
    symbol_map = {
        "NSEI": "^NSEI",
        "BSESN": "^BSESN", 
        "GC=F": "GC=F",
        "CL=F": "CL=F",
        "USDINR=X": "USDINR=X",
        "SI=F": "SI=F"
    }
    
    actual_symbol = symbol_map.get(symbol, f"^{symbol}")
    return get_history(actual_symbol, period, interval)

@app.get("/symbols")
def symbols():
    return SYMBOLS

class AskRequest(BaseModel):
    question: str

@app.post("/ask")
def ask(req: AskRequest):
    prices = get_all_prices()
    snapshot = "\n".join([
        f"{k}: {v['price']} ({'+' if v['change_pct']>=0 else ''}{v['change_pct']}%)"
        for k, v in prices.items()
    ])
    return ask_rag(req.question, snapshot)

# Background task to fetch data periodically
async def periodic_data_fetch():
    """Background task to fetch data every 15 seconds"""
    while True:
        try:
            # This will update the price_cache
            get_all_prices()
            print(f"Data fetched at {datetime.now()}")
        except Exception as e:
            print(f"Error in periodic fetch: {e}")
        
        await asyncio.sleep(15)

# Start background task on startup
@app.on_event("startup")
async def startup_background_tasks():
    asyncio.create_task(periodic_data_fetch())
