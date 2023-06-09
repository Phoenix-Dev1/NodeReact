import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
export const AuthContext = createContext();

// Used to wrap the Application with the user id and requests
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    // Check if a user is logged in
    JSON.parse(localStorage.getItem('user')) || null
  );

  // State for registration completion
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Logged in context
  const login = async (inputs) => {
    const res = await axios.post('/auth/login', inputs);
    setCurrentUser(res.data);
  };

  const registered = async (inputs) => {
    const res = await axios.post('/auth/register', inputs);
    login(inputs);
    setRegistrationComplete(true);
    setCurrentUser(res.data);
  };

  // Logged out context
  const logout = async () => {
    try {
      await axios.get('/auth/logout');
      setCurrentUser(null);
      //window.location.href = '/'; // Redirect to home page
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, login, registered, registrationComplete, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
