import axios from "axios"
// import { useContext, useState } from "react"
import { useState } from "react"
// import { useNavigate } from 'react-router'
// import { AuthContext } from "../context/AuthContext"
import { Sidebar } from "../components/Sidebar"
import { useGetName } from "../hooks/useGetName"

export const Home = () => {
    // const { setIsAuthenticated } = useContext(AuthContext)
    // const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const name = useGetName()

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
            <h1>Welcome back, {name}!</h1>
            <Sidebar />
            <button onClick={handleValidation}>Validate</button>
            {message !== '' && (
                <p>{message}</p>
            )}
        </>
    )
}