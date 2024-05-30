import { React } from 'react';
import './App.css';
import Layout from './Layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Shop from './Shop';
import Profile from './Profile';
import Login from './components/Login';
import Register from './components/Registration';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Shop />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
