import React from 'react'

export default function StatusBar({ backendOnline, activeIncidents }) {
  return (
    <footer className="statusbar">
      <span className="statusbar__item">
        <span className={`pill__dot ${backendOnline ? '' : 'pill__dot--off'}`} />
        System status: {backendOnline ? 'All systems operational' : 'Backend unreachable'}
      </span>
      <span className="statusbar__item">⚠ Active incidents: {activeIncidents}</span>
      <span className="statusbar__item">Data source: Live API</span>
    </footer>
  )
}
