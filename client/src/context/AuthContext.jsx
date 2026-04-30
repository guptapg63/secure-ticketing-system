import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('userInfo');
        const token = localStorage.getItem('token');

        if (savedUser && savedUser !== "undefined" && token) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
        localStorage.clear(); 
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (authResponse) => {
    // Extracts token and user from various possible backend formats
    const token = authResponse?.token || authResponse?.data?.token;
    const userData = authResponse?.user || authResponse?.data?.user;

    if (!token || !userData) {
      console.error("Invalid login response:", authResponse);
      return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};