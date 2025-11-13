import Card from "../components/Card.jsx"
import PortfolioPieChart from "../components/PortfolioPieChart.jsx"
import { useData } from "../context/DataContext.jsx"
import {calculateCash, calculateTotalBalance, currentPositions} from "../utils/math.js"
import {useState, useEffect} from "react"
import "./Insights.css"

export default function Insights() {
    const { transactions, prices, ready} = useData()
    const [pieChartData, setPieChartData] = useState()
    const [totalBalance, setTotalBalance] = useState()
    const [top5Returns, setTop5Returns] = useState()
    const [bottom5Returns, setBottom5Returns] = useState()

    function setValues() {
        const pos = currentPositions(transactions,prices)
        const holdingsData = Object.entries(pos).map(([ticker,data]) => (
            {name:ticker, value:data.mktPrice*data.qty}))
        const cashValue = calculateCash(transactions)

        setPieChartData([...holdingsData,{name:"Cash",value:cashValue }])
        setTotalBalance(calculateTotalBalance(transactions,prices))
        const top5 = Object.entries(pos).map(([ticker, data]) => ({ticker:ticker, return: Math.round(((data.mktPrice - data.avgCost) / data.avgCost) * 10000) / 100,})).sort((a, b) => b.return - a.return).slice(0, 5)
        setTop5Returns(top5.map((obj, i) => {
            return (
                <tr>
                    <td>{i+1}</td>
                    <td>{obj.ticker}</td>
                    <td style={{ color: obj.return >= 0 ? "#01ab76" : "#d64b4b" }}>{obj.return}</td>

                </tr>
            )
        }))
        const bot5 = Object.entries(pos).map(([ticker, data]) => ({ticker:ticker, return: Math.round(((data.mktPrice - data.avgCost) / data.avgCost) * 10000) / 100,})).sort((a, b) => a.return - b.return).slice(0, 5)
        setBottom5Returns(bot5.map((obj, i) => {
            return (
                <tr>
                    <td>{i+1}</td>
                    <td>{obj.ticker}</td>
                    <td style={{ color: obj.return >= 0 ? "#01ab76" : "#d64b4b" }}>{obj.return}</td>

                </tr>
            )
        }))
    }

    useEffect(() => {
        if (ready) {
            setValues() 
        }
    },[ready,transactions,prices])

    return (
        <section>
            <div className="titleDiv">
                <h1 className="pageTitle">Analysis</h1>
                <p>Updated: 2024-12-30</p>
            </div>
                <div id="topHoldings">
                    <div>
                        <Card>
                            <h2 className="centered">Top 5 Best Performing Holdings</h2>
                            <table className="baseTable">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Ticker</th>
                                        <th>% Return</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {top5Returns != undefined ? top5Returns : null}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                    
                    <div>
                        <Card>
                            <h2 className="centered">Top 5 Worst Performing Holdings</h2>
                            <table className="baseTable">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Ticker</th>
                                        <th>% Return</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bottom5Returns != undefined ? bottom5Returns : null}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                </div>
                <Card>
                    <div className="centered">
                        <h2>Total Portfolio Value</h2>
                        <h3>{totalBalance != undefined ? totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'Loading...'}</h3>
                    </div>
                    {ready ? <PortfolioPieChart data={pieChartData} donut/> : null}
                </Card>
        </section>
    )
}