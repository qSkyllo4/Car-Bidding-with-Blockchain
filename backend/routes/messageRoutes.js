
const express = require('express');
const router  = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  createMessage,
  getAllMessages,
  deleteMessage
} = require('../controllers/messageController');

router.post('/', authenticateToken, createMessage);

router.get('/', authenticateToken, requireAdmin, getAllMessages);

router.delete('/:id', authenticateToken, requireAdmin, deleteMessage);

module.exports = router;
