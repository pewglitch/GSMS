import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCustomerCart, addGameToCart, removeGameFromCart, updateGameQuantity } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const { user } = useAuth();

  // Fetch cart data when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const cart = await getCustomerCart(user.id);
          setCartItems(cart.items);
          setCartTotal(cart.total);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      } else {
        setCartItems([]);
        setCartTotal(0);
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (game) => {
    if (!user) {
      console.error('User must be logged in to add items to cart');
      return;
    }

    try {
      await addGameToCart(user.cartId, game.Game_ID, 1);
      
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

      setCartTotal(prevTotal => prevTotal + game.Price);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (gameId) => {
    if (!user) {
      console.error('User must be logged in to remove items from cart');
      return;
    }

    try {
      await removeGameFromCart(user.cartId, gameId);
      
      // Update local state
      const itemToRemove = cartItems.find(item => item.gameId === gameId);
      if (itemToRemove) {
        setCartTotal(prevTotal => prevTotal - (itemToRemove.price * itemToRemove.quantity));
        setCartItems(prevItems => prevItems.filter(item => item.gameId !== gameId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (gameId, quantity) => {
    if (!user) {
      console.error('User must be logged in to update cart');
      return;
    }

    if (quantity < 1) return;

    try {
      await updateGameQuantity(user.cartId, gameId, quantity);
      
      // Update local state
      const itemToUpdate = cartItems.find(item => item.gameId === gameId);
      if (itemToUpdate) {
        const quantityDiff = quantity - itemToUpdate.quantity;
        setCartTotal(prevTotal => prevTotal + (itemToUpdate.price * quantityDiff));
        
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