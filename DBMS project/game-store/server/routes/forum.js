const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all forums
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.*,
        b.Type as blog_type,
        b.Rating,
        b.Upvote_Downvote_Ratio
      FROM Forum f
      LEFT JOIN Blog b ON f.Forum_ID = b.Forum_ID
      ORDER BY f.Forum_ID DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching forums:', err);
    res.status(500).json({ error: 'Error fetching forums' });
  }
});

// Create a new forum
router.post('/', async (req, res) => {
  const { title, type, description, blog_type, rating } = req.body;

  try {
    // Start a transaction
    await db.query('START TRANSACTION');

    // Insert into Forum table
    const [forumResult] = await db.query(
      `INSERT INTO Forum (Title, Type, Description, Analytics)
       VALUES (?, ?, ?, 0)`,
      [title, type, description]
    );

    const forumId = forumResult.insertId;

    // Insert into Blog table
    await db.query(
      `INSERT INTO Blog (Forum_ID, Type, Rating, Upvote_Downvote_Ratio)
       VALUES (?, ?, ?, 0)`,
      [forumId, blog_type, rating]
    );

    // Commit the transaction
    await db.query('COMMIT');

    // Get the complete forum with blog details
    const [result] = await db.query(`
      SELECT 
        f.*,
        b.Type as blog_type,
        b.Rating,
        b.Upvote_Downvote_Ratio
      FROM Forum f
      LEFT JOIN Blog b ON f.Forum_ID = b.Forum_ID
      WHERE f.Forum_ID = ?
    `, [forumId]);

    res.status(201).json(result[0]);
  } catch (err) {
    // Rollback the transaction in case of error
    await db.query('ROLLBACK');
    console.error('Error creating forum:', err);
    res.status(500).json({ error: 'Error creating forum' });
  }
});

// Get a single forum
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.*,
        b.Type as blog_type,
        b.Rating,
        b.Upvote_Downvote_Ratio
      FROM Forum f
      LEFT JOIN Blog b ON f.Forum_ID = b.Forum_ID
      WHERE f.Forum_ID = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Forum not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching forum:', err);
    res.status(500).json({ error: 'Error fetching forum' });
  }
});

// Update a forum
router.put('/:id', async (req, res) => {
  const { title, type, description, blog_type, rating } = req.body;

  try {
    // Start a transaction
    await db.query('START TRANSACTION');

    // Update Forum table
    const [forumResult] = await db.query(
      `UPDATE Forum 
       SET Title = ?, Type = ?, Description = ?
       WHERE Forum_ID = ?`,
      [title, type, description, req.params.id]
    );

    if (forumResult.affectedRows === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Forum not found' });
    }

    // Update Blog table
    await db.query(
      `UPDATE Blog 
       SET Type = ?, Rating = ?
       WHERE Forum_ID = ?`,
      [blog_type, rating, req.params.id]
    );

    // Commit the transaction
    await db.query('COMMIT');

    // Get the updated forum with blog details
    const [result] = await db.query(`
      SELECT 
        f.*,
        b.Type as blog_type,
        b.Rating,
        b.Upvote_Downvote_Ratio
      FROM Forum f
      LEFT JOIN Blog b ON f.Forum_ID = b.Forum_ID
      WHERE f.Forum_ID = ?
    `, [req.params.id]);

    res.json(result[0]);
  } catch (err) {
    // Rollback the transaction in case of error
    await db.query('ROLLBACK');
    console.error('Error updating forum:', err);
    res.status(500).json({ error: 'Error updating forum' });
  }
});

// Delete a forum
router.delete('/:id', async (req, res) => {
  try {
    // Start a transaction
    await db.query('START TRANSACTION');

    // Delete from Blog table first (due to foreign key constraint)
    await db.query('DELETE FROM Blog WHERE Forum_ID = ?', [req.params.id]);

    // Delete from Forum table
    const [result] = await db.query(
      'DELETE FROM Forum WHERE Forum_ID = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Forum not found' });
    }

    // Commit the transaction
    await db.query('COMMIT');

    res.json({ message: 'Forum deleted successfully' });
  } catch (err) {
    // Rollback the transaction in case of error
    await db.query('ROLLBACK');
    console.error('Error deleting forum:', err);
    res.status(500).json({ error: 'Error deleting forum' });
  }
});

// Get all forum posts
router.get('/posts', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.*,
        g.title as game_title,
        u.username as author
      FROM forum_posts p
      LEFT JOIN games g ON p.game_id = g.id
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching forum posts:', err);
    res.status(500).json({ error: 'Error fetching forum posts' });
  }
});

// Create a new forum post
router.post('/posts', async (req, res) => {
  const { title, content, game_id, rating, tags, user_id } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO forum_posts 
       (title, content, game_id, rating, tags, user_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [title, content, game_id, rating, tags, user_id]
    );

    // Get the full post with game and user details
    const postResult = await db.query(`
      SELECT 
        p.*,
        g.title as game_title,
        u.username as author
      FROM forum_posts p
      LEFT JOIN games g ON p.game_id = g.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [result.rows[0].id]);

    res.status(201).json(postResult.rows[0]);
  } catch (err) {
    console.error('Error creating forum post:', err);
    res.status(500).json({ error: 'Error creating forum post' });
  }
});

// Get a single forum post
router.get('/posts/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.*,
        g.title as game_title,
        u.username as author
      FROM forum_posts p
      LEFT JOIN games g ON p.game_id = g.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching forum post:', err);
    res.status(500).json({ error: 'Error fetching forum post' });
  }
});

// Update a forum post
router.put('/posts/:id', async (req, res) => {
  const { title, content, rating, tags } = req.body;

  try {
    const result = await db.query(
      `UPDATE forum_posts 
       SET title = $1, content = $2, rating = $3, tags = $4
       WHERE id = $5
       RETURNING *`,
      [title, content, rating, tags, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating forum post:', err);
    res.status(500).json({ error: 'Error updating forum post' });
  }
});

// Delete a forum post
router.delete('/posts/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM forum_posts WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting forum post:', err);
    res.status(500).json({ error: 'Error deleting forum post' });
  }
});

module.exports = router; 