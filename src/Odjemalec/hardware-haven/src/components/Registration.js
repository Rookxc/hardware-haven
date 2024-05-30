import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [surname, setSurname] = useState(''); 
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        email,
        surname,
        password
      });
      setMessage('Registration successful');
      //change this later
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{ marginBottom: '10vh' }}>
      <div className="container bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="name">Name:</label>
            <input
              className="form-input"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="surname">Surname:</label> {/* Add surname field */}
            <input
              className="form-input"
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="email">Email:</label>
            <input
              className="form-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="form-label" htmlFor="password">Password:</label>
            <input
              className="form-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="form-button" type="submit">Register</button>
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Register;
