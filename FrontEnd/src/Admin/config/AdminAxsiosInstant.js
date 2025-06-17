import axios from "axios";

// Get the base URL from the environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

const createAdminAxiosInstance = (includeToken = false, isFormData = false) => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            "Content-Type": isFormData ? "multipart/form-data" : "application/json",
        },
    });

    // If includeToken is true, add Authorization header
    if (includeToken) {
        const token = localStorage.getItem("adminToken");
        if (token) {
            instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }

    return instance;
};

export default createAdminAxiosInstance;
