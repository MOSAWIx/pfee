import axios from "axios";



// Config Standart For Requsets
const WebAxiosConfig = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}api/`,
    headers: {
        "Content-Type": "application/json",
    },

});

export default WebAxiosConfig;