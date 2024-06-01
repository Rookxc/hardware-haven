import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckoutForm({ user }) {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user.name || '',
    surname: user.surname || '',
    email: user.email || '',
    address: '',
    city: '',
    zipcode: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async  (e) => {
    e.preventDefault();
    const errors = validateFormData(formData);
    if (Object.keys(errors).length === 0) {
      console.log(formData);
      sessionStorage.removeItem('basketItems');
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/thank-you'); // Redirect to ThankYou page
    } else {
      setErrors(errors);
    }
  };

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      name: user.name || '',
      surname: user.surname || '',
      email: user.email || ''
    }));
  }, [user]);

  const validateFormData = (data) => {
    let errors = {};
    if (!data.name) {
      errors.name = 'Name is required';
    }
    if (!data.surname) {
      errors.surname = 'Surname is required';
    }
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (!data.address) {
      errors.address = 'Address is required';
    }
    if (!data.city) {
      errors.city = 'City is required';
    }
    if (!data.zipcode) {
      errors.zipcode = 'Zipcode is required';
    }
    return errors;
  };

  const isValidEmail = (email) => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
        <input name="name" value={formData.name} onChange={handleChange} id="name" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        {errors.name && <span className="text-red-500">{errors.name}</span>}
      </div>
      <div className="mb-4">
        <label htmlFor="surname" className="block text-gray-700 text-sm font-bold mb-2">Surname</label>
        <input name="surname" value={formData.surname} onChange={handleChange} id="surname" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        {errors.surname && <span className="text-red-500">{errors.surname}</span>}
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input name="email" value={formData.email} onChange={handleChange} id="email" type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
      </div>
      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
        <input name="address" value={formData.address} onChange={handleChange} id="address" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        {errors.address && <span className="text-red-500">{errors.address}</span>}
      </div>
      <div className="mb-4">
        <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City</label>
        <input name="city" value={formData.city} onChange={handleChange} id="city" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        {errors.city && <span className="text-red-500">{errors.city}</span>}
      </div>
      <div className="mb-4">
        <label htmlFor="zipcode" className="block text-gray-700 text-sm font-bold mb-2">Zipcode</label>
        <input name="zipcode" value={formData.zipcode} onChange={handleChange} id="zipcode" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        {errors.zipcode && <span className="text-red-500">{errors.zipcode}</span>}
      </div>
      <div className="flex justify-center">
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Purchase</button>
      </div>
    </form>
  );
}

export default CheckoutForm;
