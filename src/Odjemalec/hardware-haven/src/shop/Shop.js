import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../helpers/AxiosInstance';
import { FaShoppingCart, FaCheckCircle, FaSearch } from 'react-icons/fa';
import annyang from 'annyang';
import useOnlineStatus from '../helpers/OnlineStatus';
import { BASKET_KEY } from '../App';

function Shop({ isAuthenticated, handleBasketChange }) {
  const [items, setItems] = useState([]);
  const [clickedItems, setClickedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  const fetchAllProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchAllProductsWithFilters = async (params) => {
    try {
      const response = await axiosInstance.post(`/products/search`, params);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    if (annyang) {
      const commands = {
        'filter :category': filterItems,
        'filter by :category': filterItems,
        'filter by category :category': filterItems,
        'show category :category': filterItems,
        'show me :category': filterItems,
        'display :category': filterItems,
        'view :category': filterItems,
        'search :category': filterItems
      };

      annyang.addCommands(commands);
      annyang.start();
    }
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  const handleSearch = () => {
    const params = {};
    if (searchQuery !== "") params.name = searchQuery;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (selectedCategories.length > 0) params.categories = selectedCategories;
    if (sortOrder !== "") params.sortOrder = sortOrder;
    fetchAllProductsWithFilters(params);
  };

  const displayItem = (id, productData) => {
    navigate(`/item-detail/${id}`, { state: { product: productData } });
  };

  const addToBasket = async (item) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const currentProduct = items.find(itemEl => itemEl._id === item._id);

      if (!currentProduct) {
        console.error('Product not found');
        return;
      }

      const existingBasketItems = JSON.parse(sessionStorage.getItem(BASKET_KEY)) || [];
      const existingItem = existingBasketItems.filter(existingItem => existingItem.productId === item._id);

      // Check if there's enough stock before adding to the basket
      if (existingItem.length === 0 || existingItem[0].quantity < currentProduct.stock) {
        const reqBody = {
          productId: item._id,
          name: currentProduct.name,
          description: currentProduct.description,
          price: currentProduct.price,
          category: currentProduct.category,
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

        if (updatedBasketItems) {
          let itemCount = 0;
          updatedBasketItems.forEach(element => {
            itemCount += element.quantity;
          });
          handleBasketChange(itemCount);
        }
      } else {
        console.error('Not enough stock for this product');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }

    setClickedItems([...clickedItems, item._id]);
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

  const filterItems = async (category) => {
    try {
      const response = await axiosInstance.get(`/products?category=${category}`);
      setItems(response.data);

    } catch (error) {
      console.error('Error filtering products:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <nav className="w-52 bg-gray-100 p-6 shadow-md">
          <div className="mb-4">
            <b className="text-xl mb-3">Filters</b>
          </div>
          <div className="mb-2">
            <b>Categories</b>
          </div>
          <ul className="space-y-2 mx-3">
            {['GPU', 'CPU', 'Motherboard', 'RAM', 'Storage Device', 'Power Supply', 'Case'].map((category) => (
              <li key={category}>
                {isOnline ?
                  <span
                    onClick={() => handleCategoryChange(category)}
                    className={`cursor-pointer hover:opacity-50 ${selectedCategories.includes(category) && 'font-bold text-blue-500'}`}
                  >
                    {category}
                  </span>
                  :
                  <span
                    className={`text-gray-400 cursor-default`}
                  >
                    {category}
                  </span>
                }
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <b>Price Range</b>
            <div className="mt-2">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                disabled={!isOnline}
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={!isOnline}
              />
            </div>
          </div>
          <div className="mt-6">
            <b>Sort Order</b>
            <div className="mt-2">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={`w-full p-2 border rounded text-sm ${!isOnline && 'opacity-50'}`}
                disabled={!isOnline}
              >
                <option value="">-- Select --</option>
                <option value="asc">Cheapest First</option>
                <option value="desc">Expensive First</option>
                <option value="stock-low">Lowest Stock</option>
                <option value="stock-high">Highest Stock</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <button onClick={handleSearch} className={`form-button ${!isOnline && 'opacity-50 cursor-not-allowed'}`} disabled={!isOnline}>Filter</button>
          </div>
        </nav>
        <div className="flex flex-col w-full">
          <div className="relative w-11/12 border-2 border-gray-500 rounded-md ml-6 mt-5">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 rounded-md pl-10"
              disabled={!isOnline}
            />
            {isOnline ?
              <FaSearch
                className="text-black ml-3 absolute top-1/2 transform -translate-y-1/2 left-0 cursor-pointer"
                onClick={handleSearch}
              />
              :
              <FaSearch
                className="text-gray-400 ml-3 absolute top-1/2 transform -translate-y-1/2 left-0 cursor-not-allowed"
              />
            }
          </div>
          <main className="flex-1 p-5 flex flex-wrap gap-5 justify-start">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item._id} className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-56 max-h-96 my-2">
                  <img src={item.image} alt="test_image" className="w-auto h-48 object-contain" onClick={() => displayItem(item._id, item)} />
                  <div className="p-4 flex flex-col h-36">
                    <b className="text-lg font-bold leading-tight h-20">{item.name}</b>
                    <p className="text-sm  overflow-hidden overflow-ellipsis whitespace-nowrap h-12">{item.description}</p>
                    <div className="flex flex-row mt-2 h-8">
                      <p className="text-xl font-bold text-black mr-2">{item.price}€</p>
                      <div className="flex-grow text-right">{displayStock(item.stock)}</div>
                    </div>
                  </div>
                  {item.stock > 0 ? (
                    <button
                      onClick={() => addToBasket(item)}
                      className={`py-2 w-full flex items-center justify-center rounded-b-lg ${clickedItems.includes(item._id) ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-700 text-white active:bg-green-500'
                        }`}
                    >
                      {clickedItems.includes(item._id) ? <FaCheckCircle className="text-white mr-2" /> : <FaShoppingCart className="text-white mr-2" />}
                      {clickedItems.includes(item._id) ? 'Add 1 more' : 'Add to Basket'}
                    </button>
                  ) : (
                    <button disabled className="bg-gray-400 text-white py-2 w-full flex items-center justify-center rounded-b-lg cursor-not-allowed">
                      <FaShoppingCart className="mr-2" /> Out of Stock
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
