const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// @desc    Get all restaurants with search & filtering
// @route   GET /api/restaurants
// @access  Public
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, minRating, sort, page = 1, limit = 20 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ];
    }

    if (cuisine && cuisine !== 'All') {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    let sortOptions = {};
    if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'deliveryTime') {
      sortOptions = { deliveryTimeMinutes: 1 };
    } else if (sort === 'deliveryFee') {
      sortOptions = { deliveryFee: 1 };
    } else {
      sortOptions = { featured: -1, createdAt: -1 };
    }

    const total = await Restaurant.countDocuments(query);
    const restaurants = await Restaurant.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: restaurants.length,
      total,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant by ID with its menu
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const menuItems = await FoodItem.find({ restaurant: req.params.id, isAvailable: true });

    // Group menu items by category
    const menuByCategory = menuItems.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        restaurant,
        menuByCategory,
        allItems: menuItems
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unique cuisines list
// @route   GET /api/restaurants/meta/cuisines
// @access  Public
exports.getCuisines = async (req, res, next) => {
  try {
    const cuisines = await Restaurant.distinct('cuisine');
    res.status(200).json({
      success: true,
      data: cuisines
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new restaurant (Admin / Owner)
// @route   POST /api/restaurants
// @access  Private (Admin / Restaurant Owner)
exports.createRestaurant = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Admin / Restaurant Owner)
exports.updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Check ownership if not admin
    if (req.user.role !== 'admin' && restaurant.owner && restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this restaurant' });
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};
