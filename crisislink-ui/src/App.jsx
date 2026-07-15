import React, { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Navbar from './components/Navbar.jsx'
import StatusBar from './components/StatusBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LiveMap from './pages/LiveMap.jsx'
import Incidents from './pages/Incidents.jsx'
import AIAgents from './pages/AIAgents.jsx'
import Resources from './pages/Resources.jsx'
import Hospitals from './pages/Hospitals.jsx'
import Shelters from './pages/Shelters.jsx'
import Reports from './pages/Reports.jsx'
import { checkBackendHealth, submitEmergency } from './api.js'

const ORDER = [
  'orchestrator', 'sos_agent', 'damage_agent', 'priority_agent',
  'resource_agent', 'shelter_agent', 'medical_agent',
  'security_checkpoint', 'human_approval_agent', 'communication_agent',
]

export default function App() {
  const isMobile = () => window.innerWidth <= 1080;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [backendOnline, setBackendOnline] = useState(false)
  const [userId, setUserId] = useState('sunny')
  const [running, setRunning] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [elapsed, setElapsed] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [incidentCount, setIncidentCount] = useState(0)
  const timerRef = useRef(null)
  const startRef = useRef(0)

  useEffect(() => {
    checkBackendHealth().then(r => setBackendOnline(r.online))
    const poll = setInterval(() => checkBackendHealth().then(r => setBackendOnline(r.online)), 30000)
    return () => clearInterval(poll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (!isMobile()) {
        setCollapsed(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function handleAnalyze(text) {
    setRunning(true)
    setError(null)
    setResult(null)
    setActiveIndex(0)
    setElapsed({})
    startRef.current = Date.now()

    timerRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = Math.min(prev + 1, ORDER.length - 1)
        setElapsed(e => ({ ...e, [ORDER[next - 1] || ORDER[0]]: `${((Date.now() - startRef.current) / 1000).toFixed(1)}s` }))
        return next
      })
    }, 900)

    try {
      const data = await submitEmergency(text, userId)
      clearInterval(timerRef.current)
      setActiveIndex(ORDER.length)
      setResult(data)
      setIncidentCount(c => c + 1)
    } catch (e) {
      clearInterval(timerRef.current)
      setError(e.message || 'Request failed')
    } finally {
      setRunning(false)
    }
  }

  function renderCurrentPage() {
    switch (currentPage) {
      case 'map':       return <LiveMap />
      case 'incidents': return <Incidents />
      case 'agents':    return <AIAgents />
      case 'resources': return <Resources />
      case 'hospitals': return <Hospitals />
      case 'shelters':  return <Shelters />
      case 'reports':   return <Reports />
      default:          return (
        <Dashboard
          ORDER={ORDER}
          running={running}
          activeIndex={activeIndex}
          elapsed={elapsed}
          result={result}
          error={error}
          userId={userId}
          setUserId={setUserId}
          onAnalyze={handleAnalyze}
        />
      )
    }
  }

  return (
    <div className="app">
      <>
        {mobileOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <Sidebar
          collapsed={isMobile() ? !mobileOpen : collapsed}
          onToggle={() => {
            if (isMobile()) {
              setMobileOpen(prev => !prev);
            } else {
              setCollapsed(prev => !prev);
            }
          }}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </>
      <div className="app__main">
        <Navbar
          backendOnline={backendOnline}
          userId={userId}
          onMenuClick={() => {
            if (isMobile()) {
              setMobileOpen(!mobileOpen);
            } else {
              setCollapsed(!collapsed);
            }
          }}
        />
        {renderCurrentPage()}
        <StatusBar backendOnline={backendOnline} activeIncidents={incidentCount} />
      </div>
    </div>
  )
}
