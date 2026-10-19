import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

dotenv.config();

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to:", mongoose.connection.name);

    const total = await Product.countDocuments();
    const cloudinaryCount = await Product.countDocuments({ images: { $regex: "cloudinary", $options: "i" } });
    const unsplashCount = await Product.countDocuments({ images: { $regex: "unsplash", $options: "i" } });
    const pixabayCount = await Product.countDocuments({ images: { $regex: "pixabay", $options: "i" } });
    const loremflickrCount = await Product.countDocuments({ images: { $regex: "loremflickr", $options: "i" } });
    const picsumCount = await Product.countDocuments({ images: { $regex: "picsum", $options: "i" } });

    console.log("Total products:", total);
    console.log("Cloudinary:", cloudinaryCount);
    console.log("Unsplash:", unsplashCount);
    console.log("Pixabay (should be 0):", pixabayCount);
    console.log("Loremflickr (should be 0):", loremflickrCount);
    console.log("Picsum (should be 0):", picsumCount);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

check();
