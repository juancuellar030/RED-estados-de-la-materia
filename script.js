// ========================================================================== //
// SCRIPT.JS - FULLSCREEN IFRAME ARCHITECTURE (COMPLETE VERSION)            //
// ========================================================================== //
// This script is included in every HTML page and detects its own context.
// It runs specific logic if it's on the main `index.html` page (the shell)
// or different logic if it's on a page loaded inside the iframe.
// ========================================================================== //


document.addEventListener('DOMContentLoaded', () => {

    // --- A. DETECT THE CURRENT CONTEXT ---
    // This check is the core of the new architecture.
    // It determines if the script is running in the main window or inside the iframe.
    const isInsideIframe = (window.self !== window.top);


    // --- B. EXECUTE CODE BASED ON THE CONTEXT ---

    if (isInsideIframe) {
        // --- THIS CODE RUNS ONLY ON PAGES INSIDE THE IFRAME ---
        // (menu.html, laboratorio-virtual.html, app-ra.html, etc.)

        // 1. Initialize elements common to all iframe pages
        initMatrixCanvas();
        initGlobalSounds();

        // BUG FIX: Initialize AVA logic if an avatar exists on the iframe page.
        if (document.getElementById('ava-container')) {
            initAvaLogic();
        }

        // 2. Run the router to initialize scripts for the specific page loaded
        initPageSpecificScripts();

        // 3. Set up the "Exit Fullscreen" button if it exists on the page
        const exitBtn = document.getElementById('exit-fullscreen-btn');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                // Send a message to the parent window (index.html) telling it to exit.
                window.parent.postMessage('exitFullscreen', '*');
            });
        }

    } else {
        // --- THIS CODE RUNS ONLY ON THE PARENT PAGE (index.html) ---

        // 1. Initialize elements for the main shell page
        initMatrixCanvas();
        initGlobalSounds();
        if (document.getElementById('ava-container')) {
            initAvaLogic();
        }

        // 2. Initialize the welcome page content and the fullscreen launcher
        initWelcomePage();
        initFullscreenLauncher();
    }
});


// ========================================================================== //
// --- C. ALL HELPER AND INITIALIZATION FUNCTIONS ---                       //
// ========================================================================== //

/**
 * Initializes the Matrix Rain background animation on the page's canvas.
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
    for (let x = 0; x < columns; x++) drops[x] = 1;

    const draw = () => {
        ctx.fillStyle = 'rgba(10, 15, 43, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#B5A6FF';
        ctx.font = fontSize + 'px arial';

        for (let i = 0; i < drops.length; i++) {
            const text = charactersArray[Math.floor(Math.random() * charactersArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    };
    setInterval(draw, 45);
}

/**
 * Attaches a generic click sound effect to all major interactive elements.
 */
function initGlobalSounds() {
    const clickSound = new Audio('assets/click-sound.mp3');
    clickSound.volume = 0.6;
    const interactiveElements = document.querySelectorAll('a, button:not(#ava-play-button), .node, .cube-face, .material-card');
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });
}

/**
 * Initializes logic for the AVA assistant, if present on the page.
 * (Currently only used on the main index.html page).
 */
function initAvaLogic() {
    const avaPlayButton = document.getElementById('ava-play-button');
    const avaImage = document.querySelector('.ava-character-image');
    if (!avaPlayButton || !avaImage) return;

    // THE CRITICAL BUG FIX: Declare ALL possible audio variables at the start.
    // This ensures that `audioLab`, `audioProblems`, etc., always exist,
    // even if their value is `null` on pages where the tag is missing.
    const audioWelcome = document.getElementById('ava-audio-welcome');
    const audioProblems = document.getElementById('ava-audio-problems');
    const audioAr = document.getElementById('ava-audio-ar');
    const audioLab = document.getElementById('ava-audio-lab');

    let audioContext, analyser, dataArray, isAudioContextInitialized = false, animationFrameId;

    const visualizeGlow = () => {
        analyser.getByteFrequencyData(dataArray);
        let average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const glowSize = 10 + (average / 128) * 35;
        avaImage.style.filter = `drop-shadow(0 0 ${glowSize}px #C977FF)`;
        animationFrameId = requestAnimationFrame(visualizeGlow);
    };
    const stopVisualizer = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        avaImage.style.filter = 'drop-shadow(0 0 15px #B5A6FF)';
    };

    avaPlayButton.addEventListener('click', (event) => {
        event.stopPropagation();
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

        if (!currentAudio) {
            console.error("Could not find the appropriate audio element for this page.");
            return;
        }

        if (currentAudio.paused) {
            if (!currentAudio.sourceNode) {
                currentAudio.sourceNode = audioContext.createMediaElementSource(currentAudio);
                currentAudio.sourceNode.connect(analyser).connect(audioContext.destination);
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
    });
}

    // --- 2. Show/Hide Toggle Button Logic (MOVED AND INTEGRATED HERE) ---
    if (avaToggleBtn && avaContainer) {
        const iconHide = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.974 0 9.19 3.226 10.678 7.697a.75.75 0 0 1 0 .606C21.19 17.024 16.973 20.25 12.001 20.25c-4.974 0-9.19-3.226-10.678-7.697a.75.75 0 0 1 0-.606ZM12 17.25a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5Z" clip-rule="evenodd" /></svg>';
        const iconShow = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM10.72 10.72a3 3 0 0 0-3.18.13l-1.91-1.91A5.25 5.25 0 0 1 12 7.5a5.25 5.25 0 0 1 5.25 5.25 5.23 5.23 0 0 1-.44 2.06l-2.62-2.62a3 3 0 0 0-3.47-3.47Z" clip-rule="evenodd" /></svg>';
        
        avaToggleBtn.innerHTML = iconHide; // Set initial state
        
        avaToggleBtn.addEventListener('click', () => {
            avaContainer.classList.toggle('ava-hidden');
            if (avaContainer.classList.contains('ava-hidden')) {
                avaToggleBtn.innerHTML = iconShow;
                avaToggleBtn.setAttribute('title', 'Mostrar Asistente');
            } else {
                avaToggleBtn.innerHTML = iconHide;
                avaToggleBtn.setAttribute('title', 'Ocultar Asistente');
            }
        });
    }
}

/**
 * Master function for the parent page (index.html) to handle the fullscreen sequence.
 */
function initFullscreenLauncher() {
    const startBtn = document.getElementById('start-sequence-btn');
    const welcomeContainer = document.getElementById('welcome-content-container');
    const iframeContainer = document.getElementById('iframe-container');
    const iframe = document.getElementById('content-frame');
    if (!startBtn || !welcomeContainer || !iframeContainer || !iframe) return;

    const launchSequence = () => {
        const docEl = document.documentElement;
        const requestFullscreen = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
        if (requestFullscreen) {
            requestFullscreen.call(docEl);
        }
        welcomeContainer.classList.add('hidden');
        iframeContainer.style.display = 'block';
        iframe.src = 'menu.html';
    };
    startBtn.addEventListener('click', launchSequence);

    const exitSequence = () => {
        iframeContainer.style.display = 'none';
        iframe.src = 'about:blank';
        welcomeContainer.classList.remove('hidden');
        const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (exitFullscreen && document.fullscreenElement) {
            exitFullscreen.call(document);
        }
    };

    window.addEventListener('message', (event) => {
        if (event.data === 'exitFullscreen') {
            exitSequence();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && iframeContainer.style.display === 'block') {
            exitSequence();
        }
    });
}

/**
 * Initializes animations for the Welcome Page (index.html).
 */
function initWelcomePage() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (!welcomeScreen) return;

    // Typewriter Effect
    const textElements = welcomeScreen.querySelectorAll('.typewriter-text');
    const finalButton = welcomeScreen.querySelector('.cta-button');
    let originalTexts = [];
    textElements.forEach(el => { originalTexts.push(el.textContent); el.textContent = ''; });
    if(finalButton) finalButton.style.opacity = '0';
    
    function typeWriter(element, text) {
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
            }, 50);
        });
    }

    async function startTypingSequence() {
        for (let i = 0; i < textElements.length; i++) {
            textElements[i].style.visibility = 'visible';
            await typeWriter(textElements[i], originalTexts[i]);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        if(finalButton) finalButton.style.opacity = '1';
    }
    setTimeout(startTypingSequence, 2300);

    // Screen and Teleport Sounds
    const screenSound = new Audio('assets/sci-fi-screen.mp3');
    screenSound.volume = 0.4;
    welcomeScreen.addEventListener('animationstart', () => {
        screenSound.currentTime = 0;
        screenSound.play();
    }, { once: true });

    const teleportSound = document.getElementById('ava-audio-teleport');
    if (teleportSound) {
        setTimeout(() => { teleportSound.volume = 0.5; teleportSound.play(); }, 2000);
    }
}

/**
 * This function runs INSIDE the iframe and acts as a router to initialize
 * the correct scripts for the currently loaded page.
 */
function initPageSpecificScripts() {
    if (document.querySelector('.mind-map-container')) {
        initProblemTreeModals();
    }
    if (document.querySelector('.cube-scene')) {
        initInteractiveCube();
    }
    if (document.body.classList.contains('lab-page')) {
        initVirtualLab();
    }
    // No specific JS is needed for menu.html, objetivos.html, recursos.html,
    // or actividades.html, as they are mostly static or just links.
}

/**
 * Initializes the interactive modals for the Problem Tree page (arbol-de-problemas.html).
 */
function initProblemTreeModals() {
    const allNodes = document.querySelectorAll('.node');
    const modal = document.getElementById('hologram-modal');
    const instructionsModal = document.getElementById('instructions-modal');
    if (!modal || allNodes.length === 0) return;

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
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

    if (instructionsModal) {
        const closeInstructionsButton = document.getElementById('close-instructions');
        instructionsModal.classList.add('visible');
        const closeInstructions = () => instructionsModal.classList.remove('visible');
        if (closeInstructionsButton) closeInstructionsButton.addEventListener('click', closeInstructions);
        instructionsModal.addEventListener('click', (event) => { if (event.target === instructionsModal) closeInstructions(); });
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
    cubeFaces.forEach(face => face.addEventListener('click', (e) => handleFaceInteraction(e.currentTarget.dataset.face)));

    let isDragging = false, prevX, prevY, rotX = 10, rotY = 0;
    const startDrag = (x, y) => { isDragging = true; prevX = x; prevY = y; cube.classList.add('is-interactive'); cubeScene.classList.add('user-has-interacted'); };
    const drag = (x, y) => { if (!isDragging) return; const dx = x - prevX; const dy = y - prevY; rotY += dx * 0.5; rotX -= dy * 0.5; cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`; prevX = x; prevY = y; };
    const stopDrag = () => { isDragging = false; };

    cubeScene.addEventListener('mousedown', e => { e.preventDefault(); startDrag(e.clientX, e.clientY); });
    window.addEventListener('mousemove', e => drag(e.clientX, e.clientY));
    window.addEventListener('mouseup', stopDrag);
    playRotationButton.addEventListener('click', () => { cubeScene.classList.remove('user-has-interacted'); cube.style.transform = 'rotateX(10deg) rotateY(0deg)'; setTimeout(() => cube.classList.remove('is-interactive'), 300); });
}

/**
 * Initializes all interactive modules for the Virtual Lab page.
 */
function initVirtualLab() {
    const materialCards = document.querySelectorAll('.material-card');
    const materialViewers = document.querySelectorAll('.material-viewer');
    if (materialCards.length > 0) {
        materialCards.forEach(card => card.addEventListener('click', () => {
            const targetMaterial = card.dataset.material;
            if (!targetMaterial) return;
            materialCards.forEach(c => c.classList.remove('active'));
            materialViewers.forEach(v => v.classList.remove('active'));
            card.classList.add('active');
            const targetViewer = document.getElementById(`viewer-${targetMaterial}`);
            if (targetViewer) targetViewer.classList.add('active');
        }));
    }

    const zoomInButton = document.getElementById('zoom-in-button');
    const zoomOutButton = document.getElementById('zoom-out-button');
    if (zoomInButton && zoomOutButton) {
        const handleZoom = (dir) => {
            const activeViewer = document.querySelector('.material-viewer.active model-viewer');
            if (!activeViewer) return;
            const orbit = activeViewer.getCameraOrbit();
            let radius = parseFloat(orbit.radius);
            const step = radius * 0.2;
            radius += (dir === 'in' ? -step : step);
            activeViewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radius}m`;
        };
        zoomInButton.addEventListener('click', () => handleZoom('in'));
        zoomOutButton.addEventListener('click', () => handleZoom('out'));
    }

    const stateButtons = document.querySelectorAll('.state-button');
    if (stateButtons.length > 0) {
        stateButtons.forEach(button => button.addEventListener('click', () => {
            const state = button.dataset.state;
            document.querySelectorAll('.state-button, .state-description, .molecule-viewer').forEach(el => el.classList.remove('active'));
            button.classList.add('active');
            const activeDesc = document.getElementById(`info-${state}`);
            const activeViewer = document.getElementById(`viewer-${state}`);
            if (activeDesc) activeDesc.classList.add('active');
            if (activeViewer) activeViewer.classList.add('active');
        }));
    }
}
