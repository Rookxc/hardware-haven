import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditingState = {
  NONE: 'None',
  USER_DATA: 'UserData',
  PASSWORD: 'Password'
};

function UserProfile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingState, setEditingState] = useState(EditingState.NONE);
  const [message, setMessage] = useState('');
  const [editedUser, setEditedUser] = useState({});
  const [editedPassword, setEditedPassword] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/6658d4a9668798dba2f83884`);
        setUser(response.data);
        setEditedUser(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (editingState === EditingState.PASSWORD) {
      if (!editedPassword.newPassword) {
        setMessage("New password can't be empty");
      } else if (editedPassword.newPassword !== editedPassword.repeatPassword) {
        setMessage("New passwords don't match");
      } else {
        try {
          await axios.put(`${process.env.REACT_APP_API_URL}/users/update-password/6658d4a9668798dba2f83884`, editedPassword);
          setEditingState(EditingState.USER_DATA);
          setMessage('Password updated successfully');
        } catch (error) {
          if (error && error.response && error.response.data && error.response.data.message) {
            setMessage(error.response.data.message);
          } else {
            setMessage('Password update failed');
          }
        }
      }
    } else {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/users/6658d4a9668798dba2f83884`, editedUser);
        setUser(editedUser);
        setEditingState(EditingState.NONE);
        setMessage('Profile updated successfully');
      } catch (error) {
        setMessage('Profile update failed');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setEditedPassword((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="centered-container">Loading...</div>;
  }

  if (error) {
    return <div className="centered-container">{error}</div>;
  }

  return (
    <div className="centered-container">
      <div className="container bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" style={{ marginBottom: '10vh' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-center">User Profile</h2>
          {editingState === EditingState.NONE &&
            <button onClick={() => setEditingState(EditingState.USER_DATA)} className="focus:outline-none">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </button>}
        </div>
        {editingState !== EditingState.PASSWORD &&
          <>
            <div className="mb-4">
              <label className="form-label" htmlFor="name">Name:</label>
              {editingState === EditingState.USER_DATA ? (
                <input
                  className="form-input"
                  type="text"
                  id="name"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                />
              ) : (
                <div className="form-input">{user.name}</div>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="surname">Surname:</label>
              {editingState === EditingState.USER_DATA ? (
                <input
                  className="form-input"
                  type="text"
                  id="surname"
                  name="surname"
                  value={editedUser.surname}
                  onChange={handleChange}
                />
              ) : (
                <div className="form-input">{user.surname}</div>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="email">Email:</label>
              {editingState === EditingState.USER_DATA ? (
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                />
              ) : (
                <div className="form-input">{user.email}</div>
              )}
            </div>
          </>
        }
        {editingState === EditingState.USER_DATA &&
          <div className="flex items-center justify-left mb-4">
            <button className="form-button-neutral w-full" onClick={() => {
              setEditingState(EditingState.PASSWORD);
              setEditedPassword({});
            }}>Edit password</button>
          </div>
        }
        {editingState === EditingState.PASSWORD &&
          <>
            <div className="mb-4">
              <label className="form-label" htmlFor="password">Current Password:</label>
              <input
                className="form-input"
                type="password"
                id="password"
                name="password"
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="newPassword">New Password:</label>
              <input
                className="form-input"
                type="password"
                id="newPassword"
                name="newPassword"
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="repeatPassword">Repeat New Password:</label>
              <input
                className="form-input"
                type="password"
                id="repeatPassword"
                name="repeatPassword"
                onChange={handlePasswordChange}
              />
            </div>
          </>
        }
        {editingState !== EditingState.NONE &&
          <div className="flex items-center justify-left">
            <button className="form-button" onClick={handleSubmit}>Save</button>
            <button className="form-button-danger ml-2" onClick={() => {
              setMessage('')

              if (editingState === EditingState.PASSWORD) {
                setEditingState(EditingState.USER_DATA);
              } else {
                setEditingState(EditingState.NONE);
              }
            }}>Cancel</button>
          </div>
        }
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default UserProfile;
