import { useState, useEffect } from 'react';
import { BASKET_KEY } from '../App';
import axiosInstance from './AxiosInstance';

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);

      console.log("onmline")

      const items = JSON.parse(sessionStorage.getItem(BASKET_KEY)) || [];
      console.log(items)
      if (navigator.onLine && items) {
        axiosInstance.put('/basket/sync', { basketItems: items });
        console.log("t")
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return isOnline;
};

export default useOnlineStatus;