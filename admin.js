document.addEventListener('DOMContentLoaded', function() {
    loadVideosFromFile();
    setupSearchFunctionality(); // Initialize search functionality
});

document.getElementById('video-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const videoUrl = document.getElementById('video-url').value;
    const videoTitle = document.getElementById('video-title').value;
    const videoId = extractVideoId(videoUrl);

    if (videoId) {
        addVideoToList(videoId, videoTitle);
        saveVideoToFile(videoId, videoTitle);
        document.getElementById('video-url').value = '';
        document.getElementById('video-title').value = '';
    } else {
        alert('Por favor, ingresa una URL válida de YouTube.');
    }
});

function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function saveVideoToFile(videoId, title) {
    fetch('/videos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoId, title })
    }).catch(error => console.error('Error al guardar el video:', error));
}

function loadVideosFromFile() {
    fetch('/videos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los videos');
            }
            return response.json();
        })
        .then(videos => {
            videos.forEach(video => addVideoToList(video.videoId, video.title));
        })
        .catch(error => console.error('Error al cargar los videos:', error));
}

function deleteVideo(videoId) {
    const adminPassword = prompt('Por favor, ingresa la contraseña de administrador:');
    if (adminPassword !== '156354') { // Replace 'admin123' with your actual admin password
        alert('Contraseña incorrecta. No tienes permiso para borrar este video.');
        return; // Exit the function without making a DELETE request
    }

    fetch(`/videos/${videoId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al borrar el video');
        }
        // Eliminar el video de la lista en la interfaz
        const videoElement = document.getElementById(videoId);
        if (videoElement) {
            videoElement.remove();
        }
        alert('Video borrado correctamente.');
    })
    .catch(error => {
        console.error('Error al borrar el video:', error);
        alert('Hubo un error al intentar borrar el video.');
    });
}

function addVideoToList(videoId, title) {
    const videoList = document.getElementById('video-list');
    videoList.classList.add('video-grid'); // Ensure the grid layout is applied

    const container = document.createElement('div');
    container.id = videoId; // Set the ID for easy removal

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    const videoTitle = document.createElement('h3');
    videoTitle.textContent = title;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Borrar';
    deleteButton.onclick = () => deleteVideo(videoId);

    container.appendChild(videoTitle);
    container.appendChild(iframe);
    container.appendChild(deleteButton);
    videoList.appendChild(container);
}

function setupSearchFunctionality() {
    const searchInput = document.getElementById('video-search');
    searchInput.addEventListener('input', function(event) {
        const query = event.target.value.toLowerCase();
        const videos = document.querySelectorAll('#video-list > div');

        videos.forEach(video => {
            const title = video.querySelector('h3').textContent.toLowerCase();
            if (title.includes(query)) {
                video.style.display = '';
            } else {
                video.style.display = 'none';
            }
        });
    });
}