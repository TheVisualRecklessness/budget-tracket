import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setIsLoading] = useState(true)
  
    useEffect(() => {
      axios.get("http://localhost:4000/check-authentication", { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false))
    }, []);

    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };