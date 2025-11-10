import { useState } from "react"
import "./TransactionsForm.css"
import {calculateCash} from "../utils/math.js"

export default function TransactionForm({ onSubmit, prices, transactions}) {
  const [date, setDate] = useState("")
  const [action, setAction] = useState("")
  const [ticker, setTicker] = useState("")
  const [qty, setQty] = useState("")

  function handleSubmit(e) {
    e.preventDefault()

    const txn = {
      date,
      action,
      ticker,
      qty: Number(qty),
      price: prices[ticker]?.[date]?.close ?? 0 
    }

    onSubmit(txn)
  }

  return (
    <form className="add-txn-form"onSubmit={handleSubmit}>
        <h2>Add Transaction</h2>
        <div id="form-inputs">
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        min="2024-01-02"
        max="2024-12-30"
      />

      <select value={action} onChange={e => setAction(e.target.value)}>
        <option value="">Select Action</option>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
        <option value="CASH_IN">CASH IN</option>
        <option value="CASH_OUT">CASH OUT</option>
      </select>

      <input
        type="text"
        placeholder="Ticker"
        value={ticker}
        onChange={e => setTicker(e.target.value.toUpperCase())}
      />

      <input
        type="number"
        placeholder="Qty"
        value={qty}
        onChange={e => setQty(e.target.value)}
      />
      </div>
      <div className="form-prices">
        <div>
            <p>
            Share Price:
            </p>
            <p>
            {prices[ticker]?.[date]?.close
                ? `$${Math.round(prices[ticker][date].close * 100) /100}`
                : ""}
            </p>
        </div>
        <div>
            <p>
            Total Transaction Price:
            </p>
            <p>
            {action == "BUY" || action == "CASH_OUT" ? prices[ticker]?.[date]?.close
                ? `-$${Math.round(prices[ticker][date].close * qty * 100 ) /100}`
                : "" : prices[ticker]?.[date]?.close
                ? `$${Math.round(prices[ticker][date].close * qty * 100 ) /100}`
                : "" }
            </p>
        </div>
        <div>
            <p>
            Available Cash at Transaction Date:
            </p>
            <p>
            {calculateCash(transactions,date)}
            </p>
        </div>
        <div>
            <p>
            Cash after Transaction:
            </p>
            <p>
            
            {action == "BUY" || action == "CASH_OUT" ? (Math.round((calculateCash(transactions,date)-(prices[ticker]?.[date]?.close
                ? prices[ticker][date].close * qty
                : 0))*100)/100) : (Math.round((calculateCash(transactions,date)+(prices[ticker]?.[date]?.close
                    ? prices[ticker][date].close * qty
                    : 0))*100)/100)}
            </p>
        </div>
        
      </div>


      <button type="submit">Add Transaction</button>
    </form>
  )
}
