import { NavLink } from "react-router-dom"
import "./Editor.css"
import {useState, useMemo} from "react"
import Card from "../components/Card.jsx"
import { useData } from "../context/DataContext.jsx"
import { calculateHoldingsValue, calculateCash, calculateTotalBalance, calculateTotalReturn, currentPositions, calculateTotalCostBasis} from "../utils/math.js"
import {useTransactionEditor} from "../data/useTransactionEditor.jsx"
export default function Editor() {
    const { transactions, prices, ready, startingBalance } = useData()
    const {deleteTxn} = useTransactionEditor()
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
                        <td><button onClick={() => deleteTxn(txn)}>X</button></td>
                    </tr> ) )
            )
        })
    
    return (
        <section>
            <div className="titleDiv">
                            <h1 className="pageTitle">Transactions Editor</h1>
                            <NavLink id="editorDone" to={"/transactions"} className = {({isActive}) => (isActive ? "active" : "")}>
                                            Done
                            </NavLink>
            </div>
            <Card>
                            <table className="baseTable">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Ticker</th>
                                        <th>Action</th>
                                        <th>Quantity</th>
                                        <th>Share Value</th>
                                        <th></th>
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