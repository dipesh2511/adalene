// ─── ADD TO CART ─────────────────────────────────────────────────────────────
// Handles:
//  • Adding items from product cards (Add to Bag button)
//  • Removing items from the side cart
//  • Quantity increments (duplicate adds increase qty)
//  • Running total + badge counter
//  • Empty-cart message visibility
// ─────────────────────────────────────────────────────────────────────────────

(function () {
    // ── State ────────────────────────────────────────────────────────────────
    // cart = { [productId]: { name, price, img, qty } }
    const cart = {};

    // ── DOM References ───────────────────────────────────────────────────────
    const mainDisplay      = document.getElementById('main-display');
    const cartSection      = document.getElementById('addcart-center-section');
    const totalDisplay     = document.getElementById('center-cart-display');
    const emptyMsg         = document.getElementById('empty-cart-msg');
    const cartShopLink     = document.getElementById('cart-shop-link');

    // ── Helpers ──────────────────────────────────────────────────────────────

    function getTotal() {
        return Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function getTotalQty() {
        return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    }

    function updateBadge() {
        const qty = getTotalQty();
        if (mainDisplay) mainDisplay.textContent = qty;
    }

    function updateTotal() {
        if (totalDisplay) totalDisplay.textContent = getTotal().toFixed(2);
    }

    function updateEmptyState() {
        if (!emptyMsg) return;
        const isEmpty = getTotalQty() === 0;
        emptyMsg.style.display = isEmpty ? 'flex' : 'none';
    }

    // ── Render a single cart row ─────────────────────────────────────────────
    function renderCartItem(id) {
        const item = cart[id];
        if (!item) return;

        let existing = document.getElementById('cart-item-' + id);

        if (existing) {
            // Update qty and subtotal only
            existing.querySelector('.cart-item-qty').textContent = 'Qty: ' + item.qty;
            existing.querySelector('.cart-item-price').textContent =
                '$' + (item.price * item.qty).toFixed(2);
            return;
        }

        // Create new row
        const row = document.createElement('div');
        row.className = 'cart-list';
        row.id = 'cart-item-' + id;

        row.innerHTML = `
            <div class="cart-product-img-container">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-qty">Qty: ${item.qty}</span>
            </div>
            <div class="cart-amount">
                <h2 class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</h2>
            </div>
            <div class="cart-delete-btn" data-id="${id}" title="Remove">
                <h2><i class="fa-solid fa-xmark"></i></h2>
            </div>
        `;

        // Attach delete listener
        row.querySelector('.cart-delete-btn').addEventListener('click', removeFromCart);

        // Insert before the empty-cart message (which stays at top of DOM)
        if (emptyMsg && emptyMsg.parentNode === cartSection) {
            cartSection.insertBefore(row, emptyMsg);
        } else {
            cartSection.appendChild(row);
        }
    }

    // ── Add item ─────────────────────────────────────────────────────────────
    function addToCart(e) {
        // Walk up the DOM to find the product-card (works for button clicks too)
        const card = e.target.closest('.product-card');
        if (!card) return;

        const id    = card.getAttribute('data-value');
        const name  = card.getAttribute('data-name')  || 'Product';
        const price = parseFloat(card.getAttribute('data-price')) || 0;
        const img   = card.getAttribute('data-img')   || '';

        if (cart[id]) {
            cart[id].qty += 1;
        } else {
            cart[id] = { name, price, img, qty: 1 };
        }

        renderCartItem(id);
        updateBadge();
        updateTotal();
        updateEmptyState();

        // Flash feedback on the button
        const btn = e.target.closest('.add-cart-btn');
        if (btn) {
            const orig = btn.textContent;
            btn.textContent = '✓ Added';
            btn.style.background = 'var(--gold)';
            btn.style.color = 'var(--black)';
            setTimeout(() => {
                btn.textContent = orig;
                btn.style.background = '';
                btn.style.color = '';
            }, 1000);
        }

        // Auto-open the cart drawer
        if (typeof window.openCart === 'function') window.openCart();
    }

    // ── Remove item ──────────────────────────────────────────────────────────
    function removeFromCart(e) {
        const id = e.currentTarget.getAttribute('data-id');
        if (!id || !cart[id]) return;

        delete cart[id];

        const row = document.getElementById('cart-item-' + id);
        if (row) {
            row.style.opacity = '0';
            row.style.transform = 'translateX(40px)';
            row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            setTimeout(() => row.remove(), 300);
        }

        updateBadge();
        updateTotal();
        updateEmptyState();
    }

    // ── Event delegation on product grid ────────────────────────────────────
    const productSection = document.getElementById('product-section');
    if (productSection) {
        productSection.addEventListener('click', function (e) {
            if (e.target.closest('.add-cart-btn')) {
                addToCart(e);
            }
        });
    }

    // ── Close cart link inside empty-bag message ─────────────────────────────
    if (cartShopLink) {
        cartShopLink.addEventListener('click', function () {
            if (typeof window.closeCart === 'function') window.closeCart();
        });
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    updateEmptyState();
    updateBadge();
    updateTotal();

})();