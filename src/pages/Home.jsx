import "./Home.css"
import Card from "../components/Card.jsx"
import { useData } from "../context/DataContext.jsx"
import { calculateHoldingsValue, calculateCash, calculateTotalBalance, calculateTotalReturn, currentPositions} from "../utils/math.js"
import {useState, useEffect} from "react"
import PerformanceChart from "../components/PerformanceChart.jsx"

export default function Home() {
    const { transactions, prices, ready, startingBalance } = useData()
    const [totalBalance, setTotalBalance]= useState()
    const [totalCash, setCash]= useState()
    const [totalHoldings, setHoldings]= useState()
    const [totalReturn,setTotalReturn] = useState()
    const [positionsComps, setPositionsComps] = useState()
    function setValues() {
        setTotalBalance(calculateTotalBalance(transactions,prices))
        setCash(calculateCash(transactions))
        setHoldings(calculateHoldingsValue(transactions,prices))
        setTotalReturn(calculateTotalReturn(transactions,prices,startingBalance))
        const pos = currentPositions(transactions,prices)
        
        setPositionsComps(Object.entries(pos).map(([ticker,data]) => (
            <tr>
                <td className="tickerEntry">{ticker}</td>
                <td>{data.qty}</td>
                <td>${Math.round(data.avgCost * 100) / 100}</td>
                <td>${Math.round(data.mktPrice * 100) / 100}</td>
                <td style={{ color: data.return >= 0 ? "#01ab76" : "#d64b4b" }}>${Math.round(data.return * 100) / 100}</td>
            </tr> ) ))
    }
    
    useEffect(() => {
        if (ready) {
            setValues() 
        }
    },[ready,transactions,prices])
    
    return (
        <section>
            <h1 id="summaryTitle">Summary</h1>
            <Card>
                    <h2>Account Balances</h2>
                    <div id="ValueTitles">
                        <div >
                            <p>Cash</p>
                            <h2>${totalCash}</h2>
                        </div>
                        <div>
                            <p>Holdings</p>
                            <h2>${totalHoldings}</h2>
                        </div>
                        <div>
                            <p>Account Value</p>
                            <h2>${totalBalance}</h2>
                        </div>
                    </div>
                </Card>
            <div id="cardChart">
                    <Card>
                        <div>
                            <h2>Balance Over Time</h2>
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
            <div>
                <Card> 
                    <h2>Positions</h2>
                    <table id="positions">
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Quantity</th>
                                <th>Cost</th>
                                <th>Market Value</th>
                                <th>Gain \ Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ready ? positionsComps : null}
                        </tbody>
                    </table>
                </Card>
            </div>
            
        </section>
    )
}