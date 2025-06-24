const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./database');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint to handle user registration
app.post('/adduser', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validate required fields
        if (!email || !username || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const newUser = await pool.query(
            'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *',
            [email, username, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]); // Send the created user data as a response
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if the user exists by email or username
        const userQuery = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [usernameOrEmail, usernameOrEmail]
        );

        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const user = userQuery.rows[0];

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // You can generate a token here for authentication if needed (e.g., JWT)
        res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/quilts', async (req, res) => {
    try {
      // Get all quilts with author username
      const quiltsResult = await pool.query(`
        SELECT 
          q.id, q.title, q.content, q.category, q.created_at, 
          u.username AS author
        FROM quilts q
        JOIN users u ON q.user_id = u.id
        ORDER BY q.created_at DESC
      `);
  
      const quilts = quiltsResult.rows;
  
      // Get all tags for all quilts
      const tagsResult = await pool.query(`
        SELECT quilt_id, tag FROM quilt_tags
      `);
  
      // Map tags to their quilts
      const tagsByQuilt = {};
      tagsResult.rows.forEach(row => {
        if (!tagsByQuilt[row.quilt_id]) tagsByQuilt[row.quilt_id] = [];
        tagsByQuilt[row.quilt_id].push(row.tag);
      });
  
      // Attach tags to each quilt
      const quiltsWithTags = quilts.map(q => ({
        ...q,
        tags: tagsByQuilt[q.id] || []
      }));
  
      res.json(quiltsWithTags);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch quilts' });
    }
  });

// Get user profile by username
app.get('/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userResult = await pool.query(
      'SELECT id, username, bio, profile_picture_url FROM users WHERE username = $1',
      [username]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    // Get followers and following counts
    const followersResult = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE followed_user_id = $1',
      [user.id]
    );
    const followingResult = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE follower_id = $1',
      [user.id]
    );

    res.json({
      username: user.username,
      bio: user.bio,
      profilePicture: user.profile_picture_url,
      followers: parseInt(followersResult.rows[0].count, 10),
      following: parseInt(followingResult.rows[0].count, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get all quilts by username
app.get('/users/:username/quilts', async (req, res) => {
  try {
    const { username } = req.params;
    // Get user id
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = userResult.rows[0].id;

    // Get quilts
    const quiltsResult = await pool.query(
      'SELECT id, title, content, category, created_at FROM quilts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    const quilts = quiltsResult.rows;

    // Get tags for these quilts
    const quiltIds = quilts.map(q => q.id);
    let tagsByQuilt = {};
    if (quilts.length > 0) {
      const tagsResult = await pool.query(
        'SELECT quilt_id, tag FROM quilt_tags WHERE quilt_id = ANY($1::int[])',
        [quiltIds]
      );
      tagsByQuilt = tagsResult.rows.reduce((acc, row) => {
        if (!acc[row.quilt_id]) acc[row.quilt_id] = [];
        acc[row.quilt_id].push(row.tag);
        return acc;
      }, {});
    }

    // Attach tags to each quilt
    const quiltsWithTags = quilts.map(q => ({
      ...q,
      tags: tagsByQuilt[q.id] || [],
    }));

    res.json(quiltsWithTags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user quilts' });
  }
});

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});

