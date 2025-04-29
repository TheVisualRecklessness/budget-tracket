import axios from "axios"
import { useContext } from "react"
import { Link, useNavigate } from "react-router"
import { AuthContext } from "../context/AuthContext"

/*
    [X]  Navbar será renderizado en cada página que lo necesite.
    [X]  Navbar debe de poder navegar
    []  Navbar debe de ser capáz de cerrar sesión
    []  Navbar recibirá un nombre
*/

export const Navbar = () => {
    const { setIsAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()

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

    return (
        <aside>
            <Link to={'/'}>Inicio</Link>
            <Link to={'/holo'} >Holo</Link>
            <button onClick={handleLogout}>Log out</button>

        </aside>
    )
}