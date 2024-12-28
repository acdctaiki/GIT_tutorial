// Modal functionality for gallery
const galleryImages = document.querySelectorAll('.gallery img');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');

// Open modal on image click
galleryImages.forEach(image => {
    image.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = image.src;
        modalImg.alt = image.alt;
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal on background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
