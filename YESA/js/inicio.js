document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.querySelector('.products-grid');
    let allProducts = [];
    let cart = [];
    let currentDisplayedProducts = [];

    function cargarProductos() {
        fetch('obtener_productos.php')
            .then(response => response.json())
            .then(products => {
                allProducts = products;
                currentDisplayedProducts = products;
                renderProducts(products);
            })
            .catch(console.error);
    }

    function renderProducts(products) {
        productsGrid.innerHTML = products.map(product => `
            <div class="product">
                <img src="${product.imagen}" alt="${product.nombre}">
                <h3>${product.nombre}</h3>
                <p class="description">${product.descripcion}</p>
                <p class="price">$${product.precio.toLocaleString()}</p>
                <button class="buy-btn" data-id="${product.id}">Comprar</button>
            </div>
        `).join('');
    
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.dataset.id, 10);
                addToCart(productId);
            });
        });
    }

    function addToCart(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
    
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        updateCartUI();
        showCartNotification();
    }

    function removeFromCart(productId) {
        const index = cart.findIndex(item => item.id === productId);
        if (index === -1) return;

        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateCartUI();
    }

    function updateCartUI() {
        // Actualizar contador
        const counter = document.querySelector('.cart-btn .counter');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            if (!counter) {
                const newCounter = document.createElement('span');
                newCounter.className = 'counter';
                document.querySelector('.cart-btn').appendChild(newCounter);
            }
            document.querySelector('.counter').textContent = totalItems;
        } else if (counter) {
            counter.remove();
        }

        // Actualizar menú del carrito si está visible
        if (document.getElementById('cartMenu')?.style.display === 'block') {
            updateCartMenu();
        }
    }

    function createCartMenu() {
        let menu = document.getElementById('cartMenu');
        if (menu) return menu;

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        overlay.onclick = closeCartMenu;
        document.body.appendChild(overlay);

        // Crear menú
        menu = document.createElement('div');
        menu.id = 'cartMenu';
        menu.className = 'cart-menu';
        menu.innerHTML = `
            <div class="cart-menu-content">
                <div class="cart-menu-header">
                    <h2>Carrito</h2>
                    <button class="close-cart">&times;</button>
                </div>
                <div class="cart-items"></div>
                <div class="cart-total"></div>
                <button class="checkout-btn">Pagar</button>
            </div>
        `;
        document.body.appendChild(menu);

        // Event listeners
        menu.querySelector('.close-cart').addEventListener('click', closeCartMenu);
        return menu;
    }

    function updateCartMenu() {
        const menu = createCartMenu();
        const cartItems = menu.querySelector('.cart-items');
        const cartTotal = menu.querySelector('.cart-total');

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty">El carrito está vacío</p>';
            cartTotal.innerHTML = '';
            return;
        }

        // Renderizar items
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio} x ${item.quantity}</p>
                </div>
                <div class="actions">
                    <button data-action="remove" data-id="${item.id}">-</button>
                    <button data-action="add" data-id="${item.id}">+</button>
                </div>
            </div>
        `).join('');

        // Total
        const total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        cartTotal.innerHTML = `<strong>Total:</strong> $${total.toLocaleString()}`;

        // Delegación de eventos para los botones
        cartItems.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            
            const action = btn.dataset.action;
            const productId = parseInt(btn.dataset.id, 10);
            
            if (action === 'add') addToCart(productId);
            else if (action === 'remove') removeFromCart(productId);
        });
    }

    function closeCartMenu() {
        const menu = document.getElementById('cartMenu');
        const overlay = document.querySelector('.cart-overlay');
        if (menu) menu.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    }

    function showCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = '¡Producto agregado!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Inicialización
    document.querySelector('.cart-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const menu = createCartMenu();
        menu.style.display = 'block';
        document.querySelector('.cart-overlay').style.display = 'block';
        updateCartMenu();
    });

    cargarProductos();
});