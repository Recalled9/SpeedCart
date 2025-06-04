/**
 * Cart page JavaScript for SpeedCart
 * Handles rendering and management of cart items
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize data
    await DataService.init();
    
    // Initialize cart
    CartService.init();
    
    // Render cart items
    renderCart();
    
    // Add event listener to checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }
});

/**
 * Render all cart items and summary
 */
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    const cartContainer = document.getElementById('cart-container');
    const emptyCartContainer = document.getElementById('empty-cart-container');
    
    if (!cartItemsContainer || !cartSummaryContainer) return;
    
    const cartItems = CartService.getItems();
    
    // Show empty cart message if cart is empty
    if (cartItems.length === 0) {
        if (cartContainer) cartContainer.style.display = 'none';
        if (emptyCartContainer) emptyCartContainer.style.display = 'block';
        return;
    }
    
    // Hide empty cart message and show cart if items exist
    if (cartContainer) cartContainer.style.display = 'block';
    if (emptyCartContainer) emptyCartContainer.style.display = 'none';
    
    // Render cart items
    let itemsHtml = '';
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        itemsHtml += `
            <div class="cart-item" data-id="${item.productId}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">₹${item.price.toFixed(2)} × ${item.quantity} = ₹${itemTotal.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-btn" data-id="${item.productId}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-id="${item.productId}">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.productId}">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHtml;
    
    // Render cart summary
    const totalItems = CartService.getTotalItems();
    const subtotal = CartService.getTotalPrice();
    const deliveryFee = subtotal > 100 ? 0 : 20; // Free delivery over ₹100
    const total = subtotal + deliveryFee;
    
    const summaryHtml = `
        <div class="summary-row">
            <span>Subtotal (${totalItems} items)</span>
            <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Delivery Fee</span>
            <span>${deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>₹${total.toFixed(2)}</span>
        </div>
    `;
    
    cartSummaryContainer.innerHTML = summaryHtml;
    
    // Add event listeners to cart item buttons
    addCartItemEventListeners();
}

/**
 * Add event listeners to cart item buttons (increase, decrease, remove)
 */
function addCartItemEventListeners() {
    // Increase quantity buttons
    const increaseButtons = document.querySelectorAll('.increase-btn');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const item = CartService.getItems().find(item => item.productId === productId);
            if (item) {
                CartService.updateQuantity(productId, item.quantity + 1);
                renderCart(); // Re-render cart
            }
        });
    });
    
    // Decrease quantity buttons
    const decreaseButtons = document.querySelectorAll('.decrease-btn');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const item = CartService.getItems().find(item => item.productId === productId);
            if (item && item.quantity > 1) {
                CartService.updateQuantity(productId, item.quantity - 1);
                renderCart(); // Re-render cart
            } else if (item && item.quantity === 1) {
                CartService.removeItem(productId);
                renderCart(); // Re-render cart
            }
        });
    });
    
    // Remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            CartService.removeItem(productId);
            renderCart(); // Re-render cart
        });
    });
}
