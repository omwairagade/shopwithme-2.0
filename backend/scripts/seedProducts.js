import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-noise-cancelling-headphones',
    description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    brand: 'SoundPeak',
    category: 'Electronics',
    price: 149.99,
    discountPrice: 119.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'],
    stock: 35,
    featured: true,
  },
  {
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Track your heart rate, sleep, and workouts with this sleek smartwatch.',
    brand: 'PulseTech',
    category: 'Electronics',
    price: 199.99,
    discountPrice: 0,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
    stock: 22,
    featured: true,
  },
  {
    name: 'Classic Running Sneakers',
    slug: 'classic-running-sneakers',
    description: 'Lightweight, breathable running shoes built for comfort and performance.',
    brand: 'Stridex',
    category: 'Sports',
    price: 79.99,
    discountPrice: 59.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
    stock: 40,
    featured: true,
  },
  {
    name: 'Bold Red Sneakers',
    slug: 'bold-red-sneakers',
    description: 'Eye-catching street style sneakers with cushioned soles.',
    brand: 'Stridex',
    category: 'Sports',
    price: 89.99,
    discountPrice: 0,
    images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80'],
    stock: 18,
    featured: false,
  },
  {
    name: 'Minimalist Leather Backpack',
    slug: 'minimalist-leather-backpack',
    description: 'Durable genuine leather backpack with laptop compartment.',
    brand: 'UrbanCraft',
    category: 'Clothing',
    price: 129.99,
    discountPrice: 99.99,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'],
    stock: 15,
    featured: true,
  },
  {
    name: 'Cozy Knit Sweater',
    slug: 'cozy-knit-sweater',
    description: 'Soft wool-blend sweater, perfect for cold winter days.',
    brand: 'Warmline',
    category: 'Clothing',
    price: 54.99,
    discountPrice: 0,
    images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80'],
    stock: 30,
    featured: false,
  },
  {
    name: 'Modern Table Lamp',
    slug: 'modern-table-lamp',
    description: 'Elegant LED table lamp with adjustable brightness.',
    brand: 'Lumina',
    category: 'Home',
    price: 44.99,
    discountPrice: 34.99,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80'],
    stock: 25,
    featured: false,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    slug: 'ceramic-coffee-mug-set',
    description: 'Set of 4 handcrafted ceramic mugs, dishwasher safe.',
    brand: 'HomeStyle',
    category: 'Home',
    price: 29.99,
    discountPrice: 0,
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80'],
    stock: 50,
    featured: false,
  },
  {
    name: 'The Art of Focus - Bestselling Book',
    slug: 'the-art-of-focus-book',
    description: 'A practical guide to deep work and productivity in the digital age.',
    brand: 'PagePress',
    category: 'Books',
    price: 19.99,
    discountPrice: 14.99,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80'],
    stock: 60,
    featured: true,
  },
  {
    name: 'Natural Glow Skincare Set',
    slug: 'natural-glow-skincare-set',
    description: 'A 3-step skincare routine with organic, cruelty-free ingredients.',
    brand: 'PureSkin',
    category: 'Beauty',
    price: 64.99,
    discountPrice: 49.99,
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80'],
    stock: 28,
    featured: true,
  },
  {
    name: 'Wooden Building Blocks Set',
    slug: 'wooden-building-blocks-set',
    description: 'Eco-friendly wooden blocks for creative play, ages 3+.',
    brand: 'KidCraft',
    category: 'Toys',
    price: 34.99,
    discountPrice: 0,
    images: ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&q=80'],
    stock: 20,
    featured: false,
  },
  {
    name: 'Yoga Mat with Carry Strap',
    slug: 'yoga-mat-carry-strap',
    description: 'Non-slip, eco-friendly yoga mat with alignment lines.',
    brand: 'ZenFit',
    category: 'Sports',
    price: 39.99,
    discountPrice: 29.99,
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80'],
    stock: 33,
    featured: false,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany({});
    console.log('Existing products cleared.');

    await Product.insertMany(products);
    console.log(`${products.length} demo products seeded successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seedProducts();
