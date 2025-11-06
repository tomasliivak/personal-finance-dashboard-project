import { useData } from "../context/DataContext.jsx"
import {useState, useMemo} from "react"
import { calculateHoldingsValue, calculateCash, calculateTotalBalance, calculateTotalReturn, currentPositions, calculateTotalCostBasis} from "../utils/math.js"

export function useTransactionEditor(txn) {
    const { transactions, prices, ready, startingBalance, setTransactions } = useData()

    function checkValidAction(txn, action) {
        if (action == "REMOVE")
        // concerned with cash balance and contradicting transactions(removing a buy after its sold later on)
            if (txn.action == "BUY") {
                
            }
            else if (txn.action == "CASH_IN") {
                if (calculateCash(transactions) - txn.qty < 0) {
                    return false
                }
                return true
            }
            else {
                // honestly probably should add a sanity check for selling(if they exist, but shouldnt be possible to add a sell that doesnt exist)
                return true 
            }
        else if (action == "ADD")
        // concerned about cash balance and also adding a sell that doesnt have any of a stock
            if (txn.action == "BUY") {
                if (calculateCash(transactions) - (txn.qty*txn.price) < 0) {
                    return false
                }
                return true 
            }
            else if (txn.action == "SELL") {
                
            }
            else if (txn.action == "CASH_IN") {

            }
            else if (t.action === "CASH_OUT") {
                if (calculateCash(transactions) - (txn.qty) < 0) {
                    return false
                }
                return true
                // left off working here
            }
    }
    function deleteTxn(txn) {
        // date, ticker, action, qty, price
        console.log(txn)
    }

    return { deleteTxn }
}

