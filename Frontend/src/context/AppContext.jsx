import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AppContext.Provider value={{ chatModalOpen, setChatModalOpen, activeTab, setActiveTab }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
