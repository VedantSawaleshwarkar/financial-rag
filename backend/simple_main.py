from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="FinAI RAG Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
def test():
    return {"status": "ok", "message": "Backend is working"}

@app.get("/market")
def market():
    # Mock data that works immediately
    return {
        "NIFTY50": {"price": 19750.25, "change_pct": 0.85, "symbol": "^NSEI"},
        "SENSEX": {"price": 65890.50, "change_pct": -0.32, "symbol": "^BSESN"},
        "GOLD": {"price": 72850.00, "change_pct": 1.25, "symbol": "GC=F"},
        "CRUDE_OIL": {"price": 4850.75, "change_pct": -0.85, "symbol": "CL=F"},
        "USD_INR": {"price": 83.47, "change_pct": 0.12, "symbol": "USDINR=X"},
        "SILVER": {"price": 89500.00, "change_pct": 0.65, "symbol": "SI=F"},
    }

@app.get("/symbols")
def symbols():
    return {
        "NIFTY50": "^NSEI",
        "SENSEX": "^BSESN", 
        "GOLD": "GC=F",
        "CRUDE_OIL": "CL=F",
        "USD_INR": "USDINR=X",
        "SILVER": "SI=F"
    }

@app.get("/history/{symbol}")
def history(symbol: str, period: str = "1mo"):
    # Mock historical data
    return [
        {"date": "2026-04-01", "close": 19500.00},
        {"date": "2026-04-02", "close": 19600.00},
        {"date": "2026-04-03", "close": 19700.00},
        {"date": "2026-04-04", "close": 19650.00},
        {"date": "2026-04-07", "close": 19750.25},
    ]

class AskRequest(BaseModel):
    question: str

@app.post("/ask")
def ask(req: AskRequest):
    # Mock RAG response
    return {
        "answer": f"This is a mock response to: {req.question}. The full RAG system would provide detailed financial analysis here.",
        "sources": ["mock_source_1", "mock_source_2"]
    }
