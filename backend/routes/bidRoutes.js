const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/auth');
const { placeBid, getBidsForCar } = require('../controllers/bidController');

router.post('/', authenticateToken, placeBid);

router.get('/:carId', getBidsForCar);

module.exports = router;
