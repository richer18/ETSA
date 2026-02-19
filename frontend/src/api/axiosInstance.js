import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true, // optional if you're using cookies/session (like Sanctum)
});

export default axiosInstance;
