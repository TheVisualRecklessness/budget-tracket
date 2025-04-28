import axios from "axios"
import { useContext, useState } from "react"
import { useNavigate } from 'react-router'
import { AuthContext } from "../authentication/AuthContext"

export const Home = () => {
    const { setIsAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()
    const [message, setMessage] = useState('')

    const handleLogout = () => {
        axios.post('http://localhost:4000/logout', {}, { withCredentials: true })
        .then(res => {
            console.log(res.data.message)
            setIsAuthenticated(false)
            navigate('/login')
        })
        .catch(err => console.error(err))
        .finally(() => console.log('logout completed'))
    }

    const handleValidation = () => {
        axios.get('http://localhost:4000/check-authentication', {
            withCredentials: true,
        })
        .then(res => {
            console.log(res.data.id)
            setMessage(res.data.message)
        })
        .catch(err => setMessage(err.response?.data?.error || 'An error occurred'))
        .finally(() => console.log('End validation'))
    }
    
    return (
        <>
            <h1>Home page</h1>
            <button onClick={handleValidation}>Validate</button>
            <button onClick={handleLogout}>logout</button>
            {message !== '' && (
                <p>{message}</p>
            )}
        </>
    )
}