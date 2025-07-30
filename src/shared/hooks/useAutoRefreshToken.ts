import { refreshToken } from "@/features/user/api/userApis"
import { useEffect, useRef } from "react"

const useAutoRefreshToken = () => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const getCurrentToken = () => {
        try {
            const localStorageData = window.localStorage.getItem("persist:shop/user");
            if (!localStorageData) return null;
            
            const parsedData = JSON.parse(localStorageData);
            const accessToken = JSON.parse(parsedData?.token || 'null');
            return accessToken;
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    };

    const updateTokenInStorage = (newToken: string) => {
        try {
            const localStorageData = window.localStorage.getItem("persist:shop/user");
            if (!localStorageData) return;
            
            const parsedData = JSON.parse(localStorageData);
            parsedData.token = JSON.stringify(newToken);
            
            window.localStorage.setItem("persist:shop/user", JSON.stringify(parsedData));
        } catch (error) {
            console.error('Error updating token:', error);
        }
    };

    useEffect(() => {
        const currentToken = getCurrentToken();
        if (!currentToken) return;

        const handleRefreshToken = async () => {
            const currentToken = getCurrentToken();
            if (!currentToken) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                return;
            }

            try {
                const response = await refreshToken();
                
                if (response?.data) {
                    updateTokenInStorage(response.data as string);
                    console.log('Token refreshed successfully');
                }
            } catch (error) {
                console.error('Failed to refresh token:', error);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        };

        intervalRef.current = setInterval(() => {
            handleRefreshToken();
        }, 10 * 60 * 1000); 
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []); 

    return null;
}

export default useAutoRefreshToken;