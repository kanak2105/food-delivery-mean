const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_delivery_mean';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();
    await Order.deleteMany();
    console.log('[Seed] Cleared old collections...');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@foodie.com',
      password: 'password123',
      role: 'admin',
      phone: '+1 555-0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      addresses: [
        {
          street: '100 Tech Blvd, Suite 400',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          isDefault: true
        }
      ]
    });

    const customerUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
      phone: '+1 555-0142',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      addresses: [
        {
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          postalCode: '97477',
          landmark: 'Opposite Central Park',
          isDefault: true
        }
      ]
    });

    const ownerUser = await User.create({
      name: 'Chef Marco Rossi',
      email: 'owner@napoli.com',
      password: 'password123',
      role: 'restaurant',
      phone: '+1 555-0188'
    });

    console.log('[Seed] Created demo users (admin, customer, restaurant owner)...');

    // 2. Create Restaurants
    const restaurants = await Restaurant.create([
      {
        name: 'The Burger Craft',
        description: 'Artisanal brioche smash burgers, crispy hand-cut waffle fries, and thick shakes.',
        cuisine: ['Burgers', 'American', 'Fast Food'],
        rating: 4.8,
        totalReviews: 340,
        deliveryTimeMinutes: 25,
        deliveryFee: 1.99,
        minimumOrder: 12.0,
        address: { street: '124 Market St', city: 'San Francisco', postalCode: '94103' },
        bannerImage: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1200&q=80',
        logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
        isOpen: true,
        featured: true,
        owner: ownerUser._id
      },
      {
        name: 'Napoli Woodfired Pizza',
        description: 'Traditional Neapolitan pizza baked in 900°F volcanic stone wood-fired oven.',
        cuisine: ['Pizza', 'Italian', 'Pasta'],
        rating: 4.9,
        totalReviews: 520,
        deliveryTimeMinutes: 30,
        deliveryFee: 2.49,
        minimumOrder: 15.0,
        address: { street: '58 Columbus Ave', city: 'San Francisco', postalCode: '94133' },
        bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
        logo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80',
        isOpen: true,
        featured: true,
        owner: ownerUser._id
      },
      {
        name: 'Tokyo Sushi & Ramen Bar',
        description: 'Authentic 18-hour tonkotsu broth ramen, fresh nigiri, and specialty maki rolls.',
        cuisine: ['Asian', 'Japanese', 'Sides'],
        rating: 4.7,
        totalReviews: 410,
        deliveryTimeMinutes: 35,
        deliveryFee: 2.99,
        minimumOrder: 18.0,
        address: { street: '890 Geary St', city: 'San Francisco', postalCode: '94109' },
        bannerImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
        logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300&q=80',
        isOpen: true,
        featured: true,
        owner: ownerUser._id
      },
      {
        name: 'Spice Symphony Indian Bistro',
        description: 'Rich slow-cooked Mughlai biryanis, aromatic curries, and garlic tandoori naans.',
        cuisine: ['Indian', 'Asian', 'Sides'],
        rating: 4.6,
        totalReviews: 290,
        deliveryTimeMinutes: 30,
        deliveryFee: 2.0,
        minimumOrder: 15.0,
        address: { street: '405 Howard St', city: 'San Francisco', postalCode: '94105' },
        bannerImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
        logo: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=300&q=80',
        isOpen: true,
        featured: false,
        owner: ownerUser._id
      },
      {
        name: 'Green Oasis Bowls & Salads',
        description: 'Fresh farm-to-table organic macro bowls, cold pressed juices, and clean protein.',
        cuisine: ['Salads', 'Beverages'],
        rating: 4.8,
        totalReviews: 180,
        deliveryTimeMinutes: 20,
        deliveryFee: 1.49,
        minimumOrder: 10.0,
        address: { street: '220 4th St', city: 'San Francisco', postalCode: '94103' },
        bannerImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
        logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
        isOpen: true,
        featured: false,
        owner: ownerUser._id
      },
      {
        name: 'Sweet Bliss Dessert Studio',
        description: 'Gourmet Belgian waffles, molten lava cakes, artisan macaroons, and bubble teas.',
        cuisine: ['Desserts', 'Beverages'],
        rating: 4.9,
        totalReviews: 610,
        deliveryTimeMinutes: 20,
        deliveryFee: 1.99,
        minimumOrder: 8.0,
        address: { street: '310 Sutter St', city: 'San Francisco', postalCode: '94108' },
        bannerImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
        logo: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80',
        isOpen: true,
        featured: false,
        owner: ownerUser._id
      }
    ]);

    console.log('[Seed] Created 6 realistic restaurants...');

    // 3. Create Food Items
    const foodItems = [
      // Burger Craft
      {
        restaurant: restaurants[0]._id,
        name: 'Truffle Bacon Double Smash',
        description: 'Two grass-fed Angus beef patties, aged cheddar, applewood bacon, black truffle aioli on toasted brioche.',
        price: 14.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        isSpicy: false,
        calories: 820
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Spicy Nashville Hot Chicken Burger',
        description: 'Crispy fried chicken breast dipped in cayenne oil, creamy slaw, dill pickles, comeback sauce.',
        price: 12.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        isSpicy: true,
        calories: 740
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Loaded Truffle Parmesan Waffle Fries',
        description: 'Golden criss-cross fries tossed with white truffle oil, grated parmesan, and fresh chives.',
        price: 6.49,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isSpicy: false,
        calories: 420
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Salted Caramel Pretzel Shake',
        description: 'Vanilla bean custard blended with salted caramel, topped with whipped cream and crushed pretzels.',
        price: 5.99,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isSpicy: false,
        calories: 520
      },

      // Napoli Pizza
      {
        restaurant: restaurants[1]._id,
        name: 'Classic Margherita D.O.P.',
        description: 'San Marzano tomatoes, fresh buffalo mozzarella, fragrant sweet basil, extra virgin olive oil.',
        price: 16.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isSpicy: false,
        calories: 680
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Diavola Pepperoni & Hot Honey',
        description: 'Spicy Calabrese salami, mozzarella, organic honey drizzle, and fresh red chili flakes.',
        price: 18.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        isSpicy: true,
        calories: 780
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Truffle Cream Penne Pasta',
        description: 'Al dente penne in velvety black truffle cream sauce with wild sautéed cremini mushrooms.',
        price: 15.49,
        category: 'Pasta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169b?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isSpicy: false,
        calories: 620
      },

      // Tokyo Sushi & Ramen
      {
        restaurant: restaurants[2]._id,
        name: 'Tonkotsu Chashu Ramen',
        description: 'Rich 18-hour pork bone broth, tender slow-braised pork belly chashu, ajitsuke tamago, bamboo shoots.',
        price: 16.50,
        category: 'Asian',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        isSpicy: false,
        calories: 710
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Dragon Roll (8 pcs)',
        description: 'Eel and cucumber topped with sliced avocado, tobiko roe, toasted sesame, and sweet unagi glaze.',
        price: 17.00,
        category: 'Asian',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        isSpicy: false,
        calories: 460
      },

      // Spice Symphony
      {
        restaurant: restaurants[3]._id,
        name: 'Royal Dum Hyderabadi Chicken Biryani',
        description: 'Fragrant basmati rice layered with spiced marinated chicken, saffron, caramelised onions, served with mirchi ka salan.',
        price: 15.99,
        category: 'Indian',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        isSpicy: true,
        calories: 750
      },
      {
        restaurant: restaurants[3]._id,
        name: 'Paneer Butter Masala & Garlic Naan',
        description: 'Cottage cheese cubes simmered in velvety tomato-butter gravy with aromatic fenugreek and butter garlic naan.',
        price: 14.49,
        category: 'Indian',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isSpicy: false,
        calories: 690
      },

      // Green Oasis
      {
        restaurant: restaurants[4]._id,
        name: 'Avocado Quinoa Power Salad',
        description: 'Tri-color quinoa, baby spinach, hass avocado, edamame, cherry tomatoes, and lemon tahini dressing.',
        price: 11.99,
        category: 'Salads',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isSpicy: false,
        calories: 380
      },

      // Sweet Bliss
      {
        restaurant: restaurants[5]._id,
        name: 'Warm Belgian Chocolate Lava Cake',
        description: 'Decadent molten dark chocolate center dusted with cocoa powder, served with Madagascar vanilla gelato.',
        price: 8.99,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isSpicy: false,
        calories: 490
      }
    ];

    await FoodItem.insertMany(foodItems);
    console.log(`[Seed] Created ${foodItems.length} delicious food items...`);

    // 4. Create Sample Initial Order
    const demoItems = await FoodItem.find({ restaurant: restaurants[0]._id }).limit(2);
    const orderSubtotal = demoItems[0].price + demoItems[1].price;
    const orderTax = Number((orderSubtotal * 0.05).toFixed(2));
    const orderTotal = Number((orderSubtotal + 1.99 + orderTax).toFixed(2));

    await Order.create({
      user: customerUser._id,
      restaurant: restaurants[0]._id,
      items: demoItems.map(item => ({
        foodItem: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image
      })),
      subtotal: orderSubtotal,
      deliveryFee: 1.99,
      tax: orderTax,
      totalAmount: orderTotal,
      deliveryAddress: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        postalCode: '97477',
        phone: '+1 555-0142',
        instructions: 'Please ring the doorbell and leave at door.'
      },
      status: 'Preparing',
      paymentMethod: 'Credit/Debit Card',
      paymentStatus: 'Paid',
      estimatedDeliveryTime: new Date(Date.now() + 25 * 60000),
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date(Date.now() - 10 * 60000),
          note: 'Order placed by John Doe'
        },
        {
          status: 'Confirmed',
          timestamp: new Date(Date.now() - 8 * 60000),
          note: 'The Burger Craft accepted the order'
        },
        {
          status: 'Preparing',
          timestamp: new Date(Date.now() - 3 * 60000),
          note: 'Chef is grilling your burgers and preparing fries!'
        }
      ]
    });

    console.log('[Seed] Created sample active order for John Doe...');
    console.log('[Seed] Database seeding completed successfully! ✨');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedData();
