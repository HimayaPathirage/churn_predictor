import { useState } from 'react'
import API from '../api/client'

export default function PredictForm() {
  const [form, setForm] = useState({
    gender: 'Female', SeniorCitizen: 0, Partner: 'Yes',
    Dependents: 'No', tenure: 1, PhoneService: 'No',
    MultipleLines: 'No phone service', InternetService: 'DSL',
    OnlineSecurity: 'No', OnlineBackup: 'Yes', DeviceProtection: 'No',
    TechSupport: 'No', StreamingTV: 'No', StreamingMovies: 'No',
    Contract: 'Month-to-month', PaperlessBilling: 'Yes',
    PaymentMethod: 'Electronic check',
    MonthlyCharges: 29.85, TotalCharges: 29.85
  })

  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)

  const handle = (e) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  const predict = async () => {
    setLoading(true)
    try {
      const res = await API.post('/predict', form)
      setResult(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const riskConfig = {
    High:   { bg: '#450a0a', color: '#f87171', label: '⚠ High risk'   },
    Medium: { bg: '#422006', color: '#fbbf24', label: '~ Medium risk'  },
    Low:    { bg: '#052e16', color: '#34d399', label: '✓ Low risk'     },
  }

  const inputStyle = {
    background: '#0f172a', border: '1px solid #334155', borderRadius: '6px',
    color: '#e2e8f0', fontSize: '12px', padding: '6px 8px', width: '100%'
  }

  return (
    <div style={{ background: '#1e293b', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0' }}>Predict churn for a customer</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '10px' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 3px 0' }}>Contract</p>
          <select name="Contract" value={form.Contract} onChange={handle} style={inputStyle}>
            <option>Month-to-month</option>
            <option>One year</option>
            <option>Two year</option>
          </select>
        </div>
        <div>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 3px 0' }}>Internet service</p>
          <select name="InternetService" value={form.InternetService} onChange={handle} style={inputStyle}>
            <option>DSL</option>
            <option>Fiber optic</option>
            <option>No</option>
          </select>
        </div>
        <div>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 3px 0' }}>Payment method</p>
          <select name="PaymentMethod" value={form.PaymentMethod} onChange={handle} style={inputStyle}>
            <option>Electronic check</option>
            <option>Mailed check</option>
            <option>Bank transfer (automatic)</option>
            <option>Credit card (automatic)</option>
          </select>
        </div>
        <div>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 3px 0' }}>Tenure (months)</p>
          <input type="number" name="tenure" value={form.tenure} onChange={handle} style={inputStyle} min="0" />
        </div>
        <div>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 3px 0' }}>Monthly charges ($)</p>
          <input type="number" name="MonthlyCharges" value={form.MonthlyCharges} onChange={handle} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={predict}
          disabled={loading}
          style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '7px', padding: '7px 18px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
        >
          {loading ? 'Predicting...' : 'Predict churn'}
        </button>

        {result && (() => {
          const cfg = riskConfig[result.risk_level]
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: cfg.bg, color: cfg.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                {cfg.label}
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                {(result.churn_probability * 100).toFixed(1)}% churn probability
              </span>
            </div>
          )
        })()}
      </div>
    </div>
  )
}