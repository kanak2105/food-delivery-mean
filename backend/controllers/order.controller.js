const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;

    if (!restaurantId || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items and restaurant are required.' });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required.' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    // Verify items and compute accurate pricing from DB
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await FoodItem.findById(item.foodItemId || item.foodItem);
      if (!food) {
        return res.status(404).json({ success: false, message: `Item ${item.name || 'dish'} not found.` });
      }
      const qty = item.quantity || 1;
      const itemTotal = food.price * qty;
      subtotal += itemTotal;

      orderItems.push({
        foodItem: food._id,
        name: food.name,
        price: food.price,
        quantity: qty,
        image: food.image
      });
    }

    const deliveryFee = restaurant.deliveryFee || 2.99;
    const tax = Number((subtotal * 0.05).toFixed(2)); // 5% tax
    const totalAmount = Number((subtotal + deliveryFee + tax).toFixed(2));

    const estimatedDeliveryTime = new Date(Date.now() + (restaurant.deliveryTimeMinutes || 35) * 60000);

    const initialTimeline = [
      {
        status: 'Pending',
        timestamp: new Date(),
        note: 'Order placed, awaiting restaurant acceptance'
      },
      {
        status: 'Confirmed',
        timestamp: new Date(Date.now() + 15000), // confirmed shortly
        note: `${restaurant.name} has accepted and confirmed your order`
      }
    ];

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurant._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'Credit/Debit Card',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      status: 'Confirmed',
      estimatedDeliveryTime,
      timeline: initialTimeline
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name logo bannerImage address rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name logo bannerImage address deliveryTimeMinutes phone')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization: customer who placed order or admin/restaurant
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'restaurant') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin / Restaurant / Delivery)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    const statusNotes = {
      Pending: 'Order placed, awaiting confirmation.',
      Confirmed: 'Order accepted by the restaurant.',
      Preparing: 'Chef is preparing your fresh meal with love!',
      'Out for Delivery': 'Delivery partner has picked up your order and is on the way!',
      Delivered: 'Order has been delivered safely. Enjoy your meal!',
      Cancelled: 'Order has been cancelled.'
    };

    order.timeline.push({
      status,
      timestamp: new Date(),
      note: note || statusNotes[status] || `Status updated to ${status}`
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin / Restaurant)
// @route   GET /api/orders
// @access  Private (Admin / Restaurant)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50 } = req.query;
    let query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name logo')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
