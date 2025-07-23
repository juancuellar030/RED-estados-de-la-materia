// A SINGLE, UNIFIED 'DOMContentLoaded' LISTENER FOR ALL PAGE SCRIPTS
document.addEventListener('DOMContentLoaded', () => {

    // --- PART 1: MODAL LOGIC (for arbol-de-problemas.html) ---
    
    // Get all the elements related to the modal
    const allNodes = document.querySelectorAll('.node');
    const modal = document.getElementById('hologram-modal');
    
    // This part only runs if it's on the page with the modal
    if (modal && allNodes.length > 0) {
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const closeModalButton = document.getElementById('close-modal');

        const openModal = (node) => {
            const title = node.getAttribute('data-title');
            const description = node.getAttribute('data-description');
            modalTitle.textContent = title;
            modalDescription.innerHTML = description;
            modal.classList.add('visible');
        };

        const closeModal = () => {
            modal.classList.remove('visible');
        };

        allNodes.forEach(node => {
            node.addEventListener('click', () => {
                openModal(node);
            });
        });

        closeModalButton.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }


    // --- PART 2: MATRIX RAIN ANIMATION (for all pages) ---

    const canvas = document.getElementById('matrix-canvas');
    
    // This part only runs if it's on a page with the canvas
    if (canvas) {
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

    // --- PART 3: SOUND EFFECTS (for all pages) ---
    const hoverSound = new Audio('assets/hover-sound.mp3');
    const clickSound = new Audio('assets/click-sound.mp3');
    hoverSound.volume = 0.05;
    clickSound.volume = 0.6;
    
    // Selecciona todos los elementos interactivos EXCEPTO el botón de play de A.V.A.
    const interactiveElements = document.querySelectorAll('a, button:not(#ava-play-button), .node, .cube-face');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });
    
    // ========================================================================== //
    // PART 5 & 6: TYPEWRITER LOGIC (UNIFICADO)                                   //
    // ========================================================================== //
    
    // --- 1. Definimos la función UNA SOLA VEZ ---
    function typeWriter(element, text, speed) {
        return new Promise(resolve => {
            let i = 0;
            element.classList.add('typing');
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    element.classList.remove('typing');
                    resolve();
                }
            }, speed);
        });
    }
    
    // --- 2. Lógica para la PÁGINA DE INICIO ---
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        const textElements = welcomeScreen.querySelectorAll('.typewriter-text');
        const finalButtons = welcomeScreen.querySelectorAll('.cta-button');
        let originalTexts = [];
    
        textElements.forEach(el => {
            originalTexts.push(el.textContent);
            el.textContent = '';
        });
    
        // Oculta los botones al inicio
        if (finalButtons) {
          finalButtons.forEach(button => {
            button.style.opacity = '0';
            button.style.transition = 'opacity 0.5s';
          });
        }
    
        async function startTypingSequence() {
            for (let i = 0; i < textElements.length; i++) {
                const el = textElements[i];
                const text = originalTexts[i];
                el.style.visibility = 'visible';
                await typeWriter(el, text, 50);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            if (finalButtons) {
                finalButtons.forEach(button => button.style.opacity = '1');
            }
        }
        
        setTimeout(startTypingSequence, 2300);
    }
    
    // --- 3. Lógica para la PÁGINA DE LA TABLET ---
    const tabletTitle = document.querySelector('.tablet-screen .page-title');
    if (tabletTitle) {
        const originalTitleText = tabletTitle.textContent;
        tabletTitle.textContent = '';
    
        setTimeout(() => {
            tabletTitle.style.visibility = 'visible';
            typeWriter(tabletTitle, originalTitleText, 60);
        }, 2000);
    }

    // === PART 7: SCREEN APPEARANCE SOUND EFFECTS (VERSIÓN CORREGIDA) ===

    const screenSound = new Audio('assets/sci-fi-screen.mp3');
    screenSound.volume = 0.4;
    
    const welcomeScreenForSound = document.getElementById('welcome-screen');
    const tabletScreenForSound = document.querySelector('.tablet-screen');
    
    // Para la pantalla de bienvenida, el listener funciona bien
    if (welcomeScreenForSound) {
        welcomeScreenForSound.addEventListener('animationstart', () => {
            screenSound.currentTime = 0;
            screenSound.play();
        }, { once: true });
    }
    
    // Para la pantalla de la tablet, usamos un temporizador fiable
    if (tabletScreenForSound) {
        // La animación de la pantalla empieza a los 1.2s (1200ms)
        setTimeout(() => {
            screenSound.currentTime = 0;
            screenSound.play();
        }, 1200);
    }

    // ========================================================================== //
    // PART 8 & 9: 3D CUBE LOGIC (INTERACTION + DRAG ROTATION) - FINAL VERSION   //
    // ========================================================================== //
    
    const cubeScene = document.querySelector('.cube-scene');
    const cube = document.querySelector('.cube');
    const playRotationButton = document.getElementById('play-rotation-button');
    const cubeFaces = document.querySelectorAll('.cube-face');
    const messageDisplay = document.getElementById('cube-message-display');
    
    // Solo ejecuta si TODOS los elementos del cubo existen
    if (cube && cubeScene && playRotationButton && cubeFaces.length > 0 && messageDisplay) {
    
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
            face.addEventListener('touchstart', (event) => {
                event.preventDefault();
                handleFaceInteraction(event.currentTarget.dataset.face);
            });
        });
    
        // --- LÓGICA PARA LA ROTACIÓN POR ARRASTRE ---
        let isDragging = false;
        let wasDragged = false; // Nueva variable para diferenciar clic de arrastre
        let previousX, previousY;
        let rotationX = 10; 
        let rotationY = 0;
    
        const startDrag = (clientX, clientY) => {
            isDragging = true;
            wasDragged = false;
            previousX = clientX;
            previousY = clientY;
            cube.classList.add('is-interactive');
            cubeScene.classList.add('user-has-interacted');
        };
        const drag = (clientX, clientY) => {
            if (!isDragging) return;
            wasDragged = true; // Si se mueve, fue un arrastre
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
        document.addEventListener('mouseleave', stopDrag);
        cubeScene.addEventListener('touchstart', (e) => { e.preventDefault(); startDrag(e.touches[0].clientX, e.touches[0].clientY); });
        window.addEventListener('touchmove', (e) => { if (e.touches.length > 0) drag(e.touches[0].clientX, e.touches[0].clientY); });
        window.addEventListener('touchend', stopDrag);
    
        // --- LÓGICA PARA EL BOTÓN DE PLAY ---
        playRotationButton.addEventListener('click', () => {
            cubeScene.classList.remove('user-has-interacted');
            cube.style.transform = 'rotateX(10deg) rotateY(0deg)';
            setTimeout(() => {
                cube.classList.remove('is-interactive');
            }, 300);
        });
    }

    // === PART 10: AVATAR A.V.A. LOGIC (VERSIÓN FINAL Y ROBUSTA) ===

    const avaPlayButton = document.getElementById('ava-play-button');
    const avaImage = document.querySelector('.ava-character-image'); // Usamos la clase para ser consistentes
    
    if (avaPlayButton && avaImage) {
        const audioWelcome = document.getElementById('ava-audio-welcome');
        const audioProblems = document.getElementById('ava-audio-problems');
        const audioAr = document.getElementById('ava-audio-ar');
        const audioLab = document.getElementById('ava-audio-lab');
        let audioContext, analyser, dataArray;
        let isAudioContextInitialized = false;
        let animationFrameId;
    
        const visualizeGlow = () => {
            analyser.getByteFrequencyData(dataArray);
            let average = dataArray.reduce((a, b) => a + b) / dataArray.length;
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
            // ¡LA SOLUCIÓN! Detiene el sonido de clic genérico
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
    }

    // === NEW PART: VIRTUAL LAB MODULE 1 - MATERIAL VIEWER ===
        const materialCards = document.querySelectorAll('.material-card');
        const materialViewers = document.querySelectorAll('.material-viewer');
    
        if (materialCards.length > 0 && materialViewers.length > 0) {
          
            materialCards.forEach(card => {
                card.addEventListener('click', () => {
                    const targetMaterial = card.dataset.material;
                    if (!targetMaterial) return;
    
                    // Deactivate all cards and viewers
                    materialCards.forEach(c => c.classList.remove('active'));
                    materialViewers.forEach(v => v.classList.remove('active'));
    
                    // Activate the selected card and its viewer
                    card.classList.add('active');
                    const targetViewer = document.getElementById(`viewer-${targetMaterial}`);
                    if (targetViewer) {
                        targetViewer.classList.add('active');
                    }
                });
            });
        }

    // === PART 11: VIRTUAL LAB INTERACTIVITY (CON VISOR MOLECULAR) ===

    const stateButtons = document.querySelectorAll('.state-button');
    const stateDescriptions = document.querySelectorAll('.state-description');
    const moleculeViewers = document.querySelectorAll('.molecule-viewer'); // Añadimos los visores
    
    // Solo ejecuta si los botones existen
    if (stateButtons.length > 0) {
        stateButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. Quita la clase 'active' de todos los elementos
                stateButtons.forEach(btn => btn.classList.remove('active'));
                stateDescriptions.forEach(desc => desc.classList.remove('active'));
                moleculeViewers.forEach(viewer => viewer.classList.remove('active')); // También de los visores
    
                // 2. Añade la clase 'active' al botón clicado
                button.classList.add('active');
    
                // 3. Muestra la descripción y el visor correspondientes
                const state = button.dataset.state;
                const activeDescription = document.getElementById(`info-${state}`);
                const activeViewer = document.getElementById(`viewer-${state}`); // Buscamos el visor
                
                if (activeDescription) {
                    activeDescription.classList.add('active');
                }
                if (activeViewer) {
                    activeViewer.classList.add('active'); // Y lo mostramos
                }
            });
        });
    }

    // === PART 12: AVATAR TELEPORT SOUND (for index.html) ===

    // We only want this to run on the home page, which has the welcome screen
    const welcomeScreenForTeleport = document.getElementById('welcome-screen');
    
    if (welcomeScreenForTeleport) {
        const teleportSound = document.getElementById('ava-audio-teleport');

        // The teleport visual effect animation in style.css has a 2-second delay.
        // We use setTimeout to match this delay precisely.
        setTimeout(() => {
            if (teleportSound) {
                teleportSound.volume = 0.5; // Adjust volume as needed
                teleportSound.play();
            }
        }, 2000); // 2000 milliseconds = 2 seconds
    }

    // === CORRECTED: VIRTUAL LAB 3D MODEL ZOOM CONTROLS ===
    const zoomInButton = document.getElementById('zoom-in-button');
    const zoomOutButton = document.getElementById('zoom-out-button');
    
    if (zoomInButton && zoomOutButton) {
        
        const handleZoom = (direction) => {
            // Find the active model viewer ONLY when a button is clicked
            const activeViewer = document.querySelector('.material-viewer.active model-viewer');
            if (!activeViewer) return;
    
            // Use a robust method to get the current zoom (radius)
            const currentOrbit = activeViewer.getCameraOrbit();
            let currentRadius = parseFloat(currentOrbit.radius);
            
            // Define a dynamic zoom step for a smoother feel
            const zoomStep = currentRadius * 0.2;
    
            if (direction === 'in') {
                currentRadius = Math.max(currentRadius - zoomStep, 0.1); // Zoom in
            } else {
                currentRadius = currentRadius + zoomStep; // Zoom out
            }
    
            // Set the new camera orbit radius without changing pitch and yaw
            activeViewer.cameraOrbit = `${currentOrbit.theta}rad ${currentOrbit.phi}rad ${currentRadius}m`;
        };
    
        zoomInButton.addEventListener('click', () => handleZoom('in'));
        zoomOutButton.addEventListener('click', () => handleZoom('out'));
    }
// === NEW PART: AVATAR TELEPORT SOUND (LAB PAGE) ===
    
    // Check if we are on the lab page by looking for its body class
    if (document.body.classList.contains('lab-page')) {
        const teleportSound = document.getElementById('ava-audio-teleport');
        
        // The CSS animation for the teleport glow starts after a 1-second delay
        setTimeout(() => {
            if (teleportSound) {
                teleportSound.volume = 0.5; // Adjust volume as needed
                teleportSound.play();
            }
        }, 1000); // 1000ms = 1s
    }

    // === NEW PART: AVATAR SHOW/HIDE TOGGLE LOGIC ===
        const avaToggleBtn = document.getElementById('ava-toggle-button');
        const avaContainer = document.getElementById('ava-container');
    
        // Only run this script if the avatar elements exist on the page
        if (avaToggleBtn && avaContainer) {
            
            // SVG icons for the button states
            const iconHide = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.974 0 9.19 3.226 10.678 7.697a.75.75 0 0 1 0 .606C21.19 17.024 16.973 20.25 12.001 20.25c-4.974 0-9.19-3.226-10.678-7.697a.75.75 0 0 1 0-.606ZM12 17.25a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5Z" clip-rule="evenodd" /></svg>`;
            const iconShow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM10.72 10.72a3 3 0 0 0-3.18.13l-1.91-1.91A5.25 5.25 0 0 1 12 7.5a5.25 5.25 0 0 1 5.25 5.25 5.23 5.23 0 0 1-.44 2.06l-2.62-2.62a3 3 0 0 0-3.47-3.47Z" clip-rule="evenodd" /><path d="m14.28 14.28.16.16a3 3 0 0 1-3.32-3.32l.16.16a3 3 0 0 1 3 3ZM11.45 20.14c-4.93-1.45-8.3-5.52-9.9-9.43a.75.75 0 0 1 0-.6c1.6-3.9 5-7.98 9.9-9.43a5.5 5.5 0 0 1 2.2 0c4.93 1.45 8.3 5.52 9.9 9.43a.75.75 0 0 1 0 .6c-1.55 3.79-4.8 7.8-9.67 9.4a5.5 5.5 0 0 1-2.43.04Z" /></svg>`;
    
            avaToggleBtn.addEventListener('click', () => {
                // Toggle the 'ava-hidden' class on the container
                avaContainer.classList.toggle('ava-hidden');
    
                // Update the button icon and tooltip based on the new state
                if (avaContainer.classList.contains('ava-hidden')) {
                    avaToggleBtn.innerHTML = iconShow;
                    avaToggleBtn.setAttribute('title', 'Mostrar Asistente');
                } else {
                    avaToggleBtn.innerHTML = iconHide;
                    avaToggleBtn.setAttribute('title', 'Ocultar Asistente');
                }
            });
        }
}); // <-- El final del archivo
