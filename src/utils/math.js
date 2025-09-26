
export function calculateHoldingsValue(transactions, prices) {
    let total = 0
    let holdings = {}
    for (const t of transactions) {
        if (t.ticker == "CASH") continue
        holdings[t.ticker] = (holdings[t.ticker] || 0) + t.qty
    }
    const date = "2024-12-30"

    for (const [ticker, qty] of Object.entries(holdings)) {
        total += (prices[ticker]?.[date]?.close * qty)
      }
    
    return Math.round(total * 100) / 100
}

export function calculateCash(transactions) {
    let total = 0

    for (const t of transactions) {
        if (t.action === "CASH_IN") {
          total += t.qty; 
        } else if (t.action === "BUY") {
          total -= t.price * t.qty; 
        } else if (t.action === "SELL") {
          total += t.price * t.qty;
        }
        else if (t.action === "CASH_OUT") {
            total += t.price * t.qty;
          }
    }
    return Math.round(total*100) / 100
}

export function calculateTotalBalance(transactions,prices) {
    return (calculateCash(transactions)+calculateHoldingsValue(transactions,prices))
}