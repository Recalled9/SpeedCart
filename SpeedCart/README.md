# SpeedCart - Grocery Web App

A multi-page grocery web application built with vanilla HTML, CSS, and JavaScript. This application features working cart functionality, category-based product listings, and data stored in JSON and localStorage.

## Features

- **Product Browsing**: Browse products by categories
- **Shopping Cart**: Add products to cart, update quantities, and remove items
- **Checkout Process**: Complete order with delivery information
- **Admin Panel**: Add new products to the store
- **Responsive Design**: Works on desktop and mobile devices
- **LocalStorage**: Cart and product data persists between sessions

## Pages

1. **Home Page (index.html)**: Displays categories and featured products
2. **Category Page (category.html)**: Shows products for a specific category
3. **Product Page (product.html)**: Displays detailed information about a product
4. **Cart Page (cart.html)**: Shows items added to the cart
5. **Checkout Page (checkout.html)**: Collects delivery information and completes the order
6. **Admin Panel (add-product.html)**: Allows adding new products to the store
7. **404 Page (404.html)**: Shown when a page is not found

## Project Structure

```
speedcart/
├── index.html              # Home page
├── category.html           # Category products page
├── product.html            # Product details page
├── cart.html               # Shopping cart page
├── checkout.html           # Checkout page
├── add-product.html        # Admin panel to add products
├── 404.html                # Error page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── data.js             # Data handling module
│   ├── home.js             # Home page functionality
│   ├── category.js         # Category page functionality
│   ├── product.js          # Product page functionality
│   ├── cart.js             # Cart page functionality
│   ├── checkout.js         # Checkout page functionality
│   └── add-product.js      # Admin panel functionality
├── data/
│   └── products.json       # Product and category data
└── assets/                 # Images and icons
    └── products/           # Product images
```

## How to Run

1. Clone or download this repository
2. Open the project folder in your code editor
3. Use a local server to run the application (e.g., Live Server extension in VS Code)
4. Open `index.html` in your browser

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage API
- Fetch API

## Features Implemented

- Load product data from JSON file
- Dynamic category pages
- Shopping cart with localStorage persistence
- Admin panel for adding new products
- Responsive design for all devices

## Note

This is a frontend-only application. All data is stored in the browser's localStorage. In a real-world scenario, this would be connected to a backend server for data persistence.
