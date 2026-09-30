const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Food item name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Burgers', 'Pizza', 'Asian', 'Mexican', 'Desserts', 'Beverages', 'Salads', 'Indian', 'Pasta', 'Sides']
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    },
    isVeg: {
      type: Boolean,
      default: false
    },
    isSpicy: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 4.6,
      min: 1,
      max: 5
    },
    preparationTimeMinutes: {
      type: Number,
      default: 20
    },
    calories: {
      type: Number,
      default: 350
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoodItem', foodItemSchema);
