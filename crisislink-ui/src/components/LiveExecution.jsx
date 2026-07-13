import React from 'react'
import { NODES } from './WorkflowGraph.jsx'

const STEP_TEXT = {
  orchestrator: 'Extracting key information & initializing agents…',
  sos_agent: 'Verifying emergency and location…',
  damage_agent: 'Assessing severity and impact…',
  priority_agent: 'Calculating priority level…',
  resource_agent: 'Allocating required resources…',
  shelter_agent: 'Searching nearest shelters…',
  medical_agent: 'Identifying medical requirements…',
  security_checkpoint: 'Checking safety and PII risks…',
  human_approval_agent: 'Awaiting dispatcher sign-off…',
  communication_agent: 'Generating public advisory…',
}

export default function LiveExecution({ order, activeIndex, elapsed }) {
  const visibleNodes = order.map(id => NODES.find(n => n.id === id)).filter(Boolean)
  const progress = Math.min(100, Math.round((activeIndex / order.length) * 100))

  return (
    <section className="live">
      <h3 className="panel__title">Live agent execution</h3>
      <div className="live__list">
        {visibleNodes.map((node, i) => {
          const status = i < activeIndex ? 'done' : i === activeIndex ? 'running' : 'pending'
          return (
            <div key={node.id} className={`live__row live__row--${status}`}>
              <span className="live__icon">{node.icon}</span>
              <div className="live__text">
                <span className="live__name">{node.label}</span>
                <span className="live__desc">{status === 'pending' ? 'Waiting…' : STEP_TEXT[node.id]}</span>
              </div>
              <span className="live__time">{status !== 'pending' ? `${elapsed[node.id] || ''}` : ''}</span>
              <span className="live__mark">
                {status === 'done' && '✓'}
                {status === 'running' && <span className="spinner" />}
                {status === 'pending' && '›'}
              </span>
            </div>
          )
        })}
      </div>
      <div className="live__progress">
        <div className="live__progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <span className="live__progress-label">{progress}%</span>
    </section>
  )
}


