from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
from datetime import datetime
from typing import Optional
from market_data import get_all_prices, get_history, get_market_summary, get_top_stocks, price_cache, SYMBOLS
from rag_engine import init_knowledge_base, ask_rag
import auth as auth_module
import jwt

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
    auth_module.init_db()

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


@app.get("/top-stocks")
def top_stocks(limit: int = 30):
    return {
        "items": get_top_stocks(limit=min(max(limit, 1), 30)),
        "market_status": get_market_summary()["status"],
        "last_updated": datetime.now().isoformat(),
    }

# ── Auth routes ───────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/auth/signup")
def signup(req: SignupRequest):
    try:
        user = auth_module.create_user(req.name, req.email, req.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    token = auth_module.create_token(user["id"], user["email"], user["name"])
    return {"token": token, "user": user}

@app.post("/auth/login")
def login(req: LoginRequest):
    try:
        user = auth_module.authenticate_user(req.email, req.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    token = auth_module.create_token(user["id"], user["email"], user["name"])
    return {"token": token, "user": user}

@app.get("/auth/me")
def me(authorization: Optional[str] = Header(None)):
    """Validate token and return current user info."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization[7:]
    try:
        payload = auth_module.decode_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = auth_module.get_user_by_id(int(payload["sub"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ── RAG route ──────────────────────────────────────────────────────────────────

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
