import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        image: String,
        price: Number,
        qty: Number,
      },
    ],
    shippingAddress: {
      line1: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    paymentMethod: { type: String, default: 'stripe' },
    paymentResult: { id: String, status: String, email: String },
    itemsPrice: Number,
    shippingPrice: Number,
    taxPrice: Number,
    totalPrice: Number,
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);