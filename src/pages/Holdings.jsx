import "./Holdings.css"
import Card from "../components/Card.jsx"
import { useData } from "../context/DataContext.jsx"
import { calculateHoldingsValue, calculateCash, calculateTotalBalance, calculateTotalReturn, currentPositions, calculateTotalCostBasis} from "../utils/math.js"
import {useState, useEffect} from "react"

export default function Holdings() {
    const { transactions, prices, ready, startingBalance } = useData()

    const [positionsComps, setPositionsComps] = useState()
    const [totalBalance, setTotalBalance]= useState()
    const [totalCash, setCash]= useState()
    const [totalHoldings, setHoldings]= useState()
    const [totalReturn,setTotalReturn] = useState()
    const [totalCostBasis, setTotalCostBasis] = useState()
    function setValues() {
        setTotalBalance(calculateTotalBalance(transactions,prices))
        setCash(calculateCash(transactions))
        setHoldings(calculateHoldingsValue(transactions,prices))
        setTotalReturn(calculateTotalReturn(transactions,prices,startingBalance))
        setTotalCostBasis(calculateTotalCostBasis(transactions,prices))
        const pos = currentPositions(transactions,prices)
        setPositionsComps(Object.entries(pos).map(([ticker,data]) => (
            <tr>
                <td className="tickerEntry">{ticker}</td>
                <td>{data.qty}</td>
                <td>{(data.avgCost*data.qty).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                <td>{(data.mktPrice*data.qty).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                <td style={{ color: data.return >= 0 ? "#01ab76" : "#d64b4b" }}>{(data.return*data.qty).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                <td style={{ color: data.return >= 0 ? "#01ab76" : "#d64b4b" }}>{Math.round(((data.mktPrice-data.avgCost)/data.avgCost)*10000)/100}%</td>
            </tr> ) ))
    }

    useEffect(() => {
        if (ready) {
            setValues() 
        }
    },[ready,transactions,prices])

    return (
        <section>
            <div className="titleDiv">
                <h1 className="pageTitle">Holdings</h1>
                <p>Updated: 2024-12-30</p>
            </div>
            <Card> 
                <h2>Position Details</h2>
                <table className="baseTable">
                    <thead>
                        <tr>
                            <th>Ticker</th>
                            <th>Quantity</th>
                            <th>Cost Basis</th>
                            <th>Market Value</th>
                            <th>Gain \ Loss</th>
                            <th>G / L %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ready ? positionsComps : null}
                        <tr>
                            <td className="tickerEntry" style={{ fontWeight: 700}} classname="totalTd">Total</td>
                            <td></td>
                            <td style={{ fontWeight: 700 }} classname="totalTd">{totalCostBasis != undefined ? totalCostBasis.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'Loading...'}</td>
                            <td style={{ fontWeight: 700 }} classname="totalTd">{totalHoldings != undefined ? totalHoldings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'Loading...'}</td>
                            <td style={{ color: totalReturn != undefined ? (totalReturn[1] >= 0 ? "#01ab76" : "#d64b4b" ) : null, fontWeight: 700 }} classname="totalTd">{totalReturn != undefined ? totalReturn[1].toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'Loading...'}</td>
                            <td style={{ color: totalReturn != undefined ? (totalReturn[1] >= 0 ? "#01ab76" : "#d64b4b" ) : null, fontWeight: 700 }} classname="totalTd">{totalReturn != undefined ? totalReturn[0]*100 : "Loading..."}%</td>
                        </tr>
                    </tbody>

                </table>
            </Card>
        </section>
    )
}