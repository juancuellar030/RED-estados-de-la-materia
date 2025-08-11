// ========================================================================== //
// SCRIPT.JS - MULTI-PAGE ARCHITECTURE VERSION                              //
// ========================================================================== //
// This script is designed to be included in every HTML page.
// It detects which page is currently active and runs only the necessary
// JavaScript for that specific page's interactive elements.
// All functions are organized and called from a single 'DOMContentLoaded'
// event listener at the bottom.
// ========================================================================== //


// --- A. HELPER FUNCTIONS (The building blocks) ---

/**
 * Initializes the Matrix Rain background animation on the page's canvas.
 * This function is called on every page load.
 */
function initMatrixCanvas() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = '1234567890@#$%^&*()アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const charactersArray = characters.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    const draw = () => {
        ctx.fillStyle = 'rgba(10, 15, 43, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f6ff';
        ctx.font = fontSize + 'px arial';

        for (let i = 0; i < drops.length; i++) {
            const text = charactersArray[Math.floor(Math.random() * charactersArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            drops[i]++;

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
    };

    setInterval(draw, 45);
}

/**
 * Attaches a generic click sound effect to all major interactive elements.
 * This function is called on every page load.
 */
function initGlobalSounds() {
    const clickSound = new Audio('assets/click-sound.mp3');
    clickSound.volume = 0.6;

    // Select all interactive elements EXCEPT the avatar's play button (which has its own sound logic)
    const interactiveElements = document.querySelectorAll('a, button:not(#ava-play-button), .node, .cube-face, .material-card');

    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });
}

/**
 * Initializes all logic for the AVA assistant, including audio playback,
 * visualizer, and the show/hide toggle button. This runs if an avatar
 * is found on the current page.
 */
function initAvaLogic() {
    const avaContainer = document.getElementById('ava-container');
    const avaPlayButton = document.getElementById('ava-play-button');
    const avaImage = document.querySelector('.ava-character-image');
    const avaToggleBtn = document.getElementById('ava-toggle-button');

    if (!avaContainer || !avaPlayButton || !avaImage) return;

    // --- Audio Playback and Visualizer ---
    const audioWelcome = document.getElementById('ava-audio-welcome');
    const audioProblems = document.getElementById('ava-audio-problems');
    const audioAr = document.getElementById('ava-audio-ar');
    const audioLab = document.getElementById('ava-audio-lab');
    let audioContext, analyser, dataArray;
    let isAudioContextInitialized = false;
    let animationFrameId;

    const visualizeGlow = () => {
        analyser.getByteFrequencyData(dataArray);
        let average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const baseGlow = 10;
        const maxGlow = 45;
        const glowSize = baseGlow + (average / 128) * (maxGlow - baseGlow);
        avaImage.style.filter = `drop-shadow(0 0 ${glowSize}px #77FAFF)`;
        animationFrameId = requestAnimationFrame(visualizeGlow);
    };

    const stopVisualizer = () => {
        cancelAnimationFrame(animationFrameId);
        avaImage.style.filter = 'drop-shadow(0 0 15px #00f6ff)';
    };

    const handlePlay = (event) => {
        event.stopPropagation(); // Prevents the generic click sound.

        if (!isAudioContextInitialized) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            isAudioContextInitialized = true;
        }

        const currentPage = window.location.pathname.split('/').pop();
        let currentAudio;
        if (currentPage === 'arbol-de-problemas.html') currentAudio = audioProblems;
        else if (currentPage === 'app-ra.html') currentAudio = audioAr;
        else if (currentPage === 'laboratorio-virtual.html') currentAudio = audioLab;
        else currentAudio = audioWelcome;

        if (!currentAudio) return;

        if (currentAudio.paused) {
            if (!currentAudio.sourceNode) {
                currentAudio.sourceNode = audioContext.createMediaElementSource(currentAudio);
                currentAudio.sourceNode.connect(analyser);
                analyser.connect(audioContext.destination);
            }
            currentAudio.play();
            avaPlayButton.textContent = '■';
            visualizeGlow();
        } else {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            avaPlayButton.textContent = '▶';
            stopVisualizer();
        }

        currentAudio.onended = () => {
            avaPlayButton.textContent = '▶';
            stopVisualizer();
        };
    };
    avaPlayButton.addEventListener('click', handlePlay);


    // --- Show/Hide Toggle Button Logic ---
    if (avaToggleBtn) {
        const iconHide = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.974 0 9.19 3.226 10.678 7.697a.75.75 0 0 1 0 .606C21.19 17.024 16.973 20.25 12.001 20.25c-4.974 0-9.19-3.226-10.678-7.697a.75.75 0 0 1 0-.606ZM12 17.25a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5Z" clip-rule="evenodd" /></svg>`;
        const iconShow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM10.72 10.72a3 3 0 0 0-3.18.13l-1.91-1.91A5.25 5.25 0 0 1 12 7.5a5.25 5.25 0 0 1 5.25 5.25 5.23 5.23 0 0 1-.44 2.06l-2.62-2.62a3 3 0 0 0-3.47-3.47Z" clip-rule="evenodd" /><path d="m14.28 14.28.16.16a3 3 0 0 1-3.32-3.32l.16.16a3 3 0 0 1 3 3ZM11.45 20.14c-4.93-1.45-8.3-5.52-9.9-9.43a.75.75 0 0 1 0-.6c1.6-3.9 5-7.98 9.9-9.43a5.5 5.5 0 0 1 2.2 0c4.93 1.45 8.3 5.52 9.9 9.43a.75.75 0 0 1 0 .6c-1.55 3.79-4.8 7.8-9.67 9.4a5.5 5.5 0 0 1-2.43.04Z" /></svg>`;

        avaToggleBtn.innerHTML = iconHide; // Start with the "hide" icon visible

        avaToggleBtn.addEventListener('click', () => {
            avaContainer.classList.toggle('ava-hidden');
            if (avaContainer.classList.contains('ava-hidden')) {
                avaToggleBtn.innerHTML = iconShow;
                avaToggleBtn.title = 'Mostrar Asistente';
            } else {
                avaToggleBtn.innerHTML = iconHide;
                avaToggleBtn.title = 'Ocultar Asistente';
            }
        });
    }
}


/**
 * Initializes typewriter and sound animations for the Welcome Page (index.html).
 */
function initWelcomePage() {
    // --- Typewriter Effect ---
    const textElements = document.querySelectorAll('#welcome-screen .typewriter-text');
    const finalButtons = document.querySelectorAll('#welcome-screen .cta-button');
    if (textElements.length === 0) return;

    let originalTexts = [];
    textElements.forEach(el => {
        originalTexts.push(el.textContent);
        el.textContent = '';
    });
    finalButtons.forEach(button => button.style.opacity = '0');

    function typeWriter(element, text, speed) {
        return new Promise(resolve => {
            let i = 0;
            element.classList.add('typing');
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i++);
                } else {
                    clearInterval(timer);
                    element.classList.remove('typing');
                    resolve();
                }
            }, speed);
        });
    }

    async function startTypingSequence() {
        for (let i = 0; i < textElements.length; i++) {
            textElements[i].style.visibility = 'visible';
            await typeWriter(textElements[i], originalTexts[i], 50);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        finalButtons.forEach(button => button.style.opacity = '1');
    }
    setTimeout(startTypingSequence, 2300);

    // --- Screen and Teleport Sounds ---
    const screenSound = new Audio('assets/sci-fi-screen.mp3');
    screenSound.volume = 0.4;
    document.getElementById('welcome-screen').addEventListener('animationstart', () => {
        screenSound.currentTime = 0;
        screenSound.play();
    }, { once: true });

    const teleportSound = document.getElementById('ava-audio-teleport');
    if (teleportSound) {
        setTimeout(() => {
            teleportSound.volume = 0.5;
            teleportSound.play();
        }, 2000);
    }
}

/**
 * Initializes the interactive modals for the Problem Tree page (arbol-de-problemas.html).
 */
function initProblemTreeModals() {
    const allNodes = document.querySelectorAll('.node');
    const modal = document.getElementById('hologram-modal');
    const instructionsModal = document.getElementById('instructions-modal');

    if (modal && allNodes.length > 0) {
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const closeModalButton = document.getElementById('close-modal');

        const openModal = (node) => {
            modalTitle.textContent = node.dataset.title;
            modalDescription.innerHTML = node.dataset.description;
            modal.classList.add('visible');
        };
        const closeModal = () => modal.classList.remove('visible');

        allNodes.forEach(node => node.addEventListener('click', () => openModal(node)));
        closeModalButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }

    if (instructionsModal) {
        const closeInstructionsButton = document.getElementById('close-instructions');
        instructionsModal.classList.add('visible');
        const closeInstructions = () => instructionsModal.classList.remove('visible');
        if (closeInstructionsButton) closeInstructionsButton.addEventListener('click', closeInstructions);
        instructionsModal.addEventListener('click', (event) => {
            if (event.target === instructionsModal) closeInstructions();
        });
    }
}


/**
 * Initializes the interactive 3D cube for the AR Solution page (app-ra.html).
 */
function initInteractiveCube() {
    const cubeScene = document.querySelector('.cube-scene');
    const cube = document.querySelector('.cube');
    const playRotationButton = document.getElementById('play-rotation-button');
    const cubeFaces = document.querySelectorAll('.cube-face');
    const messageDisplay = document.getElementById('cube-message-display');

    if (!cube || !cubeScene || !playRotationButton || !messageDisplay) return;

    const messageTitle = document.getElementById('message-title');
    const messageBody = document.getElementById('message-body');
    const faceMessages = {
        visualizacion: { title: "1. Visualización Sub-Microscópica", body: "Delightex nos permite superar la descripción macroscópica (Causa 1) al construir y mostrar modelos 3D de partículas. El estudiante puede ver lo invisible, entendiendo el 'porqué' detrás de las propiedades de cada estado." },
        dinamismo: { title: "2. Simulación de Procesos Dinámicos", body: "Atacamos la representación estática (Causa 2) animando los modelos. Con CoBlocks, podemos simular el aumento de la energía cinética al aplicar calor, mostrando visualmente la transición de fase en lugar de solo describirla." },
        interactividad: { title: "3. Aprendizaje Activo por Experimentación", body: "En lugar de la observación pasiva (Causa 4), el estudiante se convierte en un experimentador. Puede programar sus propias simulaciones, cambiar variables y ver los resultados, fomentando el pensamiento científico y la formulación de hipótesis." },
        conexion: { title: "4. Conexión Conceptual", body: "Al usar el mismo conjunto de partículas y solo cambiar su comportamiento, reforzamos la idea de que 'material' y 'estado' no son conceptos separados (Causa 3). El estudiante entiende que es la misma sustancia la que se transforma." },
        inicio: { title: "1. Descarga la App 'Delightex'", body: ` <p>Escanea el código QR correspondiente a la tienda de aplicaciones de tu dispositivo para descargar la herramienta.</p><div class="qr-code-container"><div class="qr-code-item"><img src="assets/qr-google-play.svg" alt="QR Code for Google Play" class="qr-code-image"><strong>Para Android</strong></div><div class="qr-code-item"><img src="assets/qr-apple-store.svg" alt="QR Code for Apple App Store" class="qr-code-image"><strong>Para iOS</strong></div></div>` },
        proyecto: { title: "Nuestro Proyecto", body: "Hemos creado una escena interactiva que demuestra estos principios. ¡Escanea el siguiente código QR con la app de Delightex para explorarla! [Aquí iría el QR de tu proyecto]" }
    };

    const handleFaceInteraction = (faceKey) => {
        const message = faceMessages[faceKey];
        if (message) {
            messageTitle.textContent = message.title;
            messageBody.innerHTML = message.body;
            messageDisplay.classList.remove('visible');
            void messageDisplay.offsetWidth;
            messageDisplay.classList.add('visible');
        }
    };

    cubeFaces.forEach(face => {
        face.addEventListener('click', (event) => handleFaceInteraction(event.currentTarget.dataset.face));
    });

    let isDragging = false, previousX, previousY, rotationX = 10, rotationY = 0;
    const startDrag = (clientX, clientY) => {
        isDragging = true; previousX = clientX; previousY = clientY;
        cube.classList.add('is-interactive');
        cubeScene.classList.add('user-has-interacted');
    };
    const drag = (clientX, clientY) => {
        if (!isDragging) return;
        const deltaX = clientX - previousX;
        const deltaY = clientY - previousY;
        rotationY += deltaX * 0.5;
        rotationX -= deltaY * 0.5;
        cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        previousX = clientX; previousY = clientY;
    };
    const stopDrag = () => { isDragging = false; };

    cubeScene.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); });
    window.addEventListener('mousemove', (e) => drag(e.clientX, e.clientY));
    window.addEventListener('mouseup', stopDrag);

    playRotationButton.addEventListener('click', () => {
        cubeScene.classList.remove('user-has-interacted');
        cube.style.transform = 'rotateX(10deg) rotateY(0deg)';
        setTimeout(() => cube.classList.remove('is-interactive'), 300);
    });
}


/**
 * Initializes all interactive modules for the Virtual Lab page.
 */
function initVirtualLab() {
    // --- Module 1: Material 3D Viewer ---
    const materialCards = document.querySelectorAll('.material-card');
    const materialViewers = document.querySelectorAll('.material-viewer');
    if (materialCards.length > 0) {
        materialCards.forEach(card => {
            card.addEventListener('click', () => {
                const targetMaterial = card.dataset.material;
                if (!targetMaterial) return;
                materialCards.forEach(c => c.classList.remove('active'));
                materialViewers.forEach(v => v.classList.remove('active'));
                card.classList.add('active');
                const targetViewer = document.getElementById(`viewer-${targetMaterial}`);
                if (targetViewer) targetViewer.classList.add('active');
            });
        });
    }

    // --- Module 1: 3D Viewer Zoom Controls ---
    const zoomInButton = document.getElementById('zoom-in-button');
    const zoomOutButton = document.getElementById('zoom-out-button');
    if (zoomInButton && zoomOutButton) {
        const handleZoom = (direction) => {
            const activeViewer = document.querySelector('.material-viewer.active model-viewer');
            if (!activeViewer) return;
            const currentOrbit = activeViewer.getCameraOrbit();
            let currentRadius = parseFloat(currentOrbit.radius);
            const zoomStep = currentRadius * 0.2;
            currentRadius = (direction === 'in') ? Math.max(currentRadius - zoomStep, 0.1) : currentRadius + zoomStep;
            activeViewer.cameraOrbit = `${currentOrbit.theta}rad ${currentOrbit.phi}rad ${currentRadius}m`;
        };
        zoomInButton.addEventListener('click', () => handleZoom('in'));
        zoomOutButton.addEventListener('click', () => handleZoom('out'));
    }

    // --- Module 2: State Simulation ---
    const stateButtons = document.querySelectorAll('.state-button');
    if (stateButtons.length > 0) {
        stateButtons.forEach(button => {
            button.addEventListener('click', () => {
                const state = button.dataset.state;
                document.querySelectorAll('.state-button, .state-description, .molecule-viewer').forEach(el => el.classList.remove('active'));
                button.classList.add('active');
                const activeDescription = document.getElementById(`info-${state}`);
                const activeViewer = document.getElementById(`viewer-${state}`);
                if (activeDescription) activeDescription.classList.add('active');
                if (activeViewer) activeViewer.classList.add('active');
            });
        });
    }
    
    // --- Lab Page Specific Avatar Sound ---
    const teleportSound = document.getElementById('ava-audio-teleport');
    if (teleportSound) {
        setTimeout(() => {
            teleportSound.volume = 0.5;
            teleportSound.play();
        }, 1000);
    }
}


// --- B. MAIN EXECUTION (This runs after the page is fully loaded) ---

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Global initializations (run on every page) ---
    initMatrixCanvas();
    initGlobalSounds();

    // The Avatar is present on multiple pages, so we check for it globally.
    if (document.getElementById('ava-container')) {
        initAvaLogic();
    }

    // --- 2. Page-specific initializations (run only on the correct page) ---

    // If an element unique to the Welcome page exists, run its scripts.
    if (document.getElementById('welcome-screen')) {
        initWelcomePage();
    }

    // If an element unique to the Problem Tree page exists, run its scripts.
    if (document.querySelector('.mind-map-container')) {
        initProblemTreeModals();
    }

    // If an element unique to the AR Solution page exists, run its scripts.
    if (document.querySelector('.cube-scene')) {
        initInteractiveCube();
    }

    // If the body has the 'lab-page' class, run the lab scripts.
    if (document.body.classList.contains('lab-page')) {
        initVirtualLab();
    }
});
