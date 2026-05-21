from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta
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
history_cache = {}
top_stocks_cache = None
top_stocks_cache_time = None

TOP_STOCK_UNIVERSE = [
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "sector": "Energy"},
    {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "sector": "IT"},
    {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "sector": "Banking"},
    {"symbol": "ICICIBANK.NS", "name": "ICICI Bank", "sector": "Banking"},
    {"symbol": "INFY.NS", "name": "Infosys", "sector": "IT"},
    {"symbol": "ITC.NS", "name": "ITC", "sector": "FMCG"},
    {"symbol": "SBIN.NS", "name": "State Bank of India", "sector": "Banking"},
    {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel", "sector": "Telecom"},
    {"symbol": "LT.NS", "name": "Larsen & Toubro", "sector": "Infrastructure"},
    {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "sector": "Banking"},
    {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever", "sector": "FMCG"},
    {"symbol": "AXISBANK.NS", "name": "Axis Bank", "sector": "Banking"},
    {"symbol": "ASIANPAINT.NS", "name": "Asian Paints", "sector": "Consumer"},
    {"symbol": "MARUTI.NS", "name": "Maruti Suzuki", "sector": "Auto"},
    {"symbol": "SUNPHARMA.NS", "name": "Sun Pharma", "sector": "Pharma"},
    {"symbol": "ULTRACEMCO.NS", "name": "UltraTech Cement", "sector": "Cement"},
    {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance", "sector": "NBFC"},
    {"symbol": "NTPC.NS", "name": "NTPC", "sector": "Power"},
    {"symbol": "POWERGRID.NS", "name": "Power Grid", "sector": "Power"},
    {"symbol": "TITAN.NS", "name": "Titan Company", "sector": "Retail"},
    {"symbol": "NESTLEIND.NS", "name": "Nestle India", "sector": "FMCG"},
    {"symbol": "BAJAJFINSV.NS", "name": "Bajaj Finserv", "sector": "Financials"},
    {"symbol": "WIPRO.NS", "name": "Wipro", "sector": "IT"},
    {"symbol": "HCLTECH.NS", "name": "HCL Technologies", "sector": "IT"},
    {"symbol": "TECHM.NS", "name": "Tech Mahindra", "sector": "IT"},
    {"symbol": "TATAMOTORS.NS", "name": "Tata Motors", "sector": "Auto"},
    {"symbol": "JSWSTEEL.NS", "name": "JSW Steel", "sector": "Metals"},
    {"symbol": "ADANIENT.NS", "name": "Adani Enterprises", "sector": "Conglomerate"},
    {"symbol": "ONGC.NS", "name": "ONGC", "sector": "Energy"},
    {"symbol": "COALINDIA.NS", "name": "Coal India", "sector": "Mining"},
]


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


def _history_cache_key(symbol: str, period: str, interval: str):
    return f"{symbol}|{period}|{interval}"


def _build_mock_history(symbol: str, interval: str):
    snapshot = None
    matched_name = next((name for name, code in SYMBOLS.items() if code == symbol), None)

    if matched_name and matched_name in price_cache:
        snapshot = price_cache[matched_name]

    if snapshot is None and matched_name:
        snapshot = get_enhanced_mock_data(matched_name)

    if snapshot is None:
        snapshot = {
            "price": 100.0,
            "open": 99.5,
            "high": 100.5,
            "low": 99.0,
            "volume": 100000,
        }

    now = datetime.now(IST).replace(second=0, microsecond=0)
    points = []
    total_points = 30 if interval in ["1m", "5m", "15m"] else 20
    step_minutes = 1 if interval == "1m" else 5 if interval == "5m" else 15 if interval == "15m" else 60
    base_price = float(snapshot["price"])

    for index in range(total_points):
        point_time = now - timedelta(minutes=(total_points - index - 1) * step_minutes)
        drift = (index - total_points / 2) * 0.06
        noise = random.uniform(-0.35, 0.35)
        open_price = round(base_price + drift + noise, 2)
        close_price = round(open_price + random.uniform(-0.45, 0.45), 2)
        high_price = round(max(open_price, close_price) + random.uniform(0.05, 0.35), 2)
        low_price = round(min(open_price, close_price) - random.uniform(0.05, 0.35), 2)
        volume = max(int(snapshot.get("volume", 100000) / max(total_points, 1) * random.uniform(0.8, 1.2)), 0)

        points.append(
            {
                "date": point_time.isoformat(),
                "open": open_price,
                "high": high_price,
                "low": low_price,
                "close": close_price,
                "volume": volume,
            }
        )

    return points


def _build_top_stock_entry(stock, hist, source="live"):
    def clean_float(value, fallback=0.0):
        try:
            if pd.isna(value):
                return fallback
            return round(float(value), 2)
        except Exception:
            return fallback

    def clean_int(value, fallback=0):
        try:
            if pd.isna(value):
                return fallback
            return int(value)
        except Exception:
            return fallback

    latest = hist.iloc[-1]
    close_price = clean_float(latest["Close"])
    open_price = clean_float(latest["Open"], close_price)
    high_price = clean_float(latest["High"], max(open_price, close_price))
    low_price = clean_float(latest["Low"], min(open_price, close_price))
    volume = clean_int(latest["Volume"], 0)

    prev_close = close_price
    if len(hist) > 1:
        prev_close = clean_float(hist.iloc[-2]["Close"], close_price)

    change = round(close_price - prev_close, 2)
    change_pct = round(((close_price - prev_close) / prev_close) * 100, 2) if prev_close else 0.0

    return {
        "symbol": stock["symbol"],
        "name": stock["name"],
        "sector": stock["sector"],
        "price": close_price,
        "change": change,
        "change_pct": change_pct,
        "open": open_price,
        "high": high_price,
        "low": low_price,
        "volume": volume,
        "source": source,
        "last_updated": datetime.now(IST).isoformat(),
    }


def _fetch_top_stock(stock):
    ticker = yf.Ticker(stock["symbol"])
    hist = ticker.history(period="5d", interval="1d")

    if hist.empty:
        raise ValueError(f"No data returned for {stock['symbol']}")

    return _build_top_stock_entry(stock, hist, source="live")


def _build_mock_top_stock_entry(stock, rank_index):
    base_price = round(350 + (rank_index * 73.4), 2)
    change_pct = round(3.2 - rank_index * 0.18, 2)
    previous_close = round(base_price / max(1 + change_pct / 100, 0.01), 2)
    change = round(base_price - previous_close, 2)
    high_price = round(base_price + random.uniform(4, 22), 2)
    low_price = round(max(base_price - random.uniform(4, 18), 1), 2)
    open_price = round(base_price - random.uniform(-6, 10), 2)
    volume = int(random.uniform(500000, 5000000))

    return {
        "symbol": stock["symbol"],
        "name": stock["name"],
        "sector": stock["sector"],
        "price": base_price,
        "change": change,
        "change_pct": change_pct,
        "open": open_price,
        "high": high_price,
        "low": low_price,
        "volume": volume,
        "source": "mock",
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
    cache_key = _history_cache_key(symbol, period, interval)
    cached_entry = history_cache.get(cache_key)

    if cached_entry:
        age_seconds = (datetime.now(IST) - cached_entry["fetched_at"]).total_seconds()
        max_age = 45 if interval in ["1m", "5m", "15m"] else 300
        if age_seconds < max_age:
            return cached_entry["data"]

    try:
        ticker = yf.Ticker(symbol)

        if interval in ["1m", "5m", "15m"]:
            intraday_period = "1d" if get_market_status() == "OPEN" else "5d"
            hist = ticker.history(period=intraday_period, interval=interval)
        else:
            hist = ticker.history(period=period, interval=interval)

        if hist.empty:
            if cached_entry:
                return cached_entry["data"]

            fallback = _build_mock_history(symbol, interval)
            history_cache[cache_key] = {"data": fallback, "fetched_at": datetime.now(IST)}
            return fallback

        result = [_history_row_to_dict(row) for _, row in hist.iterrows()]
        history_cache[cache_key] = {"data": result, "fetched_at": datetime.now(IST)}
        return result
    except Exception as error:
        print(f"Error fetching history for {symbol}: {error}")
        if cached_entry:
            return cached_entry["data"]

        fallback = _build_mock_history(symbol, interval)
        history_cache[cache_key] = {"data": fallback, "fetched_at": datetime.now(IST)}
        return fallback


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


def get_top_stocks(limit: int = 30):
    """Get the top ranked stocks of the day from a curated Indian large-cap universe."""
    global top_stocks_cache, top_stocks_cache_time

    if top_stocks_cache_time and top_stocks_cache:
        age_seconds = (datetime.now(IST) - top_stocks_cache_time).total_seconds()
        if age_seconds < 300:
            return top_stocks_cache[:limit]

    results = []

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {
            executor.submit(_fetch_top_stock, stock): (index, stock)
            for index, stock in enumerate(TOP_STOCK_UNIVERSE)
        }

        for future in as_completed(futures):
            index, stock = futures[future]
            try:
                results.append(future.result(timeout=8))
            except Exception as error:
                print(f"Top stock fetch failed for {stock['symbol']}: {error}")
                results.append(_build_mock_top_stock_entry(stock, index))

    ranked = sorted(results, key=lambda item: item.get("change_pct", 0), reverse=True)

    for index, stock in enumerate(ranked, start=1):
        stock["rank"] = index

    top_stocks_cache = ranked
    top_stocks_cache_time = datetime.now(IST)
    return ranked[:limit]
