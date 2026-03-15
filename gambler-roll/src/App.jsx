import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Label
} from 'recharts'

function calcCheatProb(rolls, cheatEffect, numCheat, totalDice) {
  const pCheat = numCheat / totalDice
  const pFair = 1 - pCheat
  const pGivenCheat = Math.pow(cheatEffect, rolls)
  const pGivenFair = Math.pow(1 / 6, rolls)
  const pTotal = pGivenCheat * pCheat + pGivenFair * pFair
  return (pGivenCheat * pCheat) / pTotal
}

function Slider({ label, min, max, step, value, onChange }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <label style={{ fontWeight: 500, fontSize: '13px', color: '#374151' }}>{label}</label>
        <span style={{ fontWeight: 700, fontSize: '13px', color: '#2563eb' }}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#2563eb' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  )
}

const CustomDot = ({ cx, cy, payload, selectedRolls }) => {
  if (payload.rolls === selectedRolls) {
    return <circle cx={cx} cy={cy} r={8} fill="#ef4444" stroke="white" strokeWidth={2} />
  }
  return <circle cx={cx} cy={cy} r={4} fill="#2563eb" stroke="white" strokeWidth={1} />
}

export default function App() {
  const [cheatEffect, setCheatEffect] = useState(0.5)
  const [numCheat, setNumCheat] = useState(1)
  const [totalDice, setTotalDice] = useState(100)
  const [selectedRolls, setSelectedRolls] = useState(3)

  const safeTotalDice = Math.max(totalDice, numCheat)

  const data = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const rolls = i + 1
      return { rolls, prob: calcCheatProb(rolls, cheatEffect, numCheat, safeTotalDice) }
    })
  }, [cheatEffect, numCheat, safeTotalDice])

  const selectedProb = data[selectedRolls - 1]?.prob ?? 0

  return (
    <div style={{
      minHeight: '100vh',
      background: '#d7edf9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '14px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
        width: '100%',
        maxWidth: '900px',
        padding: '36px',
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: '36px',
        boxSizing: 'border-box'
      }}>
        {/* Sidebar */}
        <div>
          <h2 style={{ margin: '0 0 20px', fontSize: '13px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Controls
          </h2>
          <Slider
            label="Cheat Die P(6)"
            min={0.1} max={1.0} step={0.01}
            value={cheatEffect}
            onChange={setCheatEffect}
          />
          <Slider
            label="Number of Cheat Dice"
            min={1} max={50} step={1}
            value={numCheat}
            onChange={v => { setNumCheat(v); if (v > totalDice) setTotalDice(v) }}
          />
          <Slider
            label="Total Dice Population"
            min={1} max={500} step={1}
            value={safeTotalDice}
            onChange={v => setTotalDice(Math.max(v, numCheat))}
          />
          <Slider
            label="Consecutive Sixes Rolled"
            min={1} max={10} step={1}
            value={selectedRolls}
            onChange={setSelectedRolls}
          />

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: '#eff6ff',
            borderRadius: '8px',
            borderLeft: '4px solid #2563eb'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
              P(cheat | {selectedRolls} six{selectedRolls > 1 ? 'es' : ''})
            </div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: '#ef4444' }}>
              {(selectedProb * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Main */}
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 800, color: '#111827' }}>
            Cheat Die Prob. By Consecutive Rolls
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
            A gambler picks one die from a bag of <strong>{safeTotalDice}</strong> dice
            ({numCheat} cheat, {safeTotalDice - numCheat} fair). The cheat die rolls a 6
            with probability <strong>{cheatEffect}</strong>. They roll {selectedRolls} consecutive
            six{selectedRolls > 1 ? 'es' : ''}. The red dot shows the probability they picked
            the cheat die.
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 10, right: 24, bottom: 36, left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="rolls" tickCount={10} interval={0}>
                <Label
                  value="Number of Consecutive Sixes Rolled"
                  position="insideBottom"
                  offset={-20}
                  style={{ fontSize: 12, fill: '#6b7280' }}
                />
              </XAxis>
              <YAxis domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`}>
                <Label
                  value="P(Cheat Die)"
                  angle={-90}
                  position="insideLeft"
                  offset={-8}
                  style={{ fontSize: 12, fill: '#6b7280' }}
                />
              </YAxis>
              <Tooltip
                formatter={v => [`${(v * 100).toFixed(2)}%`, 'P(Cheat Die)']}
                labelFormatter={l => `${l} consecutive six${l > 1 ? 'es' : ''}`}
              />
              <Line
                type="monotone"
                dataKey="prob"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={<CustomDot selectedRolls={selectedRolls} />}
                activeDot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
