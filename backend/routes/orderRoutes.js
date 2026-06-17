// import express from 'express';
// import Order from '../models/Order.js';
// import { protect } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/', protect, async (req, res) => {
//   try {
//     const { items, total } = req.body;
//     const order = await Order.create({ user: req.user.id, items, total });
//     res.status(201).json(order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get('/myorders', protect, async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;


import express from 'express';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer: place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, total } = req.body;
    const order = await Order.create({ user: req.user.id, items, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customer: get own orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete order
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;