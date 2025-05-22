import axios from "axios";

const baseUrl = "https://localhost:9000"; //https://lapordiri-ppg.unpak.ac.id

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