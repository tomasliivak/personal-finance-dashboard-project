
import {
    ResponsiveContainer, 
    XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area
  } from "recharts"
  import { useState, useMemo} from "react"
  import { datesAndPricesForYear } from "../utils/math.js"
  import "./PerformanceChart.css"
  
  export default function PortfolioLineChart(props) {
    const fmtUsd = v => `$${v.toLocaleString()}`;
    const [data, setData] = useState()

    useMemo(() => {
            setData(datesAndPricesForYear(2024,props.transactions,props.prices))
        },[])
    
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top:12, right:24, bottom:12, left:0 }}>
            <CartesianGrid stroke="none" />
            <XAxis dataKey="date" tickMargin={3} />
            <YAxis tickFormatter={fmtUsd} width={80} />
            <Tooltip formatter={(v) => fmtUsd(v)} labelFormatter={(l)=>`Date: ${l}`} />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              name="Portfolio Value"
              stroke="#01ab76"
              strokeWidth={2}
              fill="#01ab76"
              fillOpacity={0.1}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  