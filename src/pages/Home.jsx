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
        <section>
            <h1 id="summaryTitle">Summary</h1>
            <div id="cardChart">
                    <Card>
                        <div>
                            <h2>Total Balance</h2>
                        </div>
                        <div id="chartValueTitles">
                            <div>
                                <p>Total Value</p>
                                <h2>${totalBalance}</h2>
                            </div>
                            <div>
                                <p>Yearly Change</p>
                                <h3>{totalReturn*100}%</h3>
                            </div>
                        </div>
                        {ready ? <PerformanceChart transactions={transactions} prices={prices}/> : null}
                    </Card>
                </div>
            <div id="home">
                <div>
                <Card> 
                    <h2>Positions</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Market Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>AAPL</td>
                            </tr>
                        </tbody>
                    </table>
                    
                </Card>
                <Card>
                    <h2>Assets</h2>
                </Card>
                </div>
            </div>
        </section>
    )
}