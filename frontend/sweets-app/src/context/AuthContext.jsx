import {
    createContext, useContext, useEffect, useState
} from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("user")) || null;
            if (stored?.token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${stored.token}`;
            }
            return stored;
        } catch {
            return null;
        }
    });

    // set token in axios headers
    useEffect(() => {
        console.log(user)
        if (user?.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [user]);

    // register user
    const register = async (payload) => {
        // firstName, lastName, email, password
        const response = await api.post('/auth/register', payload);

        if (response.status === 201) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
    }

    // login user & admin
    const login = async (payload) => {
        // email, password
        const response = await api.post('/auth/login', payload);

        if (response.status === 200) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
    }

    // logout user & admin
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{ user, setUser, register, login, logout, api }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);