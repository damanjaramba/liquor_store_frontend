import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = import.meta.env.VITE_API_URL+"/public/api/v1";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data and tokens from localStorage on initialization
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return false;
      }

      const userData = await response.json();
      
      // Save auth data
      setCurrentUser({
        name: userData.name,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        role: userData.role,
        username: username
      });
      
      setToken(userData.token);
      setRefreshToken(userData.refreshToken);
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        name: userData.name,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        role: userData.role,
        username: username
      }));
      localStorage.setItem('token', userData.token);
      localStorage.setItem('refreshToken', userData.refreshToken);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        return false;
      }

      // Registration successful
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear user data and tokens
    setCurrentUser(null);
    setToken(null);
    setRefreshToken(null);
    
    // Remove from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  // Function to get the authorization header for API requests
  const getAuthHeader = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const value = {
    currentUser,
    token,
    refreshToken,
    login,
    register,
    logout,
    getAuthHeader,
    isAdmin: currentUser?.role === 'ADMIN',
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};