
export function calculateHoldingsValue(transactions, prices, date="2024-12-30") {
    let total = 0
    let holdings = {}
    for (const t of transactions) {
        if (t.date > date) continue
        if (t.ticker === "CASH") continue
        if (t.action === "BUY") {
          holdings[t.ticker] = (holdings[t.ticker] || 0) + (t.qty || 0)
        }
        else if (t.action === "SELL") {
          holdings[t.ticker] = (holdings[t.ticker] || 0) - (t.qty || 0)
        }
    }
    

    for (const [ticker, qty] of Object.entries(holdings)) {
        const price = (prices[ticker]?.[date]?.close ??
          (() => {
            
            const dateList = Object.keys(prices[ticker]) || []
            if (dateList.length === 0) return null
            
            
            let lo = 0, hi = dateList.length
            while (lo < hi) {
              const mid = (lo + hi) >> 1
              if (dateList[mid] <= date) lo = mid + 1
              else hi = mid
            }
      
            if (lo === 0) return null           
            const prevDate = dateList[lo - 1]
            
            return prices[ticker]?.[prevDate]?.close ?? null
          })())
          total += price * qty
      }
    
    return Math.round(total * 100) / 100
}

export function calculateCash(transactions,date="2024-12-30") {
    let total = 0

    for (const t of transactions) {
        if (t.date > date) continue
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

export function calculateTotalBalance(transactions,prices,date="2024-12-30") {
    return (calculateCash(transactions,date)+calculateHoldingsValue(transactions,prices,date))
}

export function calculateTotalReturn(transactions,prices,startingBalance) {
    return Math.round(((calculateTotalBalance(transactions,prices)-startingBalance)/startingBalance)*10000)/10000
}

function getDatesForYear(year) {
  const dates = [];
  const start = new Date(year, 0, 1)
  const end = new Date(year + 1, 0, 1)

  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10)
    dates.push(iso)
  }
  return dates
}



export function datesAndPricesForYear(year, transactions, prices) {
  const dates = getDatesForYear(year)
  return dates.map(date => ({
    date : date,
    value: calculateTotalBalance(transactions, prices, date)
  }))
}
