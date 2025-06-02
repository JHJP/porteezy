from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

app = FastAPI()

# CORS 허용 (프론트엔드 개발 편의)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/ticker-info")
def get_ticker_info(ticker: str = Query(..., description="Ticker symbol")):
    try:
        t = yf.Ticker(ticker)
        info = t.info
        long_name = info.get("longName") or info.get("shortName")
        price = info.get("regularMarketPrice")
        if not long_name:
            raise ValueError("No name found for ticker")
        return {"name": long_name, "price": price}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Ticker not found or error: {str(e)}")
