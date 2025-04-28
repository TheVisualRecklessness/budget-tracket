import { useContext } from "react"
import { Navigate } from "react-router"
import { AuthContext } from "../authentication/AuthContext"

export const ProtectedRoute = ({ children }: {children: React.ReactNode}) => {
    const { isAuthenticated, loading } = useContext(AuthContext)
    
    if (loading) return <h3>loading...</h3>
    return isAuthenticated ? children : <Navigate to='/login' replace />
}