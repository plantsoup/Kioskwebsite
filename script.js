// API endpoint base URL (same origin as the page)
const API_BASE = '';

let currentTrackId = null;
let lastTrackData = null; // Store last playing track

// DOM Elements
const albumArt = document.getElementById('albumArt');
const backgroundArt = document.getElementById('backgroundArt');
const trackTitle = document.getElementById('trackTitle');
const artistName = document.getElementById('artistName');
const albumName = document.getElementById('albumName');
const progressFill = document.getElementById('progressFill');
const timeElapsed = document.getElementById('timeElapsed');
const timeTotal = document.getElementById('timeTotal');
const statusIndicator = document.getElementById('statusIndicator');

// Get access token from server
async function getAccessToken() {
    try {
        const response = await fetch(`${API_BASE}/api/token`);
        if (!response.ok) {
            throw new Error('Failed to get access token');
        }
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        updateStatus('error', 'Connection Error');
        return null;
    }
}

// Format time in MM:SS
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// Update status indicator
function updateStatus(type, text) {
    statusIndicator.className = `status-indicator ${type}`;
    statusIndicator.querySelector('.status-text').textContent = text;
}

// Update the display with track information
function updateDisplay(trackData) {
    if (!trackData || !trackData.is_playing) {
        // No track currently playing - show last track
        if (lastTrackData && lastTrackData.item) {
            const lastTrack = lastTrackData.item;
            trackTitle.textContent = lastTrack.name;
            artistName.textContent = lastTrack.artists.map(a => a.name).join(', ');
            albumName.textContent = lastTrack.album.name;
            
            // Keep the last album art
            const artUrl = lastTrack.album.images[0]?.url || '';
            if (albumArt.src !== artUrl && artUrl) {
                albumArt.src = artUrl;
                backgroundArt.style.backgroundImage = `url(${artUrl})`;
            }
            
            // Show progress at 100% for last track
            progressFill.style.width = '100%';
            const duration = lastTrack.duration_ms || 0;
            timeElapsed.textContent = formatTime(duration);
            timeTotal.textContent = formatTime(duration);
            updateStatus('error', 'Paused');
            return;
        } else {
            // No track and no last track
            trackTitle.textContent = 'No Track Playing';
            artistName.textContent = '—';
            albumName.textContent = '—';
            albumArt.src = '';
            backgroundArt.style.backgroundImage = '';
            progressFill.style.width = '0%';
            timeElapsed.textContent = '0:00';
            timeTotal.textContent = '0:00';
            updateStatus('error', 'Paused');
            return;
        }
    }

    const track = trackData.item;
    if (!track) return;
    
    // Store this as the last playing track
    lastTrackData = trackData;

    // Update track info
    trackTitle.textContent = track.name;
    artistName.textContent = track.artists.map(a => a.name).join(', ');
    albumName.textContent = track.album.name;

    // Update album art
    const artUrl = track.album.images[0]?.url || '';
    if (albumArt.src !== artUrl) {
        albumArt.src = artUrl;
        backgroundArt.style.backgroundImage = artUrl ? `url(${artUrl})` : '';
    }

    // Update progress
    const progress = trackData.progress_ms || 0;
    const duration = track.duration_ms || 0;
    const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
    
    progressFill.style.width = `${progressPercent}%`;
    timeElapsed.textContent = formatTime(progress);
    timeTotal.textContent = formatTime(duration);

    // Update status
    updateStatus('', 'Playing');
}

// Get currently playing track
async function getCurrentlyPlaying() {
    try {
        const response = await fetch(`${API_BASE}/api/currently-playing`);
        
        if (response.status === 204 || response.status === 200) {
            const data = response.status === 204 ? null : await response.json();
            updateDisplay(data);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching currently playing:', error);
        updateStatus('error', 'Connection Error');
    }
}

// Update progress bar smoothly
function updateProgress() {
    // This is called frequently to update the progress bar smoothly
    // The actual data comes from the API call
}

// Initialize
async function init() {
    // Get initial track
    await getCurrentlyPlaying();

    // Update every 2 seconds
    setInterval(getCurrentlyPlaying, 2000);
    
    // Update progress bar every 500ms for smooth animation
    setInterval(updateProgress, 500);
}

// Prevent all user interactions
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.key !== 'F5') e.preventDefault();
});
document.addEventListener('click', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

// Start the app
init();
