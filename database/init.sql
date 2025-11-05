-- products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- sample products
INSERT INTO products (name, description, price, stock, image) VALUES
('Laptop', 'High-performance laptop', 949.99, 10, '/Images/laptop.jpg'),
('Smartphone', 'Latest smartphone model', 699.99, 22, '/Images/smartphone.jpg'),
('Headphones', 'Wireless noise-cancelling headphones', 199.99, 10, '/Images/headphone.jpg'),
('Keyboards', 'Mechanical Keyboard with RGB lights', 149.99, 20, '/Images/keyboard.jpg'),
('Gaming Mouse', 'Wireless Gaming mouse with RGB lights', 99.99, 10, '/Images/mouse.jpg'),
('Tablets', 'Latest tablet model', 299.99, 5, '/Images/tablet.jpg'),
('Airpods', 'Original Apple Airpods', 149.99, 20, '/Images/airpods.jpg');