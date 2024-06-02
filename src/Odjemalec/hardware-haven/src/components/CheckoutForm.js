import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../helpers/AxiosInstance';
import Input from './Input';

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

    setErrors({
      ...errors,
      [name]: false
    });

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFormData(formData);
    if (Object.keys(errors).length === 0) {
      console.log(formData);
      await axiosInstance.post('/purchases');
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
        <Input
          label="Name"
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
      </div>
      <div className="mb-4">
        <Input
          label="Surname"
          id="surname"
          name="surname"
          type="text"
          value={formData.surname}
          onChange={handleChange}
          error={errors.surname}
        />
      </div>
      <div className="mb-4">
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
      </div>
      <div className="mb-4">
        <Input
          label="Address"
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
        />
      </div>
      <div className="mb-4">
        <Input
          label="City"
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
        />
      </div>
      <div className="mb-4">
        <Input
          label="Zipcode"
          id="zipcode"
          name="zipcode"
          type="text"
          value={formData.zipcode}
          onChange={handleChange}
          error={errors.zipcode}
        />
      </div>
      <div className="flex justify-center">
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">Purchase</button>
      </div>
    </form>
  );
}

export default CheckoutForm;
