import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email: 'admin@shopwithme.com' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit();
    }

    await User.create({
      name: 'Admin',
      email: 'admin@shopwithme.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Admin user created: admin@shopwithme.com / admin123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
