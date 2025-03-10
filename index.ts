import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://2mynejosh:oZGriXxXPSA8py01@cluster0.m0azz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'after_school_classes';

let client: MongoClient | null = null;

async function connectToDb() {
  try {
    client = new MongoClient(MONGODB_URI); // Removed outdated options
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Middleware to ensure DB connection
const getDb = () => {
  if (!client) throw new Error("Database not connected");
  return client.db(DB_NAME);
};

// API Routes
app.get('/api/lessons', async (req, res) => {
  try {
    const db = getDb();
    const lessons = await db.collection('lessons').find().toArray();
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

import { Request, Response } from 'express'; // Ensure correct typing

app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    if (!client) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    const db = client.db('2mynejosh'); // ✅ Updated with correct database name
    const { items, customer } = req.body;

    if (!items || !customer) {
      return res.status(400).json({ error: 'Missing order details' });
    }

    const result = await db.collection('orders').insertOne({
      items,
      customer,
      date: new Date(),
    });

    res.json({ success: true, orderId: result.insertedId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});


const PORT = process.env.PORT || 3000;

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
