import "./Home.css"
import Card from "../components/Card.jsx"
import { useData } from "../context/DataContext.jsx"
import { calculateHoldingsValue, calculateCash, calculateTotalBalance, calculateTotalReturn} from "../utils/math.js"
import {useState, useEffect} from "react"
import PerformanceChart from "../components/PerformanceChart.jsx"

export default function Home() {
    const { transactions, prices, ready, startingBalance } = useData()
    const [totalBalance, setTotalBalance]= useState()
    const [totalCash, setCash]= useState()
    const [totalHoldings, setHoldings]= useState()
    const [totalReturn,setTotalReturn] = useState()
    function setValues() {
        setTotalBalance(calculateTotalBalance(transactions,prices))
        setCash(calculateCash(transactions))
        setHoldings(calculateHoldingsValue(transactions,prices))
        setTotalReturn(calculateTotalReturn(transactions,prices,startingBalance))
    }
    
    useEffect(() => {
        if (ready) setValues();
    },[ready,transactions,prices])

    return (
        <section id="home">
            <div>
            <Card> 
                <h3>Account Balances</h3>
                <p>Total Holdings: ${totalHoldings}</p>
                <p>Total Cash: ${totalCash}</p>
                <p>Total Balance: ${totalBalance}</p>
                <p>Yearly Return: {totalReturn*100}%</p>
            </Card>
            <Card>
                <h3>Assets</h3>
            </Card>
            </div>
            <Card>
                <h3>Portfolio Performance</h3>
                {ready ? <PerformanceChart transactions={transactions} prices={prices}/> : null}
            </Card>
        </section>
    )
}