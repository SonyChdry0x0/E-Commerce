// import express from 'express';
// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';

// const router = express.Router();

// router.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;
//   const user = await User.create({ name, email, password });
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//   res.status(201).json({
//   token,
//   user: {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   },
// });
// });

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await bcrypt.compare(password, user.password)))
//     return res.status(401).json({ message: 'Invalid credentials' });
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//   res.json({
//   token,
//   user: {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   },
// });
// });

// export default router;

import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  console.log('EMAIL:', email);
  console.log('USER FOUND:', !!user);

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const match = await bcrypt.compare(password, user.password);

  console.log('PASSWORD MATCH:', match);

  if (!match) {
    return res.status(401).json({ message: 'Wrong password' });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

// Admin: get all users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete user
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: toggle admin role
router.put('/:id/admin', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;