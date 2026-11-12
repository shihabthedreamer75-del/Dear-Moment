
/* ==========================================
   DEAR MOMENTS
   COMPLETE INTERACTIVE JAVASCRIPT
========================================== */


/* ==========================================
   1. GENERATE TWINKLING STARS
========================================== */

const starContainer = document.getElementById("stars");

if (starContainer) {

    for (let i = 0; i < 100; i++) {

        const star = document.createElement("div");

        star.className = "star";

        const size = Math.random() * 3 + 1;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${2 + Math.random() * 4}s`;

        starContainer.appendChild(star);
    }
}


/* ==========================================
   2. SMOOTH SCROLL FUNCTION
========================================== */

function scrollToMemories() {

    const section = document.getElementById("memories");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* ==========================================
   3. SCROLL REVEAL ANIMATIONS
========================================== */

const revealElements = document.querySelectorAll(
    ".memory-card, .section-label, .memories-section h2, .section-description, .about-quote"
);

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});


revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(35px)";

    element.style.transition =
        "opacity 0.8s ease, transform 0.8s ease";

    observer.observe(element);

});


/* ==========================================
   4. INTERACTIVE MOON MOVEMENT
========================================== */

const moonScene = document.querySelector(".moon-scene");

if (moonScene) {

    document.addEventListener("mousemove", (event) => {

        if (window.innerWidth < 1000) return;

        const x =
            (event.clientX / window.innerWidth - 0.5) * 12;

        const y =
            (event.clientY / window.innerHeight - 0.5) * 12;

        moonScene.style.transform =
            `translateY(-50%) translate(${x}px, ${y}px)`;

    });

}


/* ==========================================
   5. RESET MOON POSITION
========================================== */

if (moonScene) {

    document.addEventListener("mouseleave", () => {

        moonScene.style.transform = "translateY(-50%)";

    });

}


/* ==========================================
   6. CONSOLE WELCOME MESSAGE
========================================== */

console.log(
    "%c ✦ Welcome to Dear Moments ✦ ",
    "background: #818cf8; color: #080d1c; padding: 12px; font-size: 16px; border-radius: 8px;"
);


/* ==========================================
   END OF DEAR MOMENTS SCRIPT
========================================== */
