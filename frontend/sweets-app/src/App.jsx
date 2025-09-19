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
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />
  }

  // user redirect to dasboard
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
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      // Redirect any unknown routes to home
        <Route path="*" element={<Navigate to="/" />} />


      </Routes>
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
