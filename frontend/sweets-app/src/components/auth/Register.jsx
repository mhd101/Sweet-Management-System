import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useState } from "react"
import { User, Mail, Lock } from "lucide-react"
import { Link } from "react-router-dom"



export default function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const submit = async (e) => {
        e.preventDefault();
        setError('')
        setLoading(true)
        try {
            await register(form)
            navigate('/')
        } catch (error) {
            setError(error?.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow p-6">
                <h2 className="text-4xl font-bold mb-4 text-center">Create Account</h2>
                <p className="text-xl mb-4 text-center">Sign up to view sweets and order easily.</p>

                {error && <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>}

                <label className="block mb-3">
                    <span className="text-sm text-gray-600">Firstname</span>
                    <div className="flex items-center gap-2 mt-1">
                        <User className="w-5 h-5 text-slate-400" />
                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={change}
                            required
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                            placeholder="Enter your firstname"
                        />
                    </div>
                </label>

                <label className="block mb-3">
                    <span className="text-sm text-gray-600">Lastname</span>
                    <div className="flex items-center gap-2 mt-1">
                        <User className="w-5 h-5 text-slate-400" />
                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={change}
                            required
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                            placeholder="Enter your lastname"
                        />
                    </div>
                </label>

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
                            placeholder="you@example.com"
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
                            minLength={6}
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                            placeholder="Enter password"
                        />
                    </div>
                </label>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create account"}
                </button>

                <p className="text-sm text-center text-gray-500 mt-4">
                    Already have an account? <Link className="text-indigo-600" to="/login">Login</Link>
                </p>
            </form>
        </div>
    )
}