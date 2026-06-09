export default function KpiCards({ stats }) {
  if (!stats) return null

  const cards = [
    { label: 'Total customers',     value: stats.total_customers.toLocaleString(),  color: '#e2e8f0' },
    { label: 'Churned',             value: stats.churned.toLocaleString(),           color: '#f87171' },
    { label: 'Churn rate',          value: stats.churn_rate_pct + '%',               color: '#f87171' },
    { label: 'Avg monthly charges', value: '$' + stats.avg_monthly_charges,          color: '#60a5fa' },
    { label: 'Avg tenure',          value: stats.avg_tenure_months + ' mon',          color: '#e2e8f0' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '10px' }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: '#1e293b', borderRadius: '10px', padding: '10px 14px' }}>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 4px 0' }}>{c.label}</p>
          <p style={{ fontSize: '20px', fontWeight: '500', color: c.color, margin: 0 }}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}