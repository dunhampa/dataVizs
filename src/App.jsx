function App() {
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
        This repository contains multiple data visualization projects.
      </p>
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <ProjectCard 
          title="Gambler's Roll"
          description="Explore probability and statistics through dice rolling simulations"
          folder="gambler-roll"
        />
        <ProjectCard 
          title="Ohio Birth Data"
          description="Interactive visualization of Ohio birth statistics"
          folder="ohio-birth-data"
        />
      </div>
    </div>
  )
}

function ProjectCard({ title, description, folder }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #1e293b, #334155)',
      borderRadius: '12px',
      padding: '1.5rem',
      width: '280px',
      border: '1px solid #475569',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#f1f5f9',
        marginBottom: '0.5rem'
      }}>
        {title}
      </h2>
      <p style={{
        color: '#94a3b8',
        fontSize: '0.875rem',
        lineHeight: 1.5,
        marginBottom: '1rem'
      }}>
        {description}
      </p>
      <span style={{
        display: 'inline-block',
        background: '#3b82f6',
        color: '#fff',
        padding: '0.375rem 0.75rem',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontFamily: 'monospace'
      }}>
        /{folder}
      </span>
    </div>
  )
}

export default App
