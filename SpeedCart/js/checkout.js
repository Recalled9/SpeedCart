/**
 * Checkout page JavaScript for SpeedCart
 * Handles rendering of checkout summary and order placement
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize data
    await DataService.init();
    
    // Initialize cart
    CartService.init();
    
    // Check if cart is empty
    const cartItems = CartService.getItems();
    if (cartItems.length === 0) {
        // Redirect to cart page if cart is empty
        window.location.href = 'cart.html';
        return;
    }
    
    // Render checkout summary
    renderCheckoutSummary();
    
    // Add event listener to place order button
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            placeOrder();
        });
    }
});

/**
 * Render checkout summary with cart items and totals
 */
function renderCheckoutSummary() {
    const orderSummaryContainer = document.getElementById('order-summary-container');
    if (!orderSummaryContainer) return;
    
    const cartItems = CartService.getItems();
    const totalItems = CartService.getTotalItems();
    const subtotal = CartService.getTotalPrice();
    const deliveryFee = subtotal > 100 ? 0 : 20; // Free delivery over ₹100
    const total = subtotal + deliveryFee;
    
    // Create HTML for order items
    let itemsHtml = '';
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        itemsHtml += `
            <div class="order-item">
                <div class="order-item-details">
                    <span class="order-item-quantity">${item.quantity}×</span>
                    <span class="order-item-name">${item.name}</span>
                </div>
                <div class="order-item-price">₹${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    // Create HTML for order summary
    const summaryHtml = `
        <div class="checkout-items">
            <h3>Order Summary (${totalItems} items)</h3>
            <div class="order-items">
                ${itemsHtml}
            </div>
        </div>
        <div class="checkout-totals">
            <div class="summary-row">
                <span>Subtotal</span>
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
        </div>
    `;
    
    orderSummaryContainer.innerHTML = summaryHtml;
}

/**
 * Handle order placement (dummy implementation)
 */
function placeOrder() {
    // Get form data
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    
    // Simple validation
    if (!nameInput.value || !phoneInput.value || !addressInput.value) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Create order object (in a real app, this would be sent to a server)
    const order = {
        id: 'ORD' + Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: nameInput.value,
            phone: phoneInput.value,
            address: addressInput.value
        },
        items: CartService.getItems(),
        totalAmount: CartService.getTotalPrice() + (CartService.getTotalPrice() > 100 ? 0 : 20)
    };
    
    // Store order in localStorage for demonstration purposes
    const orders = JSON.parse(localStorage.getItem('blinkit_orders') || '[]');
    orders.push(order);
    localStorage.setItem('blinkit_orders', JSON.stringify(orders));
    
    // Clear the cart
    CartService.clearCart();
    
    // Show success message
    const checkoutForm = document.getElementById('checkout-form');
    const successMessage = document.getElementById('success-message');
    
    if (checkoutForm && successMessage) {
        checkoutForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Display order ID in success message
        const orderIdElement = document.getElementById('order-id');
        if (orderIdElement) {
            orderIdElement.textContent = order.id;
        }
    }
    
    // Redirect to home page after 5 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 5000);
}
