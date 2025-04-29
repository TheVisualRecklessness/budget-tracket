import { BrowserRouter as Router, Routes, Route } from "react-router"
import { Login } from "./routes/Login"
import { Home } from "./routes/Home"
import { AuthProvider } from "./authentication/AuthProvider"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Navbar } from "./components/Navbar"

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
          />
          <Route path="/holo" element={
            <ProtectedRoute>
              <h1>hola</h1>
              <Navbar />
            </ProtectedRoute>
          }>

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}
export default App
