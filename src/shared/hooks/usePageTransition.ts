import { useRouter } from "next/navigation";
import { useAppDispatch } from "./useAppHook"
import { useCallback } from "react";
import { hideModal, showModal } from "../store/appSlice";
// Loading khi chuyển trang
export const usePageTransition = () => {
    const dispatch  = useAppDispatch();
    const router = useRouter();
    const navigateWithLoading = useCallback((path: string, delay: number = 800) => {
        dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
        // Chuyển trang sau một thời gian
        setTimeout(() => {
            router.push(path);
            setTimeout(() => {
                dispatch(hideModal())
            }, 500);
        }, delay)
    },[dispatch, router])
    return {navigateWithLoading};
}