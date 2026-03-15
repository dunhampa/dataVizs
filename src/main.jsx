import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import GamblerRoll from './GamblerRoll.jsx'
import OhioBirthData from './OhioBirthData.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/gambler-roll" element={<GamblerRoll />} />
        <Route path="/ohio-birth-data" element={<OhioBirthData />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
