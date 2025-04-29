import axios from "axios"
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router"
import { AuthContext } from "../context/AuthContext"
import '../styles/Sidebar.css'

/*
    [X]  Navbar será renderizado en cada página que lo necesite.
    [X]  Navbar debe de poder navegar
    [X]  Navbar debe de ser capáz de cerrar sesión
    [X]  Navbar recibirá un nombre
*/

export const Sidebar = () => {
    const { setIsAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = () => {
        axios.get('http://localhost:4000/logout', { withCredentials: true })
        .then(res => {
            console.log(res.data.message)
            setIsAuthenticated(false)
            navigate('/')
        })
        .catch(err => console.error(err.response.data.message))
        .finally(() => console.log('Logging out process terminated'))
    }

    const toggleSidebar = () => {
        setIsOpen(prev => !prev)
    }

    return (
        <>
            <button id="sidebar-open-btn" onClick={toggleSidebar} >&#9776;</button>
            <aside id="sidebar" className={`sidebar-${isOpen ? 'open' : 'closed'}`} >
                <h2>Budget Tracker!</h2>
                <button id="sidebar-close-btn" onClick={toggleSidebar}>X</button>
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-navbar-item">
                            <Link className="sidebar-nav-link" to={'/'}>Inicio</Link>
                        </li>
                        <li className="sidebar-navbar-item">
                            <Link className="sidebar-nav-link" to={'/holo'} >Holo</Link>
                        </li>
                    </ul>
                </nav>
                <button onClick={handleLogout}>Log out</button>
            </aside>
        </>
    )
}