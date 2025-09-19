import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const submit = async (e) => {
        e.preventDefault();
        setError('')
        setLoading(true)
        try {
            const userData = await login(form)
            if(userData?.user.role === 'user'){
                navigate("/")
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow p-6">
                <h2 className="text-4xl font-bold mb-4 text-center">Login Account</h2>
                <p className="text-xl mb-4 text-center">Login to access your sweet shop dashboard.</p>

                {error && <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>}

                <label className="block mb-3">
                    <span className="text-sm text-gray-600">Email</span>
                    <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <input
                            name="email"
                            value={form.email}
                            onChange={change}
                            type="email"
                            required
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                            placeholder="Enter your email"
                        />
                    </div>
                </label>

                <label className="block mb-4">
                    <span className="text-sm text-gray-600">Password</span>
                    <div className="flex items-center gap-2 mt-1">
                        <Lock className="w-5 h-5 text-slate-400" />
                        <input
                            name="password"
                            value={form.password}
                            onChange={change}
                            type="password"
                            required
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                            placeholder="Enter your password"
                        />
                    </div>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-sm text-center text-gray-500 mt-4">
                    Are you admin? <Link className="text-indigo-600" to="/admin-login">Admin login</Link>
                </p>
            </form>
        </div>
    )
}