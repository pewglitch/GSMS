import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart items from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log('Cart updated:', cartItems); // Debug log
  }, [cartItems]);

  const addToCart = (game) => {
    console.log('Adding to cart:', game); // Debug log
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.Game_ID === game.Game_ID);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.Game_ID === game.Game_ID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...game, quantity: 1 }];
    });
  };

  const removeFromCart = (gameId) => {
    console.log('Removing from cart:', gameId); // Debug log
    setCartItems(prevItems => prevItems.filter(item => item.Game_ID !== gameId));
  };

  const updateQuantity = (gameId, quantity) => {
    if (quantity < 1) return;
    
    console.log('Updating quantity:', gameId, quantity); // Debug log
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.Game_ID === gameId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    console.log('Clearing cart'); // Debug log
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 