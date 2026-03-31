// ─── BEST SELLER AUTO-SCROLL ─────────────────────────────────────────────────
// Smoothly scrolls the best-seller strip. Pauses when the user hovers.
// Resets and loops seamlessly.

(function () {
    const container = document.getElementById('best-seller-sliding-container');
    if (!container) return;

    let position = 0;
    let paused = false;
    const SPEED = 0.6; // px per frame — tweak for faster/slower

    function tick() {
        if (!paused) {
            position += SPEED;
            const maxScroll = container.scrollWidth - container.clientWidth;

            if (position >= maxScroll) {
                position = 0; // seamless loop
            }

            container.scrollLeft = position;
        }
        requestAnimationFrame(tick);
    }

    // Pause on mouse enter, resume on leave
    container.addEventListener('mouseenter', () => { paused = true; });
    container.addEventListener('mouseleave', () => { paused = false; });

    // Also pause on touch start (mobile)
    container.addEventListener('touchstart', () => { paused = true; }, { passive: true });
    container.addEventListener('touchend', () => {
        setTimeout(() => { paused = false; }, 1500);
    });

    requestAnimationFrame(tick);
})();