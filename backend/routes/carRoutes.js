const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const {
  getAllCars,
  getPendingCars,
  getCarById,
  createCar,
  approveCar,
  declineCar
} = require('../controllers/carController');

router.get('/', getAllCars);

router.get(
  '/pending',
  authenticateToken,
  requireAdmin,
  getPendingCars
);

router.get('/:id', getCarById);

router.post(
  '/',
  authenticateToken,
  upload.array('images', 8),
  createCar
);

router.patch(
  '/:id/approve',
  authenticateToken,
  requireAdmin,
  approveCar
);
router.patch(
  '/:id/decline',
  authenticateToken,
  requireAdmin,
  declineCar
);

module.exports = router;
