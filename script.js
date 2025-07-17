// Wait for the document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get all the interactive nodes
    const allNodes = document.querySelectorAll('.node');
    
    // Get the elements of our pop-up modal
    const modal = document.getElementById('hologram-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeModalButton = document.getElementById('close-modal');

    // Check if the modal exists before adding listeners
    if (modal) {
        // Function to open the modal and fill it with content
        const openModal = (node) => {
            // Get the title and description from the node's data-* attributes
            const title = node.getAttribute('data-title');
            const description = node.getAttribute('data-description');
            
            // Set the content in the modal
            modalTitle.textContent = title;
            modalDescription.innerHTML = description; // Use innerHTML to render the <strong> tag
            
            // Make the modal visible
            modal.classList.add('visible');
        };

        // Function to close the modal
        const closeModal = () => {
            modal.classList.remove('visible');
        };

        // Add a click listener to every node
        allNodes.forEach(node => {
            node.addEventListener('click', () => {
                openModal(node);
            });
        });

        // Add a click listener to the close button
        closeModalButton.addEventListener('click', closeModal);
        
        // Add a click listener to the overlay to close the modal as well
        modal.addEventListener('click', (event) => {
            // Only close if the click is on the overlay itself, not the content inside
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});

/* === MATRIX RAIN ANIMATION SCRIPT === */

// Also wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('matrix-canvas');
    // Only run the script if the canvas element exists on the page
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Set canvas to full screen size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // The characters that will be raining
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()';
        const charactersArray = characters.split('');

        // Configuration
        const fontSize = 16;
        const columns = canvas.width / fontSize; // Number of columns

        // Create an array to track the y-position of each raindrop in each column
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        // The main drawing function
        const draw = () => {
            // Fill the canvas with a semi-transparent black rectangle
            // This creates the fading trail effect for the characters
            ctx.fillStyle = 'rgba(10, 15, 43, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set the color and font for the characters
            ctx.fillStyle = '#00f6ff'; // Your theme's neon cyan color
            ctx.font = fontSize + 'px arial';

            // Loop through each column
            for (let i = 0; i < drops.length; i++) {
                // Pick a random character to draw
                const text = charactersArray[Math.floor(Math.random() * charactersArray.length)];
                
                // Draw the character
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Move the drop down for the next frame
                drops[i]++;

                // If a drop has reached the bottom, reset it to the top with a random chance
                // This makes the rain look more chaotic and less uniform
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
            }
        };

        // Start the animation loop
        setInterval(draw, 33);
    }
});
