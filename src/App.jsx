import './App.css'

function App() {
  return (
    <div className="container">
      <h1 className="title">Data Visualizations</h1>
      <p className="subtitle">
        This repository contains multiple data visualization projects.
      </p>
      <div className="cards">
        <div className="card">
          <h2>Gambler's Roll</h2>
          <p>Explore probability and statistics through dice rolling simulations</p>
          <span className="folder">/gambler-roll</span>
        </div>
        <div className="card">
          <h2>Ohio Birth Data</h2>
          <p>Interactive visualization of Ohio birth statistics</p>
          <span className="folder">/ohio-birth-data</span>
        </div>
      </div>
    </div>
  )
}

export default App
