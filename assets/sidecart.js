// ─── SIDE CART OPEN / CLOSE ───────────────────────────────────────────────────
// Opens the cart drawer when the bag icon is clicked.
// Closes via the X button or overlay click.
// Body scroll is locked while the cart is open.

(function () {
    const cartBtn  = document.getElementById('cart-container');
    const sideCart = document.getElementById('side-cart-container');
    const cutBtn   = document.getElementById('side-cart-cross-btn');
    const overlay  = document.getElementById('cart-overlay');

    if (!cartBtn || !sideCart) return;

    function openCart() {
        sideCart.style.width = '400px';
        if (overlay) overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // lock scroll
    }

    function closeCart() {
        sideCart.style.width = '0';
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    cartBtn.addEventListener('click', openCart);
    cutBtn  && cutBtn.addEventListener('click', closeCart);
    overlay && overlay.addEventListener('click', closeCart);

    // Also close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeCart();
    });

    // Expose so addcart.js can also open the cart after adding an item
    window.openCart  = openCart;
    window.closeCart = closeCart;
})();