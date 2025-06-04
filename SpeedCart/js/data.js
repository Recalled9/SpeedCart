/**
 * Data handling module for SpeedCart
 * Handles loading and saving product data from JSON and localStorage
 */

// Main data object to store products and categories
const DataService = {
    products: [],
    categories: [],
    
    /**
     * Initialize data by loading from JSON file
     * @returns {Promise} Promise that resolves when data is loaded
     */
    init: async function() {
        try {
            const response = await fetch('/data/products.json');
            if (!response.ok) {
                throw new Error('Failed to load product data');
            }
            const data = await response.json();
            this.products = data.products;
            this.categories = data.categories;
            return data;
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback to empty arrays if data can't be loaded
            this.products = [];
            this.categories = [];
            return { products: [], categories: [] };
        }
    },
    
    /**
     * Get all products
     * @returns {Array} Array of all products
     */
    getAllProducts: function() {
        return this.products;
    },
    
    /**
     * Get all categories
     * @returns {Array} Array of all categories
     */
    getAllCategories: function() {
        return this.categories;
    },
    
    /**
     * Get products by category ID
     * @param {string} categoryId - Category ID to filter by
     * @returns {Array} Array of products in the specified category
     */
    getProductsByCategory: function(categoryId) {
        return this.products.filter(product => product.category === categoryId);
    },
    
    /**
     * Get featured products
     * @param {number} limit - Maximum number of products to return
     * @returns {Array} Array of featured products
     */
    getFeaturedProducts: function(limit) {
        const featured = this.products.filter(product => product.featured);
        return limit ? featured.slice(0, limit) : featured;
    },
    
    /**
     * Get a product by its ID
     * @param {string} productId - Product ID to find
     * @returns {Object|null} Product object or null if not found
     */
    getProductById: function(productId) {
        return this.products.find(product => product.id === productId) || null;
    },
    
    /**
     * Get a category by its ID
     * @param {string} categoryId - Category ID to find
     * @returns {Object|null} Category object or null if not found
     */
    getCategoryById: function(categoryId) {
        return this.categories.find(category => category.id === categoryId) || null;
    },
    
    /**
     * Add a new product
     * @param {Object} product - Product object to add
     * @returns {boolean} Success status
     */
    addProduct: function(product) {
        // Generate a new ID if not provided
        if (!product.id) {
            product.id = 'p' + (this.products.length + 1);
        }
        
        this.products.push(product);
        this.saveProducts();
        return true;
    },
    
    /**
     * Save products to localStorage (since we don't have a backend)
     * @returns {boolean} Success status
     */
    saveProducts: function() {
        try {
            localStorage.setItem('blinkit_products', JSON.stringify(this.products));
            return true;
        } catch (error) {
            console.error('Error saving products to localStorage:', error);
            return false;
        }
    },
    
    /**
     * Load products from localStorage if available
     * @returns {boolean} Success status
     */
    loadProductsFromStorage: function() {
        try {
            const storedProducts = localStorage.getItem('blinkit_products');
            if (storedProducts) {
                this.products = JSON.parse(storedProducts);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading products from localStorage:', error);
            return false;
        }
    }
};

/**
 * Cart handling module
 * Manages shopping cart using localStorage
 */
const CartService = {
    items: [],
    
    /**
     * Initialize cart from localStorage
     */
    init: function() {
        this.loadCart();
    },
    
    /**
     * Load cart from localStorage
     */
    loadCart: function() {
        const cart = localStorage.getItem('blinkit_cart');
        this.items = cart ? JSON.parse(cart) : [];
    },
    
    /**
     * Save cart to localStorage
     */
    saveCart: function() {
        localStorage.setItem('blinkit_cart', JSON.stringify(this.items));
    },
    
    /**
     * Get all cart items
     * @returns {Array} Array of cart items
     */
    getItems: function() {
        return this.items;
    },
    
    /**
     * Add item to cart
     * @param {string} productId - Product ID to add
     * @param {number} quantity - Quantity to add
     * @returns {boolean} Success status
     */
    addItem: function(productId, quantity = 1) {
        const product = DataService.getProductById(productId);
        if (!product) return false;
        
        const existingItem = this.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                productId,
                quantity,
                name: product.name,
                price: product.price,
                image: product.image,
                unit: product.unit
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        return true;
    },
    
    /**
     * Update quantity of an item in the cart
     * @param {string} productId - Product ID to update
     * @param {number} quantity - New quantity
     * @returns {boolean} Success status
     */
    updateQuantity: function(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (!item) return false;
        
        if (quantity <= 0) {
            return this.removeItem(productId);
        }
        
        item.quantity = quantity;
        this.saveCart();
        this.updateCartCount();
        return true;
    },
    
    /**
     * Remove item from cart
     * @param {string} productId - Product ID to remove
     * @returns {boolean} Success status
     */
    removeItem: function(productId) {
        const index = this.items.findIndex(item => item.productId === productId);
        if (index === -1) return false;
        
        this.items.splice(index, 1);
        this.saveCart();
        this.updateCartCount();
        return true;
    },
    
    /**
     * Clear all items from cart
     */
    clearCart: function() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    },
    
    /**
     * Get total number of items in cart
     * @returns {number} Total quantity of all items
     */
    getTotalItems: function() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    /**
     * Get total price of all items in cart
     * @returns {number} Total price
     */
    getTotalPrice: function() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    /**
     * Update cart count display in the header
     */
    updateCartCount: function() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const count = this.getTotalItems();
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }
};

// Initialize cart when the page loads
document.addEventListener('DOMContentLoaded', function() {
    CartService.init();
});
