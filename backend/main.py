from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from market_data import get_all_prices, get_history, SYMBOLS
from rag_engine import init_knowledge_base, ask_rag

app = FastAPI(title="FinAI RAG Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_knowledge_base()

@app.get("/test")
def test():
    return {"status": "ok", "message": "Backend is working"}

@app.get("/market")
def market():
    return get_all_prices()

@app.get("/history/{symbol}")
def history(symbol: str, period: str = "1mo"):
    return get_history(f"^{symbol}", period)

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