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

        const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const charactersArray = characters.split('');
        const fontSize = 16;
        const columns = canvas.width / fontSize;

        const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    const draw = () => {
        // The semi-transparent background creates the fading trail effect
        ctx.fillStyle = 'rgba(10, 15, 43, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Loop through each column
        for (let i = 0; i < drops.length; i++) {
            // Pick a random character for the trail and the leader
            const trailChar = charactersArray[Math.floor(Math.random() * charactersArray.length)];
            const leaderChar = charactersArray[Math.floor(Math.random() * charactersArray.length)];

            // --- 1. DRAW THE TRAIL CHARACTER ---
            // This character is drawn one step behind the leader.
            // It has the standard color and no glow.
            ctx.font = fontSize + 'px arial';
            ctx.fillStyle = '#00f6ff'; // Standard cyan trail color
            ctx.shadowBlur = 0; // No glow
            ctx.shadowColor = 'transparent'; // No glow
            // We draw it at the previous position of the leader
            if (drops[i] > 1) { // Avoid drawing at y=0 on the first frame
                 ctx.fillText(trailChar, i * fontSize, (drops[i] - 1) * fontSize);
            }
            
            // --- 2. DRAW THE LEADING CHARACTER ---
            // This is the bright, glowing character at the front of the raindrop.
            ctx.fillStyle = '#ffffff'; // Bright white for the leader
            ctx.shadowColor = '#00f6ff'; // The color of the glow
            ctx.shadowBlur = 10; // The intensity of the glow
            ctx.fillText(leaderChar, i * fontSize, drops[i] * fontSize);


            // --- 3. UPDATE THE DROP POSITION ---
            // Move the drop down for the next frame
            drops[i]++;

            // Reset the drop to the top if it goes off-screen
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
    };

    setInterval(draw, 45);
}
