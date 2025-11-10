import { useState } from "react"

export default function TransactionForm({ onSubmit, prices }) {
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
      price: prices[ticker]?.[date]?.close ?? 0  // use price from data
    }

    onSubmit(txn)
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <p className="form-price">
        Share Price: {prices[ticker]?.[date]?.close
          ? `$${prices[ticker][date].close}`
          : ""}
      </p>
      <p className="form-price">
        Total Transaction Price: {prices[ticker]?.[date]?.close
          ? `$${prices[ticker][date].close * qty}`
          : ""}
      </p>


      <button type="submit">Add Transaction</button>
    </form>
  )
}
