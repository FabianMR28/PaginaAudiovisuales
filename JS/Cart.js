let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('camproCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('camproCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showNotification(`${product.name} añadido al carrito`);
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        saveCart();
        renderCart();
        showNotification(`${removedItem.name} eliminado del carrito`);
    }
}

function updateQuantity(index, change) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            removeFromCart(index);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const emptyCartElement = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        if (cartTotalElement) cartTotalElement.textContent = '';
        if (emptyCartElement) emptyCartElement.style.display = 'block';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    if (emptyCartElement) emptyCartElement.style.display = 'none';
    if (checkoutBtn) checkoutBtn.style.display = 'block';

    let itemsHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        if (!item || !item.name || !item.price || !item.img || typeof item.quantity !== 'number') return;

        const itemTotal = parseFloat(item.price) * item.quantity;
        total += itemTotal;

        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Precio unitario: S/. ${parseFloat(item.price).toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}">Eliminar</button>
                </div>
                <div class="cart-item-price">
                    S/. ${itemTotal.toFixed(2)}
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = itemsHTML;
    if (cartTotalElement) cartTotalElement.textContent = `Total: S/. ${total.toFixed(2)}`;
    setupCartEvents();
}

function setupCartEvents() {
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(btn.dataset.index);
            updateQuantity(index, -1);
        });
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(btn.dataset.index);
            updateQuantity(index, 1);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(btn.dataset.index);
            removeFromCart(index);
        });
    });

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cart.length > 0) {
                window.location.href = "Pago.html"; // Redirige a la página de pago
            }
        });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function setupAddToCartButtons() {
    document.querySelectorAll('.product button').forEach(button => {
        button.addEventListener('click', function () {
            const productElement = this.closest('.product');
            const product = {
                id: productElement.querySelector('img').alt,
                name: productElement.querySelector('h3').textContent,
                price: parseFloat(productElement.querySelector('.price').textContent.replace('S/. ', '')),
                img: productElement.querySelector('img').src
            };
            addToCart(product);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadCart();

    if (document.getElementById('cartItems')) {
        renderCart();
    }

    setupAddToCartButtons();

    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
});
