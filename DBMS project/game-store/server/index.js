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

initializeDatabase();

//top games 
app.get('/api/top-games', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.Game_ID, g.Title, SUM(cg.Quantity) AS total_purchased
      FROM Cart_Game cg
      JOIN Game g ON cg.Game_ID = g.Game_ID
      GROUP BY g.Game_ID, g.Title
      ORDER BY total_purchased DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching top games:', error);
    res.status(500).json({ error: 'Failed to fetch top games' });
  }
});

//cart
app.post('/api/cart/add', async (req, res) => {
  try {
    const { cartId, gameId, quantity } = req.body;
    
    const [existing] = await pool.query(
      'SELECT * FROM Cart_Game WHERE Cart_ID = ? AND Game_ID = ?',
      [cartId, gameId]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE Cart_Game SET Quantity = ? WHERE Cart_ID = ? AND Game_ID = ?',
        [quantity, cartId, gameId]
      );
    } else {
      await pool.query(
        'INSERT INTO Cart_Game (Cart_ID, Game_ID, Quantity) VALUES (?, ?, ?)',
        [cartId, gameId, quantity]
      );
    }
    const [game] = await pool.query(
      'SELECT Price FROM Game WHERE Game_ID = ?',
      [gameId]
    );
    const [cart] = await pool.query(
      'SELECT Total FROM Cart WHERE Cart_ID = ?',
      [cartId]
    );

    const cartTotal = parseFloat(cart[0].Total) || 0;
    const gamePrice = parseFloat(game[0].Price) || 0;
    const addAmount = gamePrice * quantity;
    const newTotal = parseFloat((cartTotal + addAmount).toFixed(2));
    await pool.query(
      'UPDATE Cart SET Total = ? WHERE Cart_ID = ?',
      [newTotal, cartId]
    );

    res.json({ 
      success: true, 
      message: 'Game added to cart',
      cart: {
        total: newTotal
      }
    });
  } catch (error) {
    console.error('Error adding game to cart:', error);
    res.status(500).json({ error: 'Failed to add game to cart' });
  }
});

//remove
app.post('/api/cart/remove', async (req, res) => {
  try {
    const { cartId, gameId } = req.body;
    
    const [cartGame] = await pool.query(
      'SELECT Quantity FROM Cart_Game WHERE Cart_ID = ? AND Game_ID = ?',
      [cartId, gameId]
    );

    if (cartGame.length === 0) {
      return res.status(404).json({ error: 'Game not found in cart' });
    }

    const [game] = await pool.query(
      'SELECT Price FROM Game WHERE Game_ID = ?',
      [gameId]
    );

    const [cart] = await pool.query(
      'SELECT Total FROM Cart WHERE Cart_ID = ?',
      [cartId]
    );


    const cartTotal = parseFloat(cart[0].Total) || 0;
    const gamePrice = parseFloat(game[0].Price) || 0;
    const removeAmount = gamePrice * cartGame[0].Quantity;

    const newTotal = Math.max(0, parseFloat((cartTotal - removeAmount).toFixed(2)));

    await pool.query(
      'UPDATE Cart SET Total = ? WHERE Cart_ID = ?',
      [newTotal, cartId]
    );

    await pool.query(
      'DELETE FROM Cart_Game WHERE Cart_ID = ? AND Game_ID = ?',
      [cartId, gameId]
    );

    res.json({ 
      success: true, 
      message: 'Game removed from cart',
      cart: {
        total: newTotal
      }
    });
  } catch (error) {
    console.error('Error removing game from cart:', error);
    res.status(500).json({ error: 'Failed to remove game from cart' });
  }
});

//update cart 
app.post('/api/cart/update', async (req, res) => {
  try {
    const { cartId, gameId, quantity } = req.body;

    const [game] = await pool.query(
      'SELECT Price FROM Game WHERE Game_ID = ?',
      [gameId]
    );

    const [cartGame] = await pool.query(
      'SELECT Quantity FROM Cart_Game WHERE Cart_ID = ? AND Game_ID = ?',
      [cartId, gameId]
    );

    if (cartGame.length === 0) {
      return res.status(404).json({ error: 'Game not found in cart' });
    }

    const [cart] = await pool.query(
      'SELECT Total FROM Cart WHERE Cart_ID = ?',
      [cartId]
    );
    const cartTotal = parseFloat(cart[0].Total) || 0;
    const gamePrice = parseFloat(game[0].Price) || 0;
    const oldAmount = gamePrice * cartGame[0].Quantity;
    const newAmount = gamePrice * quantity;
    const priceDiff = newAmount - oldAmount;
    const newTotal = Math.max(0, parseFloat((cartTotal + priceDiff).toFixed(2)));

    await pool.query(
      'UPDATE Cart_Game SET Quantity = ? WHERE Cart_ID = ? AND Game_ID = ?',
      [quantity, cartId, gameId]
    );

    await pool.query(
      'UPDATE Cart SET Total = ? WHERE Cart_ID = ?',
      [newTotal, cartId]
    );

    res.json({ 
      success: true, 
      message: 'Cart updated successfully',
      cart: {
        total: newTotal
      }
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

//items
app.get('/api/cart/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;
    
    const [items] = await pool.query(
      'SELECT g.Game_ID, g.Title, g.Price, cg.Quantity, (g.Price * cg.Quantity) as Total_Price ' +
      'FROM Cart_Game cg ' +
      'JOIN Game g ON cg.Game_ID = g.Game_ID ' +
      'WHERE cg.Cart_ID = ?',
      [cartId]
    );

    const [cart] = await pool.query(
      'SELECT Total FROM Cart WHERE Cart_ID = ?',
      [cartId]
    );

    const formattedItems = items.map(item => ({
      gameId: item.Game_ID,
      title: item.Title,
      price: item.Price,
      quantity: item.Quantity,
      total: item.Total_Price
    }));

    res.json({ 
      items: formattedItems,
      total: cart[0]?.Total || 0
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

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

//all games for games page
app.get('/api/games', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Game');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

//by id
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

app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Customer');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

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

//publishers
app.get('/api/publishers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Publisher');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching publishers:', error);
    res.status(500).json({ error: 'Failed to fetch publishers' });
  }
});

//cart
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

//add
app.post('/api/carts/:cartId/add', async (req, res) => {
  const { gameId, quantity } = req.body;
  const { cartId } = req.params;
  
  try {
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

//all orders for a customer
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

//query
app.post('/api/query', async (req, res) => {
  const { query } = req.body;

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

//login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { userType, Billing_Email, License_Number } = req.body;
    let query = '';
    let params = [];

    if (userType === 'customer') {
      if (!Billing_Email) {
        return res.status(400).json({ error: 'Billing_Email is required for customer login' });
      }
      query = 'SELECT * FROM Customer WHERE Billing_Email = ?';
      params = [Billing_Email];
    } else if (userType === 'publisher') {
      if (!License_Number) {
        return res.status(400).json({ error: 'License_Number is required for publisher login' });
      }
      query = 'SELECT * FROM Publisher WHERE License_Number = ?';
      params = [License_Number];
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    let userTypeData;
    let cartInfo = null;

    if (userType === 'customer') {
      const [cartRows] = await pool.query('SELECT * FROM Cart WHERE Customer_ID = ?', [user.Customer_ID]);
      let cartId;
      if (cartRows.length === 0) {
        const [cartResult] = await pool.query('INSERT INTO Cart (Customer_ID, Total) VALUES (?, 0)', [user.Customer_ID]);
        cartId = cartResult.insertId;
      } else {
        cartId = cartRows[0].Cart_ID;
      }
      const [ccRows] = await pool.query('SELECT * FROM Customer_Cart WHERE Customer_ID = ? AND Cart_ID = ?', [user.Customer_ID, cartId]);
      if (ccRows.length === 0) {
        await pool.query('INSERT INTO Customer_Cart (Customer_ID, Cart_ID) VALUES (?, ?)', [user.Customer_ID, cartId]);
      }
      userTypeData = {
        customer_id: user.Customer_ID,
        name: user.Name,
        email: user.Billing_Email,
        payment_method: user.Payment_Method,
        cart_id: cartId
      };
      cartInfo = { cart_id: cartId };
    } else {
      userTypeData = {
        publisher_id: user.Publisher_ID,
        license_number: user.License_Number,
        type: user.Type
      };
    }

    res.json({
      user: userTypeData,
      userType: userType,
      cart: cartInfo
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

//register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { userType } = req.body;

    if (userType === 'customer') 
    {
      const { Name, Billing_Email, Payment_Method } = req.body;
      const [existing] = await pool.query('SELECT * FROM Customer WHERE Billing_Email = ?', [Billing_Email]);
      if (existing.length > 0) 
      {
        return res.status(400).json({ error: 'Customer already registered with this email' });
      }
      await pool.query(
        'INSERT INTO Customer (Name, Billing_Email, Payment_Method) VALUES (?, ?, ?)',
        [Name, Billing_Email, Payment_Method]
      );
      return res.json({ success: true, userType: 'customer', user: { Name, Billing_Email, Payment_Method } });
    } else if (userType === 'publisher') {
      const { License_Number, Type } = req.body;
      const [existing] = await pool.query('SELECT * FROM Publisher WHERE License_Number = ?', [License_Number]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Publisher already registered with this license number' });
      }
      await pool.query(
        'INSERT INTO Publisher (License_Number, Type) VALUES (?, ?)',
        [License_Number, Type]
      );
      return res.json({ success: true, userType: 'publisher', user: { License_Number, Type } });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.get('/api/forums', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Forum ORDER BY Forum_ID DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching forums:', error);
    res.status(500).json({ error: 'Failed to fetch forums' });
  }
});

//forum
app.post('/api/forums', async (req, res) => {
  try {
    const { title, type, description } = req.body;
    if (!title || !type || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO Forum (Title, Type, Description) VALUES (?, ?, ?)',
      [title, type, description]
    );


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

//forum rating
app.patch('/api/forums/:forumId/rating', async (req, res) => {
  try {
    const { rating } = req.body;
    const { forumId } = req.params;
    
    const [existingRating] = await pool.query(
      'SELECT * FROM Forum_Rating WHERE Forum_ID = ?',
      [forumId]
    );

    if (existingRating.length > 0) {
      await pool.query(
        'UPDATE Forum_Rating SET Rating = ? WHERE Forum_ID = ?',
        [rating, forumId]
      );
    } else {
      await pool.query(
        'INSERT INTO Forum_Rating (Forum_ID, Rating) VALUES (?, ?)',
        [forumId, rating]
      );
    }
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

//for running queries
app.get('/api/run-query', async (req, res) => {
  const queryNumber = req.query.number;
  
  try {
    //find number
    const queries = fs.readFileSync('queries.sql', 'utf8').split(';');
    const query = queries[queryNumber - 1].trim();
    
    if (!query) throw new Error('Invalid query number');
    
    const [results] = await connection.query(query);
    res.json(results);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//starts server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 