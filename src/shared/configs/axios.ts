import axios from "axios";
import { Env } from "./env";

const axiosInstance = axios.create({
  baseURL: Env.API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const localStorageData = window.localStorage.getItem("persist:shop/user");

    if (localStorageData) {
      try {
        const parsedData = JSON.parse(localStorageData);
        const accessToken = JSON.parse(parsedData?.token || 'null');

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Lỗi:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response?.data,
  (error) => {
    return Promise.reject(error?.response?.data || error);
  }
);

export default axiosInstance;