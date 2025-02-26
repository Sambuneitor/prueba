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
        },
        {
            id: 5, // Corregido el ID duplicado
            name: 'Alcancía Decorativa',
            price: 32000,
            category: 'alcancias',
            image: 'placeholder.jpg',
            description: 'Alcancía con diseños decorativos'
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
        
        // Actualizar el contador en el botón
        const counterSpan = cartBtn.querySelector('.counter');
        if (totalItems > 0) {
            if (counterSpan) {
                counterSpan.textContent = totalItems;
            } else {
                const span = document.createElement('span');
                span.className = 'counter';
                span.textContent = totalItems;
                cartBtn.appendChild(span);
            }
        } else {
            counterSpan?.remove();
        }
        
        // Actualizar el menú del carrito si está visible
        const cartMenu = document.getElementById('cartMenu');
        if (cartMenu && cartMenu.style.display === 'block') {
            updateCartMenu();
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

    // Cart Menu Functions
    function createCartMenu() {
        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        document.body.appendChild(overlay);
    
        const menu = document.createElement('div');
        menu.id = 'cartMenu';
        menu.className = 'cart-menu';
        menu.innerHTML = `
            <div class="cart-menu-content">
                <div class="cart-menu-header">
                    <h2>Carrito de Compras</h2>
                    <button class="close-cart">&times;</button>
                </div>
                <div class="cart-items"></div>
                <div class="cart-total"></div>
                <button class="checkout-btn">Proceder al Pago</button>
            </div>
        `;
        document.body.appendChild(menu);
    
        overlay.addEventListener('click', closeCartMenu);
        menu.querySelector('.close-cart').addEventListener('click', closeCartMenu);
    
        return menu;
    }
    
    function updateCartMenu() {
        const menu = document.getElementById('cartMenu') || createCartMenu();
        const cartItems = menu.querySelector('.cart-items');
        const cartTotal = menu.querySelector('.cart-total');
    
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart-message">
                    Tu carrito está vacío
                </div>
            `;
            cartTotal.innerHTML = '';
            return;
        }
    
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.product.image}" alt="${item.product.name}">
                <div class="cart-item-details">
                    <h3>${item.product.name}</h3>
                    <p>$${item.product.price.toLocaleString()}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="removeFromCart(${item.product.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="addToCart(${item.product.id})">+</button>
                </div>
            </div>
        `).join('');
    
        const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        cartTotal.innerHTML = `
            <h3>Total: $${total.toLocaleString()}</h3>
        `;
    }
    
    function toggleCartMenu() {
        const menu = document.getElementById('cartMenu') || createCartMenu();
        const overlay = document.querySelector('.cart-overlay');
        
        if (menu.style.display === 'block') {
            closeCartMenu();
        } else {
            menu.style.display = 'block';
            overlay.style.display = 'block';
            updateCartMenu();
        }
    }
    
    function closeCartMenu() {
        const menu = document.getElementById('cartMenu');
        const overlay = document.querySelector('.cart-overlay');
        if (menu) {
            menu.style.display = 'none';
            overlay.style.display = 'none';
        }
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
        
        if (activeCategory && activeCategory !== 'todos') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }
        
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
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCartMenu();
    });

    // Make functions available globally
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;

    // Initial render
    renderProducts();
});

 document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-id'), 10);
            if (!isNaN(productId)) {
                addToCart(productId);
                console.log(`Producto ${productId} agregado al carrito.`);
            } else {
                console.error("Error: No se pudo obtener el ID del producto.");
            }
        });
    });

