import {
    createContext, useContext, useEffect, useState
} from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(); // creating auth context

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            // try to get stored user object from local storage
            const stored = JSON.parse(localStorage.getItem("user")) || null;
            
            // if token exist, set is the axios default headers for authenticated requests
            if (stored?.token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${stored.token}`;
            }
            return stored; // return the stored user | null
        } catch {
            return null; // if parsing fails, then return null
        }
    });

    // sync axios authorization header whenever user changes
    useEffect(() => {
        if (user?.token) {
            // if user has a token, set it for all axios requests
            api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        } else {
            // if no user, remove the authorization header
            delete api.defaults.headers.common['Authorization'];
        }
    }, [user]);

    // register a new user
    const register = async (payload) => {
        // payload: {firstName, lastName, email, password}
        const response = await api.post('/auth/register', payload);

        if (response.status === 201) {
            // save user is state and local storage on successfull registration
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data; // return the user data
    }

    // login user & admin
    const login = async (payload) => {
        // payload: {email, password}
        const response = await api.post('/auth/login', payload);

        if (response.status === 200) {
            // save user in state and local storage on successful login
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data; // return user data
    }

    // logout user & admin
    const logout = () => {
        setUser(null); // clear user state
        localStorage.removeItem("user"); // remove user from local storage
    } 

    // provide authcontext with state and functions to children components
    return (
        <AuthContext.Provider value={{ user, setUser, register, login, logout, api }}>
            {children}
        </AuthContext.Provider>
    )
}

// custom hook for consuming authcontext
export const useAuth = () => useContext(AuthContext);