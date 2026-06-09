import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const data = [
  { contract: 'Month-to-month', churn_rate: 42 },
  { contract: 'One year',       churn_rate: 11 },
  { contract: 'Two year',       churn_rate: 3  },
]

const COLORS = ['#f87171', '#fbbf24', '#34d399']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#e2e8f0' }}>
        {payload[0].value}% churn rate
      </div>
    )
  }
  return null
}

export default function ChurnByContract() {
  return (
    <div style={{ background: '#1e293b', borderRadius: '10px', padding: '12px 14px', height: '100%' }}>
      <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 10px 0' }}>Churn rate by contract type</p>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <XAxis type="number" unit="%" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="contract" tick={{ fontSize: 11, fill: '#94a3b8' }} width={105} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155' }} />
          <Bar dataKey="churn_rate" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}