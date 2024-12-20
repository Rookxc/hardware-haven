import React, { useEffect, useState } from 'react';
import axiosInstance from '../helpers/AxiosInstance';
import { TOKEN_KEY, USER_ID_KEY } from '../App';
import { useNavigate } from 'react-router-dom';
import { subscribeToPushNotifications } from '../serviceWorkerRegistration';
import useOnlineStatus from '../helpers/OnlineStatus';

export function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();

    setTimeout(() => {
      if (window.location.pathname === '/') {
        window.location.reload();
      } else {
        navigate('/');
      }
    }, 1000);
  }, []);

  return null;
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const isOnline = useOnlineStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/auth/login`, {
        email,
        password
      });

      const { token, _id, pushNofitications } = response.data;
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_ID_KEY, _id);

      // subscribe if profile has enabled push notifications
      if (pushNofitications) {
        subscribeToPushNotifications();
      }

      setMessage('Login successful');
      //change this later
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <div className="centered-container">
      <div className="container bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="email">Email:</label>
            <input
              className="form-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!isOnline}
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
              disabled={!isOnline}
            />
          </div>
          <div className="flex items-center justify-between">
            <button className={`form-button ${!isOnline && 'opacity-50 cursor-not-allowed'}`} type="submit" disabled={!isOnline}>Login</button>
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
