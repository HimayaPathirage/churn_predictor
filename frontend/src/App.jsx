import { useEffect, useState } from 'react'
import API from './api/client'
import KpiCards        from './components/KpiCards'
import ChurnByContract from './components/ChurnByContract'
import ChurnDonut      from './components/ChurnDonut'
import PredictForm     from './components/PredictForm'

export default function App() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    API.get('/stats').then(res => setStats(res.data))
  }, [])

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', padding: '16px 20px', maxWidth: '1366px', margin: '0 auto' }}>

      <div style={{ marginBottom: '12px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>
          Churn predictor dashboard
        </h1>
        <p style={{ fontSize: '15px', color: '#64748b', margin: '2px 0 0 0' }}>
          Telco customer analytics · powered by XGBoost
        </p>
      </div>

      <KpiCards stats={stats} />
      <br></br>
      <PredictForm />
      <br></br>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <ChurnByContract />
        <ChurnDonut stats={stats} />
      </div>

    </div>
  )
}