// Cart Functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('saffran_cart')) || [];
    updateCartCount();

    // Add event listeners to buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function addToCart(event) {
        const button = event.target;
        const item = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: button.dataset.price,
            image: button.dataset.image,
            quantity: 1
        };

        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(item);
        }

        // Save to localStorage
        localStorage.setItem('saffran_cart', JSON.stringify(cart));

        // Update UI
        updateCartCount();
        showToast(`Added ${item.name} to your plate`);

        // Button feedback
        const originalText = button.innerText;
        button.innerText = 'Added!';
        button.style.backgroundColor = 'var(--primary-color)';
        button.style.color = '#000';

        setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
        }, 1500);
    }

    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.innerText = totalItems;

            // Animate counter
            cartCountElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Check if we are on the cart page
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        renderCart();
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <p>Your plate is currently empty.</p>
                    <a href="/menu" class="cta-button">Browse Menu</a>
                </div>`;
            updateSummary(0);
            return;
        }

        cart.forEach((item, index) => {
            const itemTotal = parseFloat(item.price.replace('$', '')) * item.quantity;
            subtotal += itemTotal;

            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${item.price}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });

        // Add event listeners to new controls
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', updateQuantity);
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });

        updateSummary(subtotal);
    }

    function updateQuantity(e) {
        const index = e.target.dataset.index;
        const isPlus = e.target.classList.contains('plus');

        if (isPlus) {
            cart[index].quantity++;
        } else {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }
        }

        saveCart();
    }

    function removeItem(e) {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        saveCart();
        updateCartCount(); // Ensure header count updates immediately
    }

    function saveCart() {
        localStorage.setItem('saffran_cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }

    function updateSummary(subtotal) {
        const serviceCharge = subtotal * 0.10;
        const total = subtotal + serviceCharge;

        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-service').textContent = `$${serviceCharge.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }

    // Checkout button (placeholder)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Thank you for your order! This is a demo.');
                cart = [];
                saveCart();
            } else {
                alert('Your cart is empty!');
            }
        });
    }

    // Toast Notification System
    function showToast(message) {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;

        toastContainer.appendChild(toast);

        // Trigger reflow
        toast.offsetHeight;

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
});
