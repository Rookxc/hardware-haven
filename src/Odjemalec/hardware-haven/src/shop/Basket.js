import React, { useState, useEffect } from 'react';
import axiosInstance from '../helpers/AxiosInstance';
import CheckoutForm from '../components/CheckoutForm';
import { BASKET_KEY } from '../App';
import useOnlineStatus from '../helpers/OnlineStatus';
import { useNavigate } from 'react-router-dom';

function Basket({ isAuthenticated }) {
  const [basketItems, setBasketItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState({});

  const isOnline = useOnlineStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      const fetchBasket = async () => {
        try {
          let items = [];

          if (isOnline) {
            const response = await axiosInstance.get("/basket");
            setBasketItems(response.data.items);
            items = response.data.items;
            sessionStorage.setItem(BASKET_KEY, JSON.stringify(items));
          } else {
            items = JSON.parse(sessionStorage.getItem(BASKET_KEY)) || [];
            setBasketItems(items);
          }

          // Aggregate quantities for the same product
          const aggregatedProducts = [];
          items.forEach((product) => {
            const existingProduct = aggregatedProducts.find((p) => p.productId === product.productId);
            if (existingProduct) {
              existingProduct.quantity += product.quantity;
            } else {
              aggregatedProducts.push({ ...product });
            }
          });

          setProducts(aggregatedProducts);

          // Calculate total price
          const total = aggregatedProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);
          setTotalPrice(total);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching basket:', error);
        }
      };

      const fetchUserData = async () => {
        try {
          const response = await axiosInstance.get(`/user`);
          setUser(response.data);
          console.log("🚀 ~ fetchUserData ~ response.data:", response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchBasket();
      fetchUserData();
    }
  }, [loading, basketItems, user, isOnline]);

  const removeFromBasket = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    console.log(productId)

    if (isOnline) {
      console.log("online")
      const response = await axiosInstance.delete(`/basket/${productId}`);
      setBasketItems(response.data.items);
      sessionStorage.setItem(BASKET_KEY, JSON.stringify(response.data.items));
    } else {
      const existingBasketItems = JSON.parse(sessionStorage.getItem(BASKET_KEY)) || [];
      let updatedBasketItems = [...existingBasketItems];

      console.log(productId)

      const existingItemIndex = updatedBasketItems.findIndex(existingItem => existingItem.productId === productId);


      if (existingItemIndex !== -1) {
        updatedBasketItems.splice(existingItemIndex, 1);
      }

      sessionStorage.setItem(BASKET_KEY, JSON.stringify(updatedBasketItems));
    }

    console.log(`Removing one instance of product with ID ${productId} from the basket.`);

    // Forcefully reload the page
    window.location.reload();
  };

  return (
    <div className="flex justify-center items-start mt-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Basket</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {products.length === 0 ? (
              <p>Your basket is empty</p>
            ) : (
              <>
                <table className="table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Product</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.productId}>
                        <td className="border px-4 py-2">{product.name}</td>
                        <td className="border px-4 py-2">{product.description}</td>
                        <td className="border px-4 py-2">{product.price}€</td>
                        <td className="border px-4 py-2">{product.quantity}</td>
                        <td className='p-0'><button onClick={() => removeFromBasket(product.productId)} className="px-4 py-2 bg-red-500 text-white">Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right mt-4">
                  <p className="text-lg font-bold">Total Price: {totalPrice.toFixed(2)}€</p>
                </div>
                <CheckoutForm user={user} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Basket;
