
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const auth = req.headers.authorization?.split(' ');
  if (!auth || auth[0] !== 'Bearer') return res.sendStatus(401);
  jwt.verify(auth[1], process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload; 
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
