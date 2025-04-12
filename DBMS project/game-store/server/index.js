const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ 
      message: 'Database connection successful', 
      result: result[0].solution 
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Get all games
app.get('/api/games', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Game');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Get game by ID
app.get('/api/games/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Game WHERE Game_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Customer');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer by ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Customer WHERE Customer_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Get all publishers
app.get('/api/publishers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Publisher');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching publishers:', error);
    res.status(500).json({ error: 'Failed to fetch publishers' });
  }
});

// Get customer cart
app.get('/api/carts/:customerId', async (req, res) => {
  try {
    const [cart] = await pool.query(
      'SELECT * FROM Cart WHERE Customer_ID = ?', 
      [req.params.customerId]
    );
    
    if (cart.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const [cartItems] = await pool.query(
      `SELECT cg.Cart_ID, cg.Game_ID, cg.Quantity, g.Title, g.Price 
       FROM Cart_Game cg
       JOIN Game g ON cg.Game_ID = g.Game_ID
       WHERE cg.Cart_ID = ?`,
      [cart[0].Cart_ID]
    );
    
    res.json({
      cart: cart[0],
      items: cartItems
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add game to cart
app.post('/api/carts/:cartId/add', async (req, res) => {
  const { gameId, quantity } = req.body;
  const { cartId } = req.params;
  
  try {
    // Check if game already exists in cart
    const [existingItems] = await pool.query(
      'SELECT * FROM Cart_Game WHERE Cart_ID = ? AND Game_ID = ?',
      [cartId, gameId]
    );
    
    if (existingItems.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE Cart_Game SET Quantity = ? WHERE Cart_ID = ? AND Game_ID = ?',
        [quantity, cartId, gameId]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO Cart_Game (Cart_ID, Game_ID, Quantity) VALUES (?, ?, ?)',
        [cartId, gameId, quantity]
      );
    }
    
    // Update cart total
    const [gameResult] = await pool.query(
      'SELECT Price FROM Game WHERE Game_ID = ?',
      [gameId]
    );
    
    const [cartResult] = await pool.query(
      'SELECT Total FROM Cart WHERE Cart_ID = ?',
      [cartId]
    );
    
    const gamePrice = gameResult[0].Price;
    const newTotal = cartResult[0].Total + (gamePrice * quantity);
    
    await pool.query(
      'UPDATE Cart SET Total = ? WHERE Cart_ID = ?',
      [newTotal, cartId]
    );
    
    res.json({ message: 'Game added to cart successfully' });
  } catch (error) {
    console.error('Error adding game to cart:', error);
    res.status(500).json({ error: 'Failed to add game to cart' });
  }
});

// Get all orders for a customer
app.get('/api/orders/:customerId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Orders WHERE Customer_ID = ?',
      [req.params.customerId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
  const { customerId, paymentMethod, billingEmail, total } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO Orders (Customer_ID, Payment_Method, Billing_Email, Total) VALUES (?, ?, ?, ?)',
      [customerId, paymentMethod, billingEmail, total]
    );
    
    res.status(201).json({ 
      message: 'Order created successfully',
      orderId: result.insertId
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Custom SQL query endpoint
app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  // Basic security check - only allow SELECT queries
  if (!query.trim().toLowerCase().startsWith('select')) {
    return res.status(403).json({ error: 'Only SELECT queries are allowed' });
  }

  try {
    const [results] = await pool.query(query);
    res.json(results);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 