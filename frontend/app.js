// Configuration
const API_URL = 'http://localhost:5000/api';

// State
let cart = [];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartCount = document.getElementById('cart-count');

// Fetch and display products
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        displayProducts(data.data);
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = `
            <div class="error">
                ❌ Unable to load products. Make sure the backend is running on port 5000.
            </div>
        `;
    }
}

// Display products in the grid
function displayProducts(products) {
    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<div class="loading">No products available</div>';
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-stock">Stock: ${product.stock} available</div>
            <button 
                class="add-to-cart-btn" 
                onclick="addToCart(${product.id}, '${product.name}', ${product.price})"
                ${product.stock === 0 ? 'disabled' : ''}
            >
                ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    `).join('');
}

// Add item to cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    updateCartCount();
    updateCartDisplay();
    
    // Show feedback
    alert(`${name} added to cart!`);
}

// Remove item from cart
function removeFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        
        updateCartCount();
        updateCartDisplay();
    }
}

// Update cart count display
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// View cart contents
function viewCart() {
    const cartSection = document.getElementById('cart-section');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        if (cartSection) {
            cartSection.style.display = 'none';
        }
        return;
    }
    
    if (!cartSection || !cartItems || !cartTotal) {
        // Fallback: show simple alert if cart section doesn't exist
        let cartMessage = '🛒 Shopping Cart:\n\n';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartMessage += `${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}\n`;
        });
        
        cartMessage += `\n💰 Total: $${total.toFixed(2)}`;
        alert(cartMessage);
        return;
    }
    
    cartSection.style.display = 'block';
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-actions">
                    <span>Quantity: ${item.quantity}</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = total.toFixed(2);
    
    // Smooth scroll to cart section
    cartSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Update cart display WITHOUT scrolling
function updateCartDisplay() {
    const cartSection = document.getElementById('cart-section');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        if (cartSection) {
            cartSection.style.display = 'none';
        }
        return;
    }
    
    if (!cartSection || !cartItems || !cartTotal) {
        return;
    }
    
    cartSection.style.display = 'block';
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-actions">
                    <span>Quantity: ${item.quantity}</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = total.toFixed(2);
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Checkout - Total: $${total.toFixed(2)}\n\nThank you for your purchase! 🎉`);
    
    // Clear cart
    cart = [];
    updateCartCount();
    viewCart();
}

// Make functions globally accessible
window.viewCart = viewCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;

// Initialize app - wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
} else {
    loadProducts();
}