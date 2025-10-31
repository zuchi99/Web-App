const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample products data (we'll use database later)
const products = [
  {
    id: 1,
    name: "Laptop",
    description: "High-performance laptop",
    price: 999.99,
    stock: 10,
    image: "https://via.placeholder.com/300"
  },
  {
    id: 2,
    name: "Smartphone",
    description: "Latest smartphone model",
    price: 699.99,
    stock: 25,
    image: "https://via.placeholder.com/300"
  },
  {
    id: 3,
    name: "Headphones",
    description: "Wireless noise-cancelling headphones",
    price: 199.99,
    stock: 50,
    image: "https://via.placeholder.com/300"
  }
];

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

app.get('/api/products', (req, res) => {
  res.json({ 
    success: true,
    data: products 
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ 
      success: false, 
      message: 'Product not found' 
    });
  }
  
  res.json({ 
    success: true,
    data: product 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
