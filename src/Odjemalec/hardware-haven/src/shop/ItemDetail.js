import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../helpers/AxiosInstance';
import { useNavigate } from 'react-router-dom';

function ItemDetail({ isAuthenticated }) {
  const location = useLocation();
  const { product } = location.state || {};
  const navigate = useNavigate();

  const addToBasket = (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get existing basket items from session storage or initialize empty array
    const existingBasketItems = JSON.parse(sessionStorage.getItem('basketItems')) || [];

    // Add the new productId to the basket items array
    const updatedBasketItems = [...existingBasketItems, productId];

    // Save the updated basket items array to session storage
    sessionStorage.setItem('basketItems', JSON.stringify(updatedBasketItems));

    console.log(`Adding product with ID ${productId} to the basket.`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={i}
          icon={i <= rating ? faStar : farStar} 
          className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };

  if (!product) return <div>No product data available</div>;

  return (
    <div>
      <h1 className="text-2xl text-center font-bold mt-8 mb-4">{product.name}</h1>
      {product.ratings.length > 0 ? (<div className="grid grid-rows-2">
          <p className="text-center">{renderStars(product.averageRating)}</p>
          <button>Rate us</button>
        </div>
        ) : 
        (<div className="grid grid-rows-1">
        <button>Rate us</button>
      </div>)}
      <div className="flex justify-center items-start mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 m-4 w-full max-w-screen-lg">
          <div className='p-6 border-r-2'>
            <div className='grid place-items-center w-full h-96'>
              <img src={product.image} alt={product.name} className="object-contain max-w-full max-h-96 mr-8" />
            </div>
          </div>
          <div className='p-6 flex flex-col justify-center'>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{product.price}€</span>
              <span className="text-sm text-gray-500">{product.stock} in stock</span>
            </div>
            <p className="mt-4">{product.description}</p>
            <button onClick={() => addToBasket(product._id)} className="mt-4 bg-gray-800 text-white py-2 w-full flex items-center justify-center rounded-lg">
              Add to Basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
