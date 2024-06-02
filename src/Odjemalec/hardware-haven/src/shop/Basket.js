import React, { useState, useEffect } from 'react';
import axiosInstance from '../helpers/AxiosInstance';
import CheckoutForm from '../components/CheckoutForm';
import { useNavigate } from 'react-router-dom';

function Basket({ isAuthenticated }) {
  const [basketItems, setBasketItems] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      const fetchBasket = async () => {
        try {
          const response = await axiosInstance.get("/basket");
          setBasketItems(response.data);
    
          // Aggregate quantities for the same product
          const aggregatedProducts = [];
          response.data.items.forEach((product) => {
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
  }, [loading, basketItems, user]);

  const removeFromBasket = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const response = await axiosInstance.delete(`/basket/${productId}`);
    setBasketItems(response.data);
  
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
                  <tr key={product._id}>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">{product.description}</td>
                    <td className="border px-4 py-2">{product.price}€</td>
                    <td className="border px-4 py-2">{product.quantity}</td>
                    <button onClick={() => removeFromBasket(product._id)} className="px-4 py-2 bg-red-500 text-white">Remove</button>
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
