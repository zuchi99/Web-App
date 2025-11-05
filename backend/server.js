const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection pool
const pool = new Pool({
  host: 'postgres',        // Service name from docker-compose
  port: 5432,
  user: 'ecommerce',
  password: 'devpassword123',
  database: 'ecommerce_db'
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// // Sample products data (we'll use database later) 
//    Commentted out bcus we now have posgres holding data
// const products = [
//   {
//     id: 1,
//     name: "Laptop",
//     description: "High-performance laptop",
//     price: 949.99,
//     stock: 10,
//     image: "/Images/laptop.jpg"
//   },
//   {
//     id: 2,
//     name: "Smartphone",
//     description: "Latest smartphone model",
//     price: 699.99,
//     stock: 25,
//     image: "/Images/smartphone.jpg"
//   },
//   {
//     id: 3,
//     name: "Headphones",
//     description: "Wireless noise-cancelling headphones",
//     price: 199.99,
//     stock: 50,
//     image: "/Images/headphone.jpg"
//   },
//   {
//     id: 4,
//     name: "Keyboards",
//     description: "Mechanical Keyboard with RGB lights",
//     price: 149.99,
//     stock: 20,
//     image: "/Images/keyboard.jpg"
//   },
//   {
//     id: 5,
//     name: "Gaming Mouse",
//     description: "Wireless Gaming mouse with RGB lights",
//     price: 99.99,
//     stock: 10,
//     image: "/Images/mouse.jpg"
//   },
//   {
//     id: 6,
//     name: "Tablets",
//     description: "Latest tablet model",
//     price: 299.99,
//     stock: 5,
//     image: "/Images/tablet.jpg"
//   },
//   {
//     id: 7,
//     name: "Airpods",
//     description: "Original Apple Airpods",
//     price: 149.99,
//     stock: 30,
//     image: "/Images/airpods.jpg"
//   }
// ];

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-Commerce API is running!',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json({ 
      success: true,
      data: result.rows 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products' 
    });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.json({ 
      success: true,
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch product' 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
