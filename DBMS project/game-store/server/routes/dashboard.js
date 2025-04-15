const express = require('express');
const router = express.Router();
const db = require('../db');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total games
    const gamesResult = await db.query('SELECT COUNT(*) FROM games');
    const totalGames = parseInt(gamesResult.rows[0].count);

    // Get total customers
    const customersResult = await db.query('SELECT COUNT(*) FROM customers');
    const totalCustomers = parseInt(customersResult.rows[0].count);

    // Get total orders and revenue
    const ordersResult = await db.query('SELECT COUNT(*), SUM(total_amount) FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);
    const totalRevenue = parseFloat(ordersResult.rows[0].sum || 0);

    res.json({
      totalGames,
      totalCustomers,
      totalOrders,
      totalRevenue
    });
  } catch (err) {
    console.error('Error fetching dashboard statistics:', err);
    res.status(500).json({ error: 'Error fetching dashboard statistics' });
  }
});

module.exports = router; 