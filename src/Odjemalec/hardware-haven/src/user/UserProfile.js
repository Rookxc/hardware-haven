import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import { FiEdit2 } from "react-icons/fi";
import validateEmail from '../helpers/Validator';
import axiosInstance from '../helpers/AxiosInstance';
import sendPushNotification from '../helpers/PushNotification';
import Checkbox from '../components/Checkbox';
import { subscribeToPushNotifications, unsubscribeFromPushNotifications } from '../serviceWorkerRegistration';
import useOnlineStatus from '../helpers/OnlineStatus';

const EditingState = {
  NONE: 'None',
  USER_DATA: 'UserData',
  PASSWORD: 'Password'
};

function UserProfile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');
  const [editingState, setEditingState] = useState(EditingState.NONE);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const [editedPassword, setEditedPassword] = useState({});
  const [editDataTooltip, setEditDataTooltip] = useState('');

  const isOnline = useOnlineStatus();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/user`);
        setUser(response.data);
        setEditedUser({ ...response.data, pushNotifications: response.data.pushNotifications || false });
        setLoading(false);
      } catch (error) {
        setLoadingError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if(!isOnline) {
      setEditingState(EditingState.NONE);
    }
  }, [isOnline]);

  const handleSubmit = async () => {
    setMessage('');

    if (editingState === EditingState.PASSWORD) {
      let valid = true;

      if (!editedPassword.password) {
        setErrorChange("password", "This field is required.");
        valid = false;
      }

      if (!editedPassword.newPassword) {
        setErrorChange("newPassword", "This field is required.");
        valid = false;
      } else if (editedPassword.newPassword !== editedPassword.repeatPassword) {
        setErrorChange("repeatPassword", "Passwords don't match.");
        valid = false;
      }

      if (valid) {
        try {
          await axiosInstance.put(`/user/update-password`, editedPassword);

          setEditingState(EditingState.USER_DATA);
          setMessage('Password updated successfully.');
        } catch (error) {
          const responseData = error?.response?.data;

          if (responseData?.message) {
            if (responseData.field) {
              setErrorChange(responseData.field, responseData.message);
              setMessage('');
            } else {
              setMessage(responseData.message);
            }
          } else {
            setMessage('Password update failed.');
          }
        }
      }
    } else {
      let valid = true;

      if (!editedUser.name) {
        setErrorChange("name", "This field is required.");
        valid = false;
      }

      if (!editedUser.surname) {
        setErrorChange("surname", "This field is required.");
        valid = false;
      }

      if (!editedUser.email) {
        setErrorChange("email", "This field is required.");
        valid = false;
      } else if (!validateEmail(editedUser.email)) {
        setErrorChange("email", "Please enter a valid email address.");
        valid = false;
      }

      if (valid) {
        if (editedUser.pushNotifications) {
          subscribeToPushNotifications();
        } else {
          unsubscribeFromPushNotifications();
        }

        try {
          const response = await axiosInstance.put(`/user`, editedUser);
          if (response.status === 200) {
            console.log("Success");
            sendPushNotification('User updated', 'User updated successfully');

            setUser(editedUser);
            setEditingState(EditingState.NONE);
            setMessage('Profile updated successfully.');
          } else {
            setMessage('Profile update failed.');
          }
        } catch (error) {
          if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
            error.response.data.errors.forEach(item => {
              setErrorChange(item.field, item.message);
            });
          } else {
            setMessage('Profile update failed.');
          }
        }
      }
    }
  };

  const setErrorChange = (fieldName, value) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (!value) {
        delete newErrors[fieldName];
      } else {
        newErrors[fieldName] = value;
      }

      return newErrors;
    });
  };

  const handleUserDataChange = (e) => {
    const { name, value, checked, type } = e.target;

    setErrorChange(name, false);

    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setErrorChange(name, false);

    setEditedPassword((prevPassword) => ({
      ...prevPassword,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="centered-container">Loading...</div>;
  }

  if (loadingError) {
    return <div className="centered-container">{loadingError}</div>;
  }

  return (
    <div className="centered-container">
      <div className="container bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-center">User Profile</h2>
          {editingState === EditingState.NONE &&
            <div
              className="relative"
              onMouseEnter={() => {
                if (!isOnline) {
                  setEditDataTooltip('Functionality is disabled because user is offline.');
                }
              }}
              onMouseLeave={() => {
                setEditDataTooltip('');
              }}
            >
              <button
                onClick={() => {
                  setMessage('');
                  setEditingState(EditingState.USER_DATA);
                }}
                disabled={!isOnline}>
                <FiEdit2 className={`w-5 h-5 ${isOnline ? 'text-black' : 'text-gray-400'}`} />
              </button>
              {!isOnline && editDataTooltip && (
                <div className="top-0 tooltip">
                  {editDataTooltip}
                </div>
              )}
            </div>
          }
        </div>
        {editingState !== EditingState.PASSWORD &&
          <>
            <div className="mb-4">
              <label className="form-label" htmlFor="name">Name:</label>
              {editingState === EditingState.USER_DATA ? (
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={editedUser.name}
                  onChange={handleUserDataChange}
                  error={errors["name"]}
                />
              ) : (
                <div className="form-input">{user.name}</div>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="surname">Surname:</label>
              {editingState === EditingState.USER_DATA ? (
                <Input
                  type="text"
                  id="surname"
                  name="surname"
                  value={editedUser.surname}
                  onChange={handleUserDataChange}
                  error={errors["surname"]}
                />
              ) : (
                <div className="form-input">{user.surname}</div>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="email">Email:</label>
              {editingState === EditingState.USER_DATA ? (
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleUserDataChange}
                  error={errors["email"]}
                />
              ) : (
                <div className="form-input">{user.email}</div>
              )}
            </div>
            <div className="mb-4">
              <Checkbox
                label="Push Notifications"
                id="pushNotifications"
                name="pushNotifications"
                checked={editingState === EditingState.USER_DATA ? editedUser.pushNotifications : user.pushNotifications}
                onChange={handleUserDataChange}
                disabled={editingState !== EditingState.USER_DATA}
              />
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
              <Input
                label="Current Password"
                type="password"
                id="password"
                name="password"
                onChange={handlePasswordChange}
                error={errors["password"]}
              />
            </div>
            <div className="mb-4">
              <Input
                label="New Password"
                type="password"
                id="newPassword"
                name="newPassword"
                onChange={handlePasswordChange}
                error={errors["newPassword"]}
              />
            </div>
            <div className="mb-4">
              <Input
                label="Repeat New Password"
                type="password"
                id="repeatPassword"
                name="repeatPassword"
                onChange={handlePasswordChange}
                error={errors["repeatPassword"]}
              />
            </div>
          </>
        }
        {message && <p className="message mb-4">{message}</p>}
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
      </div>
    </div>
  );
}

export default UserProfile;
