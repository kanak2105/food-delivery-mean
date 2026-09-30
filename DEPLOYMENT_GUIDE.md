# 🚀 Deployment Guide — CraveBite MEAN Stack Food Delivery

This guide provides end-to-end instructions for deploying your MEAN stack food delivery project.

---

## ❓ Do You Need to Deploy It?

- **For College / Academic / Viva Submissions**: You **do not strictly need** a public cloud deployment unless your evaluator specifically required a live URL. Running it locally (`http://localhost:4200`) or presenting it with Docker is standard and accepted everywhere.
- **For Portfolio / Client Demos / Resume**: Deploying it to a live public URL gives huge extra points, allowing anyone to test your application on their mobile phone or laptop.

---

## 🌟 Option 1: 100% Free Cloud Deployment (Recommended)

This approach separates your database, backend, and frontend onto the industry-standard free cloud tiers:

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Angular 18    │ ----> │ Node/Express API│ ----> │ MongoDB Atlas   │
│   (Vercel)      │       │ (Render.com)    │       │ (Cloud Cluster) │
│   Free Hosting  │       │ Free Web Service│       │ Free 512MB M0   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

### Step 1: Deploy Database on MongoDB Atlas (Free)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new **M0 Free Shared Cluster**.
3. Under **Database Access**, create a database user:
   - Username: `cravebite_admin`
   - Password: `YourSecurePassword123`
4. Under **Network Access**, click **Add IP Address** ➔ Choose **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** ➔ **Drivers (Node.js)** and copy your connection string:
   ```text
   mongodb+srv://cravebite_admin:YourSecurePassword123@cluster0.xxxxx.mongodb.net/food_delivery_mean?retryWrites=true&w=majority
   ```

---

### Step 2: Deploy Backend on Render.com (Free)
1. Push your repository to **GitHub**.
2. Sign in to [Render.com](https://render.com) and click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String from Step 1>`
   - `JWT_SECRET`: `super_secret_food_delivery_jwt_key_2026`
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide a live API URL like:
   `https://cravebite-backend.onrender.com`
8. *(Optional)* Seed the database via Render Shell by running: `node seed/seedData.js`.

---

### Step 3: Connect & Deploy Frontend on Vercel (Free)
1. In your frontend code, update `frontend/src/app/services/` to point to your live Render backend URL:
   - Open [`auth.service.ts`](file:///C:/Users/roshs/.gemini/antigravity/scratch/food-delivery-mean/frontend/src/app/services/auth.service.ts) and set:
     ```typescript
     private apiUrl = 'https://cravebite-backend.onrender.com/api/auth';
     ```
   - Open [`restaurant.service.ts`](file:///C:/Users/roshs/.gemini/antigravity/scratch/food-delivery-mean/frontend/src/app/services/restaurant.service.ts) and set:
     ```typescript
     private apiUrl = 'https://cravebite-backend.onrender.com/api/restaurants';
     private foodUrl = 'https://cravebite-backend.onrender.com/api/foods';
     ```
   - Open [`order.service.ts`](file:///C:/Users/roshs/.gemini/antigravity/scratch/food-delivery-mean/frontend/src/app/services/order.service.ts) and set:
     ```typescript
     private apiUrl = 'https://cravebite-backend.onrender.com/api/orders';
     ```
2. Go to [Vercel.com](https://vercel.com) and click **Add New** ➔ **Project**.
3. Select your repository and set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Angular`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/food-delivery-frontend/browser`
4. Click **Deploy**!
5. Vercel will give you a live HTTPS domain like:
   `https://cravebite-food-delivery.vercel.app`

---

## 🐳 Option 2: One-Command Docker Deployment

If you have Docker Desktop or a Linux VPS (Ubuntu / AWS EC2):

1. From the project root (`food-delivery-mean/`), simply run:
   ```bash
   docker compose up --build -d
   ```
2. Docker will build and run all 3 services automatically:
   - **MongoDB**: `localhost:27017`
   - **Express API**: `localhost:5000`
   - **Angular + Nginx**: `http://localhost` (Port 80)
3. To populate initial seed data inside the container:
   ```bash
   docker exec -it cravebite-backend node seed/seedData.js
   ```
4. To stop the containers:
   ```bash
   docker compose down
   ```

---

## 📋 Pre-Configured Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `john@example.com` | `password123` |
| **Admin** | `admin@foodie.com` | `password123` |
