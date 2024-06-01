import React, { useState, useEffect } from 'react';
import axiosInstance from '../helpers/AxiosInstance';
import CheckoutForm from '../components/CheckoutForm';
import { USER_ID_KEY } from '../App';

function Basket() {
  const [basketItems, setBasketItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState({});
  useEffect(() => {
    // Fetch basket items from session storage
    const storedBasketItems = JSON.parse(sessionStorage.getItem('basketItems')) || [];
    setBasketItems(storedBasketItems);
    setLoading(false);

    // Fetch product details for each item in the basket
    async function fetchProducts() {
      try {
        const productPromises = storedBasketItems.map(async (productId) => {
          const response = await axiosInstance.get(`/products/${productId}`);
          return response.data;
        });
        const productsData = await Promise.all(productPromises);

        // Aggregate quantities for the same product
        const aggregatedProducts = [];
        productsData.forEach((product) => {
          const existingProduct = aggregatedProducts.find((p) => p._id === product._id);
          if (existingProduct) {
            existingProduct.quantity++;
          } else {
            product.quantity = 1;
            aggregatedProducts.push(product);
          }
        });

        setProducts(aggregatedProducts);

        // Calculate total price
        const total = aggregatedProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);
        setTotalPrice(total);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }

      //Fetch user data
      try {
        const fetchUserData = async () => {
          try {
            const response = await axiosInstance.get(`/users/${sessionStorage.getItem(USER_ID_KEY)}`);
            setUser(response.data);
            console.log("🚀 ~ fetchUserData ~ response.data:", response.data)
          } catch (error) {
            // setLoadingError('Error fetching user data');
          }
            
        };
    
        fetchUserData();
      } catch(error){

      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="flex justify-center items-start mt-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Basket</h1>
        {loading ? (
          <p>Loading...</p>
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
                    <td className="border px-4 py-2">{product.price}</td>
                    <td className="border px-4 py-2">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4">
              <p className="text-lg font-bold">Total Price: {totalPrice.toFixed(2)}</p>
            </div>
            {/* Add CheckoutForm component here */}
            <CheckoutForm user={user} />
            {/* <CheckoutForm user={user} /> */}
          </>
        )}
      </div>
    </div>
  );
}

export default Basket;
