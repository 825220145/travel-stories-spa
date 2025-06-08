export default class AddStoryView {
  constructor() {
    this.app = document.getElementById('main-content');
    this.stream = null;
    this.capturedBlob = null;
  }

  get template() {
    return `
      <section class="container" aria-labelledby="add-title">
        <!-- Skip to Content link -->
        <a href="#main-content" class="skip-to-content">Skip to Content</a>

        <button id="back-btn" class="btn">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <h2 id="add-title">Tambah Story</h2>

        <!-- CAMERA UI -->
        <div class="camera-container" style="margin-bottom:1rem;">
          <video id="video" autoplay playsinline style="display:none; width:100%; border-radius:4px;"></video>
          <img id="preview" style="display:none; width:100%; border-radius:4px;" alt="Preview foto" />
        </div>
        <div class="capture-controls" style="display:flex; gap:.5rem; margin-bottom:1rem;">
          <button type="button" id="start-camera" class="btn btn-secondary">
            <i class="fa-solid fa-camera"></i> Buka Kamera
          </button>
          <button type="button" id="capture-btn" class="btn btn-secondary" disabled>
            <i class="fa-solid fa-circle"></i> Ambil Foto
          </button>
        </div>

        <form id="add-form" novalidate>
          <div class="form-group">
            <label for="desc">Deskripsi</label>
            <textarea id="desc" required></textarea>
          </div>
          <div class="form-group">
            <label for="photo-file">Atau pilih file (max 1MB)</label>
            <input type="file" id="photo-file" accept="image/*" />
          </div>

          <div class="form-group">
            <label for="coords-info">Koordinat (klik peta)</label>
            <p id="coords-info">Belum ada lokasi</p>
          </div>
          <div id="map-add" style="height:300px;margin:1rem 0;"></div>

          <input type="hidden" id="lat" />
          <input type="hidden" id="lon" />

          <button type="submit" class="btn btn-primary">Submit</button>
          <p id="error-msg" role="alert" style="color:red; margin-top:.5rem;"></p>
        </form>
      </section>
    `;
  }

  render() {
    this.app.innerHTML = this.template;

    // Kamera
    this.video = this.app.querySelector('#video');
    this.preview = this.app.querySelector('#preview');
    this.btnStart = this.app.querySelector('#start-camera');
    this.btnCapture = this.app.querySelector('#capture-btn');

    // Form
    this._form = this.app.querySelector('#add-form');
    this._desc = this.app.querySelector('#desc');
    this._fileInput = this.app.querySelector('#photo-file');
    this._lat = this.app.querySelector('#lat');
    this._lon = this.app.querySelector('#lon');
    this._coords = this.app.querySelector('#coords-info');
    this._error = this.app.querySelector('#error-msg');
    this._submitBtn = this._form.querySelector('button[type="submit"]');
    this._back = this.app.querySelector('#back-btn');

    // Map
    this._map = L.map('map-add').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this._map);

    let marker;
    this._map.on('click', e => {
      if (marker) this._map.removeLayer(marker);
      marker = L.marker(e.latlng).addTo(this._map);
      this._setCoords(e.latlng.lat, e.latlng.lng);
    });

    // Lokasi otomatis
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        this._map.setView([latitude, longitude], 13);
        this._setCoords(latitude, longitude);
        L.marker([latitude, longitude]).addTo(this._map);
      }, () => {
        this.showError('Tidak bisa mendapatkan lokasi otomatis.');
      });
    }

    // Event
    this._back.addEventListener('click', () => {
      // Hentikan kamera saat kembali
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }

      // Navigasi ke halaman lain
      document.startViewTransition(() => {
        window.location.hash = '#/stories';
      });
    });

    this.btnStart.addEventListener('click', this.startCamera.bind(this));
    this.btnCapture.addEventListener('click', this.capturePhoto.bind(this));
    this._form.addEventListener('submit', e => {
      e.preventDefault();
      const description = this._desc.value.trim();
      let file;
      if (this.capturedBlob) {
        file = new File([this.capturedBlob], 'photo.jpg', { type: 'image/jpeg' });
      } else {
        file = this._fileInput.files[0];
      }

      if (!description) return this.showError('Deskripsi wajib diisi.');
      if (!file || file.size > 1_000_000) {
        return this.showError('Pilih foto valid maksimal 1MB.');
      }
      if (!this._lat.value || !this._lon.value) {
        return this.showError('Klik peta untuk memilih koordinat.');
      }

      this.onSubmit({
        title: '', // karena API tetap butuh title
        description,
        file,
        lat: this._lat.value,
        lon: this._lon.value,
      });
    });

    // Nonaktifkan kamera saat berpindah halaman
    window.onbeforeunload = () => {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
    };
  }

  // Fungsi untuk mengaktifkan kamera
  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.srcObject = this.stream;
      this.video.style.display = 'block';
      this.preview.style.display = 'none';
      this.btnCapture.disabled = false;
      this.btnStart.disabled = true;
    } catch (err) {
      this.showError('Gagal mengakses kamera: ' + err.message);
    }
  }

  capturePhoto() {
    if (!this.stream) return;

    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0);
    canvas.toBlob(blob => {
      this.capturedBlob = blob;
      this.preview.src = URL.createObjectURL(blob);
      this.preview.style.display = 'block';
      this.video.style.display = 'none';
      
      // Hentikan stream setelah foto diambil
      this.stream.getTracks().forEach(t => t.stop());
      this.btnCapture.disabled = true;
      this.btnStart.disabled = false;
    }, 'image/jpeg', 0.9);
  }

  _setCoords(lat, lon) {
    this._lat.value = lat;
    this._lon.value = lon;
    this._coords.textContent = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }

  setLoading(isLoading) {
    this._submitBtn.textContent = isLoading ? 'Loading…' : 'Submit';
    this._submitBtn.disabled = isLoading;
  }

  bindSubmit(cb) {
    this.onSubmit = cb;
  }

  showError(msg) {
    this._error.textContent = msg;
  }
}
