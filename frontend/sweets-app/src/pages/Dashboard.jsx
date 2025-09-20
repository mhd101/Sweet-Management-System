import { useAuth } from "../context/AuthContext"
import { Navigate, useNavigate } from "react-router-dom";
import SweetsList from "../components/sweets/SweetsList";
import { toast } from "react-toastify";


export default function Dashboard() {

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.user?.role === 'admin') {

    return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    logout();
    toast.success("Logout successfully")
    navigate("/login"); // redirect to user login
  };
  return (
    <>
      <div className="p-6 max-w-6xl mx-auto relative">

        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer transition"
        >
          Logout
        </button>
        <h2 className="text-4xl font-semibold mb-4 text-center">
          Sweet Shop
        </h2>

        <main className="bg-slate-50 min-h-screen">
          <SweetsList />
        </main>


      </div>

    </>
  )
}