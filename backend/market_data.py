from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
import random

import pandas as pd
import pytz
import yfinance as yf

# IST timezone
IST = pytz.timezone("Asia/Kolkata")

SYMBOLS = {
    "NIFTY50": "^NSEI",
    "SENSEX": "^BSESN",
    "GOLD": "GC=F",
    "CRUDE_OIL": "CL=F",
    "USD_INR": "USDINR=X",
    "SILVER": "SI=F",
}

# Global cache for data updates
price_cache = {}
last_fetch_time = None


def get_market_status():
    """Check if NSE market is open (9:15 AM - 3:30 PM IST)."""
    now = datetime.now(IST)
    weekday = now.weekday()

    if weekday >= 5:
        return "CLOSED"

    market_open = now.replace(hour=9, minute=15, second=0, microsecond=0)
    market_close = now.replace(hour=15, minute=30, second=0, microsecond=0)

    return "OPEN" if market_open <= now <= market_close else "CLOSED"


def get_intraday_data(symbol: str, interval: str = "1m"):
    """Get intraday data with specified interval."""
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1d", interval=interval)

        if hist.empty:
            return []

        return [_history_row_to_dict(row) for _, row in hist.iterrows()]
    except Exception as error:
        print(f"Error fetching intraday data for {symbol}: {error}")
        return []


def _history_row_to_dict(row):
    return {
        "date": str(row.name),
        "open": round(float(row["Open"]), 2),
        "high": round(float(row["High"]), 2),
        "low": round(float(row["Low"]), 2),
        "close": round(float(row["Close"]), 2),
        "volume": int(row["Volume"]) if not pd.isna(row["Volume"]) else 0,
    }


def _build_snapshot(name, symbol, hist):
    latest = hist.iloc[-1]
    open_price = round(float(latest["Open"]), 2)
    high_price = round(float(latest["High"]), 2)
    low_price = round(float(latest["Low"]), 2)
    close_price = round(float(latest["Close"]), 2)
    volume = int(latest["Volume"]) if not pd.isna(latest["Volume"]) else 0

    prev_close = close_price
    if len(hist) > 1:
        prev_close = round(float(hist.iloc[-2]["Close"]), 2)

    change_pct = 0.0
    if prev_close:
        change_pct = round(((close_price - prev_close) / prev_close) * 100, 2)

    return {
        "price": close_price,
        "change_pct": change_pct,
        "open": open_price,
        "high": high_price,
        "low": low_price,
        "volume": volume,
        "prev_close": prev_close,
        "symbol": symbol,
        "source": "live",
        "last_updated": datetime.now(IST).isoformat(),
    }


def _fetch_live_quote(name, symbol):
    ticker = yf.Ticker(symbol)

    intraday = ticker.history(period="1d", interval="1m")
    if not intraday.empty:
        return name, _build_snapshot(name, symbol, intraday)

    fallback = ticker.history(period="5d", interval="1d")
    if not fallback.empty:
        return name, _build_snapshot(name, symbol, fallback)

    raise ValueError(f"No data returned for {name} ({symbol})")


def get_all_prices():
    """Get live prices when possible, with cache/mock fallback for resilience."""
    global price_cache, last_fetch_time

    if last_fetch_time and price_cache:
      last_time = datetime.fromisoformat(last_fetch_time)
      age_seconds = (datetime.now(IST) - last_time).total_seconds()
      if age_seconds < 20:
          return price_cache.copy()

    result = {}

    with ThreadPoolExecutor(max_workers=min(6, len(SYMBOLS))) as executor:
        futures = {
            executor.submit(_fetch_live_quote, name, symbol): (name, symbol)
            for name, symbol in SYMBOLS.items()
        }

        for future in as_completed(futures):
            name, symbol = futures[future]
            try:
                key, snapshot = future.result(timeout=8)
                result[key] = snapshot
            except Exception as error:
                print(f"Live fetch failed for {name}: {error}")
                if name in price_cache:
                    cached = price_cache[name].copy()
                    cached["source"] = cached.get("source", "cache")
                    cached["last_updated"] = datetime.now(IST).isoformat()
                    result[name] = cached
                else:
                    result[name] = get_enhanced_mock_data(name)

    for name in SYMBOLS:
        if name not in result:
            result[name] = price_cache.get(name, get_enhanced_mock_data(name))

    price_cache = result.copy()
    last_fetch_time = datetime.now(IST).isoformat()
    return result


def get_enhanced_mock_data(name: str):
    """Enhanced mock data with realistic variations when live fetch is unavailable."""
    base_mock = {
        "NIFTY50": {"price": 19750.25, "change_pct": 0.85, "open": 19600.00, "high": 19800.00, "low": 19550.00, "volume": 124000000, "prev_close": 19600.00, "symbol": "^NSEI"},
        "SENSEX": {"price": 65890.50, "change_pct": -0.32, "open": 66100.00, "high": 66200.00, "low": 65700.00, "volume": 98000000, "prev_close": 66100.00, "symbol": "^BSESN"},
        "GOLD": {"price": 72850.00, "change_pct": 1.25, "open": 72000.00, "high": 73000.00, "low": 71800.00, "volume": 45000, "prev_close": 72000.00, "symbol": "GC=F"},
        "CRUDE_OIL": {"price": 4850.75, "change_pct": -0.85, "open": 4900.00, "high": 4920.00, "low": 4840.00, "volume": 120000, "prev_close": 4900.00, "symbol": "CL=F"},
        "USD_INR": {"price": 83.47, "change_pct": 0.12, "open": 83.35, "high": 83.55, "low": 83.30, "volume": 0, "prev_close": 83.35, "symbol": "USDINR=X"},
        "SILVER": {"price": 89500.00, "change_pct": 0.65, "open": 88900.00, "high": 89800.00, "low": 88700.00, "volume": 32000, "prev_close": 88900.00, "symbol": "SI=F"},
    }

    if name in price_cache:
        cached = price_cache[name]
        variation = random.uniform(-0.5, 0.5)
        new_price = round(cached["price"] * (1 + variation / 100), 2)
        new_change_pct = round(cached["change_pct"] + random.uniform(-0.2, 0.2), 2)

        return {
            "price": new_price,
            "change_pct": new_change_pct,
            "open": cached["open"],
            "high": round(max(cached["high"], new_price), 2),
            "low": round(min(cached["low"], new_price), 2),
            "volume": cached["volume"],
            "prev_close": cached["prev_close"],
            "symbol": cached["symbol"],
            "source": "mock",
            "last_updated": datetime.now(IST).isoformat(),
        }

    data = base_mock.get(
        name,
        {
            "price": 0.0,
            "change_pct": 0.0,
            "open": 0.0,
            "high": 0.0,
            "low": 0.0,
            "volume": 0,
            "prev_close": 0.0,
            "symbol": SYMBOLS.get(name, name),
        },
    ).copy()

    data["source"] = "mock"
    data["last_updated"] = datetime.now(IST).isoformat()
    return data


def get_history(symbol: str = "^NSEI", period: str = "1mo", interval: str = "1d"):
    """Get historical data with support for intraday intervals."""
    try:
        ticker = yf.Ticker(symbol)

        if interval in ["1m", "5m", "15m"] and get_market_status() == "OPEN":
            hist = ticker.history(period="1d", interval=interval)
        else:
            hist = ticker.history(period=period, interval=interval)

        if hist.empty:
            return []

        return [_history_row_to_dict(row) for _, row in hist.iterrows()]
    except Exception as error:
        print(f"Error fetching history for {symbol}: {error}")
        return []


def get_market_summary():
    """Get market summary with status and timing."""
    source = "live" if any(item.get("source") == "live" for item in price_cache.values()) else "fallback"
    return {
        "status": get_market_status(),
        "last_updated": datetime.now(IST).isoformat(),
        "instruments_tracked": len(SYMBOLS),
        "ist_timezone": True,
        "data_source": source,
    }
