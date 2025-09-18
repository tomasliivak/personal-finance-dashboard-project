import "./NavBar.css"

import { NavLink } from "react-router-dom"
import navLinks from "../data/routes.jsx"


export default function NavBar() {
    const navArray = navLinks.map(
        link => (
            <li key={link.path}>
                <NavLink to={link.path} className = {({isActive}) => (isActive ? "active" : "")}>
                {link.label}
                </NavLink>
            </li>
        )
    )
    return (
        <nav>
            <h1>Finance Dashboard</h1>
            <ul>
                {navArray}
            </ul>
        </nav>

    )
}