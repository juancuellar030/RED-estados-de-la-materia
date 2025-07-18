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

}); // <-- El final del archivo
