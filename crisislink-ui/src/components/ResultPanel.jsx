import React from 'react'

function tryParse(v) {
  if (v == null) return null
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return null }
}

export default function ResultPanel({ result, error }) {
  if (error) {
    return (
      <section className="results results--error">
        <h3 className="panel__title">AI final response</h3>
        <p className="results__error">{error}</p>
        <p className="results__error-hint">Check that VITE_API_URL points at your live Render backend and that it's awake (free-tier services sleep after inactivity).</p>
      </section>
    )
  }

  if (!result) {
    return (
      <section className="results results--empty">
        <h3 className="panel__title">AI final response</h3>
        <p className="results__empty">Submit a report to see the verified, prioritized rescue plan here.</p>
      </section>
    )
  }

  const priority = tryParse(result.priority_result) || {}
  const finalMsg = tryParse(result.final_response) || {}
  const state = result.raw_state || {}
  const resource = tryParse(state.resource_result) || {}
  const shelter = tryParse(state.shelter_result) || {}
  const medical = tryParse(state.medical_result) || {}
  const approval = tryParse(result.approval_result) || {}

  const score = priority.priority_score ?? 0
  const label = priority.priority_label || 'UNKNOWN'
  const isCritical = label === 'CRITICAL'

  return (
    <section className="results">
      <div className="results__head">
        <h3 className="panel__title">AI final response</h3>
      </div>

      <div className={`card card--priority ${isCritical ? 'card--critical' : ''}`}>
        <div className="card__label">
          <span className="card__dot" /> Priority level
          <span className={`badge badge--${label.toLowerCase()}`}>{label}</span>
        </div>
        <div className="card__big">{score}<span className="card__big-max">/100</span></div>
        <svg className="ecg" viewBox="0 0 300 40" preserveAspectRatio="none">
          <polyline className="ecg__line" points="0,20 40,20 55,5 70,35 85,20 140,20 155,8 170,32 185,20 300,20" />
        </svg>
        {approval.human_reviewed && (
          <p className="card__note">
            Dispatcher approval: <strong>{approval.approved ? 'Approved' : 'Pending / declined'}</strong>
          </p>
        )}
      </div>

      <div className="card-grid">
        <div className="card card--blue">
          <div className="card__label">✚ Nearby hospitals</div>
          <ul className="card__list">
            {(medical.nearby_hospitals || []).slice(0, 4).map((h, i) => (
              <li key={i}>{typeof h === 'string' ? h : h.name || JSON.stringify(h)}</li>
            ))}
            {(!medical.nearby_hospitals || medical.nearby_hospitals.length === 0) && <li className="card__muted">No hospital data returned</li>}
          </ul>
        </div>

        <div className="card card--green">
          <div className="card__label">⌂ Recommended shelter</div>
          {shelter.recommended ? (
            <>
              <div className="card__strong">{shelter.recommended}</div>
              <p className="card__muted">
                {(shelter.top_shelters || []).find(s => s.name === shelter.recommended)?.capacity
                  ? `Capacity ${shelter.top_shelters.find(s => s.name === shelter.recommended).capacity} people`
                  : 'See full shelter list'}
              </p>
            </>
          ) : <p className="card__muted">No shelter recommended</p>}
        </div>

        <div className="card card--purple">
          <div className="card__label">📦 Resources allocated</div>
          <ul className="card__list">
            {Object.entries(resource.allocated || {}).map(([k, v]) => (
              <li key={k}><span className="card__key">{k.replace(/_/g, ' ')}</span><span className="card__val">{String(v)}</span></li>
            ))}
            {Object.keys(resource.allocated || {}).length === 0 && <li className="card__muted">No allocation (not critical)</li>}
          </ul>
        </div>

        <div className="card card--orange">
          <div className="card__label">✚ Medical assistance</div>
          <p className="card__muted">{medical.first_aid_guidance || 'No guidance returned'}</p>
        </div>
      </div>

      <div className="card card--recommendation">
        <div className="card__label">📣 Citizen advisory</div>
        <p>{finalMsg.citizen_message || 'No advisory generated.'}</p>
        {finalMsg.sms_summary && <p className="card__sms">SMS: {finalMsg.sms_summary}</p>}
      </div>
    </section>
  )
}
