import React, { useState, useEffect } from 'react';
import axiosInstance from '../helpers/AxiosInstance';


function PurchaseHistory() {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axiosInstance.get('/purchases');
        setPurchaseHistory(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  return (
    <div className="flex justify-center items-start mt-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Purchase History</h1>
        {loading ? (
          <p>Loading...</p>
        ) : purchaseHistory.length === 0 ? (
          <p>No purchases found</p>
        ) : (
          <div>
            {purchaseHistory.map((purchase, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Purchase Date: {new Date(purchase.purchaseDate).toLocaleDateString()}</h3>
                <table className="table-fixed">
                  <thead>
                    <tr>
                    <th className="w-2/12 px-3 py-2">Product</th>
                      <th className="w-7/12 px-3 py-2">Description</th>
                      <th className="w-1/12 px-3 py-2">Price</th>
                      <th className="w-1/12 px-1 py-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchase.items.map((item, i) => (
                      <tr key={i}>
                        <td className="border px-3 py-2 ">{item.name}</td>
                        <td className="border px-3 py-2">{item.description}</td>
                        <td className="border px-3 py-2 text-center">{item.price}€</td>
                        <td className="border px-3 py-2 text-center">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default PurchaseHistory;