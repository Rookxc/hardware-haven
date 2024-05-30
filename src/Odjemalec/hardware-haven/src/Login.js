import { React, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function Login() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users`)
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div className="App">
      Login 
      {data && data.user.name}
    </div>
  );
}

export default Login;
