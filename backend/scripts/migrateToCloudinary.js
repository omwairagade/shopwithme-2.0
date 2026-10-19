import dotenv from "dotenv";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const migrateToCloudinary = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to:", mongoose.connection.name);

    const products = await Product.find({
      images: { $regex: "pixabay", $options: "i" }
    });

    console.log("Products to migrate:", products.length);

    let success = 0;
    let failed = 0;

    for (const product of products) {
      try {
        const result = await cloudinary.uploader.upload(product.images[0], {
          folder: "shopwithme/products",
          public_id: product.slug,
          overwrite: true,
          timeout: 60000
        });

        product.images = [result.secure_url];
        await product.save();
        success++;
        console.log("UPLOADED:", product.name, "->", result.secure_url);
      } catch (err) {
        failed++;
        console.log("FAILED:", product.name, "-", err.message);
      }

      await sleep(400);
    }

    console.log("===================");
    console.log("Success:", success);
    console.log("Failed:", failed);

    process.exit(0);
  } catch (err) {
    console.error("Fatal error:", err.message);
    process.exit(1);
  }
};

migrateToCloudinary();
