import React, { createContext, useState, useContext } from 'react';

const ItemContext = createContext();

export const useItemContext = () => {
  return useContext(ItemContext);
};

export const ItemProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const deleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  return (
    <ItemContext.Provider value={{ users, setUsers, deleteUser }}>
      {children}
    </ItemContext.Provider>
  );
};
 