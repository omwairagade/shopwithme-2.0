import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${item.name}`);
    }
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.qty, sold: item.qty },
    });
  }

  res.status(201).json({ success: true, order });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    email: req.body.email,
  };

  const updated = await order.save();
  res.json({ success: true, order: updated });
});

export const getOrders = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const count = await Order.countDocuments();
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    count,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = req.body.status;
  if (req.body.status === 'delivered') {
    order.deliveredAt = Date.now();
  }

  const updated = await order.save();
  res.json({ success: true, order: updated });
});
