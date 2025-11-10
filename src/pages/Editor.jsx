import { NavLink } from "react-router-dom"
import "./Editor.css"
import {useState, useMemo} from "react"
import Card from "../components/Card.jsx"
import TransactionForm from "../components/TransactionsForm.jsx"
import { useData } from "../context/DataContext.jsx"
import { calculateHoldingsValue, calculateCash, calculateTotalBalance, calculateTotalReturn, currentPositions, calculateTotalCostBasis} from "../utils/math.js"
import {useTransactionEditor} from "../data/useTransactionEditor.jsx"
export default function Editor() {
    const { transactions, prices, ready, startingBalance } = useData()
    const {deleteTxn} = useTransactionEditor()
    const {addTxn} = useTransactionEditor()
        const txnsRows = useMemo(() => {
            return (
                transactions.map((txn,idx) => (
                    // date, ticker, action, qty, price
                    <tr >
                        <td>{txn.date}</td>
                        <td>{txn.ticker}</td>
                        <td style={{color : ((txn.action === "BUY" || txn.action === "CASH_IN")) ? "#01ab76" : "#d64b4b" }}>{txn.action}</td>
                        <td>{txn.qty}</td>
                        <td>{txn.price != undefined ? (txn.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null}</td>
                        <td><button onClick={() => deleteTxn(txn,idx)}>X</button></td>
                    </tr> ) )
            )
        },[transactions])
    
    return (
        <section>
            <div className="titleDiv">
                            <h1 className="pageTitle">Transactions Editor</h1>
                            <NavLink id="editorDone" to={"/transactions"}>
                                            Done
                            </NavLink>
            </div>
            <Card>
                <h2>Add Transaction</h2>
                <TransactionForm prices={prices} onSubmit={(txn) => {
                    addTxn(txn)
                }}/>
            </Card>
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