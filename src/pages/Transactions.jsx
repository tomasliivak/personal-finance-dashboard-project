import "./transactions.css"
import Card from "../components/Card.jsx"
import { useData } from "../context/DataContext.jsx"
import { calculateHoldingsValue, calculateCash, calculateTotalBalance, calculateTotalReturn, currentPositions, calculateTotalCostBasis} from "../utils/math.js"
import {useState, useMemo} from "react"
export default function Transactions() {
    const { transactions, prices, ready, startingBalance } = useData()
    const txnsRows = useMemo(() => {
        return (
            transactions.map(txn => (
                // date, ticker, action, qty, price
                <tr >
                    <td>{txn.date}</td>
                    <td>{txn.ticker}</td>
                    <td style={{color : ((txn.action === "BUY" || txn.action === "CASH_IN")) ? "#01ab76" : "#d64b4b" }}>{txn.action}</td>
                    <td>{txn.qty}</td>
                    <td>{txn.price != undefined ? (txn.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null}</td>
                </tr> ) )
        )
    })

    return (
        <section>
            <div className="titleDiv">
                <h1 className="pageTitle">Transactions</h1>
                <p>Updated: 2024-12-30</p>
            </div>
            <Card>
                <table className="baseTable" id="transactionsTable">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Ticker</th>
                            <th>Action</th>
                            <th>Quantity</th>
                            <th>Share Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {txnsRows != undefined ? txnsRows : null}
                    </tbody>
                </table>
            </Card>
        </section>
    )
}