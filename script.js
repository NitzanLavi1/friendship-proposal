(() => {
    'use strict';

    const yesOption          = document.getElementById('yesOption');
    const noOption           = document.getElementById('noOption');
    const yesCheckbox        = document.getElementById('yesCheckbox');
    const paperBg            = document.getElementById('paperBg');
    const celebrationOverlay = document.getElementById('celebrationOverlay');
    const heartsContainer    = document.getElementById('heartsContainer');

    let moveCount = 0;

    // Track current translation so we know the visual position for the next move
    let curDx = 0;
    let curDy = 0;

    // Capture No button's original (untranslated) position once
    let origRect = null;
    function getOrigRect() {
        if (!origRect) origRect = noOption.getBoundingClientRect();
        return origRect;
    }

    // ─── YES ──────────────────────────────────────────────────────────────────
    yesOption.addEventListener('click', (e) => {
        e.preventDefault();
        yesCheckbox.classList.add('checked');
        triggerCelebration();
    });

    // ─── NO — moves around the paper on hover via transform ───────────────────
    noOption.addEventListener('mouseenter', () => {
        moveNoButton();
    });

    function moveNoButton() {
        moveCount++;

        const orig  = getOrigRect();
        const paper = paperBg.getBoundingClientRect();
        const btnW  = orig.width;
        const btnH  = orig.height;

        // Current visual position of No button (original + translation)
        const curLeft = orig.left + curDx;
        const curTop  = orig.top  + curDy;

        // Target zone: the paper's lined writing area, inset from edges
        const leftMin = paper.left + paper.width  * 0.18;
        const leftMax = paper.left + paper.width  * 0.72 - btnW;
        const topMin  = paper.top  + paper.height * 0.10;
        const topMax  = paper.top  + paper.height * 0.85 - btnH;

        // Pick a target at least 80px away from current visual position
        let targetLeft, targetTop, attempts = 0;
        do {
            targetLeft = leftMin + Math.random() * (leftMax - leftMin);
            targetTop  = topMin  + Math.random() * (topMax  - topMin);
            attempts++;
        } while (
            attempts < 80 &&
            Math.abs(targetLeft - curLeft) < 80 &&
            Math.abs(targetTop  - curTop)  < 80
        );

        // Translate = how far to move from the ORIGINAL untranslated position
        curDx = targetLeft - orig.left;
        curDy = targetTop  - orig.top;

        noOption.style.transform = `translate(${curDx}px, ${curDy}px)`;

        // Grow Yes a little after repeated attempts
        if (moveCount >= 3) {
            const scale = Math.min(1 + (moveCount - 2) * 0.06, 1.5);
            yesOption.style.transform = `scale(${scale})`;
        }
    }

    // ─── CELEBRATION ──────────────────────────────────────────────────────────
    function triggerCelebration() {
        celebrationOverlay.classList.add('active');

        const heartEmojis = ['❤️','💕','💖','💗','💓','💘','💝','🥰','😘'];
        let heartCount = 0;
        const maxHearts = 50;

        const spawnHeart = () => {
            if (heartCount >= maxHearts) return;
            const heart = document.createElement('span');
            heart.className = 'floating-heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left              = Math.random() * 100 + 'vw';
            heart.style.bottom            = '-50px';
            heart.style.fontSize          = (1.5 + Math.random() * 2.5) + 'rem';
            heart.style.animationDuration = (2 + Math.random() * 3) + 's';
            heart.style.animationDelay    = Math.random() * 0.3 + 's';
            heartsContainer.appendChild(heart);
            heartCount++;
            heart.addEventListener('animationend', () => heart.remove());
        };

        for (let i = 0; i < 20; i++) setTimeout(spawnHeart, i * 80);
        setTimeout(() => { for (let i=0;i<15;i++) setTimeout(spawnHeart, i*120); }, 1500);
        setTimeout(() => { for (let i=0;i<15;i++) setTimeout(spawnHeart, i*150); }, 3000);
    }
})();
