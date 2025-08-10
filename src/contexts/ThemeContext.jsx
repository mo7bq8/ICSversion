import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'modern-light';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'organization', 'modern', 'modern-light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const value = {
    theme,
    setTheme,
    isSidebarCollapsed,
    toggleSidebar,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};