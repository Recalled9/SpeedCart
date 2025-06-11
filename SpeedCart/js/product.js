/**
 * Product page JavaScript for SpeedCart
 * Handles rendering of single product details
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize data
    await DataService.init();
    
    // Load any products saved in localStorage (for admin-added products)
    DataService.loadProductsFromStorage();
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        // Redirect to 404 if no product ID provided
        window.location.href = '404.html';
        return;
    }
    
    // Get product details
    const product = DataService.getProductById(productId);
    
    if (!product) {
        // Redirect to 404 if product not found
        window.location.href = '404.html';
        return;
    }
    
    // Render product details
    renderProductDetails(product);
});

/**
 * Render product details on the page
 * @param {Object} product - Product object to render
 */
function renderProductDetails(product) {
    // Set page title
    document.title = `${product.name} - SpeedCart`;
    
    // Get container elements
    const productContainer = document.getElementById('product-container');
    if (!productContainer) return;
    
    // Calculate discounted price
    const discountedPrice = product.discount 
        ? product.price - (product.price * product.discount / 100) 
        : product.price;
    
    // Create HTML for product details
    const html = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h1 class="product-detail-title">${product.name}</h1>
                <div class="product-detail-unit">${product.unit}</div>
                <div class="product-detail-price">
                    ₹${discountedPrice.toFixed(2)}
                    ${product.discount ? `<span class="original-price">₹${product.price.toFixed(2)}</span>` : ''}
                    ${product.discount ? `<span class="discount-tag">${product.discount}% OFF</span>` : ''}
                </div>
                <div class="product-detail-description">
                    ${product.description}
                </div>
                <button id="add-to-cart-btn" class="add-to-cart-large" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    
    productContainer.innerHTML = html;
    
    // Add event listener to "Add to Cart" button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            CartService.addItem(productId, 1);
            
            // Optional: Add animation or notification
            this.textContent = 'Added to Cart';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
            }, 1000);
        });
    }
}
