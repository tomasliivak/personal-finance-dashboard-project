import "./transactions.css"
import Card from "../components/Card.jsx"
import { useData } from "../context/DataContext.jsx"
import {useMemo} from "react"
import { NavLink } from "react-router-dom"
export default function Transactions() {
    const { transactions} = useData()
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
                <NavLink to={"/transactions/editor"}>
                                Edit Transactions
                </NavLink>
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