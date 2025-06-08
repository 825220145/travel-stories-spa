import router from './router.js';
import './components/Header.js';
import './components/Footer.js';
import './css/styles.css';

// Menangani perubahan hash
window.addEventListener('load', () => {
  // Jika hash URL adalah #main-content, scroll langsung ke elemen dengan ID main-content
  if (window.location.hash === "#main-content") {
    document.querySelector('#main-content').scrollIntoView();
  } else {
    // Jika hash bukan #main-content, jalankan router untuk pengaturan tampilan lainnya
    router();
  }

  // Mendaftarkan service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker berhasil didaftarkan:', registration);
      })
      .catch((error) => {
        console.error('Pendaftaran Service Worker gagal:', error);
      });
  }

  // Meminta izin untuk push notification
  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Izin untuk push notification diberikan.');
      } else {
        console.log('Izin untuk push notification ditolak.');
      }
    });
  }
});

// Menangani perubahan hash URL
window.addEventListener('hashchange', () => {
  if (window.location.hash === "#main-content") {
    // Jika hash berubah menjadi #main-content, scroll langsung ke konten utama
    document.querySelector('#main-content').scrollIntoView();
  } else {
    // Jika hash berubah ke hash lain, jalankan router untuk menangani tampilan lain
    router();
  }
});
