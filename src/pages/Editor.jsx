import { NavLink } from "react-router-dom"
import "./Editor.css"
import {useState, useMemo} from "react"
import Card from "../components/Card.jsx"
import TransactionForm from "../components/TransactionsForm.jsx"
import { useData } from "../context/DataContext.jsx"
import { calculateHoldingsValue, calculateCash, calculateTotalBalance, calculateTotalReturn, currentPositions, calculateTotalCostBasis} from "../utils/math.js"
import {useTransactionEditor} from "../data/useTransactionEditor.jsx"
export default function Editor() {
    const { transactions, setTransactions, prices, ready, startingBalance, setRestart} = useData()
    const {deleteTxn} = useTransactionEditor()
    const {addTxn} = useTransactionEditor()

    const [errorMsg, setErrorMsg] = useState("")
    function resetToDefault() {
        if (window.confirm("Are you sure you want to delete ALL transactions?")) {
          setTransactions([])
          localStorage.removeItem("transactions")
          setRestart(prev => !prev)
        }
      }
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
                        <td classname="delete-column"><button className="txn-delete-btn"onClick={() => deleteTxn(txn,idx)}>x</button></td>
                    </tr> ) )
            )
        },[transactions])
    
    return (
        <section>
            <div className="titleDiv">
                            <h1 className="pageTitle">Transactions Editor</h1>
                            <button onClick={resetToDefault}>Reset To Default</button>
                            <NavLink id="editorDone" to={"/transactions"}>
                                            Done
                            </NavLink>
            </div>
                <TransactionForm
                    prices={prices}
                    transactions={transactions}
                    onSubmit={(txn) => {
                        const valid = addTxn(txn)

                        if (!valid) {
                        setErrorMsg("Invalid transaction")

                        setTimeout(() => {
                            setErrorMsg("")
                        }, 3500)
                        }
                    }}
                />
            <Card>
                            <table className="baseTable" id="editorTable">
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
                        {errorMsg && (
            <div className="toast-error">
                {errorMsg}
            </div>
            )}
        </section>
    )
}