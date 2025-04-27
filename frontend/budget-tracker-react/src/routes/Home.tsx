import axios from "axios"
import { useNavigate } from 'react-router'

export const Home = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        axios.post('http://localhost:4000/logout', {}, { withCredentials: true })
        .then(res => {
            console.log(res.data.message)
            navigate('/login')
        })
        .catch(err => console.error(err))
        .finally(() => console.log('logout completed'))
    }
    
    return (
        <>
            <h1>Home page</h1>
            <button onClick={handleLogout}>logout</button>
        </>
    )
}