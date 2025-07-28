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

// Lấy token hiện có
const getAccessToken = (): string | null => {
  try {
    const localStorageData = window.localStorage.getItem("persist:shop/user");
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      const accessToken = JSON.parse(parsedData?.token || 'null');
      return accessToken;
    }
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
  }
  return null;
};

// Cập nhật token mới khi token cũ hết hạn
const updateTokenInStorage = (newToken: string): void => {
  try {
    const localStorageData = window.localStorage.getItem("persist:shop/user");
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      parsedData.token = JSON.stringify(newToken);
      window.localStorage.setItem("persist:shop/user", JSON.stringify(parsedData));
    }
  } catch (error) {
    console.error("Error updating token in localStorage:", error);
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers['X-Timestamp'] = Date.now().toString();
    
    delete config.headers['If-None-Match'];
    delete config.headers['If-Modified-Since'];
    
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

// Biến cờ để ngăn chặn nhiều lần gọi refresh-token cùng lúc
let isRefreshing = false;

// Hàng đợi chứa các request bị lỗi 401 và đang chờ token mới
type FailedRequest = {
  resolve: (token: string | null) => void;
  reject: (error?: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

// Hàm xử lý lại các request trong hàng đợi sau khi refresh token thành công hoặc thất bại
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error); // Gọi lại các request với lỗi nếu không refresh được
    } else {
      resolve(token); // Gọi lại các request với token mới nếu refresh thành công
    }
  });

  failedQueue = []; // Reset hàng đợi
};

axiosInstance.interceptors.response.use(
  (response) => {
    // Nếu response là 304 (Not Modified), có thể lấy dữ liệu từ cache hoặc xử lý khác
    if (response.status === 304) {
      console.warn('Received 304 Not Modified response');
      return response.data || response;
    }

    // Mặc định trả về dữ liệu response
    return response?.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Trường hợp lỗi 304 nằm trong phần catch (ít gặp)
    if (error.response?.status === 304) {
      console.warn('304 Not Modified error caught');
      return Promise.resolve(error.response.data || {});
    }

    // Nếu lỗi 401 và request chưa từng được retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đang có request khác đang refresh token → đưa request này vào hàng đợi
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        });
      }

      // Đánh dấu là đã retry và bắt đầu quá trình refresh token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API backend để refresh token từ cookie
        const response = await axios.post('/api/user/refresh-token', {}, {
          withCredentials: true,
          timeout: 10000
        });

        // Lấy accessToken mới từ backend trả về
        const newToken = response.data?.accessToken || response.data?.token;

        if (newToken) {
          // Cập nhật lại token mới vào localStorage
          updateTokenInStorage(newToken);

          // Gắn token mới vào request gốc
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Thực thi lại các request bị treo trong hàng đợi
          processQueue(null, newToken);

          // Gửi lại request ban đầu
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Không nhận được accessToken từ API refresh-token');
        }
      } catch (refreshError) {
        console.error('Lỗi khi gọi refresh-token:', refreshError);

        // Nếu refresh thất bại → xóa token trong localStorage
        try {
          const localStorageData = window.localStorage.getItem("persist:shop/user");
          if (localStorageData) {
            const parsedData = JSON.parse(localStorageData);
            parsedData.token = JSON.stringify(null);
            window.localStorage.setItem("persist:shop/user", JSON.stringify(parsedData));
          }
        } catch (storageError) {
          console.error("Lỗi khi xóa token trong localStorage:", storageError);
        }

        // Gọi lại các request bị chờ với lỗi
        processQueue(refreshError, null);

        // Option: Chuyển hướng về trang đăng nhập nếu cần
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        // Kết thúc quá trình refresh
        isRefreshing = false;
      }
    }

    // Các lỗi khác không phải 401
    return Promise.reject(error?.response?.data || error);
  }
);


export default axiosInstance;
