import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "https://localhost:7253",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach the login token to every request
axiosClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// If the token is missing, expired or rejected, send the user back to login
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRequest = error.config?.url?.includes("/api/auth/");

        if (error.response?.status === 401 && !isAuthRequest) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosClient;