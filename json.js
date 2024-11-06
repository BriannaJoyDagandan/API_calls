const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const imageGrid = document.getElementById('image-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const errorMessage = document.getElementById('error-message');

// Modal elements
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalTags = document.getElementById('modal-tags');
const modalLikes = document.getElementById('modal-likes');
const modalViews = document.getElementById('modal-views');
const modalDownloads = document.getElementById('modal-downloads');
const modalClose = document.getElementById('modal-close');

let currentPage = 1;
const perPage = 20;

async function fetchImages(query, page = 1) {
    const apiKey = '46929469-0c22b47c5c1aa355116447bbb';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        if (data.hits.length === 0) {
            errorMessage.textContent = 'No results found.';
            imageGrid.innerHTML = '';
        } else {
            displayImages(data.hits);
            errorMessage.textContent = '';
        }
    } catch (error) {
        console.error(error);
        errorMessage.textContent = 'Failed to load images.';
    }
}

function displayImages(images) {
    imageGrid.innerHTML = '';
    images.forEach(image => {
        const imageItem = document.createElement('div');
        imageItem.classList.add('image-item');

        imageItem.innerHTML = `
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        `;

        // Event listener for opening modal on image click
        imageItem.addEventListener('click', () => {
            openModal(image);
        });

        imageGrid.appendChild(imageItem);
    });
}

function openModal(image) {
    modal.style.display = 'flex';
    modalImage.src = image.webformatURL;
    modalTags.textContent = image.tags;
    modalLikes.textContent = image.likes;
    modalViews.textContent = image.views;
    modalDownloads.textContent = image.downloads;
}

// Close the modal when the close button is clicked
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close the modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

searchBtn.addEventListener('click', () => {
    currentPage = 1;
    fetchImages(searchInput.value, currentPage);
    prevBtn.disabled = true;
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchImages(searchInput.value, currentPage);
    prevBtn.disabled = false;
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchImages(searchInput.value, currentPage);
    }
    prevBtn.disabled = currentPage === 1;
});

prevBtn.disabled = true;

