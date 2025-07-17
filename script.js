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