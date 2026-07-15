import React, { useState } from 'react'
import { House, MapPin, Users, Utensils, Droplets, HeartPulse, Wifi } from 'lucide-react'

const SHELTERS = [
  {
    id: 's1',
    name: 'Jefferson Community High School',
    capacity: 500,
    occupied: 287,
    status: 'Open',
    address: '153 Jefferson Ave, Brooklyn, NY',
    distance: '0.9 km',
    resources: ['Food', 'Water', 'Medical', 'WiFi'],
    manager: 'FEMA District 2',
    opened: '2 hr ago',
  },
  {
    id: 's2',
    name: 'Riverside Community Center',
    capacity: 250,
    occupied: 241,
    status: 'Near Capacity',
    address: '50 Riverside Dr, New York, NY',
    distance: '1.4 km',
    resources: ['Food', 'Water'],
    manager: 'NYC OEM',
    opened: '3 hr ago',
  },
  {
    id: 's3',
    name: 'St. Anthony\'s Church Hall',
    capacity: 120,
    occupied: 43,
    status: 'Open',
    address: '862 Manhattan Ave, Brooklyn, NY',
    distance: '2.0 km',
    resources: ['Food', 'Water', 'Medical'],
    manager: 'Red Cross',
    opened: '5 hr ago',
  },
  {
    id: 's4',
    name: 'Marcus Garvey Village Rec Center',
    capacity: 400,
    occupied: 0,
    status: 'Standby',
    address: '1 Marcus Garvey Blvd, Brooklyn, NY',
    distance: '3.1 km',
    resources: ['Water', 'Medical'],
    manager: 'NYC Parks',
    opened: '—',
  },
  {
    id: 's5',
    name: 'Lower East Side Boys & Girls Club',
    capacity: 180,
    occupied: 180,
    status: 'Full',
    address: '111 Eldridge St, New York, NY',
    distance: '1.7 km',
    resources: ['Food', 'Water', 'WiFi'],
    manager: 'FEMA District 2',
    opened: '1 hr ago',
  },
  {
    id: 's6',
    name: 'Metropolitan Baptist Church',
    capacity: 300,
    occupied: 88,
    status: 'Open',
    address: '151 W 128th St, New York, NY',
    distance: '4.3 km',
    resources: ['Food', 'Water', 'Medical', 'WiFi'],
    manager: 'Red Cross',
    opened: '4 hr ago',
  },
]

const RESOURCE_ICON = { Food: Utensils, Water: Droplets, Medical: HeartPulse, WiFi: Wifi }

const STATUS_STYLE = {
  Open:          { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  'Near Capacity': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Full:          { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  Standby:       { color: '#8b93a8', bg: 'rgba(139,147,168,0.1)' },
}

export default function Shelters() {
  const [filterStatus, setFilterStatus] = useState('All')

  const statuses = ['All', 'Open', 'Near Capacity', 'Full', 'Standby']
  const filtered = filterStatus === 'All' ? SHELTERS : SHELTERS.filter(s => s.status === filterStatus)

  const open        = SHELTERS.filter(s => s.status === 'Open').length
  const totalCap    = SHELTERS.reduce((acc, s) => acc + s.capacity, 0)
  const totalOccup  = SHELTERS.reduce((acc, s) => acc + s.occupied, 0)
  const availSpaces = totalCap - totalOccup

  return (
    <>
      <div className="hero">
        <h1 className="hero__title">
          Shelters <span className="hero__accent">— safe havens for displaced citizens.</span>
        </h1>
        <p className="hero__subtitle">
          Live occupancy tracking across all designated emergency shelters in the response zone.
        </p>
      </div>

      <div className="page-content">
        <div className="stats-strip">
          <div className="stat stat--green">
            <span className="stat__value">{open}</span>
            <span className="stat__label">Shelters open</span>
          </div>
          <div className="stat stat--cyan">
            <span className="stat__value">{availSpaces}</span>
            <span className="stat__label">Spaces available</span>
          </div>
          <div className="stat">
            <span className="stat__value">{totalOccup}</span>
            <span className="stat__label">People housed</span>
          </div>
          <div className="stat">
            <span className="stat__value">{SHELTERS.length}</span>
            <span className="stat__label">Facilities total</span>
          </div>
        </div>

        <div className="panel panel--bright">
          <div className="panel__head">
            <h2 className="panel__title">Shelter directory</h2>
            <span className="panel__live"><span className="pill__dot" /> Live</span>
          </div>

          <div className="tabs">
            {statuses.map(s => (
              <button
                key={s}
                className={`tab ${filterStatus === s ? 'tab--active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(shelter => {
              const pct = Math.round((shelter.occupied / shelter.capacity) * 100)
              const s   = STATUS_STYLE[shelter.status]
              return (
                <div key={shelter.id} className="panel" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <House size={15} color="var(--green)" />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>{shelter.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 14, marginTop: 5 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                          <MapPin size={11} /> {shelter.address}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                          Manager: {shelter.manager}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--cyan)', fontWeight: 600 }}>{shelter.distance}</span>
                      <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: s.bg, color: s.color, fontWeight: 600 }}>
                        {shelter.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users size={12} /> Occupancy
                      </span>
                      <span style={{ color: 'var(--text)' }}>
                        {shelter.occupied} / {shelter.capacity} people ({pct}%)
                      </span>
                    </div>
                    <div className="prog">
                      <div className="prog__fill" style={{
                        width: `${pct}%`,
                        background: pct < 70 ? 'var(--green)' : pct < 90 ? 'var(--orange)' : 'var(--red)',
                      }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    {shelter.resources.map(res => {
                      const Icon = RESOURCE_ICON[res]
                      return (
                        <span key={res} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 11,
                          padding: '3px 9px',
                          borderRadius: 99,
                          background: 'rgba(255,255,255,0.06)',
                          color: 'var(--text-muted)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                          {Icon && <Icon size={11} />} {res}
                        </span>
                      )
                    })}
                    {shelter.opened !== '—' && (
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-faint)' }}>
                        Opened {shelter.opened}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
