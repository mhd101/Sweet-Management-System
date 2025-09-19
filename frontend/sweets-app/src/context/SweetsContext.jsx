import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const SweetsContext = createContext()

export const SweetsProvider = ({ children }) => {
    const { api, user } = useAuth()
    const [sweets, setSweets] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchSweets = async () => {
        setLoading(true)
        try {
            const response = await api.get('/sweets')
            setSweets(response.data || [])
        } catch (error) {
            if (error.status === 404) {
                toast.warn("No sweets are available")
            } else {
                toast.error("Failed to fetch sweets")
                console.log("Error fetching sweets", error)
            }
        } finally {
            setLoading(false)
        }
    }

    const searchSweets = async (filters = {}) => {
        setLoading(true)
        try {
            const response = await api.get('/sweets/search', { params: filters })
            setSweets(response.data || [])
        } finally {
            setLoading(false)
        }
    }

    const addSweet = async (payload) => {
        try {
            const response = await api.post("/sweets", payload)
            fetchSweets();
            toast.success("Added sweet successfully")
            return response.data;
        } catch (error) {
            if (error.status === 400) {
                toast.error("Something went wrong")
            }
        }
    }

    const updateSweet = async (id, payload) => {
        try {
            const response = await api.put(`/sweets/${id}`, payload)
            fetchSweets();
            toast.success("Updated sweet successfully")
            return response.data;
        } catch (error) {
            if (error.status === 400) {
                toast.error("Something went wrong")
            }
        }
    }

    const deleteSweet = async (id) => {
        try {
            const response = await api.delete(`/sweets/${id}`)
            setSweets(prev => ({
                ...prev,
                sweets: prev.sweets.filter(s => s._id !== id)
            }));

            toast.success("Deleted sweet successfully")
            return response.data;
        } catch (error) {
            if (error.status === 400) {
                toast.error("Something went wrong")
            }
        }
    }

    const purchaseSweet = async (id, quantity = 1) => {
        const response = await api.post(`/sweets/${id}/purchase`, { quantity })
        fetchSweets()
        return response.data
    }

    const restockSweet = async (id, quantity = 1) => {
        try {
            const response = await api.post(`/sweets/${id}/restock`, { quantity })
            fetchSweets();
            toast.success("Restock sweet successfully")
            return response.data;
        } catch (error) {
            if (error.status === 400) {
                toast.error("Something went wrong")
            }
        }
    }

    useEffect(() => {
        // Only fetch sweets for logged-in users
        if (user?.token) {
            // small delay to avoid showing toasts immediately after login
            const timer = setTimeout(() => {
                fetchSweets(false); // don't show toasts on initial load
            }, 500);

            return () => clearTimeout(timer);
        } else {
            setSweets([]); // clear sweets on logout
        }
    }, [user?.token]);

    return (
        <SweetsContext.Provider value={{ sweets, loading, fetchSweets, searchSweets, addSweet, updateSweet, deleteSweet, restockSweet, purchaseSweet }}>
            {children}
        </SweetsContext.Provider>
    )

}

export const useSweets = () => useContext(SweetsContext);