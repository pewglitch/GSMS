const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Create database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gsms2'
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if customer exists
        const [customers] = await pool.execute(
            'SELECT * FROM Customer WHERE Billing_Email = ?',
            [email]
        );

        if (customers.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const customer = customers[0];

        // Check if customer has a cart
        const [carts] = await pool.execute(
            'SELECT * FROM Cart WHERE Customer_ID = ?',
            [customer.Customer_ID]
        );

        // If no cart exists, create one
        if (carts.length === 0) {
            const [result] = await pool.execute(
                'INSERT INTO Cart (Customer_ID, Total) VALUES (?, 0)',
                [customer.Customer_ID]
            );

            // Link cart to customer
            await pool.execute(
                'INSERT INTO Customer_Cart (Customer_ID, Cart_ID) VALUES (?, ?)',
                [customer.Customer_ID, result.insertId]
            );
        }

        res.json({
            message: 'Login successful',
            customer: {
                id: customer.Customer_ID,
                name: customer.Name,
                email: customer.Billing_Email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, paymentMethod } = req.body;

        // Check if email already exists
        const [existingCustomers] = await pool.execute(
            'SELECT * FROM Customer WHERE Billing_Email = ?',
            [email]
        );

        if (existingCustomers.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new customer
        const [result] = await pool.execute(
            'INSERT INTO Customer (Name, Billing_Email, Payment_Method) VALUES (?, ?, ?)',
            [name, email, paymentMethod]
        );

        const customerId = result.insertId;

        // Create cart for new customer
        const [cartResult] = await pool.execute(
            'INSERT INTO Cart (Customer_ID, Total) VALUES (?, 0)',
            [customerId]
        );

        // Link cart to customer
        await pool.execute(
            'INSERT INTO Customer_Cart (Customer_ID, Cart_ID) VALUES (?, ?)',
            [customerId, cartResult.insertId]
        );

        res.status(201).json({
            message: 'Registration successful',
            customer: {
                id: customerId,
                name,
                email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 