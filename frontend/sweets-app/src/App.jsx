import { Route, Routes, Navigate } from "react-router-dom"
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import AdminLogin from "./components/auth/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext.jsx";

function PrivateRoute({children, adminOnly = false}) {
  const { user } = useAuth();
  
  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace/>
  }

  if (adminOnly && !user.isAdmin) {
    // Not an admin
    return <Navigate to="/" replace/>
  }

  return children;
}


function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      // Redirect any unknown routes to home
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
