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
          q.id, q.title, q.description, q.category, q.created_at, q.user_id,
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
      'SELECT id, title, description, category, created_at FROM quilts WHERE user_id = $1 ORDER BY created_at DESC',
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

// Endpoint to create a new quilt
app.post('/quilts', async (req, res) => {
  try {
    const { title, description, category, structure, isPublic, tags, creatorId } = req.body;

    // Insert the new quilt into the quilts table
    const quiltResult = await pool.query(
      `INSERT INTO quilts (user_id, title, description, category, structure, public, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [creatorId, title, description, category, structure, isPublic]
    );
    const quilt = quiltResult.rows[0];

    // Insert tags into quilt_tags table
    if (Array.isArray(tags) && tags.length > 0) {
      const tagInserts = tags.map(tag =>
        pool.query(
          'INSERT INTO quilt_tags (quilt_id, tag) VALUES ($1, $2)',
          [quilt.id, tag]
        )
      );
      await Promise.all(tagInserts);
    }

    // Attach tags to the response
    quilt.tags = tags || [];

    res.status(201).json(quilt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create quilt' });
  }
});

// Get all patches for a particular quilt, including links
app.get('/quilts/:quiltId/patches', async (req, res) => {
  try {
    const { quiltId } = req.params;

    const patchesResult = await pool.query(
      `SELECT p.id, p.title, p.content_html, p.created_at, p.is_published, u.username AS author
       FROM patches p
       JOIN users u ON p.user_id = u.id
       WHERE p.quilt_id = $1
       ORDER BY p.created_at ASC`,
      [quiltId]
    );
    const patches = patchesResult.rows;

    const patchIds = patches.map(p => p.id);
    let links = [];
    if (patchIds.length > 0) {
      const linksResult = await pool.query(
        'SELECT from_patch_id, to_patch_id FROM patch_links WHERE from_patch_id = ANY($1::int[]) OR to_patch_id = ANY($1::int[])',
        [patchIds]
      );
      links = linksResult.rows;
    }

    res.json({ patches, links });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch patches' });
  }
});

// Get a single quilt by id
app.get('/quilts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM quilts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quilt not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quilt' });
  }
});

// Get the number of patches for a quilt
app.get('/quilts/:quiltId/patches/count', async (req, res) => {
  try {
    const { quiltId } = req.params;
    const result = await pool.query('SELECT COUNT(*) FROM patches WHERE quilt_id = $1', [quiltId]);
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch patch count' });
  }
});

// Get a single patch by id
app.get('/patches/:patchId', async (req, res) => {
  try {
    const { patchId } = req.params;
    const result = await pool.query('SELECT * FROM patches WHERE id = $1', [patchId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patch not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch patch' });
  }
});

// Create a new patch
app.post('/patches', async (req, res) => {
  try {
    const { quilt_id, user_id, title, content_html, parent_patch_id, tags } = req.body;
    if (!quilt_id || !user_id || !title || !content_html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Insert the patch
    const result = await pool.query(
      `INSERT INTO patches (quilt_id, user_id, title, content_html, created_at, is_published)
       VALUES ($1, $2, $3, $4, NOW(), true)
       RETURNING *`,
      [quilt_id, user_id, title, content_html]
    );
    const patch = result.rows[0];
    // If parent_patch_id is provided, create a link
    if (parent_patch_id) {
      await pool.query(
        'INSERT INTO patch_links (from_patch_id, to_patch_id) VALUES ($1, $2)',
        [parent_patch_id, patch.id]
      );
    }
    // If tags are provided, insert them into patch_tags
    if (Array.isArray(tags) && tags.length > 0) {
      const tagInserts = tags.map(tag =>
        pool.query(
          'INSERT INTO patch_tags (patch_id, name) VALUES ($1, $2)',
          [patch.id, tag]
        )
      );
      await Promise.all(tagInserts);
    }
    res.status(201).json(patch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create patch' });
  }
});

// Create a new patch suggestion
app.post('/patch-suggestions', async (req, res) => {
  try {
    const { quilt_id, user_id, title, content_html, parent_patch_id, tags } = req.body;
    if (!quilt_id || !user_id || !title || !content_html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Insert the patch suggestion
    const result = await pool.query(
      `INSERT INTO patch_suggestions (quilt_id, user_id, title, content_html, parent_patch_id, tags, created_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'pending')
       RETURNING *`,
      [quilt_id, user_id, title, content_html, parent_patch_id || null, JSON.stringify(tags || [])]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create patch suggestion' });
  }
});

// Get pending patch suggestions for a user's quilts
app.get('/patch-suggestions/pending/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all quilts owned by this user
    const quiltsResult = await pool.query(
      'SELECT id, title FROM quilts WHERE user_id = $1',
      [userId]
    );
    
    if (quiltsResult.rows.length === 0) {
      return res.json([]);
    }
    
    const quiltIds = quiltsResult.rows.map(q => q.id);
    const quiltsById = quiltsResult.rows.reduce((acc, quilt) => {
      acc[quilt.id] = quilt;
      return acc;
    }, {});
    
    // Get pending suggestions for these quilts
    const suggestionsResult = await pool.query(
      `SELECT ps.id, ps.title, ps.content_html, ps.created_at, ps.quilt_id, ps.parent_patch_id,
              u.username AS author_name, p.title AS parent_patch_title
       FROM patch_suggestions ps
       JOIN users u ON ps.user_id = u.id
       LEFT JOIN patches p ON ps.parent_patch_id = p.id
       WHERE ps.quilt_id = ANY($1::int[]) AND ps.status = 'pending'
       ORDER BY ps.created_at DESC`,
      [quiltIds]
    );
    
    // Attach quilt information to each suggestion
    const suggestions = suggestionsResult.rows.map(suggestion => ({
      ...suggestion,
      quilt_title: quiltsById[suggestion.quilt_id].title
    }));
    
    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pending suggestions' });
  }
});

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});

