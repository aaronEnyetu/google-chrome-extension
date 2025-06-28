document.addEventListener('DOMContentLoaded', () => {
  const videoListDiv = document.getElementById('videoList');
  const addVideoForm = document.getElementById('addVideoForm');
  const videoUrlInput = document.getElementById('videoUrl');
  const videoTitleInput = document.getElementById('videoTitle');

  function renderVideos(videos) {
    videoListDiv.innerHTML = '';
    videos.forEach((video, idx) => {
      const div = document.createElement('div');
      div.className = 'video-item';
      div.innerHTML = `
        <a href="${video.url}" target="_blank">${video.title}</a>
        <button data-idx="${idx}" class="remove-btn">Remove</button>
      `;
      videoListDiv.appendChild(div);
    });
    // Add remove event listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        removeVideo(idx);
      });
    });
  }

  function loadVideos() {
    chrome.storage.local.get({ videos: [] }, (result) => {
      renderVideos(result.videos);
    });
  }

  function saveVideos(videos) {
    chrome.storage.local.set({ videos }, loadVideos);
  }

  function addVideo(video) {
    chrome.storage.local.get({ videos: [] }, (result) => {
      const videos = result.videos;
      videos.push(video);
      saveVideos(videos);
    });
  }

  function removeVideo(idx) {
    chrome.storage.local.get({ videos: [] }, (result) => {
      const videos = result.videos;
      videos.splice(idx, 1);
      saveVideos(videos);
    });
  }

  addVideoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = videoUrlInput.value.trim();
    const title = videoTitleInput.value.trim();
    if (url && title) {
      addVideo({ url, title });
      videoUrlInput.value = '';
      videoTitleInput.value = '';
    }
  });

  loadVideos();
});
