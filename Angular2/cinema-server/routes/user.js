const express = require('express');
const router = express.Router();
const pool = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticate, authorizeRoles } = require('./auth');

router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT UserID, FirstName, LastName, Email, Phone, PasswordHash FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Помилка при отриманні користувачів' });
  }
});


// Реєстрація
router.post('/register', async (req, res) => {
  const { FirstName, LastName, Email, Phone, Password } = req.body;
  // Перевірити Email
  const [exists] = await pool.query('SELECT * FROM users WHERE Email = ?', [Email]);
  if (exists.length) return res.status(400).json({ error: 'Email вже існує' });

  const hash = await bcrypt.hash(Password, 10);
  const [result] = await pool.query(
    `INSERT INTO users 
      (FirstName, LastName, Email, Phone, PasswordHash, Role, CreatedAt)
     VALUES (?, ?, ?, ?, ?, 'user', NOW())`,
    [FirstName, LastName, Email, Phone, hash]
  );
  res.status(201).json({ userId: result.insertId });
});

// Логін
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;
  const [users] = await pool.query('SELECT * FROM users WHERE Email = ?', [Email]);
  if (!users.length) return res.status(401).json({ error: 'Невірний email або пароль' });

  const user = users[0];
  const ok = await bcrypt.compare(Password, user.PasswordHash);
  if (!ok) return res.status(401).json({ error: 'Невірний email або пароль' });

  const token = jwt.sign(
    { id: user.UserID, role: user.Role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({
    token,
    user: {
      UserID: user.UserID,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Email: user.Email,
      Role: user.Role
    }
  });
});
// Отримати свій профіль
router.get('/me', authenticate, async (req, res) => {
  const [users] = await pool.query(
    'SELECT UserID, FirstName, LastName, Email, Phone, Role FROM users WHERE UserID = ?',
    [req.user.id]
  );
  if (!users.length) return res.status(404).json({ error: 'Користувача не знайдено' });
  res.json(users[0]);
});
//  /user — список всіх юзерів (admin only)
router.get(
  '/',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const [users] = await pool.query(
        'SELECT UserID, FirstName, LastName, Email, Phone, Role, CreatedAt FROM users'
      );
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

//  /user/:UserID — дані конкретного користувача
router.get(
  'me',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    const { UserID } = req.params;
    try {
      const [rows] = await pool.query(
        'SELECT UserID, FirstName, LastName, Email, Phone, Role FROM users WHERE UserID = ?',
        [UserID]
      );
      if (!rows.length) return res.status(404).json({ error: 'Користувача не знайдено' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// /user/:UserID — оновити дані або роль користувача
router.put(
  '/me',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    const { UserID } = req.params;
    const { FirstName, LastName, Phone, Role } = req.body;
    try {
      const [result] = await pool.query(
        `UPDATE users
            SET FirstName = ?, LastName = ?, Phone = ?, Role = ?
          WHERE UserID = ?`,
        [FirstName, LastName, Phone, Role, UserID]
      );
      if (!result.affectedRows) return res.status(404).json({ error: 'Користувача не знайдено' });
      const [updated] = await pool.query(
        'SELECT UserID, FirstName, LastName, Email, Phone, Role FROM users WHERE UserID = ?',
        [UserID]
      );
      res.json(updated[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

//  /user/:UserID — видалити користувача
router.delete(
  '/:UserID',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    const { UserID } = req.params;
    try {
      const [result] = await pool.query(
        'DELETE FROM users WHERE UserID = ?',
        [UserID]
      );
      if (!result.affectedRows) return res.status(404).json({ error: 'Користувача не знайдено' });
      res.json({ message: 'Користувача видалено' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
module.exports = router;
