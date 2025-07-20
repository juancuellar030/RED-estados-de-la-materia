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
}); // <-- El final del archivo
