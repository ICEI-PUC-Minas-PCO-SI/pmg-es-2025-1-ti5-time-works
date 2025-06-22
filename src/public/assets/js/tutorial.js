function initTutorial() {
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    const startTutorialBtn = document.getElementById('start-tutorial');
    const closeWelcomeBtn = document.getElementById('close-welcome');
    const skipWelcomeBtn = document.getElementById('skip-welcome');
    const closeTutorialBtn = document.getElementById('close-tutorial');
    const skipBtn = document.getElementById('skip-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if (!welcomeOverlay) return;
    let currentSlide = 0;
    const totalSlides = slides.length;

    async function markTutorialAsSeen() {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return;

        try {
            await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PATCH', headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hasSeenTutorial: true })
            });
            console.log("Tutorial marcado como visto no servidor.");
        } catch (error) {
            console.error("Erro ao marcar tutorial como visto:", error);
        }
    }

    function openWelcome() {
        welcomeOverlay.classList.add('active');
    }

    function closeWelcome(markAsSeen = false) {
        welcomeOverlay.classList.remove('active');
        if (markAsSeen) {
            markTutorialAsSeen();
        }
    }

    function startTutorial() {
        closeWelcome(false); setTimeout(() => showTutorial(), 500);
    }

    function showTutorial() {
        updateSlide(0);
        tutorialOverlay.classList.add('active');
    }

    function closeTutorial() {
        tutorialOverlay.classList.remove('active');
        markTutorialAsSeen();
    }

    function updateSlide(newIndex) {
        if (newIndex < 0 || newIndex >= totalSlides) return;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[newIndex].classList.add('active');
        dots[newIndex].classList.add('active');

        currentSlide = newIndex;

        prevBtn.disabled = currentSlide === 0;
        nextBtn.textContent = currentSlide === totalSlides - 1 ? 'Finalizar' : 'Próximo';
    }

    startTutorialBtn.addEventListener('click', startTutorial);
    closeWelcomeBtn.addEventListener('click', () => closeWelcome(true));
    skipWelcomeBtn.addEventListener('click', () => closeWelcome(true));
    welcomeOverlay.addEventListener('click', (e) => e.target === welcomeOverlay && closeWelcome(true));

    closeTutorialBtn.addEventListener('click', closeTutorial);
    skipBtn.addEventListener('click', closeTutorial);
    tutorialOverlay.addEventListener('click', (e) => e.target === tutorialOverlay && closeTutorial());

    nextBtn.addEventListener('click', () => {
        if (currentSlide === totalSlides - 1) {
            closeTutorial();
        } else {
            updateSlide(currentSlide + 1);
        }
    });

    prevBtn.addEventListener('click', () => updateSlide(currentSlide - 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => updateSlide(index)));

    openWelcome();
}