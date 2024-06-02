import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './Layout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Shop from './shop/Shop';
import ItemDetail from './shop/ItemDetail';
import Login, { Logout } from './user/Login';
import Register from './user/Registration';
import UserProfile from './user/UserProfile';
import Basket from './shop/Basket';
import axiosInstance from './helpers/AxiosInstance';
import NotFound from './NotFound';
import ThankYou from './shop/ThankYou';
import Admin from './shop/Admin';
import PurchaseHistory from './shop/PurchaseHistory';

export const TOKEN_KEY = 'token';
export const USER_ID_KEY = 'userId';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          await axiosInstance.get(`/auth/verify`);
          setIsAuthenticated(true);
        } catch (error) {
          sessionStorage.removeItem(TOKEN_KEY);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout isAuthenticated={isAuthenticated} />}>
            <Route index element={<Shop isAuthenticated={isAuthenticated} />} />
            <Route path="profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route path="item-detail/:id" element={<ItemDetail isAuthenticated={isAuthenticated} /> } />
            <Route path="basket" element={isAuthenticated ? <Basket isAuthenticated={isAuthenticated} /> : <Navigate to="/login" />} />
            <Route path="/purchase-history" element={isAuthenticated ? <PurchaseHistory /> : <Navigate to="/login" />} />
            <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
