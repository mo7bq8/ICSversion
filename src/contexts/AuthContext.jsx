import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSsoEnabled, setIsSsoEnabled] = useState(false);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const ssoStatus = localStorage.getItem('ssoEnabled') === 'true';
    setIsSsoEnabled(ssoStatus);
    const storedAuditLog = getInitialData('auditLog', []);
    setAuditLog(storedAuditLog);
    setLoading(false);
  }, []);

  const getInitialData = (key, defaultValue) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  };
  
  const saveData = (key, data) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  };

  const logAction = (action, details) => {
    const newLogEntry = {
      id: Date.now(),
      user: user?.name || 'System',
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLog(prevLog => {
      const updatedLog = [newLogEntry, ...prevLog];
      saveData('auditLog', updatedLog);
      return updatedLog;
    });
  };

  const login = (email, password) => {
    if (email && password) {
      const roles = getInitialData('roles', []);
      const users = getInitialData('users', []);
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if(foundUser){
        const userRole = roles.find(r => r.name === foundUser.role);
        const userData = { ...foundUser, permissions: userRole?.permissions || {} };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        logAction('Login', `User ${email} logged in.`);
        return true;
      }
    }
    logAction('Login Failed', `Failed login attempt for ${email}.`);
    return false;
  };

  const demoLogin = () => {
    const roles = getInitialData('roles', []);
    const users = getInitialData('users', []);
    const demoUser = users.find(u => u.email === 'demo.user@kipic.com');

    if (!demoUser) {
        console.error("Demo user not found in seed data!");
        return false;
    }

    const userRole = roles.find(r => r.name === demoUser.role);
    const userData = { ...demoUser, permissions: userRole?.permissions || {} };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    logAction('Demo Login', `User ${userData.email} logged in as Demo Tester.`);
    return true;
  };

  const ssoLogin = () => {
    const userData = { email: 'sso.user@kipic.com', name: 'SSO User', role: 'Enterprise Architect', permissions: { all: 'all' }, pageAccess: [] };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    logAction('SSO Login', `User ${userData.email} logged in via SSO.`);
    return true;
  };

  const logout = () => {
    logAction('Logout', `User ${user?.email} logged out.`);
    localStorage.removeItem('user');
    setUser(null);
  };

  const setSsoStatus = (enabled) => {
    localStorage.setItem('ssoEnabled', enabled);
    setIsSsoEnabled(enabled);
    logAction('SSO Configuration', `SSO set to ${enabled ? 'enabled' : 'disabled'}.`);
  };
  
  const updateUserInContext = (updatedUser) => {
    const roles = getInitialData('roles', []);
    const userRole = roles.find(r => r.name === updatedUser.role);
    const userData = { ...updatedUser, permissions: userRole?.permissions || {} };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isSsoEnabled,
    login,
    demoLogin,
    ssoLogin,
    logout,
    setSsoStatus,
    auditLog,
    logAction,
    updateUserInContext
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
