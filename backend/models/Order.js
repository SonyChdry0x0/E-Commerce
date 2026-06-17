import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name:  String,
      price: Number,
      qty:   Number,
    }
  ],
  total:  { type: Number, required: true },
  status: { type: String, default: 'pending' },
  isPaid: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
