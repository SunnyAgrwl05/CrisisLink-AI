import React, { useState } from 'react'
import { Map, AlertTriangle, Flame, Droplets, Activity, Wind, Zap } from 'lucide-react'

const MARKERS = [
  { x: 34, y: 22, type: 'fire',      priority: 'CRITICAL', id: 'INC-0042', label: '5th Ave & 23rd St' },
  { x: 54, y: 38, type: 'medical',   priority: 'HIGH',     id: 'INC-0041', label: 'Central Park West' },
  { x: 22, y: 62, type: 'flood',     priority: 'HIGH',     id: 'INC-0040', label: 'Lower East Side' },
  { x: 68, y: 53, type: 'quake',     priority: 'CRITICAL', id: 'INC-0039', label: 'Downtown' },
  { x: 44, y: 74, type: 'gas',       priority: 'MEDIUM',   id: 'INC-0038', label: 'Brooklyn Bridge Rd' },
  { x: 78, y: 30, type: 'medical',   priority: 'LOW',      id: 'INC-0037', label: 'Times Square' },
]

const TYPE_COLOR = {
  fire:    '#ef4444',
  medical: '#22d3ee',
  flood:   '#3b82f6',
  quake:   '#a855f7',
  gas:     '#f59e0b',
}

const TYPE_ICON = {
  fire:    Flame,
  medical: Activity,
  flood:   Droplets,
  quake:   AlertTriangle,
  gas:     Wind,
}

const PRIORITY_RING = {
  CRITICAL: '#ef4444',
  HIGH:     '#f59e0b',
  MEDIUM:   '#22d3ee',
  LOW:      '#22c55e',
}

const LEGEND = [
  { color: '#ef4444', label: 'Fire' },
  { color: '#22d3ee', label: 'Medical' },
  { color: '#3b82f6', label: 'Flood' },
  { color: '#a855f7', label: 'Seismic' },
  { color: '#f59e0b', label: 'Gas Leak' },
]

export default function LiveMap() {
  const [hovered, setHovered] = useState(null)

  const active = MARKERS.filter(m => m.priority === 'CRITICAL' || m.priority === 'HIGH').length

  return (
    <>
      <div className="hero">
        <h1 className="hero__title">
          Live Map <span className="hero__accent">— real-time incident overlay.</span>
        </h1>
        <p className="hero__subtitle">
          Pinpoint active emergencies across the city. Markers update as incidents are reported and resolved.
        </p>
      </div>

      <div className="page-content">
        <div className="stats-strip">
          <div className="stat stat--red">
            <span className="stat__value">{MARKERS.length}</span>
            <span className="stat__label">Total incidents</span>
          </div>
          <div className="stat stat--orange">
            <span className="stat__value">{active}</span>
            <span className="stat__label">High priority</span>
          </div>
          <div className="stat stat--cyan">
            <span className="stat__value">23</span>
            <span className="stat__label">Responders deployed</span>
          </div>
          <div className="stat stat--green">
            <span className="stat__value">3</span>
            <span className="stat__label">Resolved today</span>
          </div>
        </div>

        <div className="panel panel--bright">
          <div className="panel__head">
            <h2 className="panel__title">City incident map</h2>
            <span className="panel__live"><span className="pill__dot" /> Live</span>
          </div>

          <div className="map-canvas">
            <svg viewBox="0 0 100 90" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
              {/* Background grid — city block pattern */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
                </pattern>
                {MARKERS.map(m => (
                  <radialGradient key={`grd-${m.id}`} id={`grd-${m.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={TYPE_COLOR[m.type]} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={TYPE_COLOR[m.type]} stopOpacity="0" />
                  </radialGradient>
                ))}
              </defs>

              <rect width="100" height="90" fill="#070b14" />
              <rect width="100" height="90" fill="url(#grid)" />

              {/* City roads */}
              {[20, 40, 60, 80].map(x => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="90" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
              ))}
              {[18, 36, 54, 72].map(y => (
                <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
              ))}

              {/* Incident glow areas */}
              {MARKERS.map(m => (
                <circle key={`glow-${m.id}`} cx={m.x} cy={m.y} r="9" fill={`url(#grd-${m.id})`} />
              ))}

              {/* Markers */}
              {MARKERS.map(m => (
                <g
                  key={m.id}
                  transform={`translate(${m.x},${m.y})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(m)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <circle r="3.8" fill={TYPE_COLOR[m.type]} opacity="0.25" />
                  <circle r="2.4" fill={TYPE_COLOR[m.type]} />
                  <circle r="2.4" fill="none" stroke={PRIORITY_RING[m.priority]} strokeWidth="0.8" opacity="0.9" />
                </g>
              ))}

              {/* Tooltip */}
              {hovered && (
                <g transform={`translate(${Math.min(hovered.x + 3, 72)},${Math.max(hovered.y - 14, 2)})`}>
                  <rect rx="2" ry="2" width="28" height="11" fill="rgba(10,15,26,0.94)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
                  <text x="2" y="5" fontSize="2.5" fill="#eef1f8" fontWeight="600">{hovered.id}</text>
                  <text x="2" y="9" fontSize="2.2" fill="#8b93a8">{hovered.label}</text>
                </g>
              )}
            </svg>

            {/* Legend overlay */}
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              background: 'rgba(7,9,17,0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              {LEGEND.map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#8b93a8' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incident list below map */}
        <div className="panel panel--bright">
          <h2 className="panel__title">Active incidents</h2>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Coordinates</th>
                </tr>
              </thead>
              <tbody>
                {MARKERS.map(m => {
                  const Icon = TYPE_ICON[m.type]
                  return (
                    <tr key={m.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{m.id}</td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Icon size={14} color={TYPE_COLOR[m.type]} />
                          <span style={{ textTransform: 'capitalize' }}>{m.type}</span>
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{m.label}</td>
                      <td><span className={`badge badge--${m.priority.toLowerCase()}`}>{m.priority}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
                        {m.x.toFixed(1)}°N {m.y.toFixed(1)}°W
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
