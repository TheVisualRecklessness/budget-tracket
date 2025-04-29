import axios from "axios"
import { useEffect, useState } from "react"
import { UserContext } from "./userContext"

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('http://localhost:4000/get-name', { withCredentials: true })
        .then(res => setName(res.data.name))
        .catch(err => console.error(err.response.message))
        .finally(() => setLoading(false))
    },[])

    return (
        
    )
}