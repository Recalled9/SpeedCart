/**
 * Category page JavaScript for SpeedCart
 * Handles rendering of products for a specific category
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize data
    await DataService.init();
    
    // Load any products saved in localStorage (for admin-added products)
    DataService.loadProductsFromStorage();
    
    // Get category ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    
    if (!categoryId) {
        // Redirect to 404 if no category ID provided
        window.location.href = '404.html';
        return;
    }
    
    // Get category details
    const category = DataService.getCategoryById(categoryId);
    
    if (!category) {
        // Redirect to 404 if category not found
        window.location.href = '404.html';
        return;
    }
    
    // Set page title and category name
    document.title = `${category.name} - SpeedCart`;
    const categoryTitleElement = document.getElementById('category-title');
    if (categoryTitleElement) {
        categoryTitleElement.textContent = category.name;
    }
    
    // Render products for this category
    renderCategoryProducts(categoryId);
});

/**
 * Render products for a specific category
 * @param {string} categoryId - Category ID to render products for
 */
function renderCategoryProducts(categoryId) {
    const productsContainer = document.getElementById('category-products-container');
    if (!productsContainer) return;
    
    // Get products for this category
    const products = DataService.getProductsByCategory(categoryId);
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<div class="empty-category">No products found in this category.</div>';
        return;
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
    
    productsContainer.innerHTML = html;
    
    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            CartService.addItem(productId, 1);
            
            // Optional: Add animation or notification
            this.textContent = 'Added';
            setTimeout(() => {
                this.textContent = 'Add';
            }, 1000);
        });
    });
}
