// ─── EMAIL POPUP ─────────────────────────────────────────────────────────────
// Shows the promotional popup after 60 s (first visit only).
// Can be closed via the X button or by clicking the overlay.

(function () {
    const popup    = document.getElementById('add-container');
    const closeBtn = document.getElementById('add-cross-btn');
    const overlay  = document.getElementById('add-overlay');
    const dismissBtn = popup ? popup.querySelector('.dismiss-btn') : null;

    if (!popup) return;

    function openPopup() {
        popup.style.display = 'flex';
        if (overlay) overlay.style.display = 'block';
    }

    function closePopup() {
        popup.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        // Remember dismissal for this session so it won't re-appear on scroll etc.
        sessionStorage.setItem('popupDismissed', 'true');
    }

    // Don't show again if already dismissed this session
    if (sessionStorage.getItem('popupDismissed')) return;

    closeBtn  && closeBtn.addEventListener('click', closePopup);
    overlay   && overlay.addEventListener('click', closePopup);
    dismissBtn && dismissBtn.addEventListener('click', closePopup);

    // Trigger after 60 s
    setTimeout(openPopup, 60000);
})();