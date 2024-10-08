import React, { useState, useEffect } from 'react';
import { FaStar as FaSolidStar, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../helpers/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { BASKET_KEY, USER_ID_KEY } from '../App';
import useOnlineStatus from '../helpers/OnlineStatus';

//Deploy 
function ItemDetail({ isAuthenticated, handleBasketChange }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [clickedItems, setClickedItems] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const isOnline = useOnlineStatus();

  const navigate = useNavigate();
  const location = useLocation();

  const { product } = location.state || {};
  const userId = sessionStorage.getItem(USER_ID_KEY);

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

  const addToBasket = async (item) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const existingBasketItems = JSON.parse(sessionStorage.getItem(BASKET_KEY)) || [];
      const existingItem = existingBasketItems.filter(existingItem => existingItem.productId === item._id);

      // Check if there's enough stock before adding to the basket
      if (existingItem.length === 0 || existingItem[0].quantity < product.stock) {
        const reqBody = {
          productId: item._id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          quantity: 1
        }

        let updatedBasketItems;

        if (isOnline) {
          const response = await axiosInstance.post('/basket', reqBody);
          updatedBasketItems = response.data.items;
          sessionStorage.setItem(BASKET_KEY, JSON.stringify(updatedBasketItems));
        } else {
          updatedBasketItems = [...existingBasketItems];
          const existingItemIndex = updatedBasketItems.findIndex(existingItem => existingItem.productId === item._id);

          if (existingItemIndex !== -1) {
            updatedBasketItems[existingItemIndex].quantity += reqBody.quantity;
          } else {
            updatedBasketItems.push(reqBody);
          }

          sessionStorage.setItem(BASKET_KEY, JSON.stringify(updatedBasketItems));
        }

        if(updatedBasketItems) {
          let itemCount = 0;
          updatedBasketItems.forEach(element => {
            itemCount += element.quantity;
          });
          handleBasketChange(itemCount);
        }

        setClickedItems([...clickedItems, item._id]);
      } else {
        console.error('Not enough stock for this product');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const renderStars = (rating) => {
    console.log(rating)
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaSolidStar 
          key={i}
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
        <div className="flex justify-center items-center">
          {renderStars(product.averageRating)}
          <span className="px-2">{product.averageRating}</span>
          <span>({product.ratings.length})</span>
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
            {product.stock > 0 ? (
              <button 
                onClick={() => addToBasket(product)}
                className={`mt-4 bg-gray-800 text-white py-2 w-full flex items-center justify-center rounded-lg ${
                  clickedItems.includes(product._id) ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-700 text-white active:bg-green-500'
                }`}
              >
              {clickedItems.includes(product._id) ? <FaCheckCircle className="text-white mr-2" /> : <FaShoppingCart className="text-white mr-2" />} 
              {clickedItems.includes(product._id) ? 'Add 1 more' : 'Add to Basket'}
            </button>
            ) : (
              <button disabled className="mt-4 bg-gray-400 text-white py-2 w-full flex items-center justify-center rounded-lg cursor-not-allowed">
                <FaShoppingCart className="mr-2" /> Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Rate this product</h2>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((rating) => (
            <FaSolidStar
              key={rating}
              className={`cursor-pointer ${rating <= (hoveredRating || selectedRating) ? 'text-yellow-500' : 'text-gray-300'}`}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleRatingClick(rating)}
            />
          ))}
        </div>
        {selectedRating > 0 && isClicked && (
          <button onClick={confirmRating} className="mt-4 mb-4 bg-blue-500 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isDisabled || !isOnline}>
            Confirm Rating
          </button>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;
