import React from 'react'
import WorkflowGraph from '../components/WorkflowGraph.jsx'
import EmergencyConsole from '../components/EmergencyConsole.jsx'
import LiveExecution from '../components/LiveExecution.jsx'
import ResultPanel from '../components/ResultPanel.jsx'

export default function Dashboard({ ORDER, running, activeIndex, elapsed, result, error, userId, setUserId, onAnalyze }) {
  return (
    <>
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
            <EmergencyConsole onAnalyze={onAnalyze} running={running} userId={userId} setUserId={setUserId} />
          </div>

          <div className="panel">
            <LiveExecution order={ORDER} activeIndex={activeIndex} elapsed={elapsed} />
          </div>

          <div className="panel">
            <ResultPanel result={result} error={error} />
          </div>
        </div>
      </div>
    </>
  )
}
