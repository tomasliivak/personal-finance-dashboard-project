import "./Home.css"
import Card from "../components/Card.jsx"
import { useData } from "../context/DataContext.jsx"
import { calculateHoldingsValue, calculateCash, calculateTotalBalance } from "../utils/math.js"
import {useState, useEffect} from "react"

export default function Home() {
    const { transactions, prices, ready, startingBalance } = useData()
    const [totalBalance, setTotalBalance]= useState()
    const [totalCash, setCash]= useState()
    const [totalHoldings, setHoldings]= useState()
    function setValues() {
        setTotalBalance(calculateTotalBalance(transactions,prices))
        setCash(calculateCash(transactions))
        setHoldings(calculateHoldingsValue(transactions,prices))
    }
    
    useEffect(() => {
        if (ready) setValues();
    },[ready,transactions,prices])

    return (
        <section id="home">
            <Card> 
                <h3>Account Balances</h3>
                <p>Total Holdings: ${totalHoldings}</p>
                <p>Total Cash: ${totalCash}</p>
                <p>Total Balance: ${totalBalance}</p>
            </Card>
            <Card>
                <h3>Portfolio Value Over Time</h3>
            </Card>
            <Card>
                <h3>Holdings:</h3>
            </Card>
        </section>
    )
}