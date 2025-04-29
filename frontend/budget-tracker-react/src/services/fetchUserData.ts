import axios from "axios"

export const fetchUserData = async () => {
    try {
        const response = await axios.get('http://localhost:4000/get-name', { withCredentials: true })
        return response.data.name
    } catch (error) {
        console.error(error)
    }
}