import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './Layout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Shop from './shop/Shop';
import ItemDetail from './shop/ItemDetail';
import Login from './components/Login';
import Register from './components/Registration';
import UserProfile from './components/UserProfile';
import Basket from './shop/Basket';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const instance = axios.create();

    instance.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const checkAuth = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          await instance.get(`${process.env.REACT_APP_API_URL}/api/auth/verify`);
          setIsAuthenticated(true);
        } catch (error) {
          sessionStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    return () => {
      instance.interceptors.request.eject();
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Shop isAuthenticated={isAuthenticated} />} />
            <Route path="profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route path="item-detail/:id" element={<ItemDetail /> } />
            <Route path="basket" element={isAuthenticated ? <Basket /> : <Navigate to="/login" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
