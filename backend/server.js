import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';



// ... imports ...

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌', err.message));

// 1. DEFINE YOUR ROUTES FIRST
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// 2. DEFINE THE 404 HANDLER LAST
// This will only run if none of the routes above match the request
app.use((req, res) => {
  res.status(404).json({ message: "API Route not found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
