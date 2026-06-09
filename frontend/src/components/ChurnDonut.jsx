import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#e2e8f0' }}>
        {payload[0].name}: {payload[0].value.toLocaleString()}
      </div>
    )
  }
  return null
}

export default function ChurnDonut({ stats }) {
  if (!stats) return null

  const data = [
    { name: 'Churned',  value: stats.churned },
    { name: 'Retained', value: stats.total_customers - stats.churned },
  ]

  const COLORS = ['#f87171', '#34d399']

  return (
    <div style={{ background: '#1e293b', borderRadius: '10px', padding: '12px 14px', height: '100%' }}>
      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Churn split</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ResponsiveContainer width="55%" height={150}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" startAngle={90} endAngle={-270}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.map((d, i) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i], flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{d.name}</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#e2e8f0', margin: 0 }}>{d.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}