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

// Get customer's cart
router.get('/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        // Get cart details
        const [carts] = await pool.execute(
            `SELECT c.*, cg.Game_ID, cg.Quantity, g.Title, g.Price 
             FROM Cart c 
             LEFT JOIN Cart_Game cg ON c.Cart_ID = cg.Cart_ID 
             LEFT JOIN Game g ON cg.Game_ID = g.Game_ID 
             WHERE c.Customer_ID = ?`,
            [customerId]
        );

        if (carts.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Format the response
        const cart = {
            cartId: carts[0].Cart_ID,
            customerId: carts[0].Customer_ID,
            total: carts[0].Total,
            items: carts
                .filter(item => item.Game_ID) // Only include items with games
                .map(item => ({
                    gameId: item.Game_ID,
                    title: item.Title,
                    price: item.Price,
                    quantity: item.Quantity
                }))
        };

        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add game to cart
router.post('/:cartId/add', async (req, res) => {
    try {
        const { cartId } = req.params;
        const { gameId, quantity } = req.body;

        // Check if the game is already in the cart
        const [existingItems] = await pool.execute(
            'SELECT * FROM Cart_Game WHERE Cart_ID = ? AND Game_ID = ?',
            [cartId, gameId]
        );

        if (existingItems.length > 0) {
            // Update quantity if game already exists in cart
            await pool.execute(
                'UPDATE Cart_Game SET Quantity = Quantity + ? WHERE Cart_ID = ? AND Game_ID = ?',
                [quantity, cartId, gameId]
            );
        } else {
            // Add new game to cart
            await pool.execute(
                'INSERT INTO Cart_Game (Cart_ID, Game_ID, Quantity) VALUES (?, ?, ?)',
                [cartId, gameId, quantity]
            );
        }

        // Update cart total
        const [game] = await pool.execute(
            'SELECT Price FROM Game WHERE Game_ID = ?',
            [gameId]
        );

        if (game.length > 0) {
            await pool.execute(
                'UPDATE Cart SET Total = Total + ? WHERE Cart_ID = ?',
                [game[0].Price * quantity, cartId]
            );
        }

        res.json({ message: 'Game added to cart successfully' });
    } catch (error) {
        console.error('Error adding game to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove game from cart
router.delete('/:cartId/remove/:gameId', async (req, res) => {
    try {
        const { cartId, gameId } = req.params;

        // Get the game price and quantity before removing
        const [cartGame] = await pool.execute(
            `SELECT cg.Quantity, g.Price 
             FROM Cart_Game cg 
             JOIN Game g ON cg.Game_ID = g.Game_ID 
             WHERE cg.Cart_ID = ? AND cg.Game_ID = ?`,
            [cartId, gameId]
        );

        if (cartGame.length > 0) {
            // Remove the game from cart
            await pool.execute(
                'DELETE FROM Cart_Game WHERE Cart_ID = ? AND Game_ID = ?',
                [cartId, gameId]
            );

            // Update cart total
            await pool.execute(
                'UPDATE Cart SET Total = Total - ? WHERE Cart_ID = ?',
                [cartGame[0].Price * cartGame[0].Quantity, cartId]
            );
        }

        res.json({ message: 'Game removed from cart successfully' });
    } catch (error) {
        console.error('Error removing game from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update game quantity in cart
router.put('/:cartId/update/:gameId', async (req, res) => {
    try {
        const { cartId, gameId } = req.params;
        const { quantity } = req.body;

        // Get the game price
        const [game] = await pool.execute(
            'SELECT Price FROM Game WHERE Game_ID = ?',
            [gameId]
        );

        if (game.length > 0) {
            // Get current quantity
            const [cartGame] = await pool.execute(
                'SELECT Quantity FROM Cart_Game WHERE Cart_ID = ? AND Game_ID = ?',
                [cartId, gameId]
            );

            if (cartGame.length > 0) {
                const oldQuantity = cartGame[0].Quantity;
                const quantityDiff = quantity - oldQuantity;

                // Update quantity
                await pool.execute(
                    'UPDATE Cart_Game SET Quantity = ? WHERE Cart_ID = ? AND Game_ID = ?',
                    [quantity, cartId, gameId]
                );

                // Update cart total
                await pool.execute(
                    'UPDATE Cart SET Total = Total + ? WHERE Cart_ID = ?',
                    [game[0].Price * quantityDiff, cartId]
                );
            }
        }

        res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 