import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


api.interceptors.request.use((config) => {
   const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.log("401 detected");

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

     
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;