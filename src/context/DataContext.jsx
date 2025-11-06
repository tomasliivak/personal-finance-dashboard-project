import {createContext, useState, useContext, useEffect} from "react"
import {loadTransactions, loadPrices } from "../data/data.js"


const DataContext = createContext();

export function DataProvider({children}) {
    const [transactions, setTransactions] = useState([]) 
    const [prices, setPrices] = useState({})
    const [ready, setReady] = useState(false)
    const [startingBalance, setStartingBalance] = useState()

    useEffect(() => {
        (async () => {
            const [txns, px] = await Promise.all([loadTransactions(), loadPrices()])
            const datesByTicker = (() => {
                const out = {};
                for (const t in px) out[t] = Object.keys(px[t]).sort();
                return out;
                } )()
            const enrichedTxns = txns.map(txn => {
                if (txn.ticker == "CASH") {
                    return {...txn, price: null}
                }
                
                return {
                    ...txn,
                    price:
                      px[txn.ticker]?.[txn.date]?.close ??
                      (() => {
                        
                        const dateList = datesByTicker[txn.ticker] || []
                        if (dateList.length === 0) return null
                        
                        
                        let lo = 0, hi = dateList.length
                        while (lo < hi) {
                          const mid = (lo + hi) >> 1
                          if (dateList[mid] <= txn.date) lo = mid + 1
                          else hi = mid
                        }
                  
                        if (lo === 0) return null           
                        const prevDate = dateList[lo - 1]
                        
                        return px[txn.ticker]?.[prevDate]?.close ?? null
                      })()
                  }
                  
                  
            })
            setTransactions(enrichedTxns)
            setPrices(px)
            setReady(true)
            let cash = 0
            for (let i = 0 ; i< txns.length ; i++) {
                if (txns[i].ticker == "CASH") {
                    cash += txns[i].qty
                }
            }
            setStartingBalance(cash)
        })()
    }, [])

    return (
        <DataContext.Provider value={{transactions, prices, ready, startingBalance, setTransactions}}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    return useContext(DataContext)
}