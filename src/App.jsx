import './App.css'
import { Routes, Route } from "react-router-dom"
import navLinks from "./data/routes.jsx"
import NavBar from "./components/NavBar.jsx"




export default function App() {
  const routesList = navLinks.map(temp => (
    <Route key={temp.label} path= {temp.path} element = {temp.element} />
  ))

  return (
    <div className="app">
    <NavBar />
      <main className="content">
          <Routes>
            {routesList}
          </Routes>
      </main>
    </div>
  )
}

