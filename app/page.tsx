import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '2rem'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 700,
        color: '#f1f5f9',
        textAlign: 'center'
      }}>
        Data Visualizations
      </h1>
      <p style={{
        color: '#94a3b8',
        fontSize: '1.125rem',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        This repository contains multiple data visualization projects. Click a card to explore.
      </p>
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link href="/gambler-roll" style={{
          background: 'linear-gradient(145deg, #1e293b, #334155)',
          borderRadius: '12px',
          padding: '1.5rem',
          width: '280px',
          border: '1px solid #475569',
          textDecoration: 'none',
          display: 'block',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#f1f5f9',
            marginBottom: '0.5rem'
          }}>
            Gambler&apos;s Roll
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            marginBottom: '1rem'
          }}>
            Explore probability and statistics through dice rolling simulations
          </p>
          <span style={{
            display: 'inline-block',
            background: '#3b82f6',
            color: '#fff',
            padding: '0.375rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem'
          }}>
            View Visualization
          </span>
        </Link>
        <Link href="/ohio-birth-data" style={{
          background: 'linear-gradient(145deg, #1e293b, #334155)',
          borderRadius: '12px',
          padding: '1.5rem',
          width: '280px',
          border: '1px solid #475569',
          textDecoration: 'none',
          display: 'block',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#f1f5f9',
            marginBottom: '0.5rem'
          }}>
            Ohio Birth Data
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            marginBottom: '1rem'
          }}>
            Interactive visualization of Ohio birth statistics
          </p>
          <span style={{
            display: 'inline-block',
            background: '#3b82f6',
            color: '#fff',
            padding: '0.375rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem'
          }}>
            View Visualization
          </span>
        </Link>
      </div>
    </div>
  )
}
