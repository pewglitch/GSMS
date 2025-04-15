import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check localStorage for existing user data
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedUser && storedUserType) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setUserType(userData.userType);
    }
  }, []);

  const login = async (userData) => {
    setUser(userData);
    setUserType(userData.userType);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', userData.userType);

    // If user is a customer, fetch their cart
    if (userData.userType === 'customer') {
      try {
        const response = await getCustomerCart(userData.cartId);
        if (response) {
          // Update user data with cart information
          setUser(prevUser => ({
            ...prevUser,
            cart: {
              items: response.items,
              total: response.total
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
