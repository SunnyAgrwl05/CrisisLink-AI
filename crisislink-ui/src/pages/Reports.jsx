import React, { useState } from 'react'
import { FileText, Download, Calendar, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const REPORTS = [
  {
    id: 'RPT-0042',
    incidentId: 'INC-0042',
    title: 'Structure Fire — 5th Ave & 23rd St',
    type: 'Incident Report',
    priority: 'CRITICAL',
    status: 'Final',
    generatedAt: '14:32, Jul 15 2026',
    analyst: 'CrisisLink AI',
    summary: 'Coordinated response to third-floor structure fire. 4 fire engines and 2 ambulances dispatched. All civilians evacuated. Fire contained at 14:58.',
    agents: ['SOS Agent', 'Damage Agent', 'Priority Agent', 'Resource Agent', 'Communication Agent'],
    pages: 4,
  },
  {
    id: 'RPT-0041',
    incidentId: 'INC-0041',
    title: 'Multi-Vehicle Collision — Central Park West',
    type: 'Incident Report',
    priority: 'HIGH',
    status: 'Final',
    generatedAt: '13:55, Jul 15 2026',
    analyst: 'CrisisLink AI',
    summary: '3-vehicle collision, 5 casualties. 2 ambulances deployed. Patients transferred to Mt. Sinai ER within 12 minutes of report.',
    agents: ['SOS Agent', 'Priority Agent', 'Medical Agent', 'Communication Agent'],
    pages: 3,
  },
  {
    id: 'RPT-0040',
    incidentId: 'INC-0040',
    title: 'Residential Flooding — Lower East Side',
    type: 'Incident Report',
    priority: 'HIGH',
    status: 'In Progress',
    generatedAt: '13:48, Jul 15 2026',
    analyst: 'CrisisLink AI',
    summary: 'Basement flooding affecting 12 units. Shelter assignments made for 34 displaced residents. Water tankers and pumping crew dispatched.',
    agents: ['SOS Agent', 'Damage Agent', 'Priority Agent', 'Resource Agent', 'Shelter Agent', 'Communication Agent'],
    pages: 5,
  },
  {
    id: 'RPT-0039',
    incidentId: 'INC-0039',
    title: 'Seismic Event — Downtown Manhattan',
    type: 'Post-Incident Analysis',
    priority: 'CRITICAL',
    status: 'Final',
    generatedAt: '12:15, Jul 15 2026',
    analyst: 'CrisisLink AI',
    summary: 'Magnitude 4.1 event. Structural assessment completed for 18 buildings. 12 responders coordinated. No casualties reported. All-clear issued at 13:02.',
    agents: ['SOS Agent', 'Damage Agent', 'Priority Agent', 'Security Checkpoint', 'Human Approval', 'Communication Agent'],
    pages: 8,
  },
  {
    id: 'RPT-0038',
    incidentId: 'INC-0038',
    title: 'Gas Leak — Brooklyn Bridge Rd',
    type: 'Incident Report',
    priority: 'MEDIUM',
    status: 'Pending Dispatch',
    generatedAt: '14:01, Jul 15 2026',
    analyst: 'CrisisLink AI',
    summary: 'Suspected gas leak at pipeline junction. Evacuation advisory issued for a 100m radius. Awaiting utility crew dispatch confirmation.',
    agents: ['SOS Agent', 'Priority Agent', 'Resource Agent', 'Communication Agent'],
    pages: 2,
  },
  {
    id: 'SUM-0001',
    incidentId: null,
    title: 'Daily Operations Summary — Jul 15 2026',
    type: 'Daily Summary',
    priority: null,
    status: 'Final',
    generatedAt: '00:05, Jul 15 2026',
    analyst: 'CrisisLink AI',
    summary: 'Automated daily summary covering 6 incidents, 23 responders deployed, 3 resolved. Average AI response time: 4.3 s.',
    agents: ['Orchestrator'],
    pages: 2,
  },
]

const STATUS_STYLE = {
  Final:             { color: '#22c55e', icon: CheckCircle },
  'In Progress':     { color: '#22d3ee', icon: Clock },
  'Pending Dispatch':{ color: '#f59e0b', icon: Clock },
}

const TYPE_COLOR = {
  'Incident Report':       '#3b82f6',
  'Post-Incident Analysis':'#a855f7',
  'Daily Summary':         '#22c55e',
}

export default function Reports() {
  const [search, setSearch] = useState('')

  const filtered = REPORTS.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  )

  const finals = REPORTS.filter(r => r.status === 'Final').length
  const total  = REPORTS.length

  return (
    <>
      <div className="hero">
        <h1 className="hero__title">
          Reports <span className="hero__accent">— AI-generated incident summaries.</span>
        </h1>
        <p className="hero__subtitle">
          Every emergency processed by CrisisLink AI generates a structured report for review and archiving.
        </p>
      </div>

      <div className="page-content">
        <div className="stats-strip">
          <div className="stat">
            <span className="stat__value">{total}</span>
            <span className="stat__label">Total reports</span>
          </div>
          <div className="stat stat--green">
            <span className="stat__value">{finals}</span>
            <span className="stat__label">Finalised</span>
          </div>
          <div className="stat stat--cyan">
            <span className="stat__value">{REPORTS.filter(r => r.status === 'In Progress').length}</span>
            <span className="stat__label">In progress</span>
          </div>
          <div className="stat stat--orange">
            <span className="stat__value">{REPORTS.filter(r => r.status === 'Pending Dispatch').length}</span>
            <span className="stat__label">Pending</span>
          </div>
        </div>

        <div className="panel panel--bright">
          <div className="panel__head">
            <h2 className="panel__title">Report archive</h2>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reports…"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '6px 12px',
                color: 'var(--text)',
                fontSize: 13,
                outline: 'none',
                width: 200,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(rep => {
              const ss    = STATUS_STYLE[rep.status] || STATUS_STYLE['In Progress']
              const SIcon = ss.icon
              return (
                <div key={rep.id} className="panel" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <FileText size={15} color={TYPE_COLOR[rep.type] || 'var(--cyan)'} />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>{rep.title}</span>
                        {rep.priority && (
                          <span className={`badge badge--${rep.priority.toLowerCase()}`}>{rep.priority}</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan)' }}>{rep.id}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                          <Calendar size={11} /> {rep.generatedAt}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                          <User size={11} /> {rep.analyst}
                        </span>
                        <span style={{
                          fontSize: 11,
                          padding: '1px 7px',
                          borderRadius: 99,
                          background: `${TYPE_COLOR[rep.type]}18`,
                          color: TYPE_COLOR[rep.type],
                          border: `1px solid ${TYPE_COLOR[rep.type]}40`,
                        }}>
                          {rep.type}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: ss.color }}>
                        <SIcon size={13} />
                        {rep.status}
                      </div>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 14px',
                        borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text)',
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: '.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.1)'; e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.color = 'var(--cyan)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text)' }}
                      >
                        <Download size={13} /> Download PDF
                      </button>
                    </div>
                  </div>

                  <p style={{ margin: '12px 0 8px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {rep.summary}
                  </p>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>Agents:</span>
                    {rep.agents.map(a => (
                      <span key={a} style={{
                        fontSize: 11,
                        padding: '2px 7px',
                        borderRadius: 99,
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-faint)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}>
                        {a}
                      </span>
                    ))}
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-faint)' }}>{rep.pages} pages</span>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                No reports match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
