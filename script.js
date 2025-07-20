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

    // Selecciona todos los elementos que deben tener sonido
    const interactiveElements = document.querySelectorAll('a, button, .node');

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
    
    // === PART 5: TYPEWRITER EFFECT (for index.html) (VERSIÓN FINAL Y ROBUSTA) ===
    
    const welcomeScreen = document.getElementById('welcome-screen');
    // Solo ejecuta esto si estamos en la página de bienvenida
    if (welcomeScreen) {
        const textElements = welcomeScreen.querySelectorAll('.typewriter-text');
        let originalTexts = [];
    
        // Guarda el texto original y limpia los elementos
        textElements.forEach(el => {
            originalTexts.push(el.textContent);
            el.textContent = '';
        });
    
        // Función que simula la escritura (sin cambios)
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
    
        // Función asíncrona para ejecutar la secuencia
        async function startTypingSequence() {
            for (let i = 0; i < textElements.length; i++) {
                const el = textElements[i];
                const text = originalTexts[i];
                el.style.visibility = 'visible';
                await typeWriter(el, text, 50);
                await new Promise(resolve => setTimeout(resolve, 200)); // Pausa entre líneas
            }
            
            const finalButton = document.querySelector('#welcome-screen .cta-button');
            if (finalButton) {
                finalButton.style.opacity = '1';
            }
        }
        
        // Oculta el botón al inicio
        const finalButton = document.querySelector('#welcome-screen .cta-button');
        if(finalButton) {
          finalButton.style.opacity = '0';
          finalButton.style.transition = 'opacity 0.5s';
        }
    
        // ¡LA SOLUCIÓN!
        // Usamos un temporizador simple y fiable. La animación de la pantalla
        // empieza a los 1.2s y dura 1s, terminando en 2.2s (2200ms).
        // Le damos un pequeño margen y empezamos a escribir a los 2300ms.
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
                title: "Cómo Empezar",
                body: "1. Descarga la app 'Delightex' en tu dispositivo. 2. Escanea el código QR que te proporcionaremos para nuestra escena. 3. Apunta a una superficie plana para proyectar la simulación."
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
                    messageBody.textContent = message.body;
    
                    // Muestra el panel con una animación
                    messageDisplay.classList.remove('visible'); // Resetea la animación
                    void messageDisplay.offsetWidth; // Truco para forzar el reseteo
                    messageDisplay.classList.add('visible');
                }
            });
        });
    }

    // === PART 9: 3D CUBE DRAG ROTATION ===

    const cubeScene = document.querySelector('.cube-scene');
    const cube = document.querySelector('.cube');
    
    // Solo ejecuta esto si el cubo existe
    if (cube && cubeScene) {
        let isDragging = false;
        let previousX, previousY;
        // Empezamos con la inclinación inicial del CSS
        let rotationX = 10; 
        let rotationY = 0;
    
        // --- Evento: Clic para empezar a arrastrar ---
        cubeScene.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Evita que se seleccione texto al arrastrar
            isDragging = true;
            previousX = e.clientX;
            previousY = e.clientY;
            
            // Detiene la animación automática y permite una rotación suave
            cube.classList.add('is-interactive');
        });
    
        // --- Evento: Mover el ratón mientras se arrastra ---
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return; // Si no estamos arrastrando, no hace nada
    
            const deltaX = e.clientX - previousX;
            const deltaY = e.clientY - previousY;
    
            // Ajusta los ángulos de rotación basados en cuánto se movió el ratón
            // El 0.5 es un factor de sensibilidad, puedes ajustarlo
            rotationY += deltaX * 0.5;
            rotationX -= deltaY * 0.5; // Invertido para una sensación natural
    
            // Aplica la nueva rotación al cubo
            cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    
            // Actualiza la posición anterior para el siguiente movimiento
            previousX = e.clientX;
            previousY = e.clientY;
        });
    
        // --- Evento: Soltar el clic para dejar de arrastrar ---
        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // --- Evento extra: Si el ratón sale de la ventana ---
        document.addEventListener('mouseleave', () => {
            isDragging = false;
        });
    }
}); // <-- El final del archivo
