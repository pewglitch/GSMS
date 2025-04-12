import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Games
export const getGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/games`);
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const getGameById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/games/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching game ${id}:`, error);
    throw error;
  }
};

// Customers
export const getCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
};

// Publishers
export const getPublishers = async () => {
  try {
    const response = await axios.get(`${API_URL}/publishers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching publishers:', error);
    throw error;
  }
};

// Cart
export const getCustomerCart = async (customerId) => {
  try {
    const response = await axios.get(`${API_URL}/carts/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cart for customer ${customerId}:`, error);
    throw error;
  }
};

export const addGameToCart = async (cartId, gameId, quantity) => {
  try {
    const response = await axios.post(`${API_URL}/carts/${cartId}/add`, {
      gameId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding game to cart:', error);
    throw error;
  }
};

// Orders
export const getCustomerOrders = async (customerId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for customer ${customerId}:`, error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}; 