import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCustomerCart, addGameToCart, removeGameFromCart, updateGameQuantity } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const { user } = useAuth();

  // Fetch cart data when user logs in or cart updates
  useEffect(() => {
    const fetchCart = async () => {
      if (user && user.cartId) {
        try {
          const response = await getCustomerCart(user.cartId);
          if (response) {
            setCartItems(response.items || []);
            setCartTotal(Number(response.total) || 0);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCartItems([]);
          setCartTotal(0);
        }
      } else {
        setCartItems([]);
        setCartTotal(0);
      }
    };

    fetchCart();
  }, [user, user?.cart?.total]);

  const addToCart = async (game) => {
    if (!user || !user.cartId) {
      console.error('User must be logged in to add items to cart');
      return;
    }

    try {
      const response = await addGameToCart(user.cartId, game.Game_ID, 1);
      
      // Update local state
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.gameId === game.Game_ID);
        
        if (existingItem) {
          return prevItems.map(item =>
            item.gameId === game.Game_ID
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        return [...prevItems, {
          gameId: game.Game_ID,
          title: game.Title,
          price: game.Price,
          quantity: 1
        }];
      });

      setCartTotal(Number(response.cart?.total) || 0);

      // Update user's cart in AuthContext
      if (user.cart) {
        setUser(prevUser => ({
          ...prevUser,
          cart: {
            ...prevUser.cart,
            total: response.cart?.total || 0,
            items: [...prevUser.cart.items, {
              gameId: game.Game_ID,
              title: game.Title,
              price: game.Price,
              quantity: 1
            }]
          }
        }));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (gameId) => {
    if (!user || !user.cartId) {
      console.error('User must be logged in to remove items from cart');
      return;
    }

    try {
      const response = await removeGameFromCart(user.cartId, gameId);
      
      // Update local state
      const itemToRemove = cartItems.find(item => item.gameId === gameId);
      if (itemToRemove) {
        setCartTotal(Number(response.cart?.total) || 0);
        setCartItems(prevItems => prevItems.filter(item => item.gameId !== gameId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (gameId, quantity) => {
    if (!user || !user.cartId) {
      console.error('User must be logged in to update cart');
      return;
    }

    if (quantity < 1) return;

    try {
      const response = await updateGameQuantity(user.cartId, gameId, quantity);
      
      // Update local state
      const itemToUpdate = cartItems.find(item => item.gameId === gameId);
      if (itemToUpdate) {
        setCartTotal(Number(response.cart?.total) || 0);
        
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.gameId === gameId
              ? { ...item, quantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const clearCart = async () => {
    if (!user) {
      console.error('User must be logged in to clear cart');
      return;
    }

    try {
      // Remove all items from cart
      for (const item of cartItems) {
        await removeGameFromCart(user.cartId, item.gameId);
      }
      
      setCartItems([]);
      setCartTotal(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
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