const express = require('express');
const router = express.Router();
const {
  getFoodsByRestaurant,
  searchFoods,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem
} = require('../controllers/food.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/restaurant/:restaurantId', getFoodsByRestaurant);
router.get('/search', searchFoods);

// Protected routes (Admin / Restaurant Owner)
router.post('/', protect, authorize('admin', 'restaurant'), createFoodItem);
router.put('/:id', protect, authorize('admin', 'restaurant'), updateFoodItem);
router.delete('/:id', protect, authorize('admin', 'restaurant'), deleteFoodItem);

module.exports = router;
