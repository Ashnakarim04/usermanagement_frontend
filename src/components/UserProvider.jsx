import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userss, setUserss] = useState([]);

  const fetchUsers = async () => {
    // const response = await fetch('/api/users');
    const response = await fetch('https://usermanagement-backend-vxs3.onrender.com/api/users');

    const data = await response.json();
    setUserss(data);
  };

  return (
    <UserContext.Provider value={{ userss, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
