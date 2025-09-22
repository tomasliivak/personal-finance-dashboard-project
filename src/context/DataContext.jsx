import {createContext, useState, useContext, useEffect} from "react"
import {loadTransactions, loadPrices } from "../data/data.js"


const DataContext = createContext();

export function DataProvider({children}) {
    const [transactions, setTransactions] = useState([]) 
    const [prices, setPrices] = useState({})
    const [ready, setReady] = useState(false)

    useEffect(() => {
        (async () => {
            const [txns, px] = await Promise.all([loadTransactions(), loadPrices()])
            setTransactions(txns)
            setPrices(px)
            setReady(true)
        })()
    }, [])

    return (
        <DataContext.Provider value={{transactions, prices, ready}}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    return useContext(DataContext)
}