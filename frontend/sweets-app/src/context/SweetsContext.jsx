import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const SweetsContext = createContext()

export const SweetsProvider = ({ children }) => {
    const { api } = useAuth()
    const [sweets, setSweets] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchSweets = async () => {
        try {
            const response = await api.get('/sweets')
            setSweets(response.data || [])
        } finally {
            setLoading(false)
        }
    }

    const searchSweets = async (filters = {}) => {
        try {
            const response = await api.get('/sweets/search', { params: filters })
            setSweets(response.data || [])
        } finally {
            setLoading(false)
        }
    }

    const addSweet = async (payload) => {
        const response = await api.post("/sweets", payload)
        fetchSweets();
        return response.data;
    }

    const updateSweet = async (id, payload) => {
        const response = await api.put(`/sweets/${id}`, payload)
        fetchSweets();
        return response.data;
    }

    const deleteSweet = async (id) => {
        const response = await api.delete(`/sweets/${id}`)
        fetchSweets()
        return response.data;
    }

    const purchaseSweet = async (id, quantity = 1) => {
        const response = await api.post(`/sweets/:${id}/purchase`, { quantity })
        fetchSweets()
        return response.data
    }

    const restockSweet = async (id, quantity = 1) => {
        const response = await api.post(`/sweets/${id}/restock`, { quantity })
        fetchSweets()
        return response.data
    }

    useEffect(() => {
        fetchSweets()
    })

    return (
        <SweetsContext.Provider value={{ sweets, loading, fetchSweets, searchSweets, addSweet, updateSweet, deleteSweet, restockSweet, purchaseSweet }}>
            {children}
        </SweetsContext.Provider>
    )

}

export const useSweets = () => useContext(SweetsContext);