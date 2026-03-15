# dataVizs

A collection of interactive data visualizations built with React, Recharts, and React-Leaflet. Originally R/Shiny apps, rebuilt as static React applications — no server required.

## Projects

### [Gambler's Roll](./gambler-roll)
Bayesian inference demo: given a bag of fair and rigged dice, what's the probability a gambler who rolled consecutive sixes picked the rigged one? Adjust priors and see the posterior update in real time.

**Stack:** React · Recharts · Vite

---

### [Interactive Ohio Birth Data](./ohio-birth-data)
Choropleth map of Ohio counties shaded by percentage of low birth weight births. Click any county to explore the breakdown by maternal age group, for a single year or a five-year trend (2014–2018).

**Stack:** React · React-Leaflet · Recharts · PapaParse · Vite
**Data:** Ohio Department of Health Public Data Warehouse

---

## Deployment

Each project is a standalone Vite app. To deploy on Vercel, connect this repo and add two projects — one rooted at `gambler-roll/`, one at `ohio-birth-data/`.

To run locally:
```bash
cd gambler-roll && npm install && npm run dev
cd ohio-birth-data && npm install && npm run dev
```
