import React from 'react'
import { Truck, Flame, Shield, Package, Zap, Droplets, Radio, HeartPulse } from 'lucide-react'

const RESOURCES = [
  { id: 'ambulances',    label: 'Ambulances',         icon: HeartPulse, color: '#22d3ee', available: 8,   total: 12,  unit: 'vehicles',  status: 'Sufficient' },
  { id: 'fire_engines',  label: 'Fire Engines',        icon: Flame,      color: '#ef4444', available: 5,   total: 7,   unit: 'vehicles',  status: 'Sufficient' },
  { id: 'police_units',  label: 'Police Units',        icon: Shield,     color: '#3b82f6', available: 14,  total: 20,  unit: 'units',     status: 'Sufficient' },
  { id: 'rescue_teams',  label: 'Search & Rescue',     icon: Truck,      color: '#a855f7', available: 3,   total: 6,   unit: 'teams',     status: 'Low' },
  { id: 'med_kits',      label: 'Medical Kits',        icon: Package,    color: '#22c55e', available: 47,  total: 60,  unit: 'kits',      status: 'Sufficient' },
  { id: 'generators',    label: 'Portable Generators', icon: Zap,        color: '#f59e0b', available: 2,   total: 8,   unit: 'units',     status: 'Critical' },
  { id: 'water_tanks',   label: 'Water Tankers',       icon: Droplets,   color: '#3b82f6', available: 4,   total: 5,   unit: 'trucks',    status: 'Sufficient' },
  { id: 'comm_units',    label: 'Comms Equipment',     icon: Radio,      color: '#a855f7', available: 18,  total: 24,  unit: 'radios',    status: 'Sufficient' },
]

const STATUS_STYLE = {
  Sufficient: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  Low:        { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Critical:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
}

const FILL_COLOR = {
  Sufficient: 'var(--green)',
  Low:        'var(--orange)',
  Critical:   'var(--red)',
}

export default function Resources() {
  const sufficient = RESOURCES.filter(r => r.status === 'Sufficient').length
  const low        = RESOURCES.filter(r => r.status === 'Low').length
  const critical   = RESOURCES.filter(r => r.status === 'Critical').length
  const totalAvail = RESOURCES.reduce((s, r) => s + r.available, 0)

  return (
    <>
      <div className="hero">
        <h1 className="hero__title">
          Resources <span className="hero__accent">— live inventory.</span>
        </h1>
        <p className="hero__subtitle">
          Track availability of vehicles, equipment, and personnel across all active emergency operations.
        </p>
      </div>

      <div className="page-content">
        <div className="stats-strip">
          <div className="stat stat--green">
            <span className="stat__value">{sufficient}</span>
            <span className="stat__label">Sufficient</span>
          </div>
          <div className="stat stat--orange">
            <span className="stat__value">{low}</span>
            <span className="stat__label">Low stock</span>
          </div>
          <div className="stat stat--red">
            <span className="stat__value">{critical}</span>
            <span className="stat__label">Critical</span>
          </div>
          <div className="stat stat--cyan">
            <span className="stat__value">{totalAvail}</span>
            <span className="stat__label">Units available</span>
          </div>
        </div>

        <div className="panel panel--bright">
          <div className="panel__head">
            <h2 className="panel__title">Resource inventory</h2>
            <span className="panel__live"><span className="pill__dot" /> Live</span>
          </div>

          <div className="agent-grid">
            {RESOURCES.map(res => {
              const Icon = res.icon
              const pct  = Math.round((res.available / res.total) * 100)
              const s    = STATUS_STYLE[res.status]
              return (
                <div key={res.id} className="agent-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: `${res.color}18`,
                        border: `1px solid ${res.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon size={18} color={res.color} />
                      </div>
                      <span className="agent-card__name">{res.label}</span>
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: s.bg,
                      color: s.color,
                    }}>
                      {res.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>
                      {res.available}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>/ {res.total} {res.unit}</span>
                  </div>

                  <div className="prog">
                    <div
                      className="prog__fill"
                      style={{
                        width: `${pct}%`,
                        background: FILL_COLOR[res.status],
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right' }}>{pct}% available</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
