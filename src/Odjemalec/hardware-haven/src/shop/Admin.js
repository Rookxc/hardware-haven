import React, { useState, useEffect } from 'react';
import axiosInstance from '../helpers/AxiosInstance';

function Admin() {
  const [action, setAction] = useState('');
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    category: '',
    description: '',
    price: '',
    image: '',
    brand: '',
    stock: '',
    ratings: []
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (action === 'add') {
        const { _id, ...newProductData } = formData;
        newProductData.ratings = [];
        await axiosInstance.post('/products/secure', newProductData);
      } else if (action === 'update') {
        await axiosInstance.put(`/products/secure/${formData._id}`, formData);
      } else if (action === 'delete') {
        await axiosInstance.delete(`/products/secure/${formData._id}`);
      }

      window.location.reload(); // Refresh the page on success

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRowClick = (product) => {
    setFormData({
      _id: product._id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      image: product.image,
      brand: product.brand,
      stock: product.stock,
      ratings: []
    });
    setAction('update'); // Automatically switch to update mode
  };

  const handleActionChange = (e) => {
    const selectedAction = e.target.value;
    setAction(selectedAction);

    if (selectedAction === 'add') {
      setFormData({
        _id: '',
        name: '',
        category: '',
        description: '',
        price: '',
        image: '',
        brand: '',
        stock: '',
        ratings: []
      });
    } else if (selectedAction === 'update') {
      setFormData((prevData) => ({
        ...prevData,
        ratings: []
      }));
    }
  };
  
  const categories = ['GPU', 'CPU', 'Motherboard', 'RAM', 'Storage Device', 'Power Supply', 'Case'];

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold my-6">Admin Panel</h1>
      <div className="w-full flex justify-center mb-4">
        <select
          value={action}
          onChange={handleActionChange}
          className="border border-gray-300 p-2"
        >
          <option value="">Select Action</option>
          <option value="add">Add Product</option>
          <option value="update">Update Product</option>
          <option value="delete">Delete Product</option>
        </select>
      </div>
      {action && (
        <form onSubmit={handleSubmit} className="flex flex-col border border-gray-300 p-4 mb-4 w-full max-w-lg">
          {action !== 'delete' && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 p-2 mb-2"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border border-gray-300 p-2 mb-2"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-300 p-2 mb-2"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="border border-gray-300 p-2 mb-2"
                required
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
                className="border border-gray-300 p-2 mb-2"
                required
              />
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                className="border border-gray-300 p-2 mb-2"
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                className="border border-gray-300 p-2 mb-2"
                required
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                {action === 'add' ? 'Add Product' : 'Update Product'}
              </button>
            </>
          )}
          {action === 'delete' && (
            <>
              <select
                name="_id"
                value={formData._id}
                onChange={handleChange}
                className="border border-gray-300 p-2 mb-2"
                required
              >
                <option value="">Select Product to Delete</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>{product.name}</option>
                ))}
              </select>
              <button type="submit" className="bg-red-500 text-white p-2 rounded">
                Delete Product
              </button>
            </>
          )}
        </form>
      )}
      <div className="w-full my-8 flex justify-center">
        <table className="table-fixed w-10/12">
          <thead>
            <tr>
              <th className="w-1/12 px-4 py-2">Image</th>
              <th className="w-2/12 px-4 py-2">Product</th>
              <th className="w-3/12 px-4 py-2">Description</th>
              <th className="w-1/12 px-4 py-2">Category</th>
              <th className="w-1/12 px-4 py-2">Brand</th>
              <th className="w-1/12 px-4 py-2">Price</th>
              <th className="w-1/12 px-4 py-2">Stock</th>
              <th className="w-2/12 px-4 py-2">Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} onClick={() => handleRowClick(product)} className="cursor-pointer hover:bg-gray-100">
                <td className="border px-4 py-2 text-center">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-contain" />
                </td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2 text-center">{product.category}</td>
                <td className="border px-4 py-2 text-center">{product.brand}</td>
                <td className="border px-4 py-2 text-center">{product.price}€</td>
                <td className="border px-4 py-2 text-center">{product.stock}</td>
                <td className="border px-4 py-2 text-center">{product.ratings.length > 0 ? product.averageRating : 'No ratings'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
