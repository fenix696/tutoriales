document.addEventListener('DOMContentLoaded', function() {
    loadVideosFromFile();
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
    fetch('videos.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoId, title })
    }).catch(error => console.error('Error al guardar el video:', error));
}

function loadVideosFromFile() {
    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            videos.forEach(video => addVideoToList(video.videoId, video.title));
        })
        .catch(error => console.error('Error al cargar los videos:', error));
}

function addVideoToList(videoId, title) {
    const videoList = document.getElementById('video-list');
    videoList.classList.add('video-grid'); // Ensure the grid layout is applied

    const container = document.createElement('div');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    const videoTitle = document.createElement('h3');
    videoTitle.textContent = title;

    container.appendChild(videoTitle);
    container.appendChild(iframe);
    videoList.appendChild(container);
}