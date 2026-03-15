import './globals.css'

export const metadata = {
  title: 'Data Visualizations',
  description: 'Interactive data visualizations by Pete Dunham',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
