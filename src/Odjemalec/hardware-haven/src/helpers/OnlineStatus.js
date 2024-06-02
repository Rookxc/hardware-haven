import { useState, useEffect } from 'react';
import { BASKET_KEY } from '../App';
import axiosInstance from './AxiosInstance';

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);

      const items = JSON.parse(sessionStorage.getItem(BASKET_KEY)) || [];

      if (navigator.onLine && items) {
        axiosInstance.put('/basket/sync', { basketItems: items });
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