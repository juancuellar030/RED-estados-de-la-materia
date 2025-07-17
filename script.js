// A SINGLE, UNIFIED 'DOMContentLoaded' LISTENER FOR ALL PAGE SCRIPTS
document.addEventListener('DOMContentLoaded', () => {

    // --- PART 1: MODAL LOGIC (for arbol-de-problemas.html) ---
    
    const allNodes = document.querySelectorAll('.node');
    const modal = document.getElementById('hologram-modal');
    
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
            node.addEventListener('click', () => { openModal(node); });
        });

        closeModalButton.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { closeModal(); }
        });
    }

    // --- PART 2: MATRIX RAIN ANIMATION (for all pages) ---

    const canvas = document.getElementById('matrix-canvas');
    
    if (canvas) { // The 'if' block starts here...
    
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
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
            
            for (let i = 0; i < drops.length; i++) {
                const trailChar = charactersArray[Math.floor(Math.random() * charactersArray.length)];
                const leaderChar = charactersArray[Math.floor(Math.random() * charactersArray.length)];

                // 1. Draw the standard trail character
                ctx.font = fontSize + 'px arial';
                ctx.fillStyle = '#00f6ff';
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                if (drops[i] > 1) {
                     ctx.fillText(trailChar, i * fontSize, (drops[i] - 1) * fontSize);
                }
                
                // 2. Draw the glowing leader character
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#00f6ff';
                ctx.shadowBlur = 10;
                ctx.fillText(leaderChar, i * fontSize, drops[i] * fontSize);

                // 3. Update drop position
                drops[i]++;
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
            }
        };

        setInterval(draw, 45);

    } // <-- ...and the 'if' block correctly closes here, wrapping all the animation logic.

}); // <-- This is the final closing brace for the DOMContentLoaded listener.
