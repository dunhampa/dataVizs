import dynamic from 'next/dynamic'

export const metadata = { title: 'Interactive Ohio Birth Data' }

// Leaflet requires browser APIs — disable SSR for this component
const OhioBirthData = dynamic(() => import('@/components/OhioBirthData'), { 
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#6b7280', fontSize: 16 }}>
      Loading map...
    </div>
  )
})

export default function Page() {
  return <OhioBirthData />
}
