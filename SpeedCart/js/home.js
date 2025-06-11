/**
 * Home page JavaScript for SpeedCart
 * Handles rendering of categories and products by category on the home page
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize data
    await DataService.init();
    
    // Load any products saved in localStorage (for admin-added products)
    DataService.loadProductsFromStorage();
    
    // Render categories
    renderCategories();
    
    // Render products by category
    renderProductsByCategory('dairy-breakfast', 'dairy-products-container', 6);
    renderProductsByCategory('tobacco', 'tobacco-products-container', 6);
    renderProductsByCategory('snacks-beverages', 'snacks-products-container', 6);
    renderProductsByCategory('household-items', 'hookah-products-container', 6);
    renderProductsByCategory('instant-food', 'fresheners-products-container', 6);
    renderProductsByCategory('fruits-vegetables', 'beverages-products-container', 6);
    renderProductsByCategory('snacks-beverages', 'candies-products-container', 6);
    
    // Add event listeners to all "Add to Cart" buttons
    addCartEventListeners();
});

/**
 * Render all categories in the categories grid
 */
function renderCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;
    
    const categories = DataService.getAllCategories();
    
    let html = '';
    categories.forEach(category => {
        html += `
            <a href="category.html?id=${category.id}" class="category-card">
                <div class="category-image">
                    <img src="${category.image}" alt="${category.name}">
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                </div>
            </a>
        `;
    });
    
    categoriesContainer.innerHTML = html;
}

/**
 * Render products by category
 * @param {string} categoryId - The category ID to filter products by
 * @param {string} containerId - The ID of the container to render products in
 * @param {number} limit - The maximum number of products to display
 */
function renderProductsByCategory(categoryId, containerId, limit = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Get products by category
    let products = DataService.getProductsByCategory(categoryId);
    
    // Limit the number of products
    if (limit && products.length > limit) {
        products = products.slice(0, limit);
    }
    
    let html = '';
    products.forEach(product => {
        const discountedPrice = product.discount 
            ? product.price - (product.price * product.discount / 100) 
            : product.price;
            
        html += `
            <div class="product-card">
                ${product.discount ? `<div class="discount-tag">${product.discount}% OFF</div>` : ''}
                <a href="product.html?id=${product.id}" class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </a>
                <div class="product-info">
                    <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
                    <div class="product-unit">${product.unit}</div>
                    <div class="product-price">
                        <div>
                            <span class="price">₹${discountedPrice.toFixed(2)}</span>
                            ${product.discount ? `<span class="original-price">₹${product.price.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">Add</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Add event listeners to all "Add to Cart" buttons
 */
function addCartEventListeners() {
    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            CartService.addItem(productId, 1);
            
            // Add animation or notification
            this.textContent = 'Added';
            setTimeout(() => {
                this.textContent = 'Add';
            }, 1000);
        });
    });
}
