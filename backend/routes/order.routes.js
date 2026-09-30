const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect); // All order routes require authentication

router.post('/', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrderById);

// Admin & Restaurant management routes
router.get('/', authorize('admin', 'restaurant'), getAllOrders);
router.put('/:id/status', authorize('admin', 'restaurant', 'delivery'), updateOrderStatus);

module.exports = router;
