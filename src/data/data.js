import Papa from "papaparse";


export async function loadTransactions() {
  const res = await fetch("/transactions.csv");
  const text = await res.text();

  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const rows = parsed.data.map(normalizeRow).filter(Boolean);

  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

function normalizeRow(r) {
  const date = String(r.Date || "").trim();
  const ticker = String(r.Ticker || "").trim().toUpperCase();
  const action = String(r.Action || "").trim().toUpperCase();
  const qty = Number(r.Quantity);

  if (!date || !ticker || !["BUY", "SELL"].includes(action) || !qty) {
    return null;
  }
  return { date, ticker, action, qty };
}

export async function loadPrices() {
  const res = await fetch("/prices.json");
  return res.json();
}