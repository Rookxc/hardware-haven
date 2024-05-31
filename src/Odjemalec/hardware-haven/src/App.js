import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './Layout';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Shop from './shop/Shop';
import ItemDetail from './shop/ItemDetail';
import Login, { Logout } from './user/Login';
import Register from './user/Registration';
import UserProfile from './user/UserProfile';
import Basket from './shop/Basket';
import axiosInstance from './helpers/AxiosInstance';
import NotFound from './NotFound';

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
          await axiosInstance.get(`/api/auth/verify`);
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
            <Route path="item-detail/:id" element={<ItemDetail /> } />
            <Route path="basket" element={isAuthenticated ? <Basket /> : <Navigate to="/login" />} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
