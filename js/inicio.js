// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Sample product data - expanded with more items
    const products = [
        {
            id: 1,
            name: 'Pocillo Clásico',
            price: 25000,
            category: 'pocillos',
            image: 'placeholder.jpg',
            description: 'Pocillo de cerámica diseño clásico'
        },
        {
            id: 2,
            name: 'Alcancía Cerdito',
            price: 35000,
            category: 'alcancias',
            image: 'placeholder.jpg',
            description: 'Alcancía tradicional en forma de cerdito'
        },
        {
            id: 3,
            name: 'Pocillo Térmico',
            price: 45000,
            category: 'pocillos',
            image: 'placeholder.jpg',
            description: 'Pocillo con aislamiento térmico'
        },
        {
            id: 4,
            name: 'Alcancía Moderna',
            price: 30000,
            category: 'alcancias',
            image: 'placeholder.jpg',
            description: 'Alcancía de diseño contemporáneo'
        }
    ];

    // Cart state
    let cart = [];
    let currentDisplayedProducts = [...products];

    // Cart functionality
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const cartItem = cart.find(item => item.product.id === productId);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.push({ product, quantity: 1 });
            }
            updateCartUI();
            showCartNotification();
        }
    }

    function removeFromCart(productId) {
        const index = cart.findIndex(item => item.product.id === productId);
        if (index !== -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCartUI();
        }
    }

    function updateCartUI() {
        const cartBtn = document.querySelector('.cart-btn');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        cartBtn.textContent = `Carrito (${totalItems})`;
        
        // Update cart modal if it exists
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            updateCartModal();
        }
    }

    function showCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = '¡Producto agregado al carrito!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Cart Modal
    function createCartModal() {
        const modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Carrito de Compras</h2>
                <div class="cart-items"></div>
                <div class="cart-total"></div>
                <button class="checkout-btn">Proceder al Pago</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Close button functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => modal.style.display = 'none';

        // Close modal when clicking outside
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }

        return modal;
    }

    function updateCartModal() {
        const modal = document.getElementById('cartModal') || createCartModal();
        const cartItems = modal.querySelector('.cart-items');
        const cartTotal = modal.querySelector('.cart-total');

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.product.image}" alt="${item.product.name}" width="50">
                <div class="cart-item-details">
                    <h3>${item.product.name}</h3>
                    <p>$${item.product.price.toLocaleString()} x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="removeFromCart(${item.product.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="addToCart(${item.product.id})">+</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        cartTotal.innerHTML = `<h3>Total: $${total.toLocaleString()}</h3>`;
    }

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterAndRenderProducts(searchTerm);
    });

    // Category filter functionality
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.textContent.toLowerCase();
            if (category === 'todos') {
                currentDisplayedProducts = [...products];
            } else {
                currentDisplayedProducts = products.filter(p => p.category === category);
            }
            renderProducts(currentDisplayedProducts);
        });
    });

    // Combined filter function
    function filterAndRenderProducts(searchTerm = '') {
        const activeCategory = document.querySelector('.category-btn.active')?.textContent.toLowerCase();
        
        let filtered = [...products];
        
        // Apply category filter
        if (activeCategory && activeCategory !== 'todos') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }
        
        currentDisplayedProducts = filtered;
        renderProducts(filtered);
    }

    // Render products
    function renderProducts(productsToRender = products) {
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = '';

        productsToRender.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <p class="price">$${product.price.toLocaleString()}</p>
                <button class="buy-btn" onclick="addToCart(${product.id})">Agregar al Carrito</button>
            `;
            productsGrid.appendChild(productElement);
        });
    }

    // Initialize cart button click handler
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.addEventListener('click', () => {
        const modal = document.getElementById('cartModal') || createCartModal();
        updateCartModal();
        modal.style.display = 'block';
    });

    // Make functions available globally
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;

    // Initial render
    renderProducts();
});