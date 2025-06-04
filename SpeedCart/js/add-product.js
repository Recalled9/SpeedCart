/**
 * Add Product page JavaScript for SpeedCart
 * Handles adding new products to the store
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize data
    await DataService.init();
    
    // Load any products saved in localStorage
    DataService.loadProductsFromStorage();
    
    // Populate category dropdown
    populateCategoryDropdown();
    
    // Add event listener to form submission
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewProduct();
        });
    }
});

/**
 * Populate the category dropdown with available categories
 */
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('category');
    if (!categorySelect) return;
    
    const categories = DataService.getAllCategories();
    
    let options = '';
    categories.forEach(category => {
        options += `<option value="${category.id}">${category.name}</option>`;
    });
    
    categorySelect.innerHTML = options;
}

/**
 * Add a new product based on form input
 */
function addNewProduct() {
    // Get form inputs
    const nameInput = document.getElementById('name');
    const categorySelect = document.getElementById('category');
    const priceInput = document.getElementById('price');
    const unitInput = document.getElementById('unit');
    const imageInput = document.getElementById('image');
    const descriptionInput = document.getElementById('description');
    const inStockCheckbox = document.getElementById('in-stock');
    const featuredCheckbox = document.getElementById('featured');
    const discountInput = document.getElementById('discount');
    
    // Validate required fields
    if (!nameInput.value || !priceInput.value || !unitInput.value || !descriptionInput.value) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Create new product object
    const newProduct = {
        id: 'p' + Date.now(), // Generate unique ID
        name: nameInput.value,
        category: categorySelect.value,
        price: parseFloat(priceInput.value),
        unit: unitInput.value,
        image: imageInput.value || 'assets/products/placeholder.jpg', // Use placeholder if no image URL
        description: descriptionInput.value,
        inStock: inStockCheckbox.checked,
        featured: featuredCheckbox.checked,
        discount: parseInt(discountInput.value) || 0
    };
    
    // Add product to data service
    const success = DataService.addProduct(newProduct);
    
    if (success) {
        showMessage('Product added successfully!', 'success');
        resetForm();
    } else {
        showMessage('Failed to add product. Please try again.', 'error');
    }
}

/**
 * Show a message to the user
 * @param {string} message - Message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) return;
    
    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`;
    messageContainer.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}

/**
 * Reset the form after adding a product
 */
function resetForm() {
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.reset();
    }
}
