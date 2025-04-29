import { useEffect, useState } from "react"
import { fetchUserData } from "../services/fetchUserData"

export const useGetName = () => {
    const [name, setName] = useState('')

    useEffect(() => {
        fetchUserData()
        .then(res => setName(res))
        .catch(err => console.error(err))
    },[])

    return name
}