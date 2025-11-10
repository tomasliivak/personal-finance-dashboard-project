
export function calculateHoldingsValue(transactions, prices, date="2024-12-30") {
    let total = 0
    let holdings = currentPositions(transactions, prices, date)
    
    for (const [key, value] of Object.entries(holdings)) {
      total += value.qty * value.mktPrice 
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
            total -= t.qty;
          }
    }
    return Math.round(total*100) / 100
}

export function calculateTotalBalance(transactions,prices,date="2024-12-30") {
    return (calculateCash(transactions,date)+calculateHoldingsValue(transactions,prices,date))
}

export function calculateTotalReturn(transactions,prices,startingBalance,date="2024-12-30") {
    return [Math.round(((calculateTotalBalance(transactions,prices,date)-startingBalance)/startingBalance)*10000)/10000, calculateTotalBalance(transactions,prices,date)-startingBalance]
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

export function currentPositions(transactions, prices, date="2024-12-30") {
  let positions = {}
  /* positions structure currently - object of key : object pairs with the key being the ticker 
  and the object info being the ticker data. Data includes, qty, avgCost, mktPrice, return
  */

  for (const t of transactions) {
    if (t.date > date) continue
    if (t.ticker === "CASH") continue

    const cur = positions[t.ticker] ?? { qty: 0, avgCost: 0 }

    if (t.action === "BUY") {
      positions[t.ticker] = {
        ...cur,
        avgCost: (
          ((cur.avgCost || 0) * (cur.qty || 0)) + (t.qty * t.price)
        ) / ((cur.qty || 0) + (t.qty || 0)),
        qty: (cur.qty || 0) + (t.qty || 0)
      }
    }

    else if (t.action === "SELL") {
      positions[t.ticker] = {
        ...cur,
        qty: Math.max(0, (cur.qty || 0) - (t.qty || 0)), avgCost: Math.max(0, (cur.qty || 0) - (t.qty || 0)) === 0 ? 0 : cur.avgCost
      }
    }
  }

  for (const [ticker, values] of Object.entries(positions)) {
    const price = (
      prices?.[ticker]?.[date]?.close ??
      (!prices?.[ticker] ? null : (() => {
        const dateList = Object.keys(prices[ticker]).sort() || []
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
    )

    if (values.qty !== 0) {
      positions[ticker] = {
        ...values,
        mktPrice: price,
        return: ((price ?? 0) - (values.avgCost ?? 0))
      }
    } else {
      delete positions[ticker]  
    }
  }
  
  return positions
}

export function calculateTotalCostBasis(transactions,prices,date="2024-12-30"){
  const pos = currentPositions(transactions,prices,date)
  let total = 0
  for (const [key, value] of Object.entries(pos)) {
    total += (value.avgCost * value.qty)
  }

  return total
}
