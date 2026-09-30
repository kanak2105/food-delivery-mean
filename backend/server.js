const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Base Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'MEAN Stack Food Delivery Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/restaurants', require('./routes/restaurant.routes'));
app.use('/api/foods', require('./routes/food.routes'));
app.use('/api/orders', require('./routes/order.routes'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🍕 Food Delivery MEAN Server running on port ${PORT}`);
  console.log(`  🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

module.exports = app;
