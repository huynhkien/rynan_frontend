
import createWebStorage from "redux-persist/es/storage/createWebStorage";


// khi chạy trên server, nó giả lập localStorage nhưng không lưu gì cả => tránh lỗi mà vẫn cho redux hoạt động
const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem() {
            return Promise.reject();
        },
        removeItem() {
            return Promise.resolve();
        }
    }
}

const storage = typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

export default storage;