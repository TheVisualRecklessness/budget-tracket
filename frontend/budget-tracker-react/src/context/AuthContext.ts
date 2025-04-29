import { createContext } from "react";

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  loading: true,
});