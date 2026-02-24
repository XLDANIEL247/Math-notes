// Tab System
function openTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Emergency Tab Cloaker (Press 'Esc' to hide)
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    window.location.replace("https://classroom.google.com");
  }
});

// Proxy Logic
const stockSW = '/uv/sw.js';
const swContainer = navigator.serviceWorker;

function launchURL(url) {
  // Encodes the URL so filters can't read it
  document.getElementById('uv-iframe').src = __uv$config.prefix + __uv$config.encodeUrl(url);
}
