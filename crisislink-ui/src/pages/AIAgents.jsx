import React from 'react'
import { Bot, Cpu, Shield, Package, House, Stethoscope, Radio, UserCheck, AlertTriangle, Zap } from 'lucide-react'

const AGENTS = [
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    icon: Zap,
    color: '#22d3ee',
    status: 'Online',
    role: 'Master coordinator that manages the full multi-agent response pipeline and routes tasks between agents.',
    tasksToday: 42,
    avgTime: '0.3s',
  },
  {
    id: 'sos_agent',
    name: 'SOS Agent',
    icon: AlertTriangle,
    color: '#ef4444',
    status: 'Online',
    role: 'Receives and validates incoming emergency reports. Extracts structured data from free-text descriptions.',
    tasksToday: 42,
    avgTime: '0.8s',
  },
  {
    id: 'damage_agent',
    name: 'Damage Agent',
    icon: Cpu,
    color: '#f59e0b',
    status: 'Online',
    role: 'Assesses structural and environmental damage by analysing incident descriptions and geographic context.',
    tasksToday: 38,
    avgTime: '1.1s',
  },
  {
    id: 'priority_agent',
    name: 'Priority Agent',
    icon: Shield,
    color: '#a855f7',
    status: 'Online',
    role: 'Scores each incident 0–100 and assigns a priority label (CRITICAL / HIGH / MEDIUM / LOW).',
    tasksToday: 38,
    avgTime: '0.6s',
  },
  {
    id: 'resource_agent',
    name: 'Resource Agent',
    icon: Package,
    color: '#3b82f6',
    status: 'Online',
    role: 'Calculates required resources (ambulances, fire engines, personnel) and checks live availability.',
    tasksToday: 31,
    avgTime: '0.9s',
  },
  {
    id: 'shelter_agent',
    name: 'Shelter Agent',
    icon: House,
    color: '#22c55e',
    status: 'Online',
    role: 'Identifies and recommends the nearest shelters with sufficient capacity for displaced citizens.',
    tasksToday: 24,
    avgTime: '0.7s',
  },
  {
    id: 'medical_agent',
    name: 'Medical Agent',
    icon: Stethoscope,
    color: '#22d3ee',
    status: 'Online',
    role: 'Locates nearby hospitals, checks bed availability, and provides first-aid guidance for responders.',
    tasksToday: 29,
    avgTime: '1.2s',
  },
  {
    id: 'security_checkpoint',
    name: 'Security Checkpoint',
    icon: Shield,
    color: '#ef4444',
    status: 'Online',
    role: 'Validates all agent outputs for anomalies and ensures the response plan meets safety protocols.',
    tasksToday: 38,
    avgTime: '0.4s',
  },
  {
    id: 'human_approval_agent',
    name: 'Human Approval',
    icon: UserCheck,
    color: '#f59e0b',
    status: 'Standby',
    role: 'Routes high-stakes decisions to a human dispatcher for final approval before resource dispatch.',
    tasksToday: 7,
    avgTime: '—',
  },
  {
    id: 'communication_agent',
    name: 'Communication Agent',
    icon: Radio,
    color: '#a855f7',
    status: 'Online',
    role: 'Composes citizen advisories, SMS alerts, and dispatcher briefings from the consolidated plan.',
    tasksToday: 38,
    avgTime: '1.0s',
  },
]

const STATUS_DOT = { Online: '#22c55e', Standby: '#f59e0b', Offline: '#ef4444' }

export default function AIAgents() {
  const online  = AGENTS.filter(a => a.status === 'Online').length
  const standby = AGENTS.filter(a => a.status === 'Standby').length
  const total   = AGENTS.length
  const totalTasks = AGENTS.reduce((s, a) => s + a.tasksToday, 0)

  return (
    <>
      <div className="hero">
        <h1 className="hero__title">
          AI Agents <span className="hero__accent">— your autonomous response team.</span>
        </h1>
        <p className="hero__subtitle">
          Ten specialized agents work in concert to assess, prioritise, and coordinate every emergency — end to end.
        </p>
      </div>

      <div className="page-content">
        <div className="stats-strip">
          <div className="stat stat--green">
            <span className="stat__value">{online}</span>
            <span className="stat__label">Online</span>
          </div>
          <div className="stat stat--orange">
            <span className="stat__value">{standby}</span>
            <span className="stat__label">Standby</span>
          </div>
          <div className="stat stat--cyan">
            <span className="stat__value">{total}</span>
            <span className="stat__label">Total agents</span>
          </div>
          <div className="stat">
            <span className="stat__value">{totalTasks}</span>
            <span className="stat__label">Tasks today</span>
          </div>
        </div>

        <div className="panel panel--bright">
          <div className="panel__head">
            <h2 className="panel__title">Agent fleet</h2>
            <span className="panel__live"><span className="pill__dot" /> Live</span>
          </div>

          <div className="agent-grid">
            {AGENTS.map((agent, idx) => {
              const Icon = agent.icon
              return (
                <div key={agent.id} className="agent-card" style={{ animationDelay: `${idx * 40}ms` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: `${agent.color}18`,
                        border: `1px solid ${agent.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon size={18} color={agent.color} />
                      </div>
                      <span className="agent-card__name">{agent.name}</span>
                    </div>
                    <div className="agent-card__status">
                      <span className="agent-card__dot" style={{ background: STATUS_DOT[agent.status], boxShadow: `0 0 8px ${STATUS_DOT[agent.status]}` }} />
                      <span style={{ color: STATUS_DOT[agent.status] }}>{agent.status}</span>
                    </div>
                  </div>

                  <p className="agent-card__role">{agent.role}</p>

                  <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                        {agent.tasksToday}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Tasks today</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                        {agent.avgTime}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Avg time</div>
                    </div>
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
