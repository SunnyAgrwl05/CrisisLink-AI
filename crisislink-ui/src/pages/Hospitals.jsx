import React, { useState } from 'react'
import { Building2, MapPin, Phone, Star } from 'lucide-react'

const HOSPITALS = [
  {
    id: 'h1',
    name: 'Mt. Sinai Medical Center',
    status: 'Operational',
    beds: { available: 42, total: 200 },
    icu: { available: 8, total: 30 },
    distance: '1.2 km',
    phone: '(212) 241-6500',
    specialties: ['Trauma', 'ICU', 'Burns'],
    address: '1 Gustave L. Levy Pl, New York, NY',
    rating: 5,
  },
  {
    id: 'h2',
    name: 'NYC Health + Hospitals / Bellevue',
    status: 'Operational',
    beds: { available: 18, total: 828 },
    icu: { available: 3, total: 48 },
    distance: '2.1 km',
    phone: '(212) 562-4141',
    specialties: ['Psychiatric', 'Trauma', 'Pediatrics'],
    address: '462 First Ave, New York, NY',
    rating: 4,
  },
  {
    id: 'h3',
    name: 'NewYork-Presbyterian / Weill Cornell',
    status: 'Operational',
    beds: { available: 65, total: 862 },
    icu: { available: 14, total: 60 },
    distance: '3.4 km',
    phone: '(212) 746-5454',
    specialties: ['Cardiology', 'Neurology', 'Oncology'],
    address: '525 E 68th St, New York, NY',
    rating: 5,
  },
  {
    id: 'h4',
    name: 'St. Luke\'s – Roosevelt Hospital',
    status: 'Overcrowded',
    beds: { available: 4, total: 300 },
    icu: { available: 0, total: 20 },
    distance: '0.8 km',
    phone: '(212) 523-4000',
    specialties: ['Trauma', 'Surgery'],
    address: '1000 Tenth Ave, New York, NY',
    rating: 3,
  },
  {
    id: 'h5',
    name: 'Lenox Hill Hospital',
    status: 'Operational',
    beds: { available: 31, total: 652 },
    icu: { available: 6, total: 35 },
    distance: '4.0 km',
    phone: '(212) 434-2000',
    specialties: ['Orthopedics', 'Maternity', 'ICU'],
    address: '100 E 77th St, New York, NY',
    rating: 4,
  },
  {
    id: 'h6',
    name: 'Harlem Hospital Center',
    status: 'Operational',
    beds: { available: 22, total: 257 },
    icu: { available: 5, total: 18 },
    distance: '5.1 km',
    phone: '(212) 939-1000',
    specialties: ['Trauma', 'General Medicine'],
    address: '506 Lenox Ave, New York, NY',
    rating: 3,
  },
]

const STATUS_STYLE = {
  Operational: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  Overcrowded: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  Critical:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
}

export default function Hospitals() {
  const [sortBy, setSortBy] = useState('distance')

  const sorted = [...HOSPITALS].sort((a, b) => {
    if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance)
    if (sortBy === 'beds')     return b.beds.available - a.beds.available
    if (sortBy === 'icu')      return b.icu.available - a.icu.available
    return 0
  })

  const operational = HOSPITALS.filter(h => h.status === 'Operational').length
  const totalBeds   = HOSPITALS.reduce((s, h) => s + h.beds.available, 0)
  const totalICU    = HOSPITALS.reduce((s, h) => s + h.icu.available, 0)

  return (
    <>
      <div className="hero">
        <h1 className="hero__title">
          Hospitals <span className="hero__accent">— nearby medical facilities.</span>
        </h1>
        <p className="hero__subtitle">
          Real-time bed and ICU availability for hospitals in the response area. Sorted by proximity.
        </p>
      </div>

      <div className="page-content">
        <div className="stats-strip">
          <div className="stat stat--green">
            <span className="stat__value">{operational}</span>
            <span className="stat__label">Operational</span>
          </div>
          <div className="stat stat--cyan">
            <span className="stat__value">{totalBeds}</span>
            <span className="stat__label">Beds available</span>
          </div>
          <div className="stat stat--orange">
            <span className="stat__value">{totalICU}</span>
            <span className="stat__label">ICU beds</span>
          </div>
          <div className="stat">
            <span className="stat__value">{HOSPITALS.length}</span>
            <span className="stat__label">Facilities tracked</span>
          </div>
        </div>

        <div className="panel panel--bright">
          <div className="panel__head">
            <h2 className="panel__title">Facility list</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sort by:</span>
              {['distance', 'beds', 'icu'].map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 12,
                    cursor: 'pointer',
                    background: sortBy === s ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.06)',
                    color: sortBy === s ? 'var(--cyan)' : 'var(--text-muted)',
                    transition: '.2s',
                  }}
                >
                  {s === 'beds' ? 'Beds' : s === 'icu' ? 'ICU' : 'Distance'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
            {sorted.map(h => {
              const s    = STATUS_STYLE[h.status] || STATUS_STYLE.Operational
              const bedPct = Math.round((h.beds.available / h.beds.total) * 100)
              const icuPct = Math.round((h.icu.available / h.icu.total) * 100)
              return (
                <div key={h.id} className="panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Building2 size={16} color="var(--cyan)" />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>{h.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 14, marginTop: 5 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                          <MapPin size={11} /> {h.address}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                          <Phone size={11} /> {h.phone}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13, color: 'var(--cyan)', fontWeight: 600 }}>{h.distance}</span>
                      <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: s.bg, color: s.color, fontWeight: 600 }}>
                        {h.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                        <span>General beds</span>
                        <span style={{ color: 'var(--text)' }}>{h.beds.available} / {h.beds.total}</span>
                      </div>
                      <div className="prog">
                        <div className="prog__fill" style={{
                          width: `${bedPct}%`,
                          background: bedPct > 20 ? 'var(--green)' : bedPct > 5 ? 'var(--orange)' : 'var(--red)',
                        }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                        <span>ICU beds</span>
                        <span style={{ color: 'var(--text)' }}>{h.icu.available} / {h.icu.total}</span>
                      </div>
                      <div className="prog">
                        <div className="prog__fill" style={{
                          width: `${icuPct}%`,
                          background: icuPct > 20 ? 'var(--green)' : icuPct > 5 ? 'var(--orange)' : 'var(--red)',
                        }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {h.specialties.map(sp => (
                      <span key={sp} style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 99,
                        background: 'rgba(255,255,255,0.06)',
                        color: 'var(--text-muted)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}>
                        {sp}
                      </span>
                    ))}
                    <span style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={11} fill={i < h.rating ? '#f59e0b' : 'none'} color={i < h.rating ? '#f59e0b' : 'var(--text-faint)'} />
                      ))}
                    </span>
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
