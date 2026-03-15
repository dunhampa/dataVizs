import Link from 'next/link'

// v2
const projects = [
  {
    slug: 'gambler-roll',
    title: "Gambler's Roll",
    subtitle: 'Bayesian Inference Demo',
    description:
      'A gambler draws a die from a bag of fair and rigged dice, then rolls consecutive sixes. Adjust priors — cheat die probability, population mix, roll count — and watch the posterior update in real time.',
    tags: ['Bayesian', 'Probability', 'React', 'Recharts'],
    color: '#2563eb',
  },
  {
    slug: 'ohio-birth-data',
    title: 'Interactive Ohio Birth Data',
    subtitle: 'County-Level Public Health Dashboard',
    description:
      'Choropleth map of all 88 Ohio counties shaded by percentage of low birth weight births. Click any county to explore the breakdown by maternal age group — single year or five-year trend (2014–2018).',
    tags: ['Public Health', 'Leaflet', 'Choropleth', 'Ohio ODH'],
    color: '#1e3a5f',
  },
]

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#0f172a', color: 'white', padding: '48px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Data Visualizations
          </h1>
          <p style={{ fontSize: 15, opacity: 0.65, margin: 0 }}>
            Interactive explorations built with React — originally R/Shiny, rebuilt as static apps.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {projects.map(p => (
          <Link key={p.slug} href={`/${p.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: 12,
              padding: '28px 32px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 24,
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  {p.subtitle}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>{p.title}</h2>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>{p.description}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontSize: 11, padding: '3px 10px', background: '#f1f5f9', color: '#475569', borderRadius: 99, fontWeight: 500 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 28, opacity: 0.2, color: p.color }}>→</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: '0 0 48px', fontSize: 12, color: '#94a3b8' }}>
        Source:{' '}
        <a href="https://github.com/dunhampa/dataVizs" style={{ color: '#2563eb' }} target="_blank" rel="noreferrer">
          github.com/dunhampa/dataVizs
        </a>
      </div>
    </main>
  )
}
