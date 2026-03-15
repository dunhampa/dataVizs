import { Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="container">
      <h1 className="title">Data Visualizations</h1>
      <p className="subtitle">
        This repository contains multiple data visualization projects. Click a card to explore.
      </p>
      <div className="cards">
        <Link to="/gambler-roll" className="card">
          <h2>Gambler's Roll</h2>
          <p>Explore probability and statistics through dice rolling simulations</p>
          <span className="folder">View Visualization</span>
        </Link>
        <Link to="/ohio-birth-data" className="card">
          <h2>Ohio Birth Data</h2>
          <p>Interactive visualization of Ohio birth statistics</p>
          <span className="folder">View Visualization</span>
        </Link>
      </div>
    </div>
  )
}

export default App
