import yfinance as yf
import pandas as pd
import json

tickers = ["AAPL","MSFT","AMZN","VOO","NVDA","TSLA","GOOGL", "BRK-B"]
start = "2024-01-01" 
end = "2024-12-31"

data = {}

for i in tickers:
    df = yf.download(i, start=start, end=end)
    data[i] = [
    {"date": str(idx.date()), "close": float(row["Close"])}
    for idx, row in df.iterrows()
]

with open("../public/price.json", "w") as f:
    json.dump(data, f, indent=2)