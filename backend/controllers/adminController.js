import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email');

  const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
    .sort({ stock: 1 })
    .limit(5);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlySales = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        sales: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
    recentOrders,
    lowStockProducts,
    monthlySales,
  });
});
