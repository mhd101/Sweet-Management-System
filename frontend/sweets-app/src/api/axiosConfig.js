import axios from "axios";

// created a axios instance with default configuration
const api = axios.create({
    // set the base URL for all requests made using this instance
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api",
    // set default headers for all requests
    headers: {
        "Content-Type": "application/json",
    },
})

export default api;