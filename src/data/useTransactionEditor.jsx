import { useData } from "../context/DataContext.jsx"
import {useState, useMemo} from "react"
import { calculateHoldingsValue, calculateCash, calculateTotalBalance, calculateTotalReturn, currentPositions, calculateTotalCostBasis} from "../utils/math.js"

export function useTransactionEditor() {
    const { transactions, prices, ready, startingBalance, setTransactions } = useData()
    

    function checkValidAction(txn, action) {
        let found = false

        for (const key in prices) {
        if (key === txn.ticker) {
            found = true
            break
        }
        }
        if (txn.action == "" ) {
            return false
        }
        if (!found && txn.ticker !== "CASH") {
            return false
          }

          if (txn.ticker === "CASH" && txn.action !== "CASH_IN" && txn.action !== "CASH_OUT") {
            return false
          }
        if (txn.qty <= 0) {
            return false
        }

                // concerned with cash balance and contradicting transactions(removing a buy after its sold later on)
        if (action == "REMOVE") {
            if (txn.action == "BUY") {
                
                let base = currentPositions(transactions,prices,txn.date)[txn.ticker]
                let qty = base ? base.qty : 0
                qty -= txn.qty
                
                if (qty < 0) return false
                for (const t of transactions) {
                    if (t.date <= txn.date) continue
                    if (t.ticker !== txn.ticker) continue
                    if (t === txn) continue
            
                    if (t.action === "BUY") qty += t.qty
                    else if (t.action === "SELL") qty -= t.qty
                    
                    if (qty < 0) return false
                }
            
                return true
            }
            else if (txn.action == "CASH_IN") {
                let cash = calculateCash(transactions, txn.date) ?? 0
                cash -= txn.qty
                
                if (cash < 0) return false
                for (const t of transactions) {
                    if (t.date <= txn.date) continue
                    if (t === txn) continue
                    if (t.action === "BUY") cash -= (t.qty*t.price)
                    else if (t.action === "SELL") cash += (t.qty*t.price)
                    else if (t.action === "CASH_IN") cash += (t.qty)
                    else if (t.action === "CASH_OUT") cash -= (t.qty)
            
                    if (cash < 0) return false
                }
            
                return true
            }
            else {
                // honestly probably should add a sanity check for selling(if they exist, but shouldnt be possible to add a sell that doesnt exist)
                return true 
            }
        }
        else if (action == "ADD") {

        
        // concerned about cash balance and also adding a sell that doesnt have any of a stock
            if (txn.action == "BUY") {
                let cash = calculateCash(transactions, txn.date) ?? 0
                cash -= (txn.qty * txn.price)

                if (cash < 0) return false
                for (const t of transactions) {
                    if (t.date <= txn.date) continue
                    if (t === txn) continue
                    if (t.action === "BUY") cash -= (t.qty*t.price)
                    else if (t.action === "SELL") cash += (t.qty*t.price)
                    else if (t.action === "CASH_IN") cash += (t.qty)
                    else if (t.action === "CASH_OUT") cash -= (t.qty)
            
                    if (cash < 0) return false
                }
            
                return true
            }
            else if (txn.action == "SELL") {
                console.log("ran")
                let base = currentPositions(transactions,prices,txn.date)[txn.ticker]
                console.log(base)
                let qty = base ? base.qty : 0
                qty -= txn.qty
                console.log(qty)
                if (qty < 0) return false

                for (const t of transactions) {
                    if (t.date <= txn.date) continue
                    if (t.ticker !== txn.ticker) continue
                    if (t === txn) continue
                    
                    if (t.action === "BUY") qty += t.qty
                    else if (t.action === "SELL") qty -= t.qty
                    
                    
                    if (qty < 0) return false

                }
            
                return true
            }
            else if (txn.action === "CASH_OUT") {
                let cash = calculateCash(transactions, txn.date) ?? 0
                cash -= txn.qty 
                
                if (cash < 0) return false
                for (const t of transactions) {
                    if (t.date <= txn.date) continue
                    if (t === txn) continue
                    if (t.action === "BUY") cash -= (t.qty*t.price)
                    else if (t.action === "SELL") cash += (t.qty*t.price)
                    else if (t.action === "CASH_IN") cash += (t.qty)
                    else if (t.action === "CASH_OUT") cash -= (t.qty)
            
                    if (cash < 0) return false
                }
            
                return true
            }
            else {
                return true
            }
        }
    }
    function deleteTxn(txn,idx) {
        // date, ticker, action, qty, price
        console.log(checkValidAction(txn, "REMOVE"))
        if (checkValidAction(txn,"REMOVE")) {
            setTransactions(prev => prev.filter((_, i) => i !== idx))
        }
    }

    function addTxn(txn) {
        if (checkValidAction(txn, "ADD")) {
            console.log(txn)
            setTransactions(prev => {
                const updated = [...prev, txn]
                return updated.sort((a, b) => a.date.localeCompare(b.date))
              })
            return true
        } else {
            return false
        }
    }

    return { deleteTxn, addTxn}
}

