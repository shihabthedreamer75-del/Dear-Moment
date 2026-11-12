
document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTS
    const letterForm = document.getElementById("letterForm");
    const letterTitle = document.getElementById("letterTitle");
    const letterRecipient = document.getElementById("letterRecipient");
    const letterMessage = document.getElementById("letterMessage");

    const lettersContainer = document.getElementById("lettersContainer");
    const letterCount = document.getElementById("letterCount");
    const characterCount = document.getElementById("characterCount");

    const letterModal = document.getElementById("letterModal");
    const closeModal = document.getElementById("closeModal");

    const modalTitle = document.getElementById("modalTitle");
    const modalRecipient = document.getElementById("modalRecipient");
    const modalMessage = document.getElementById("modalMessage");
    const modalDate = document.getElementById("modalDate");

    const envelopeOverlay = document.getElementById("envelopeOverlay");
    const animatedEnvelope = document.getElementById("animatedEnvelope");

    // STORAGE
    const STORAGE_KEY = "dearMomentsLetters";

    let letters = [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        letters = stored ? JSON.parse(stored) : [];

        if (!Array.isArray(letters)) {
            letters = [];
        }
    } catch (error) {
        console.error("Storage loading error:", error);
        letters = [];
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
            return true;
        } catch (error) {
            alert("Could not save your letter.");
            return false;
        }
    }

    // CHARACTER COUNTER
    function updateCharacterCount() {
        if (characterCount && letterMessage) {
            characterCount.textContent =
                `${letterMessage.value.length} / 5000`;
        }
    }

    letterMessage?.addEventListener("input", updateCharacterCount);

    // LETTER COUNT
    function updateLetterCount() {
        if (letterCount) {
            letterCount.textContent =
                `${letters.length} ${letters.length === 1 ? "Letter" : "Letters"}`;
        }
    }

    // DATE FORMAT
    function formatDate(dateString) {
        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    // SAVE LETTER
    letterForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = letterTitle.value.trim();
        const recipient = letterRecipient.value.trim();
        const message = letterMessage.value.trim();

        if (!title || !message) {
            alert("Please write a title and your letter.");
            return;
        }

        const newLetter = {
            id: (typeof crypto !== "undefined" && crypto.randomUUID)
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            title,
            recipient,
            message,
            date: new Date().toISOString()
        };

        letters.unshift(newLetter);

        if (!saveToStorage()) {
            letters.shift();
            return;
        }

        letterForm.reset();
        updateCharacterCount();
        renderLetters();

        alert("Your letter has been saved successfully! 💌");

        document.getElementById("savedLetters")?.scrollIntoView({
            behavior: "smooth"
        });
    });

    // RENDER LETTERS
    function renderLetters() {
        if (!lettersContainer) return;

        lettersContainer.innerHTML = "";

        updateLetterCount();

        if (letters.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-state";

            const icon = document.createElement("div");
            icon.className = "empty-icon";
            icon.textContent = "✉";

            const heading = document.createElement("h3");
            heading.textContent = "Your collection is waiting.";

            const paragraph = document.createElement("p");
            paragraph.textContent =
                "Your first letter will find its home here.";

            empty.append(icon, heading, paragraph);
            lettersContainer.appendChild(empty);
            return;
        }

        letters.forEach((letter) => {
            const card = document.createElement("div");
            card.className = "letter-card";

            const heading = document.createElement("h3");
            heading.textContent = letter.title;

            const recipient = document.createElement("p");
            recipient.textContent = letter.recipient
                ? `To: ${letter.recipient}`
                : "An unsent letter";

            const date = document.createElement("p");
            date.textContent = formatDate(letter.date);

            const actions = document.createElement("div");
            actions.className = "letter-card-actions";

            const readButton = document.createElement("button");
            readButton.className = "read-letter-btn";
            readButton.textContent = "Read";
            readButton.addEventListener("click", () => {
                openEnvelope(letter);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-letter-btn";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                deleteLetter(letter.id);
            });

            actions.append(readButton, deleteButton);
            card.append(heading, recipient, date, actions);

            lettersContainer.appendChild(card);
        });
    }

    // OPEN ENVELOPE
    let selectedLetter = null;

    function openEnvelope(letter) {
        selectedLetter = letter;

        if (!envelopeOverlay || !animatedEnvelope) {
            showLetter(letter);
            return;
        }

        animatedEnvelope.classList.remove("open");
        envelopeOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    // ENVELOPE ANIMATION
    animatedEnvelope?.addEventListener("click", () => {
        if (!selectedLetter) return;

        animatedEnvelope.classList.add("open");

        setTimeout(() => {
            if (selectedLetter) {
                envelopeOverlay.classList.remove("active");
                showLetter(selectedLetter);
            }
        }, 1100);
    });

    // SHOW LETTER
    function showLetter(letter) {
        if (!letterModal) return;

        modalTitle.textContent = letter.title;

        modalRecipient.textContent = letter.recipient
            ? `To: ${letter.recipient}`
            : "A letter from your heart";

        modalMessage.textContent = letter.message;
        modalDate.textContent = formatDate(letter.date);

        letterModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    // CLOSE LETTER
    function closeLetterModal() {
        letterModal?.classList.remove("active");
        document.body.style.overflow = "";
        selectedLetter = null;
    }

    closeModal?.addEventListener("click", closeLetterModal);

    letterModal?.addEventListener("click", (event) => {
        if (event.target === letterModal) {
            closeLetterModal();
        }
    });

    // CLOSE ENVELOPE
    function closeEnvelope() {
        envelopeOverlay?.classList.remove("active");
        animatedEnvelope?.classList.remove("open");

        document.body.style.overflow = "";
        selectedLetter = null;
    }

    envelopeOverlay?.addEventListener("click", (event) => {
        if (event.target === envelopeOverlay) {
            closeEnvelope();
        }
    });

    // DELETE LETTER
    function deleteLetter(id) {
        if (!confirm("Are you sure you want to delete this letter?")) {
            return;
        }

        const previousLetters = [...letters];

        letters = letters.filter(letter => letter.id !== id);

        if (!saveToStorage()) {
            letters = previousLetters;
            return;
        }

        renderLetters();
    }

    // ESCAPE KEY
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (letterModal?.classList.contains("active")) {
                closeLetterModal();
            } else if (envelopeOverlay?.classList.contains("active")) {
                closeEnvelope();
            }
        }
    });

    // INITIALIZE
    updateCharacterCount();
    renderLetters();

    console.log("DEAR MOMENTS — Letters are ready 💌");

});
