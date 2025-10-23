import Card from "../components/Card.jsx"
import { useData } from "../context/DataContext.jsx"
import {currentPositions} from "../utils/math.js"
import {useState, useEffect} from "react"

export default function Holdings() {
    const { transactions, prices, ready, startingBalance } = useData()

    const [positionsComps, setPositionsComps] = useState()

    function setValues() {
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