# 🍕 CraveBite — Full-Stack Food Delivery Application (MEAN Stack)

A production-ready, full-featured **Food Delivery Web Application** built using the complete **MEAN Stack** (**M**ongoDB, **E**xpress.js, **A**ngular 18, and **N**ode.js).

---

## 🏛️ System Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                      CLIENT / FRONTEND                           │
│                      Angular 18 (SPA)                            │
│  - Standalone Components & Router                                │
│  - RxJS Reactive State (Cart, Auth, Orders)                      │
│  - Modern Responsive UI (Tailwind CSS, FontAwesome)              │
└─────────────────────────────────┬────────────────────────────────┘
                                  │ HTTP / REST APIs (JSON + JWT)
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                      SERVER / BACKEND                            │
│                  Node.js + Express.js                            │
│  - RESTful API Routing & Controllers                             │
│  - JWT Bearer Authentication & Role Authorization                │
│  - Business Logic (Cart, Tax, Discounts, Order Lifecycle)        │
└─────────────────────────────────┬────────────────────────────────┘
                                  │ Mongoose ODM
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                      DATABASE TIER                               │
│                         MongoDB                                  │
│  - Collections: users, restaurants, fooditems, orders, reviews   │
│  - Indexing, Validation, Relationships & Embedded Sub-schemas    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### 👤 1. Customer Experience
- **Restaurant Discovery**: Search restaurants and dishes by name, cuisine, rating, and delivery speed.
- **Categorized Menus**: Browse burgers, pizza, sushi, bowls, desserts, and sides with vegetarian and spicy badges.
- **Smart Cart & Single-Restaurant Locking**: Prevents accidental ordering from multiple restaurants simultaneously with a friendly reset modal.
- **Promo Code Discounts**: Instant coupon validation (e.g. `SAVE20`, `WELCOME50`).
- **Interactive Checkout**: Saved addresses, new address input, instructions, and multiple payment methods (Card, UPI, Cash on Delivery).
- **Live Order Tracking**: Dynamic step-by-step progress timeline:
  `Order Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`.
- **Order History & Receipts**: View past invoices and status details.

### 🛡️ 2. Restaurant Partner & Admin Dashboard
- **Live Orders Manager**: View all active orders and dispatch deliveries.
- **Real-Time Status Changer**: Advance order status directly from the table.
- **Menu Management**: Add, update, and manage restaurant dishes, prices, and categories.
- **KPI Metrics**: Total orders count, active in-flight orders, and gross revenue calculations.

---

## 📁 Project Structure

```text
food-delivery-mean/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── auth.controller.js       # Signup, login, profile, addresses
│   │   ├── restaurant.controller.js # Restaurants search, filter, details
│   │   ├── food.controller.js       # Dishes menu and food search
│   │   └── order.controller.js      # Cart checkout, calculation & status tracking
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT protect & role authorize
│   │   └── error.middleware.js      # Centralized error handler
│   ├── models/
│   │   ├── User.js                  # User schema with bcrypt hashing
│   │   ├── Restaurant.js            # Restaurant details & ratings
│   │   ├── FoodItem.js              # Dishes, prices, categories & veg badges
│   │   ├── Order.js                 # Orders, items, totals & timeline
│   │   └── Review.js                # Ratings & reviews
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── restaurant.routes.js
│   │   ├── food.routes.js
│   │   └── order.routes.js
│   ├── seed/
│   │   └── seedData.js              # Database seeder with realistic test data
│   ├── .env                         # Environment variables
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── navbar/          # Header with live cart count & user profile
    │   │   │   ├── footer/          # Footer with cuisine links & tech badges
    │   │   │   ├── home/            # Hero section, categories, featured spots
    │   │   │   ├── restaurant-list/ # Filter & search restaurant grid
    │   │   │   ├── restaurant-detail/# Category tabs, dish cards & add to cart
    │   │   │   ├── cart/            # Item adjustments & price summary
    │   │   │   ├── checkout/        # Address form & payment options
    │   │   │   ├── order-tracking/  # Real-time multi-step order timeline
    │   │   │   ├── order-history/   # Past orders and invoices
    │   │   │   ├── admin-dashboard/ # Live orders table & menu editor
    │   │   │   ├── login/           # Auth login with one-click demo fill
    │   │   │   └── register/        # Account creation & role selector
    │   │   ├── models/              # TypeScript interfaces (User, Order, etc.)
    │   │   ├── services/            # Angular HTTP services & RxJS stores
    │   │   ├── app.config.ts        # App providers (HttpClient, Router)
    │   │   ├── app.routes.ts        # Route declarations & route guards
    │   │   └── app.component.ts     # Main layout container
    │   ├── index.html               # Fonts & Tailwind CSS configuration
    │   ├── styles.css               # Global styles & custom scrollbars
    │   └── main.ts                  # Angular bootstrap
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

---

## 🛠️ Step-by-Step Setup & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017, or a MongoDB Atlas connection string.

---

### Step 1: Start & Seed the Backend

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured (default points to local MongoDB):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/food_delivery_mean
   JWT_SECRET=super_secret_food_delivery_jwt_key_2026
   ```

4. Populate the database with realistic restaurants and dishes:
   ```bash
   npm run seed
   ```

5. Start the Express server:
   ```bash
   npm run dev
   # OR
   npm start
   ```
   *The backend will be live at `http://localhost:5000` with health check at `http://localhost:5000/api/health`.*

---

### Step 2: Start the Angular Frontend

1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```text
   http://localhost:4200
   ```

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Customer** | `john@example.com` | `password123` | Browsing, Cart, Checkout, Order Tracking, History |
| **Admin / Restaurant** | `admin@foodie.com` | `password123` | Operations Dashboard, Order Dispatcher, Menu Dish Additions |
| **Restaurant Partner** | `owner@napoli.com` | `password123` | Restaurant Management |

---

## 📡 REST API Documentation

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Create new user account
- `POST /api/auth/login` — Sign in and get JWT token
- `GET /api/auth/me` — Retrieve profile of authenticated user
- `PUT /api/auth/profile` — Update user profile details
- `POST /api/auth/address` — Add new saved delivery address

### 🍽️ Restaurants (`/api/restaurants`)
- `GET /api/restaurants` — Get all restaurants (supports `?search=`, `?cuisine=`, `?sort=`)
- `GET /api/restaurants/:id` — Get restaurant info and menu grouped by category
- `GET /api/restaurants/meta/cuisines` — Get list of available cuisines
- `POST /api/restaurants` — Add restaurant *(Admin/Owner only)*
- `PUT /api/restaurants/:id` — Update restaurant details *(Admin/Owner only)*

### 🍲 Food Items (`/api/foods`)
- `GET /api/foods/restaurant/:restaurantId` — Get menu items for specific restaurant
- `GET /api/foods/search` — Search food items across all restaurants
- `POST /api/foods` — Create food item *(Admin/Owner only)*
- `PUT /api/foods/:id` — Update food item *(Admin/Owner only)*
- `DELETE /api/foods/:id` — Delete food item *(Admin/Owner only)*

### 📦 Orders (`/api/orders`)
- `POST /api/orders` — Place new food order with items, address, payment
- `GET /api/orders/my-orders` — List logged-in user's past orders
- `GET /api/orders/:id` — Order tracking receipt & live timeline
- `GET /api/orders` — Get all orders *(Admin/Restaurant only)*
- `PUT /api/orders/:id/status` — Advance order status *(Confirmed ➔ Preparing ➔ Out for Delivery ➔ Delivered)*
