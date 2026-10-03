import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();

  res.json({
    success: true,
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    },
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = req.body.role;
  const updated = await user.save();

  res.json({ success: true, user: updated });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete an admin user');
  }

  await user.deleteOne();
  res.json({ success: true, message: 'User removed' });
});
