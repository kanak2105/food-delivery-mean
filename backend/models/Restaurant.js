const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    cuisine: {
      type: [String],
      required: [true, 'At least one cuisine type is required']
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 120
    },
    deliveryTimeMinutes: {
      type: Number,
      default: 30
    },
    deliveryFee: {
      type: Number,
      default: 2.99
    },
    minimumOrder: {
      type: Number,
      default: 10.0
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      postalCode: { type: String, required: true },
      location: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
      }
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80'
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
