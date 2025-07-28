import axios from "axios";

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 50000,
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
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

    // Thêm timestamp để tránh cache
    config.headers['X-Timestamp'] = Date.now().toString();
    
    // Xóa các headers có thể gây cache
    delete config.headers['If-None-Match'];
    delete config.headers['If-Modified-Since'];
    
    // Đảm bảo không cache cho các request quan trọng
    if (config.method?.toLowerCase() === 'post' || 
        config.method?.toLowerCase() === 'put' || 
        config.method?.toLowerCase() === 'delete') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Xử lý cả response 304 và response thành công
    if (response.status === 304) {
      console.warn('Received 304 Not Modified response');
      // Có thể return dữ liệu từ cache local hoặc retry request
      return response.data || response;
    }
    return response?.data;
  },
  (error) => {
    // Xử lý lỗi 304 trong error handler
    if (error.response?.status === 304) {
      console.warn('304 Not Modified error caught');
      // Có thể retry request hoặc return cached data
      return Promise.resolve(error.response.data || {});
    }
    
    return Promise.reject(error?.response?.data || error);
  }
);

export default axiosInstance;
