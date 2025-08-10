import React, { createContext, useContext, useState } from 'react';

const PageStateContext = createContext();

export const usePageState = () => useContext(PageStateContext);

export const PageStateProvider = ({ children }) => {
  const [pageStates, setPageStates] = useState({});

  const getPageState = (key) => {
    return pageStates[key] || {};
  };

  const setPageState = (key, newState) => {
    setPageStates(prev => ({
      ...prev,
      [key]: typeof newState === 'function' ? newState(prev[key] || {}) : newState,
    }));
  };

  const value = { getPageState, setPageState };

  return (
    <PageStateContext.Provider value={value}>
      {children}
    </PageStateContext.Provider>
  );
};