import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../helpers/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { USER_ID_KEY } from '../App';

function ItemDetail({ isAuthenticated }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { product } = location.state || {};
  const userId = sessionStorage.getItem(USER_ID_KEY); // Get the user ID from session storage


  const fetchUserRating = async () => {
    if (product && userId) {
      const userRating = await product.ratings.find(r => r.userId === userId);
      if (userRating) {
        setSelectedRating(userRating.value);
      }
    }
  }
  useEffect(() => {
    fetchUserRating();
  }, []);

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
          icon={i <= rating ? faSolidStar : faRegularStar} 
          className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };

  const handleMouseEnter = (rating) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleRatingClick = (rating) => {
    setIsClicked(true)
    setSelectedRating(rating);
  };

  const confirmRating = async () => {
    try {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      const response = await axiosInstance.put(`/products/secure/ratings/${product._id}`, { rating: selectedRating });
      console.log('Rating confirmed:', response.data);
      // Disable confirm button
      setIsDisabled(true);
    } catch (error) {
      console.error('Error confirming rating:', error);
    }
  };

  if (!product) return <div>No product data available</div>;

  return (
    <div>
      <h1 className="text-2xl text-center font-bold mt-8 mb-4">{product.name}</h1>
      {product.ratings.length > 0 ? (
        <div className="grid grid-rows-1">
          <p className="text-center">{renderStars(product.averageRating)} ({product.ratings.length})</p>
        </div>
      ) : (
        ''
      )}
      <div className="flex justify-center items-start mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 m-4 w-full max-w-screen-lg">
          <div className="p-6 border-r-2">
            <div className="grid place-items-center w-full h-96">
              <img src={product.image} alt={product.name} className="object-contain max-w-full max-h-96 mr-8" />
            </div>
          </div>
          <div className="p-6 flex flex-col justify-center">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{product.price}€</span>
              <span className="text-sm text-gray-500">{product.stock} in stock</span>
            </div>
            <div className="grid grid-cols-2">
              <p className="mt-4">Brand: {product.brand}</p>
              <p className="mt-4 text-right">
                <span className="bg-blue-400 text-white rounded p-1">{product.category}</span>
              </p>
            </div>
            <p className="mt-4">{product.description}</p>
            <button onClick={() => addToBasket(product._id)} className="mt-4 bg-gray-800 text-white py-2 w-full flex items-center justify-center rounded-lg">
              Add to Basket
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Rate this product</h2>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((rating) => (
            <FontAwesomeIcon
              key={rating}
              icon={rating <= (hoveredRating || selectedRating) ? faSolidStar : faRegularStar}
              className="text-yellow-500 cursor-pointer"
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleRatingClick(rating)}
            />
          ))}
        </div>
        {selectedRating > 0 && isClicked && (
          <button onClick={confirmRating} className="mt-4 mb-4 bg-blue-500 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isDisabled}>
            Confirm Rating
          </button>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;
