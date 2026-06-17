import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

await mongoose.connect(process.env.MONGO_URI);
console.log('DB connected');

app.get('/test', async (req, res) => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  res.json(collections.map(c => c.name));
});

app.listen(5001, () => console.log('Test server on 5001'));
