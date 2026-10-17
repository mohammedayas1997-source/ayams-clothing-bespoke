const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// 1. Ma'aikaci ya yi Login (Staff, Manager, ko Super Admin)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Shigar da Username da Password.' });
    }

    const userResult = await db.query('SELECT * FROM users WHERE username = $1 AND is_active = TRUE', [username.trim()]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Username ko Password ba daidai ba ne.' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Username ko Password ba daidai ba ne.' });
    }

    // Samar da JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '12h' } // Token zai yi aiki na tsawon sa'a 12 a lokacin aikin rana
    );

    res.status(200).json({
      success: true,
      message: `Barka da zuwa, ${user.full_name}!`,
      token,
      user: {
        id: user.id,
        name: user.full_name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure a tsarin login', error: error.message });
  }
};

// 2. Kirkirar Sabon Ma'aikaci (Super Admin kadai ke da wannan ikon)
exports.createStaff = async (req, res) => {
  try {
    const { full_name, username, password, role } = req.body;

    if (!full_name || !username || !password || !role) {
      return res.status(400).json({ success: false, message: 'Cika dukkan bayanan maaikaci.' });
    }

    // Tabbatar an saka halastaccen matsayi
    const validRoles = ['super_admin', 'manager', 'staff'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Wannan matsayin (role) ba a san shi ba.' });
    }

    // Rufe kalmar sirri (Hash Password)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const queryText = `
      INSERT INTO users (full_name, username, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, username, role, created_at;
    `;
    const result = await db.query(queryText, [full_name.trim(), username.trim().toLowerCase(), password_hash, role]);

    res.status(201).json({
      success: true,
      message: `An yi nasarar kirkirar maaikaci (${role})!`,
      staff: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Wannan Username din an riga an dauke shi.' });
    }
    res.status(500).json({ success: false, message: 'Kuskure wajen kirkirar maaikaci', error: error.message });
  }
};

// 3. Duba Jerin Dukkan Ma'aikata (Manager & Super Admin)
exports.getAllStaff = async (req, res) => {
  try {
    const result = await db.query('SELECT id, full_name, username, role, is_active, created_at FROM users ORDER BY id ASC');
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};