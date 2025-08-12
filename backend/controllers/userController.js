const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User   = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'Registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });
  try {
    const user = await User.findOne({ where: { email } });
    console.log('Found user row:', user && {
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
