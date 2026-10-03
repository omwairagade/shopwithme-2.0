import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    brand: String,
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

export default mongoose.model('Product', productSchema);