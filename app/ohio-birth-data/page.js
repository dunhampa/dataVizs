import dynamic from 'next/dynamic'

export const metadata = { title: 'Interactive Ohio Birth Data' }

// Leaflet requires browser APIs — disable SSR for this component
const OhioBirthData = dynamic(() => import('@/components/OhioBirthData'), { ssr: false })

export default function Page() {
  return <OhioBirthData />
}
