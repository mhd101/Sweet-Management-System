import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const SweetsContext = createContext() // creating sweets context

export const SweetsProvider = ({ children }) => {
    const { api, user } = useAuth() // get axios instance and logged-in user
    const [sweets, setSweets] = useState([]) // stores the sweets
    const [loading, setLoading] = useState(false)

    // fetch all sweets from the backend API
    const fetchSweets = async () => {
        setLoading(true) // set loading while fetching
        try {
            const response = await api.get('/sweets') // GET /sweets
            setSweets(response.data || []) // update state with response data
        } catch (error) {
            // show toast messages depending on the error
            if (error.status === 404) {
                toast.warn("No sweets are available")
            } else {
                toast.error("Failed to fetch sweets")
                console.log("Error fetching sweets", error)
            }
        } finally {
            setLoading(false) // reset the loading state
        }
    }

    // search sweets with filter: {name, category, price range}
    const searchSweets = async (filters = {}) => {
        setLoading(true)
        try {
            const response = await api.get('/sweets/search', { params: filters })
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

    // add a new sweet
    const addSweet = async (payload) => {
        try {
            const response = await api.post("/sweets", payload)
            fetchSweets(); // refresh stored sweets list after adding
            toast.success("Added sweet successfully")
            return response.data;
        } catch (error) {
            if (error.status === 400) {
                toast.error("Something went wrong")
            }
        }
    }

    // update an existing sweet
    const updateSweet = async (id, payload) => {
        try {
            const response = await api.put(`/sweets/${id}`, payload)
            fetchSweets(); // refresh list after updating
            toast.success("Updated sweet successfully")
            return response.data;
        } catch (error) {
            if (error.status === 400) {
                toast.error("Something went wrong")
            }
        }
    }

    // delete a sweet
    const deleteSweet = async (id) => {
        try {
            const response = await api.delete(`/sweets/${id}`)
            // update local state to remove deleted sweet
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

    // purchase a sweet
    const purchaseSweet = async (id, quantity) => {
        const response = await api.post(`/sweets/${id}/purchase`, { quantity })
        fetchSweets() // refresh list after purchase to reflect updated quantity
        return response.data
    }

    // restock a sweet
    const restockSweet = async (id, quantity = 1) => {
        try {
            const response = await api.post(`/sweets/${id}/restock`, { quantity })
            fetchSweets(); // refresh list after restock
            toast.success("Restock sweet successfully")
            return response.data;
        } catch (error) {
            if (error.status === 400) {
                toast.error("Something went wrong")
            }
        }
    }

    // fetch sweets automatically when user logged-in
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

    // provide state and functions to components via context
    return (
        <SweetsContext.Provider value={{ sweets, loading, fetchSweets, searchSweets, addSweet, updateSweet, deleteSweet, restockSweet, purchaseSweet }}>
            {children}
        </SweetsContext.Provider>
    )

}

// custom hook to use the sweets context
export const useSweets = () => useContext(SweetsContext);