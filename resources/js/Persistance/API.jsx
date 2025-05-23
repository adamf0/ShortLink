import axios from "axios";

const baseUrl = "https://cdc.unpak.ac.id"; //http://localhost:8000

const apiProduction = axios.create({
    baseURL: baseUrl,
});

// apiProduction.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export { baseUrl, apiProduction };