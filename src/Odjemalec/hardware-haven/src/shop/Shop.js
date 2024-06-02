import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../helpers/AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function Shop({ isAuthenticated }) {
  const [items, setItems] = useState([]);
  const [clickedItems, setClickedItems] = useState([]);
  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const displayItem = (id, productData) => {
    navigate(`/item-detail/${id}`, { state: { product: productData } });
  };

  const addToBasket = (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const existingBasketItems = JSON.parse(sessionStorage.getItem('basketItems')) || [];
    const updatedBasketItems = [...existingBasketItems, productId];
    sessionStorage.setItem('basketItems', JSON.stringify(updatedBasketItems));

    console.log(`Adding product with ID ${productId} to the basket.`);

    setClickedItems([...clickedItems, productId]);
  };

  const displayStock = (stock) => {
    if (stock > 5) {
      return <p className="mt-1 text-green-500 text-sm font-bold">In Stock</p>;
    } else if (stock <= 5 && stock > 1) {
      return <p className="mt-1 text-orange-500 text-sm font-bold">Limited Stock</p>;
    } else if (stock === 1) {
      return <p className="mt-1 text-red-500 text-sm font-bold">Last Piece</p>;
    } else {
      return <p className="mt-1 text-red-700 text-sm font-bold">Out of Stock</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <nav className="w-52 bg-gray-100 p-5 shadow-md">
          <ul className="space-y-2">
            <b>Categories</b>
            <li className="cursor-pointer hover:underline">All</li>
            <li className="cursor-pointer hover:underline">CPUs</li>
            <li className="cursor-pointer hover:underline">GPUs</li>
            <li className="cursor-pointer hover:underline">Motherboards</li>
            <li className="cursor-pointer hover:underline">RAM</li>
            <li className="cursor-pointer hover:underline">Storage</li>
            <li className="cursor-pointer hover:underline">Power Supplies</li>
            <li className="cursor-pointer hover:underline">Cases</li>
          </ul>
        </nav>
        <div className="flex flex-col">
          <div className="relative w-11/12 border-2 border-gray-500 rounded-md ml-6 mt-5">
            <input type="text" placeholder="Search..." className="w-full p-2 rounded-md pl-10" />
            <FontAwesomeIcon icon={faSearch} className="text-black ml-3 absolute top-1/2 transform -translate-y-1/2 left-0" />
          </div>
          <main className="flex-1 p-5 flex flex-wrap gap-5 justify-start">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item._id} className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-56">
                  <img src={item.image} alt="test_image" className="w-auto h-48 object-contain" onClick={() => displayItem(item._id, item)} />
                  <div className="p-4 flex flex-col flex-grow">
                    <b className="text-lg font-bold leading-tight h-12">{item.name}</b>
                    <p className="text-sm pt-4 overflow-hidden overflow-ellipsis whitespace-nowrap h-12">{item.description}</p>
                    <div className="flex flex-row mt-2 h-8">
                      <p className="text-xl font-bold text-black mr-2">{item.price}€</p>
                      <div className="flex-grow text-right">{displayStock(item.stock)}</div>
                    </div>
                  </div>
                  {item.stock > 0 ? (
                    <button
                      onClick={() => addToBasket(item._id)}
                      className={`py-2 w-full flex items-center justify-center rounded-b-lg ${
                        clickedItems.includes(item._id) ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-700 text-white active:bg-green-500'
                      }`}
                    >
                      {clickedItems.includes(item._id) ? <FontAwesomeIcon icon={faCheckCircle} className="text-white mr-2" /> : <FontAwesomeIcon icon={faShoppingCart} className="text-white mr-2" />} 
                      {clickedItems.includes(item._id) ? 'Add 1 more' : 'Add to Basket'}
                    </button>
                  ) : (
                    <button disabled className="bg-gray-400 text-white py-2 w-full flex items-center justify-center rounded-b-lg cursor-not-allowed">
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> Out of Stock
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No items to display</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;
