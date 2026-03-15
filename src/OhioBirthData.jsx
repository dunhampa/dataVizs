import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import Papa from 'papaparse'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Label
} from 'recharts'

const OHIO_TOPO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json'

const AGE_ORDER = ['< 15', '15 to 17', '18 to 19', '20 to 24', '25 to 29', '30 to 34', '35 to 39', '40 to 44', '> 44']
const TREND_YEARS = ['2014', '2015', '2016', '2017', '2018']
const REDS = ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15']

function mapAge(age) {
  if (age === 'Less than 15') return '< 15'
  if (age === '45 and older') return '> 44'
  return age
}

function parseCount(val) {
  if (val === '*' || val === '' || val == null) return 0
  return Number(val) || 0
}

function processRows(rawRows) {
  return rawRows.map(r => ({
    BirthWeight: r['LowBirthWeightIndLowBirthWeightIndDesc'] === 'Low birth weight (<2500g)'
      ? '< 5.5 lbs' : '5.5 lbs+',
    MaternalAge: mapAge(r['BirthAgeGroupAgeGroupDesc']),
    Year: String(r['YearBirthYearDesc']).trim(),
    County: r['CountyCountyName'],
    BirthCount: parseCount(r['BirthCount']),
  }))
}

function getMapStats(data) {
  const stats = {}
  for (const row of data) {
    if (row.Year !== '2018' || row.County === 'NonOH' || row.County === 'Pending') continue
    if (!stats[row.County]) stats[row.County] = { low: 0, total: 0 }
    stats[row.County].total += row.BirthCount
    if (row.BirthWeight === '< 5.5 lbs') stats[row.County].low += row.BirthCount
  }
  const result = {}
  for (const [county, { low, total }] of Object.entries(stats)) {
    result[county] = total > 0 ? low / total : 0
  }
  return result
}

function makeColorFn(mapStats) {
  const vals = Object.values(mapStats).filter(v => v > 0).sort((a, b) => a - b)
  return (val) => {
    if (!val || vals.length === 0) return '#f0f0f0'
    const rank = vals.filter(v => v <= val).length
    const idx = Math.min(Math.floor((rank / vals.length) * REDS.length), REDS.length - 1)
    return REDS[idx]
  }
}

function getChartData(data, county, years) {
  const byYearAge = {}
  for (const row of data) {
    if (row.County !== county || !years.includes(row.Year)) continue
    const key = `${row.Year}__${row.MaternalAge}`
    if (!byYearAge[key]) byYearAge[key] = { year: row.Year, age: row.MaternalAge, low: 0, normal: 0 }
    if (row.BirthWeight === '< 5.5 lbs') byYearAge[key].low += row.BirthCount
    else byYearAge[key].normal += row.BirthCount
  }
  const byYear = {}
  for (const { year, age, low, normal } of Object.values(byYearAge)) {
    if (!byYear[year]) byYear[year] = []
    byYear[year].push({ age, low, normal })
  }
  for (const year of Object.keys(byYear)) {
    byYear[year].sort((a, b) => AGE_ORDER.indexOf(a.age) - AGE_ORDER.indexOf(b.age))
  }
  return byYear
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e3a5f', margin: '0 0 10px', borderBottom: '2px solid #e5e7eb', paddingBottom: 6 }}>{title}</h3>
      <div style={{ fontSize: 14, color: '#374151' }}>{children}</div>
    </div>
  )
}

function CountyChart({ title, data, height = 300 }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', textAlign: 'center', marginBottom: 4 }}>
        {title}
      </div>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 52, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="age" tick={{ fontSize: 9 }} angle={-55} textAnchor="end" interval={0}>
              <Label value="Maternal Age" position="insideBottom" offset={-40} style={{ fontSize: 10, fill: '#6b7280' }} />
            </XAxis>
            <YAxis tick={{ fontSize: 9 }}>
              <Label value="Birth Count" angle={-90} position="insideLeft" offset={-22} style={{ fontSize: 10, fill: '#6b7280' }} />
            </YAxis>
            <Tooltip
              formatter={(val, name) => [val.toLocaleString(), name]}
              labelFormatter={l => `Age: ${l}`}
            />
            <Legend verticalAlign="top" iconSize={10} wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="normal" name="5.5 lbs+" stackId="a" fill="#93c5fd" />
            <Bar dataKey="low" name="< 5.5 lbs" stackId="a" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 12 }}>
          No data for {title}
        </div>
      )}
    </div>
  )
}

function OhioMap({ mapStats, colorFn, selectedCounty, setSelectedCounty, hoveredCounty, setHoveredCounty }) {
  const [geoData, setGeoData] = useState(null)

  useEffect(() => {
    fetch(OHIO_TOPO_URL)
      .then(res => res.json())
      .then(topology => {
        const counties = feature(topology, topology.objects.counties)
        const ohioCounties = {
          ...counties,
          features: counties.features.filter(f => String(f.id).startsWith('39'))
        }
        setGeoData(ohioCounties)
      })
      .catch(err => console.error('Failed to load map:', err))
  }, [])

  const { pathGenerator, counties } = useMemo(() => {
    if (!geoData) return { pathGenerator: null, counties: [] }
    
    const projection = geoMercator()
      .center([-82.5, 40.2])
      .scale(6000)
      .translate([350, 300])
    
    const pathGen = geoPath().projection(projection)
    
    return {
      pathGenerator: pathGen,
      counties: geoData.features
    }
  }, [geoData])

  if (!geoData || !pathGenerator) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
        Loading map...
      </div>
    )
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 700 600" style={{ background: '#f8fafc' }}>
      {counties.map(county => {
        const countyName = county.properties.name
        const pct = mapStats[countyName] ?? 0
        const isSelected = selectedCounty === countyName
        const isHovered = hoveredCounty === countyName
        
        return (
          <path
            key={county.id}
            d={pathGenerator(county) || ''}
            fill={colorFn(pct)}
            stroke={isSelected ? '#1e3a5f' : isHovered ? '#fff' : '#666'}
            strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.5}
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedCounty(countyName)}
            onMouseEnter={() => setHoveredCounty(countyName)}
            onMouseLeave={() => setHoveredCounty(null)}
          />
        )
      })}
    </svg>
  )
}

export default function OhioBirthData() {
  const [birthData, setBirthData] = useState([])
  const [selectedCounty, setSelectedCounty] = useState('Franklin')
  const [hoveredCounty, setHoveredCounty] = useState(null)
  const [activeTab, setActiveTab] = useState('explore')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Papa.parse('/birth_data.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (r) => {
        setBirthData(processRows(r.data))
        setLoading(false)
      },
      error: (err) => {
        setError(err.message)
        setLoading(false)
      },
    })
  }, [])

  const mapStats = useMemo(() => getMapStats(birthData), [birthData])
  const colorFn = useMemo(() => makeColorFn(mapStats), [mapStats])

  const exploreData = useMemo(
    () => getChartData(birthData, selectedCounty, ['2018'])['2018'] || [],
    [birthData, selectedCounty]
  )
  const trendData = useMemo(
    () => getChartData(birthData, selectedCounty, TREND_YEARS),
    [birthData, selectedCounty]
  )

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif', color: '#6b7280', fontSize: 16 }}>
      Loading data...
    </div>
  )

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif', color: '#ef4444' }}>
      Error: {error}
    </div>
  )

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: '#1e3a5f', color: 'white', padding: '12px 24px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Interactive Ohio Birth Data</h1>
          <p style={{ margin: '2px 0 0', fontSize: 12, opacity: 0.75 }}>
            Click a county on the map to explore birth weight by maternal age
          </p>
        </div>
        <nav style={{ display: 'flex', gap: '24px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}>
            Home
          </Link>
          <Link to="/gambler-roll" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}>
            Gambler's Roll
          </Link>
        </nav>
      </div>

      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 20px', display: 'flex', flexShrink: 0 }}>
        {[
          ['explore', 'Explore Data (2018)'],
          ['trend', '5 Year Trend (2014-2018)'],
          ['background', 'Background'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 18px',
              border: 'none',
              borderBottom: activeTab === id ? '3px solid #1e3a5f' : '3px solid transparent',
              background: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === id ? 700 : 400,
              color: activeTab === id ? '#1e3a5f' : '#6b7280',
              fontSize: 13,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'background' && (
        <div style={{ flex: 1, overflowY: 'auto', background: '#f9fafb', display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
          <div style={{ maxWidth: 720, width: '100%', fontFamily: 'system-ui, sans-serif', color: '#111827', lineHeight: 1.7 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px' }}>About This Project</h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>Interactive exploration of Ohio birth statistics by county, maternal age, and birth weight.</p>

            <Section title="Summary">
              <p>
                This dashboard visualizes Ohio live birth data across all 88 counties, allowing users to explore
                the relationship between maternal age groups and birth weight outcomes. Counties are shaded by
                percentage of low birth weight births (&lt;2,500g / ~5.5 lbs), with darker red indicating higher rates.
                Clicking a county reveals its detailed breakdown by age group.
              </p>
            </Section>

            <Section title="Data Source">
              <p>
                Data was obtained from the{' '}
                <a href="http://publicapps.odh.ohio.gov/EDW/DataBrowser/Browse/OhioLiveBirths"
                  style={{ color: '#2563eb' }} target="_blank" rel="noreferrer">
                  Ohio Department of Health Public Data Warehouse
                </a>
                . The dataset covers Ohio live births from 2006-2018.
              </p>
            </Section>

            <Section title="Key Terms">
              <dl style={{ margin: 0 }}>
                <div style={{ marginBottom: 14 }}>
                  <dt style={{ fontWeight: 700, color: '#1e3a5f' }}>Low Birth Weight</dt>
                  <dd style={{ margin: '2px 0 0 0', color: '#374151' }}>A birth weight below 2,500 grams (~5.5 lbs).</dd>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <dt style={{ fontWeight: 700, color: '#1e3a5f' }}>Maternal Age Groups</dt>
                  <dd style={{ margin: '2px 0 0 0', color: '#374151' }}>Births are categorized into nine age bands from under 15 to 45 and older.</dd>
                </div>
              </dl>
            </Section>

            <div style={{ marginTop: 40, padding: '16px 20px', background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: 4, fontSize: 13, color: '#78350f' }}>
              <strong>Disclaimer:</strong> These data were provided by the Ohio Department of Health. The Department
              specifically disclaims responsibility for any analyses, interpretations, or conclusions drawn from this data.
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'background' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
          <div style={{ position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
            <OhioMap
              mapStats={mapStats}
              colorFn={colorFn}
              selectedCounty={selectedCounty}
              setSelectedCounty={setSelectedCounty}
              hoveredCounty={hoveredCounty}
              setHoveredCounty={setHoveredCounty}
            />

            {hoveredCounty && (
              <div style={{
                position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.95)',
                padding: '8px 12px', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 1000, fontSize: 12
              }}>
                <div style={{ fontWeight: 700, color: '#1e3a5f' }}>{hoveredCounty} County</div>
                <div style={{ color: '#6b7280' }}>
                  Low birth weight: {mapStats[hoveredCounty] !== undefined ? (mapStats[hoveredCounty] * 100).toFixed(2) : 'N/A'}%
                </div>
              </div>
            )}

            <div style={{
              position: 'absolute', bottom: 16, right: 16, background: 'rgba(255,255,255,0.95)',
              padding: '10px 12px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 1000, fontSize: 11
            }}>
              <div style={{ fontWeight: 700, marginBottom: 6, color: '#374151' }}>% Low Birth Weight (2018)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {REDS.map((color, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 14, height: 14, background: color, border: '1px solid #ccc', borderRadius: 2 }} />
                    <span style={{ color: '#6b7280' }}>{['Lowest', '', '', '', '', 'Highest'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderLeft: '1px solid #e2e8f0', padding: '16px 20px', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800, color: '#111827', textAlign: 'center' }}>
              {selectedCounty} County Birth Data
            </h2>

            {activeTab === 'explore' ? (
              <CountyChart title="2018" data={exploreData} height={380} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {TREND_YEARS.map(year => (
                  <CountyChart key={year} title={year} data={trendData[year] || []} height={220} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
