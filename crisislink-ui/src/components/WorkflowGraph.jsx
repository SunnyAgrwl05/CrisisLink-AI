import React from 'react'

// Mirrors crisislink_ai/agent.py exactly:
// START -> orchestrator -> (sos_agent, damage_agent) -> join -> priority_agent
// -> (resource_agent, shelter_agent, medical_agent) -> join -> security_checkpoint
// -> human_approval_agent -> communication_agent -> END
export const NODES = [
  { id: 'orchestrator', label: 'Orchestrator', sub: 'Task Coordinator', icon: '◎', row: 1, col: 2, tone: 'green' },
  { id: 'sos_agent', label: 'SOS Agent', sub: 'Verification', icon: '📡', row: 2, col: 1, tone: 'green' },
  { id: 'damage_agent', label: 'Damage Agent', sub: 'Assessment', icon: '📈', row: 2, col: 2, tone: 'green' },
  { id: 'triage_advisor', label: 'Triage Advisor', sub: 'Suggestion', icon: '🧭', row: 2, col: 3, tone: 'grey' },
  { id: 'priority_agent', label: 'Priority Agent', sub: 'Risk Evaluation', icon: '★', row: 3, col: 2, tone: 'green' },
  { id: 'resource_agent', label: 'Resource Agent', sub: 'Allocation', icon: '📦', row: 4, col: 1, tone: 'purple' },
  { id: 'shelter_agent', label: 'Shelter Agent', sub: 'Management', icon: '⌂', row: 4, col: 2, tone: 'blue' },
  { id: 'medical_agent', label: 'Medical Agent', sub: 'Assistance', icon: '✚', row: 4, col: 3, tone: 'orange' },
  { id: 'security_checkpoint', label: 'Security Agent', sub: 'Safety Check', icon: '🛡', row: 5, col: 2, tone: 'yellow' },
  { id: 'human_approval_agent', label: 'Human Approval', sub: 'Dispatcher Sign-off', icon: '🖐', row: 6, col: 2, tone: 'red' },
  { id: 'communication_agent', label: 'Communication Agent', sub: 'Public Advisory', icon: '📣', row: 7, col: 2, tone: 'cyan' },
]

// Simple edges used only to draw connecting lines between grid cells.
const EDGES = [
  ['orchestrator', 'sos_agent'], ['orchestrator', 'damage_agent'], ['orchestrator', 'triage_advisor'],
  ['sos_agent', 'priority_agent'], ['damage_agent', 'priority_agent'],
  ['priority_agent', 'resource_agent'], ['priority_agent', 'shelter_agent'], ['priority_agent', 'medical_agent'],
  ['resource_agent', 'security_checkpoint'], ['shelter_agent', 'security_checkpoint'], ['medical_agent', 'security_checkpoint'],
  ['security_checkpoint', 'human_approval_agent'],
  ['human_approval_agent', 'communication_agent'],
]

function statusOf(nodeId, activeIndex, order) {
  const pos = order.indexOf(nodeId)
  if (pos === -1) return 'idle'
  if (pos < activeIndex) return 'done'
  if (pos === activeIndex) return 'running'
  return 'pending'
}

export default function WorkflowGraph({ order, activeIndex, running }) {
  return (
    <div className="graph">
      <div className="graph__node graph__node--endpoint" style={{ gridRow: 0, gridColumn: 2 }}>START</div>
      <svg className="graph__lines" aria-hidden="true">
        {EDGES.map(([a, b], i) => {
          const na = NODES.find(n => n.id === a)
          const nb = NODES.find(n => n.id === b)
          const x1 = na.col * 130 - 65, y1 = na.row * 92 + 20
          const x2 = nb.col * 130 - 65, y2 = nb.row * 92 - 6
          const done = statusOf(a, activeIndex, order) === 'done' || statusOf(a, activeIndex, order) === 'running'
          return (
            <path
              key={i}
              d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`}
              className={`graph__edge ${done ? 'graph__edge--active' : ''}`}
            />
          )
        })}
      </svg>

      {NODES.map(node => {
        const status = statusOf(node.id, activeIndex, order)
        return (
          <div
            key={node.id}
            className={`graph__node graph__node--${node.tone} graph__node--${status}`}
            style={{ gridRow: node.row, gridColumn: node.col }}
          >
            <span className="graph__node-icon">{node.icon}</span>
            <span className="graph__node-label">{node.label}</span>
            <span className="graph__node-sub">{node.sub}</span>
            <span className="graph__node-status">
              {status === 'done' && '✓'}
              {status === 'running' && <span className="spinner" />}
              {status === 'pending' && '·'}
            </span>
          </div>
        )
      })}

      <div className="graph__node graph__node--endpoint" style={{ gridRow: 8, gridColumn: 2 }}>
        {!running && activeIndex >= order.length ? 'END' : 'END'}
      </div>
    </div>
  )
}
