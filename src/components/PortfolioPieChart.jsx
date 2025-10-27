import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

const COLORS = ["#38BDF8", "#FACC15", "#34D399", "#A78BFA", "#FB7185", "#F59E0B"]

function percentLabel({ name = "", percent = 0 }) {
  return percent > 0.02 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
}

export default function PieChartCard({ data = []}) {
  
  const rows = Array.isArray(data) ? data : []
  const total = rows.reduce((s, d) => s + (Number.isFinite(d?.value) ? d.value : 0), 0)
  const safeData = total > 0
    ? rows.filter(d => Number.isFinite(d?.value) && d.value > 0)
    : [{ name: "None", value: 1 }]


  if (safeData.length === 0) {
    return <div className="w-full h-80 rounded-2xl p-4 border border-gray-200">No data</div>
  }

  return (
    <div className="w-full h-80 rounded-2xl p-4 border border-gray-200">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={safeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={0}
            label={percentLabel}
            labelLine={false}
            isAnimationActive
          >
            {safeData.map((entry, i) => (
              <Cell key={`cell-${entry?.name ?? "n"}-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => (Number.isFinite(v) ? v.toLocaleString() : v)} />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
