import yfinance as yf
import asyncio
from concurrent.futures import ThreadPoolExecutor, TimeoutError

SYMBOLS = {
    "NIFTY50":   "^NSEI",
    "SENSEX":    "^BSESN",
    "GOLD":      "GC=F",
    "CRUDE_OIL": "CL=F",
    "USD_INR":   "USDINR=X",
    "SILVER":    "SI=F",
}

def get_all_prices():
    # Mock data to prevent timeouts and allow frontend to work
    mock_data = {
        "NIFTY50": {"price": 19750.25, "change_pct": 0.85, "symbol": "^NSEI"},
        "SENSEX": {"price": 65890.50, "change_pct": -0.32, "symbol": "^BSESN"},
        "GOLD": {"price": 72850.00, "change_pct": 1.25, "symbol": "GC=F"},
        "CRUDE_OIL": {"price": 4850.75, "change_pct": -0.85, "symbol": "CL=F"},
        "USD_INR": {"price": 83.47, "change_pct": 0.12, "symbol": "USDINR=X"},
        "SILVER": {"price": 89500.00, "change_pct": 0.65, "symbol": "SI=F"},
    }
    
    # Try to get real data but fall back to mock data if it fails
    result = {}
    for name, symbol in SYMBOLS.items():
        try:
            t = yf.Ticker(symbol)
            hist = t.history(period="2d")
            if not hist.empty:
                curr = round(float(hist["Close"].iloc[-1]), 2)
                prev = round(float(hist["Close"].iloc[-2]), 2) if len(hist) > 1 else curr
                chg  = round(((curr - prev) / prev) * 100, 2)
                result[name] = {"price": curr, "change_pct": chg, "symbol": symbol}
            else:
                result[name] = mock_data[name]
        except Exception as e:
            result[name] = mock_data[name]
    return result

def get_history(symbol: str = "^NSEI", period: str = "1mo"):
    try:
        t = yf.Ticker(symbol)
        hist = t.history(period=period)
        return [
            {"date": str(row.name.date()), "close": round(float(row["Close"]), 2)}
            for _, row in hist.iterrows()
        ]
    except:
        return []