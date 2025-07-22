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

    // Carga los archivos de sonido una sola vez
    const hoverSound = new Audio('assets/hover-sound.mp3');
    const clickSound = new Audio('assets/click-sound.mp3');

    // Ajusta el volumen si es necesario (0.5 es 50% del volumen)
    hoverSound.volume = 0.05;
    clickSound.volume = 0.6;

    // Selecciona todos los elementos interactivos EXCEPTO el botón de play de A.V.A.
    const interactiveElements = document.querySelectorAll('a, button:not(#ava-play-button), .node, .cube-face');

    // Añade los listeners a cada elemento
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play();
        });
        element.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });
    
    // === PART 5: TYPEWRITER EFFECT (for index.html) (CON MÚLTIPLES BOTONES) ===
    
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        const textElements = welcomeScreen.querySelectorAll('.typewriter-text');
        let originalTexts = [];
    
        textElements.forEach(el => {
            originalTexts.push(el.textContent);
            el.textContent = '';
        });
    
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
    
        async function startTypingSequence() {
            for (let i = 0; i < textElements.length; i++) {
                const el = textElements[i];
                const text = originalTexts[i];
                el.style.visibility = 'visible';
                await typeWriter(el, text, 50);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            // SOLUCIÓN #1: Selecciona TODOS los botones
            const finalButtons = document.querySelectorAll('#welcome-screen .cta-button');
            if (finalButtons) {
                // Y aplica la animación a CADA UNO
                finalButtons.forEach(button => {
                    button.style.opacity = '1';
                });
            }
        }
        
        // SOLUCIÓN #2: Oculta TODOS los botones al inicio
        const finalButtons = document.querySelectorAll('#welcome-screen .cta-button');
        if(finalButtons) {
          finalButtons.forEach(button => {
            button.style.opacity = '0';
            button.style.transition = 'opacity 0.5s';
          });
        }
    
        setTimeout(startTypingSequence, 2300);
    }

    // === PART 6: TYPEWRITER EFFECT (for tablet-page) ===

    // Busca el título específico de la página de la tablet
    const tabletTitle = document.querySelector('.tablet-screen .page-title');
    // Solo ejecuta esto si estamos en la página de la tablet
    if (tabletTitle) {
    
        const originalTitleText = tabletTitle.textContent;
        tabletTitle.textContent = ''; // Limpia el título
    
        // Reutilizamos la función de máquina de escribir si ya existe, si no, la creamos
        // (Esta es una salvaguarda por si movemos el código)
        if (typeof typeWriter !== 'function') {
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
        }
    
        // Inicia la animación del título después de que la pantalla se proyecte
        setTimeout(() => {
            tabletTitle.style.visibility = 'visible';
            typeWriter(tabletTitle, originalTitleText, 60); // 60ms por caracter
        }, 2000); // Empieza a los 2 segundos
    }

    // === PART 7: SCREEN APPEARANCE SOUND EFFECTS (VERSIÓN CORREGIDA) ===

    const screenSound = new Audio('assets/sci-fi-screen.wav');
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

    // === PART 8: 3D CUBE INTERACTIVITY (for ar-page) ===

    const cubeFaces = document.querySelectorAll('.cube-face');
    const messageDisplay = document.getElementById('cube-message-display');
    
    // Solo ejecuta esto si el cubo existe
    if (cubeFaces.length > 0 && messageDisplay) {
        const messageTitle = document.getElementById('message-title');
        const messageBody = document.getElementById('message-body');
    
        // Almacén de textos para cada cara
        const faceMessages = {
            visualizacion: {
                title: "1. Visualización Sub-Microscópica",
                body: "Delightex nos permite superar la descripción macroscópica (Causa 1) al construir y mostrar modelos 3D de partículas. El estudiante puede ver lo invisible, entendiendo el 'porqué' detrás de las propiedades de cada estado."
            },
            dinamismo: {
                title: "2. Simulación de Procesos Dinámicos",
                body: "Atacamos la representación estática (Causa 2) animando los modelos. Con CoBlocks, podemos simular el aumento de la energía cinética al aplicar calor, mostrando visualmente la transición de fase en lugar de solo describirla."
            },
            interactividad: {
                title: "3. Aprendizaje Activo por Experimentación",
                body: "En lugar de la observación pasiva (Causa 4), el estudiante se convierte en un experimentador. Puede programar sus propias simulaciones, cambiar variables y ver los resultados, fomentando el pensamiento científico y la formulación de hipótesis."
            },
            conexion: {
                title: "4. Conexión Conceptual",
                body: "Al usar el mismo conjunto de partículas y solo cambiar su comportamiento, reforzamos la idea de que 'material' y 'estado' no son conceptos separados (Causa 3). El estudiante entiende que es la misma sustancia la que se transforma."
            },
            inicio: {
                title: "1. Descarga la App 'Delightex'",
                // Usamos backticks (`) para crear una cadena de texto multilínea
                body: ` 
                    <p>Escanea el código QR correspondiente a la tienda de aplicaciones de tu dispositivo para descargar la herramienta.</p>
                    <div class="qr-code-container">
                        <div class="qr-code-item">
                            <!-- RUTA ACTUALIZADA A .SVG -->
                            <img src="assets/qr-google-play.svg" alt="QR Code for Google Play" class="qr-code-image">
                            <strong>Para Android</strong>
                        </div>
                        <div class="qr-code-item">
                            <!-- RUTA ACTUALIZADA A .SVG -->
                            <img src="assets/qr-apple-store.svg" alt="QR Code for Apple App Store" class="qr-code-image">
                            <strong>Para iOS</strong>
                        </div>
                    </div>
                `
            },
            proyecto: {
                title: "Nuestro Proyecto",
                body: "Hemos creado una escena interactiva que demuestra estos principios. ¡Escanea el siguiente código QR con la app de Delightex para explorarla! [Aquí iría el QR de tu proyecto]"
            }
        };
    
        // Añade el listener a cada cara
        cubeFaces.forEach(face => {
            face.addEventListener('click', (event) => {
                const faceKey = event.currentTarget.dataset.face;
                const message = faceMessages[faceKey];
    
                if (message) {
                    // Actualiza el contenido del panel
                    messageTitle.textContent = message.title;
                    messageBody.innerHTML = message.body;
    
                    // Muestra el panel con una animación
                    messageDisplay.classList.remove('visible'); // Resetea la animación
                    void messageDisplay.offsetWidth; // Truco para forzar el reseteo
                    messageDisplay.classList.add('visible');
                }
            });
        });
    }

    // === PART 8: 3D CUBE INTERACTIVITY (CON SOPORTE TÁCTIL PARA CARAS) ===
    const cubeFaces = document.querySelectorAll('.cube-face');
    const messageDisplay = document.getElementById('cube-message-display');
    
    if (cubeFaces.length > 0 && messageDisplay) {
        const messageTitle = document.getElementById('message-title');
        const messageBody = document.getElementById('message-body');
        const faceMessages = { /* ... (tu objeto faceMessages sin cambios) ... */ };
    
        // Función unificada para manejar la interacción
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
    
        // Añade los listeners a cada cara
        cubeFaces.forEach(face => {
            // Listener para el clic del ratón
            face.addEventListener('click', (event) => {
                const faceKey = event.currentTarget.dataset.face;
                handleFaceInteraction(faceKey);
            });
    
            // ¡NUEVO! Listener para el toque en pantallas táctiles
            face.addEventListener('touchstart', (event) => {
                event.preventDefault(); // Evita que se dispare un "clic fantasma"
                const faceKey = event.currentTarget.dataset.face;
                handleFaceInteraction(faceKey);
            });
        });
    }

    // === PART 10: AVATAR A.V.A. LOGIC (CON VISUALIZADOR DE BRILLO) ===

    const avaPlayButton = document.getElementById('ava-play-button');
    const avaImage = document.getElementById('ava-image');
    
    if (avaPlayButton && avaImage) {
        // --- 1. Preparación de los elementos de audio ---
        const audioWelcome = document.getElementById('ava-audio-welcome');
        const audioProblems = document.getElementById('ava-audio-problems');
        const audioAr = document.getElementById('ava-audio-ar');
        const allAvaAudios = [audioWelcome, audioProblems, audioAr];
    
        // --- 2. Preparación de la Web Audio API (se inicializará con el primer clic) ---
        let audioContext;
        let analyser;
        let sourceNode;
        let dataArray;
        let isAudioContextInitialized = false;
        let animationFrameId;
    
        // --- 3. La función del visualizador ---
        const visualizeGlow = () => {
            // Obtenemos los datos de frecuencia del audio en tiempo real
            analyser.getByteFrequencyData(dataArray);
            
            // Calculamos el volumen promedio en este instante
            let average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            
            // Mapeamos el volumen (0-128) a un tamaño de brillo (10px - 40px)
            const baseGlow = 10;
            const maxGlow = 45;
            const glowSize = baseGlow + (average / 128) * (maxGlow - baseGlow);
    
            // Aplicamos el nuevo brillo a la imagen del avatar
            avaImage.style.filter = `drop-shadow(0 0 ${glowSize}px #77FAFF)`;
    
            // Continuamos el bucle de animación
            animationFrameId = requestAnimationFrame(visualizeGlow);
        };
    
        // --- 4. Función para detener el visualizador ---
        const stopVisualizer = () => {
            cancelAnimationFrame(animationFrameId);
            // Devolvemos el brillo a su estado base suavemente
            avaImage.style.filter = 'drop-shadow(0 0 10px #00f6ff)';
        };
    
        // --- 5. Lógica del botón de Play/Pausa ---
        const handlePlay = () => {
            // LA CLAVE: La Web Audio API debe iniciarse con una interacción del usuario
            if (!isAudioContextInitialized) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                isAudioContextInitialized = true;
            }
    
            const currentPage = window.location.pathname.split('/').pop();
            let currentAudio;
        
            // Lógica reescrita para mayor claridad y robustez
            if (currentPage === 'arbol-de-problemas.html') {
                currentAudio = audioProblems;
            } else if (currentPage === 'app-ra.html') {
                currentAudio = audioAr;
            } else {
                // Si no es ninguna de las otras dos, ASUMIMOS que es la página de inicio
                currentAudio = audioWelcome;
            }
            // --- FIN DEL BLOQUE CORREGIDO ---
        
            if (!currentAudio) return;
        
            // Si el audio está pausado, lo reproducimos y activamos el visualizador
            if (currentAudio.paused) {
                // Conecta este audio específico a la Web Audio API si es la primera vez
                if (!currentAudio.sourceNode) {
                    currentAudio.sourceNode = audioContext.createMediaElementSource(currentAudio);
                    currentAudio.sourceNode.connect(analyser);
                    analyser.connect(audioContext.destination);
                }
                
                currentAudio.play();
                avaPlayButton.textContent = '■';
                visualizeGlow(); // Inicia la animación del brillo
            } else {
                // Si está sonando, lo pausamos y detenemos el visualizador
                currentAudio.pause();
                currentAudio.currentTime = 0;
                avaPlayButton.textContent = '▶';
                stopVisualizer(); // Detiene la animación del brillo
            }
    
            // Listener para cuando el audio termina por sí solo
            currentAudio.onended = () => {
                avaPlayButton.textContent = '▶';
                stopVisualizer();
            };
        };
    
        avaPlayButton.addEventListener('click', handlePlay);
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
}); // <-- El final del archivo
