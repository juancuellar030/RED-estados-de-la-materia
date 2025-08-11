// START OF FILE script.js (HEAVILY REFACTORED)

// --- A. HELPER & INITIALIZATION FUNCTIONS ---
// These functions are modular and can be called anytime.

/**
 * Initializes the Matrix Rain background animation on a given canvas.
 * @param {HTMLCanvasElement} canvas The canvas element to draw on.
 */
function initMatrixCanvas(canvas) {
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
        ctx.fillStyle = '#00f6ff';
        ctx.font = fontSize + 'px arial';
        for (let i = 0; i < drops.length; i++) {
            const text = charactersArray[Math.floor(Math.random() * charactersArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    };
    // To avoid creating multiple intervals, we store the interval ID on the canvas element itself.
    if (canvas.matrixInterval) clearInterval(canvas.matrixInterval);
    canvas.matrixInterval = setInterval(draw, 45);
}

/**
 * Initializes the modal logic for the "arbol-de-problemas" page.
 */
function initProblemTreeModals() {
    const allNodes = document.querySelectorAll('.node');
    const modal = document.getElementById('hologram-modal');
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
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Also handle the instructions modal for this page
    const instructionsModal = document.getElementById('instructions-modal');
    if (instructionsModal) {
        instructionsModal.classList.add('visible');
        const closeInstructionsButton = document.getElementById('close-instructions');
        const closeInstructions = () => instructionsModal.classList.remove('visible');
        if(closeInstructionsButton) closeInstructionsButton.addEventListener('click', closeInstructions);
        instructionsModal.addEventListener('click', (e) => { if (e.target === instructionsModal) closeInstructions(); });
    }
}

/**
 * Initializes the interactive 3D cube for the "app-ra" page.
 */
function initInteractiveCube() {
    // --- FIX APPLIED HERE ---
    // Combined all querySelectors and removed the duplicate declaration.
    const cubeScene = document.querySelector('.cube-scene');
    const cube = document.querySelector('.cube');
    const playRotationButton = document.getElementById('play-rotation-button');
    const cubeFaces = document.querySelectorAll('.cube-face');
    const messageDisplay = document.getElementById('cube-message-display');

    // Single, robust guard clause to ensure all elements exist before proceeding.
    if (!cubeScene || !cube || !playRotationButton || !messageDisplay) {
        return;
    }
    
    // --- LÓGICA PARA LA INTERACCIÓN DE LAS CARAS ---
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
        isDragging = true;
        previousX = clientX;
        previousY = clientY;
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
        previousX = clientX;
        previousY = clientY;
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
 * Initializes all the interactive elements for the "laboratorio-virtual" page.
 */
function initVirtualLab() {
    // Module 1: Material Viewer
    const materialCards = document.querySelectorAll('.material-card');
    materialCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetMaterial = card.dataset.material;
            document.querySelectorAll('.material-card, .material-viewer').forEach(el => el.classList.remove('active'));
            card.classList.add('active');
            const targetViewer = document.getElementById(`viewer-${targetMaterial}`);
            if (targetViewer) targetViewer.classList.add('active');
        });
    });

    // Module 1: Zoom Controls
    const zoomInButton = document.getElementById('zoom-in-button');
    const zoomOutButton = document.getElementById('zoom-out-button');
    if (zoomInButton && zoomOutButton) {
        const handleZoom = (direction) => {
            const activeViewer = document.querySelector('.material-viewer.active model-viewer');
            if (!activeViewer) return;
            const currentOrbit = activeViewer.getCameraOrbit();
            let radius = parseFloat(currentOrbit.radius);
            const step = radius * 0.2;
            radius += (direction === 'in' ? -step : step);
            activeViewer.cameraOrbit = `${currentOrbit.theta}rad ${currentOrbit.phi}rad ${radius}m`;
        };
        zoomInButton.addEventListener('click', () => handleZoom('in'));
        zoomOutButton.addEventListener('click', () => handleZoom('out'));
    }

    // Module 2: State Simulation
    const stateButtons = document.querySelectorAll('.state-button');
    stateButtons.forEach(button => {
        button.addEventListener('click', () => {
            const state = button.dataset.state;
            document.querySelectorAll('.state-button, .state-description, .molecule-viewer').forEach(el => el.classList.remove('active'));
            button.classList.add('active');
            const activeDesc = document.getElementById(`info-${state}`);
            const activeViewer = document.getElementById(`viewer-${state}`);
            if (activeDesc) activeDesc.classList.add('active');
            if (activeViewer) activeViewer.classList.add('active');
        });
    });
}

/**
 * This function is the router. It calls the correct init function
 * based on the page that was just loaded.
 * @param {string} pageName The filename of the loaded page.
 */
function initializePageScripts(pageName) {
    // Add sound effects to new elements
    const clickSound = new Audio('assets/click-sound.mp3');
    clickSound.volume = 0.6;
    const newInteractiveElements = document.querySelectorAll('#content-display-area a, #content-display-area button, #content-display-area .node, #content-display-area .cube-face');
    newInteractiveElements.forEach(element => {
        element.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });
    
    switch (pageName) {
        case 'arbol-de-problemas.html':
            initProblemTreeModals();
            break;
        case 'app-ra.html':
            initInteractiveCube();
            break;
        case 'laboratorio-virtual.html':
            initVirtualLab();
            break;
        case 'actividad-1.html':
        case 'actividad-2.html':
            // These pages are static, no specific JS needed.
            break;
    }
}


// --- B. CORE DYNAMIC CONTENT LOADING LOGIC ---

/**
 * Fetches HTML from a given URL and injects its <main> content into a target element.
 * @param {string} pageUrl The URL of the page to load.
 * @param {HTMLElement} targetElement The element to inject the content into.
 */
async function loadContent(pageUrl, targetElement) {
    if (!pageUrl || !targetElement) return;

    // Add a 'loading' class for fade-out/spinner effects
    targetElement.classList.add('loading');

    try {
        const response = await fetch(pageUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // Find the <main> element in the fetched document
        const mainContent = doc.querySelector('main');
        
        if (mainContent) {
            // Use a short delay to allow the fade-out transition to be visible
            setTimeout(() => {
                targetElement.innerHTML = mainContent.innerHTML;
                targetElement.classList.remove('loading');
                // IMPORTANT: Initialize the scripts for the new content
                initializePageScripts(pageUrl);
            }, 300); // This duration should match the CSS transition
        } else {
            targetElement.innerHTML = `<p class="error">Error: Could not find main content in ${pageUrl}</p>`;
            targetElement.classList.remove('loading');
        }

    } catch (error) {
        console.error('Failed to load page:', error);
        targetElement.innerHTML = `<p class="error">Error loading content. Please check the console.</p>`;
        targetElement.classList.remove('loading');
    }
}


// --- C. MAIN 'DOMContentLoaded' EVENT LISTENER ---
// This runs once when the site is first loaded.

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize global elements that are always present
    initMatrixCanvas(document.getElementById('matrix-canvas'));
    
    // (Your existing global Avatar and Sound logic would go here. No change needed.)
    // For brevity, this part is omitted but you should keep it.
    
    // 2. Logic specific to the WELCOME PAGE
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        // (Your existing typewriter and teleport sound logic for the welcome page)
        // No changes needed for this part.
    }

    // 3. LOGIC FOR OUR NEW DYNAMIC SEQUENCE PAGE
    const contentDisplayArea = document.getElementById('content-display-area');
    const sequenceContainer = document.querySelector('.sequence-steps-container');

    if (contentDisplayArea && sequenceContainer) {
        // Use event delegation for the load buttons
        sequenceContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.load-content-btn');
            if (button) {
                const pageToLoad = button.dataset.page;
                loadContent(pageToLoad, contentDisplayArea);

                // Optional: Add an 'active' state to the parent card
                document.querySelectorAll('.sequence-step-card').forEach(c => c.classList.remove('active'));
                button.closest('.sequence-step-card').classList.add('active');
            }
        });
    }

});
