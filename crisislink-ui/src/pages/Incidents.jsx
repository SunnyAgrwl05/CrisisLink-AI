import React, { useState } from 'react'
import { Flame, Activity, Droplets, AlertTriangle, Wind, Clock, Users } from 'lucide-react'

const INCIDENTS = [
  { id: 'INC-0042', type: 'Fire',       location: '5th Ave & 23rd St',    priority: 'CRITICAL', status: 'Active',   time: '2 min ago',  responders: 4,  description: 'Structure fire on the 3rd floor, civilians reported trapped.' },
  { id: 'INC-0041', type: 'Medical',    location: 'Central Park West',     priority: 'HIGH',     status: 'Active',   time: '8 min ago',  responders: 2,  description: 'Multiple casualties reported after a vehicle collision.' },
  { id: 'INC-0040', type: 'Flood',      location: 'Lower East Side',       priority: 'HIGH',     status: 'Active',   time: '15 min ago', responders: 6,  description: 'Basement flooding affecting 12 residential units.' },
  { id: 'INC-0039', type: 'Earthquake', location: 'Downtown',              priority: 'CRITICAL', status: 'Resolved', time: '1 hr ago',   responders: 12, description: 'Magnitude 4.1 tremor caused minor structural damage.' },
  { id: 'INC-0038', type: 'Gas Leak',   location: 'Brooklyn Bridge Rd',    priority: 'MEDIUM',   status: 'Pending',  time: '22 min ago', responders: 0,  description: 'Gas odour reported by residents near the pipeline junction.' },
  { id: 'INC-0037', type: 'Medical',    location: 'Times Square',          priority: 'LOW',      status: 'Resolved', time: '2 hr ago',   responders: 1,  description: 'Individual collapsed; treated on-site by paramedics.' },
  { id: 'INC-0036', type: 'Fire',       location: 'Queens Blvd & 74th St', priority: 'HIGH',     status: 'Active',   time: '31 min ago', responders: 3,  description: 'Vehicle fire spreading to nearby parked cars.' },
  { id: 'INC-0035', type: 'Flood',      location: 'Bronx River Pkwy',      priority: 'MEDIUM',   status: 'Resolved', time: '3 hr ago',   responders: 4,  description: 'Road flooding cleared after storm drain unblocked.' },
]

const TYPE_ICON = { Fire: Flame, Medical: Activity, Flood: Droplets, Earthquake: AlertTriangle, 'Gas Leak': Wind }
const TYPE_COLOR = { Fire: '#ef4444', Medical: '#22d3ee', Flood: '#3b82f6', Earthquake: '#a855f7', 'Gas Leak': '#f59e0b' }
const STATUS_COLOR = { Active: '#22c55e', Resolved: '#565f76', Pending: '#f59e0b' }

const TABS = ['All', 'Active', 'Pending', 'Resolved']

export default function Incidents() {
  const [activeTab, setActiveTab] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const filtered = activeTab === 'All' ? INCIDENTS : INCIDENTS.filter(i => i.status === activeTab)

  const counts = {
    All:      INCIDENTS.length,
    Active:   INCIDENTS.filter(i => i.status === 'Active').length,
    Pending:  INCIDENTS.filter(i => i.status === 'Pending').length,
    Resolved: INCIDENTS.filter(i => i.status === 'Resolved').length,
  }

  return (
    <>
      <div className="hero">
        <h1 className="hero__title">
          Incidents <span className="hero__accent">— track every emergency.</span>
        </h1>
        <p className="hero__subtitle">
          Monitor, filter, and drill into active and historical incidents managed by CrisisLink AI.
        </p>
      </div>

      <div className="page-content">
        <div className="stats-strip">
          <div className="stat stat--red">
            <span className="stat__value">{counts.Active}</span>
            <span className="stat__label">Active</span>
          </div>
          <div className="stat stat--orange">
            <span className="stat__value">{counts.Pending}</span>
            <span className="stat__label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat__value">{counts.Resolved}</span>
            <span className="stat__label">Resolved today</span>
          </div>
          <div className="stat stat--cyan">
            <span className="stat__value">{INCIDENTS.filter(i => i.priority === 'CRITICAL').length}</span>
            <span className="stat__label">Critical priority</span>
          </div>
        </div>

        <div className="panel panel--bright">
          <div className="panel__head">
            <h2 className="panel__title">Incident log</h2>
            <span className="panel__live"><span className="pill__dot" /> Live</span>
          </div>

          <div className="tabs">
            {TABS.map(t => (
              <button
                key={t}
                className={`tab ${activeTab === t ? 'tab--active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
                <span style={{
                  marginLeft: 6,
                  fontSize: 11,
                  padding: '1px 6px',
                  borderRadius: 99,
                  background: activeTab === t ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.07)',
                  color: activeTab === t ? 'var(--cyan)' : 'var(--text-faint)',
                }}>
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Responders</th>
                  <th>Reported</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inc => {
                  const Icon = TYPE_ICON[inc.type] || AlertTriangle
                  const isExpanded = expanded === inc.id
                  return (
                    <React.Fragment key={inc.id}>
                      <tr
                        onClick={() => setExpanded(isExpanded ? null : inc.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--cyan)' }}>{inc.id}</td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <Icon size={14} color={TYPE_COLOR[inc.type]} />
                            {inc.type}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{inc.location}</td>
                        <td><span className={`badge badge--${inc.priority.toLowerCase()}`}>{inc.priority}</span></td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[inc.status], display: 'inline-block' }} />
                            {inc.status}
                          </span>
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                            <Users size={13} color="var(--text-muted)" />
                            {inc.responders}
                          </span>
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
                            <Clock size={12} />
                            {inc.time}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} style={{
                            background: 'rgba(34,211,238,0.04)',
                            borderLeft: '2px solid var(--cyan)',
                            padding: '12px 18px',
                            fontSize: 13,
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                          }}>
                            {inc.description}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
