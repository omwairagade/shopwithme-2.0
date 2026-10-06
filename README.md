# ShopWithMe 2.0

![CI](https://github.com/omwairagade/shopwithme-2.0/actions/workflows/ci.yml/badge.svg)


A full-featured, professional MERN stack e-commerce application with JWT authentication, Stripe payments, and a complete admin dashboard.

## Features

- Authentication: JWT-based auth with role-based access (customer/admin)
- Product Catalog: Search, filter by category, sort, and pagination
- Shopping Cart: Redux + localStorage persistence
- Checkout: Real Stripe payment integration (test mode)
- Orders: Stock locking, order status tracking, order history
- Admin Dashboard: Stats overview, monthly sales chart, product/order/user management
- Security: Helmet, rate limiting, mongo-sanitize, bcrypt password hashing
- UI: Professional polish with icons, toast notifications, skeleton loaders

## Tech Stack

Frontend: React, Redux Toolkit, React Router, Tailwind CSS, Axios, Stripe.js, lucide-react, react-hot-toast, recharts, Vite

Backend: Node.js, Express, MongoDB, JWT, bcrypt, Stripe, Helmet, express-rate-limit, express-mongo-sanitize

## Project Structure

ShopWithMe/
- backend/
  - config/       Database connection
  - controllers/  Route logic
  - middleware/   Auth, error handling
  - models/       Mongoose schemas (User, Product, Order)
  - routes/       API routes
  - scripts/      Seed data, create admin
  - server.js
- frontend/
  - src/
    - components/ Navbar, Footer, ProductCard, admin components
    - pages/      Home, Cart, Checkout, Profile, admin pages
    - store/      Redux slices (auth, cart, admin)
    - services/   API client

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Stripe account (test mode keys)

### 1. Install dependencies

cd backend
npm install

cd ../frontend
npm install

### 2. Environment variables

Copy the example env files and fill in your own values.

backend/.env:
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173

frontend/.env:
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key

### 3. Seed demo data (optional but recommended)

cd backend
node scripts/seedProducts.js

This seeds 12 demo products across Electronics, Sports, Clothing, Home, Books, Beauty, and Toys categories.

### 4. Create an admin user

cd backend
node scripts/createAdmin.js

### 5. Run the app

Backend (from backend/):
npm run dev

Frontend (from frontend/):
npm run dev

Visit http://localhost:5173

## Testing Payments

Use Stripe test card to simulate a successful checkout:

Card number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits

## Default Admin Credentials

After running createAdmin.js:

Email: admin@shopwithme.com
Password: admin123

Change these in production.

## Key Schema Notes

- Product stock field is "stock" (not countInStock)
- Order line items are "items" array (not orderItems)
- User roles: customer or admin
- Order status: pending, processing, shipped, delivered, cancelled

## License

This project is for educational and portfolio purposes.

## Known Dependency Notices

npm audit reports some vulnerabilities in transitive dev dependencies (nodemon/chokidar/braces in backend; tailwindcss/vite/react-router in frontend). These require major breaking version upgrades to fully resolve and were intentionally left unpatched because:

- Affected packages are dev-only build tooling (nodemon, vite dev server, tailwind file watcher) not exposed in production
- react-router open-redirect advisory requires untrusted user input in navigation calls, which this app does not do
- Forcing upgrades would require Tailwind v3 to v4, Vite v6 to v8, and react-router-dom v6 to v7 migrations, risking breaking a fully tested, working application

Revisit if planning a major dependency upgrade pass in the future.

