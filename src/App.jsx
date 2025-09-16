import './App.css'
import { Routes, Route } from "react-router-dom"
import navLinks from "./data/routes.jsx"





export default function App() {
  const routesList = navLinks.map(temp => (
    <Route key={temp.label} path= {temp.path} element = {temp.element} />
  ))

  return (
    <>
      <Routes >
          {routesList}
        </Routes>
    </>
  )
}

