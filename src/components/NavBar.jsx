import "./NavBar.css"

import { NavLink } from "react-router-dom"
import navLinks from "../data/routes.jsx"


export default function NavBar() {
    const navArray = navLinks.map(
        link => {
            const segments = link.path.split("/").filter(Boolean)
            if (segments.length > 1) return null
            return (
                <li key={link.path}>
                <NavLink to={link.path} className = {({isActive}) => (isActive ? "active" : "")}>
                {link.label}
                </NavLink>
            </li>
            )
        }
        )
        
    return (
        <nav>
            <h1>Investment Dashboard</h1>
            <ul>
                {navArray}
            </ul>
        </nav>

    )
        }