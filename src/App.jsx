import './App.css'
import { Routes, Route } from "react-router-dom"
import navLinks from "./data/routes.jsx"
import NavBar from "./components/NavBar.jsx"
import { DataProvider } from "./context/DataContext.jsx"



export default function App() {
  const routesList = navLinks.map(temp => (
    <Route key={temp.label} path= {temp.path} element = {temp.element} />
  ))

  return (
    <div className="app">
      <DataProvider>
      <NavBar />
      <main className="content">
          <Routes>
            {routesList}
          </Routes>
      </main>
      </DataProvider>
    </div>
  )
}

