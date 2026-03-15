import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '2rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center' }}>
        Data Visualizations
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.125rem', textAlign: 'center', maxWidth: '500px' }}>
        Click a card below to explore each visualization.
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/gambler-roll" style={{
          background: 'linear-gradient(145deg, #1e293b, #334155)',
          borderRadius: '12px',
          padding: '1.5rem',
          width: '280px',
          border: '1px solid #475569',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'transform 0.2s'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Gambler's Roll
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Explore probability through dice rolling simulations
          </p>
        </Link>
        <Link to="/ohio-birth-data" style={{
          background: 'linear-gradient(145deg, #1e293b, #334155)',
          borderRadius: '12px',
          padding: '1.5rem',
          width: '280px',
          border: '1px solid #475569',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'transform 0.2s'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Ohio Birth Data
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Interactive visualization of Ohio birth statistics
          </p>
        </Link>
      </div>
    </div>
  )
}
