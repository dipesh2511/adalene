// ─── BEST SELLER AUTO-SCROLL ─────────────────────────────────────────────────
// Uses requestAnimationFrame with delta-time.
// Duplicates cards once to create a seamless infinite loop.
// Pauses on hover/drag/touch; supports mouse drag scrolling.

(function () {
    const strip = document.getElementById('best-seller-sliding-container');
    if (!strip) return;

    const originalCards = Array.from(strip.children);
    if (!originalCards.length) return;

    // Clone once so we can loop without a visible jump.
    const clonedCards = originalCards.map((card) => card.cloneNode(true));
    clonedCards.forEach((card) => strip.appendChild(card));

    let loopWidth = strip.scrollWidth / 2;
    let paused = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    let lastTs = 0;
    const speedPxPerSecond = 45;

    function normalizeLoopPosition() {
        if (!loopWidth) return;
        if (strip.scrollLeft >= loopWidth) {
            strip.scrollLeft -= loopWidth;
        } else if (strip.scrollLeft < 0) {
            strip.scrollLeft += loopWidth;
        }
    }

    function tick(ts) {
        if (!lastTs) lastTs = ts;
        const dt = (ts - lastTs) / 1000;
        lastTs = ts;

        if (!paused && !isDragging) {
            strip.scrollLeft += speedPxPerSecond * dt;
            normalizeLoopPosition();
        }

        requestAnimationFrame(tick);
    }

    function pointerDown(clientX) {
        isDragging = true;
        paused = true;
        dragStartX = clientX;
        dragStartScrollLeft = strip.scrollLeft;
    }

    function pointerMove(clientX) {
        if (!isDragging) return;
        const dx = clientX - dragStartX;
        strip.scrollLeft = dragStartScrollLeft - dx;
        normalizeLoopPosition();
    }

    function pointerUp() {
        if (!isDragging) return;
        isDragging = false;
        setTimeout(() => {
            paused = false;
        }, 500);
    }

    strip.addEventListener('mousedown', (e) => {
        pointerDown(e.clientX);
    });
    window.addEventListener('mousemove', (e) => {
        pointerMove(e.clientX);
    });
    window.addEventListener('mouseup', pointerUp);

    strip.addEventListener(
        'touchstart',
        (e) => {
            if (e.touches[0]) pointerDown(e.touches[0].clientX);
        },
        { passive: true }
    );
    strip.addEventListener(
        'touchmove',
        (e) => {
            if (e.touches[0]) pointerMove(e.touches[0].clientX);
        },
        { passive: true }
    );
    strip.addEventListener('touchend', pointerUp, { passive: true });

    window.addEventListener('resize', () => {
        loopWidth = strip.scrollWidth / 2;
        normalizeLoopPosition();
    });

    requestAnimationFrame(tick);
})();


// ─── JS PARALLAX for mid-section panels ──────────────────────────────────────
// Replaces background-attachment:fixed (forces full-page repaints every scroll).
// Instead: GPU-promoted absolute divs shifted via translateY on the compositor.
//
// How it works:
//   - Each panel bg div is 28% taller than its container (14% top + 14% bottom).
//   - On scroll, we read how far the CELL's centre is from the viewport centre.
//   - We multiply that distance by a depth factor (0 = locked, 1 = scroll speed).
//   - translateY moves the oversized bg at a slower rate → parallax effect.
//   - translateZ(0) keeps the element on its own GPU layer → no repaint.

(function () {
    const panels = [
        { el: document.getElementById('mid-one-second-img'), depth: 0.20 },
        { el: document.getElementById('mid-one-third-img'),  depth: 0.20 },
        { el: document.getElementById('nav-image'),          depth: 0.15 },
    ].filter(p => p.el);

    if (!panels.length) return;

    let ticking = false;

    function update() {
        const vh = window.innerHeight;

        panels.forEach(({ el, depth }) => {
            const cell  = el.parentElement;
            const rect  = cell.getBoundingClientRect();
            // Distance between the cell's vertical centre and viewport centre
            const delta = (rect.top + rect.height / 2) - vh / 2;
            const shift = delta * depth;
            el.style.transform = `translateY(${shift}px) translateZ(0)`;
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    // Run once immediately so panels are positioned on load
    update();
})();