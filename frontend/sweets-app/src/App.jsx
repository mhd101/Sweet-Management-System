import { Route, Routes, Navigate } from "react-router-dom"
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import AdminLogin from "./components/auth/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function PrivateRoute({ children }) {
  const { user } = useAuth(); // user context

  // if user in not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // if role is not admin then redirect to user dashboard
  if (user?.user?.role !== 'admin') {
    return <Navigate to="/" replace />
  } 

  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* private route for admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      {/* redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* toaster configuration */}
      <ToastContainer
        position="top-right" 
        autoClose={5000}     
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
