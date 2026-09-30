const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

// @desc    Get foods by restaurant ID
// @route   GET /api/foods/restaurant/:restaurantId
// @access  Public
exports.getFoodsByRestaurant = async (req, res, next) => {
  try {
    const { category, isVeg } = req.query;
    let query = { restaurant: req.params.restaurantId, isAvailable: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (isVeg !== undefined && isVeg !== '') {
      query.isVeg = isVeg === 'true';
    }

    const items = await FoodItem.find(query).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search food items across restaurants
// @route   GET /api/foods/search
// @access  Public
exports.searchFoods = async (req, res, next) => {
  try {
    const { q, category } = req.query;
    let query = { isAvailable: true };

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const items = await FoodItem.find(query).populate('restaurant', 'name rating deliveryTimeMinutes bannerImage');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new food item
// @route   POST /api/foods
// @access  Private (Restaurant Owner / Admin)
exports.createFoodItem = async (req, res, next) => {
  try {
    const { restaurant: restaurantId } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const foodItem = await FoodItem.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Food item added successfully',
      data: foodItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private (Restaurant Owner / Admin)
exports.updateFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      data: foodItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private (Restaurant Owner / Admin)
exports.deleteFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);

    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
