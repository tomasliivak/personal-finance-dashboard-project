
import {
    ResponsiveContainer, LineChart, Line,
    XAxis, YAxis, Tooltip, CartesianGrid, Legend
  } from "recharts"
  import { useState, useMemo, useEffect} from "react"
  import { datesAndPricesForYear } from "../utils/math.js"
  
  
  export default function PortfolioLineChart(props) {
    const fmtUsd = v => `$${v.toLocaleString()}`;
    const [data, setData] = useState()

    useMemo(() => {
            setData(datesAndPricesForYear(2024,props.transactions,props.prices))
        },[])
    
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 12, right: 24, bottom: 12, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickMargin={8} />
            <YAxis tickFormatter={fmtUsd} width={80} />
            <Tooltip formatter={(v) => fmtUsd(v)} labelFormatter={(l) => `Date: ${l}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name="Portfolio Value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  