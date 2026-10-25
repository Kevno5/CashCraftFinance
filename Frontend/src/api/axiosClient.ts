import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "https://localhost:7253",
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosClient;