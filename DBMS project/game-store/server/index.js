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

// Initialize database tables
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Forum (
        Forum_ID INT PRIMARY KEY AUTO_INCREMENT,
        Title VARCHAR(255) NOT NULL,
        Type VARCHAR(50) NOT NULL,
        Description TEXT NOT NULL,
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Forum_Rating (
        Rating_ID INT PRIMARY KEY AUTO_INCREMENT,
        Forum_ID INT NOT NULL,
        Rating INT NOT NULL,
        FOREIGN KEY (Forum_ID) REFERENCES Forum(Forum_ID)
      )
    `);

    console.log('Forum tables initialized successfully');
  } catch (error) {
    console.error('Error initializing forum tables:', error);
  }
}

// Initialize database when server starts
initializeDatabase();

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

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, userType } = req.body;
    
    let query = '';
    let params = [];
    
    if (userType === 'customer') {
      query = 'SELECT * FROM Customer WHERE Billing_Email = ?';
      params = [identifier];
    } else {
      query = 'SELECT * FROM Publisher WHERE License_Number = ?';
      params = [identifier];
    }

    const [rows] = await pool.query(query, params);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const userTypeData = userType === 'customer' ? {
      customer_id: user.Customer_ID,
      name: user.Name,
      email: user.Billing_Email,
      payment_method: user.Payment_Method
    } : {
      publisher_id: user.Publisher_ID,
      license_number: user.License_Number,
      type: user.Type
    };

    res.json({
      user: userTypeData,
      userType: userType
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { identifier, userType, name, paymentMethod, type } = req.body;
    
    if (userType === 'customer') {
      const [rows] = await pool.query('SELECT * FROM Customer WHERE Billing_Email = ?', [identifier]);
      if (rows.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      await pool.query(
        'INSERT INTO Customer (Name, Billing_Email, Payment_Method) VALUES (?, ?, ?)',
        [name, identifier, paymentMethod]
      );
    } else {
      const [rows] = await pool.query('SELECT * FROM Publisher WHERE License_Number = ?', [identifier]);
      if (rows.length > 0) {
        return res.status(400).json({ error: 'License number already registered' });
      }

      await pool.query(
        'INSERT INTO Publisher (License_Number, Type) VALUES (?, ?)',
        [identifier, type]
      );
    }

    // Get the newly created user
    const [result] = await pool.query('SELECT LAST_INSERT_ID()');
    const userId = result[0]['LAST_INSERT_ID()'];

    res.json({
      user: {
        id: userId,
        identifier,
        name,
        userType
      },
      userType
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get all forums
app.get('/api/forums', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Forum ORDER BY Forum_ID DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching forums:', error);
    res.status(500).json({ error: 'Failed to fetch forums' });
  }
});

// Create new forum post
app.post('/api/forums', async (req, res) => {
  try {
    const { title, type, description } = req.body;
    
    // Validate input
    if (!title || !type || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO Forum (Title, Type, Description) VALUES (?, ?, ?)',
      [title, type, description]
    );

    // Get the newly created forum
    const [newForum] = await pool.query(
      'SELECT * FROM Forum WHERE Forum_ID = ?',
      [result.insertId]
    );

    res.json(newForum[0]);
  } catch (error) {
    console.error('Error creating forum:', error);
    res.status(500).json({ error: 'Failed to create forum' });
  }
});

// Update forum rating
app.patch('/api/forums/:forumId/rating', async (req, res) => {
  try {
    const { rating } = req.body;
    const { forumId } = req.params;
    
    // First, check if rating exists for this user
    const [existingRating] = await pool.query(
      'SELECT * FROM Forum_Rating WHERE Forum_ID = ?',
      [forumId]
    );

    if (existingRating.length > 0) {
      // Update existing rating
      await pool.query(
        'UPDATE Forum_Rating SET Rating = ? WHERE Forum_ID = ?',
        [rating, forumId]
      );
    } else {
      // Create new rating
      await pool.query(
        'INSERT INTO Forum_Rating (Forum_ID, Rating) VALUES (?, ?)',
        [forumId, rating]
      );
    }

    // Get updated forum with new average rating
    const [updatedForum] = await pool.query(
      'SELECT f.*, AVG(r.Rating) as average_rating FROM Forum f LEFT JOIN Forum_Rating r ON f.Forum_ID = r.Forum_ID WHERE f.Forum_ID = ? GROUP BY f.Forum_ID',
      [forumId]
    );

    res.json({ forum: updatedForum[0] });
  } catch (error) {
    console.error('Error updating forum rating:', error);
    res.status(500).json({ error: 'Failed to update forum rating' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 