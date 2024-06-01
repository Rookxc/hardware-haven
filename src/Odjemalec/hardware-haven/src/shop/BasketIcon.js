import React, { useState, useEffect } from 'react';
import { FaShoppingBasket } from 'react-icons/fa';

const BasketIcon = ({ basketItemCount  }) => {
  const [basketItemCount, setBasketItemCount] = useState(0);

  useEffect(() => {
    const storedBasketItems = JSON.parse(sessionStorage.getItem('basketItems')) || [];
    setBasketItemCount(storedBasketItems.length);
  }, []);

  return (
    <div className={`fixed bottom-8 right-8`}>
      <a href="/basket" className="flex items-center justify-center bg-blue-500 text-white rounded-full w-12 h-12 hover:bg-blue-600 relative">
        <FaShoppingBasket className="h-6 w-6" />
        {basketItemCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1 ml-1 absolute top-7 right-7">{basketItemCount}</span>
        )}
      </a>
    </div>
  );
};

export default BasketIcon;
