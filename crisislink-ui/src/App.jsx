import React, { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Navbar from './components/Navbar.jsx'
import WorkflowGraph from './components/WorkflowGraph.jsx'
import EmergencyConsole from './components/EmergencyConsole.jsx'
import LiveExecution from './components/LiveExecution.jsx'
import ResultPanel from './components/ResultPanel.jsx'
import StatusBar from './components/StatusBar.jsx'
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

    // Step the visual timeline forward while the real request is in flight.
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
        <div className="hero">
          <h1 className="hero__title">
            Every second counts. <span className="hero__accent">Let AI coordinate the response.</span>
          </h1>
          <p className="hero__subtitle">
            Describe an emergency below and watch ten specialized agents verify, prioritize, and route help — live.
          </p>
        </div>

        <div className="dashboard">
          <div className="dashboard__col dashboard__col--graph">
            <div className="panel panel--bright">
              <div className="panel__head">
                <h2 className="panel__title">AI agent workflow</h2>
                <span className="panel__live"><span className="pill__dot" /> Live</span>
              </div>
              <WorkflowGraph order={ORDER} activeIndex={activeIndex} running={running} />
            </div>
          </div>

          <div className="dashboard__col dashboard__col--side">
            <div className="panel panel--bright panel--glow">
              <h2 className="panel__title">Emergency console</h2>
              <EmergencyConsole onAnalyze={handleAnalyze} running={running} userId={userId} setUserId={setUserId} />
            </div>

            <div className="panel">
              <LiveExecution order={ORDER} activeIndex={activeIndex} elapsed={elapsed} />
            </div>

            <div className="panel">
              <ResultPanel result={result} error={error} />
            </div>
          </div>
        </div>

        <StatusBar backendOnline={backendOnline} activeIncidents={incidentCount} />
      </div>
    </div>
  )
}
