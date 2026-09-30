const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getCuisines,
  createRestaurant,
  updateRestaurant
} = require('../controllers/restaurant.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', getAllRestaurants);
router.get('/meta/cuisines', getCuisines);
router.get('/:id', getRestaurantById);

// Protected routes (Admin / Restaurant Owner)
router.post('/', protect, authorize('admin', 'restaurant'), createRestaurant);
router.put('/:id', protect, authorize('admin', 'restaurant'), updateRestaurant);

module.exports = router;
