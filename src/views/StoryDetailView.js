export default class StoryDetailView {
    constructor() { this.app = document.getElementById('main-content'); }
  
    get template() {
      return `
        <section class="container" aria-labelledby="detail-title">
          <button id="back-btn" class="btn">
            <i class="fa-solid fa-arrow-left"></i> Kembali
          </button>
          <h2 id="detail-title">Detail Story</h2>
          <div id="map-detail" style="height:300px;margin:1rem 0;"></div>
          <article id="story-detail" class="story-detail"></article>
          <p id="error-msg" role="alert" style="color:red;"></p>
        </section>`;
    }
  
    render() {
      this.app.innerHTML = this.template;
      this._back   = this.app.querySelector('#back-btn');
      this._detail = this.app.querySelector('#story-detail');
      this._error  = this.app.querySelector('#error-msg');
      this._map    = L.map('map-detail').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'' })
        .addTo(this._map);
  
      this._back.addEventListener('click', () => {
        document.startViewTransition(() => window.history.back());
      });
  
      const id = window.location.hash.split('/')[2];
      this.onFetch(id);
    }
  
    bindFetch(cb) { this.onFetch = cb; }
  
    setLoading(isLoading) {
      this._detail.innerHTML = isLoading ? '<p>Loading…</p>' : '';
    }
  
    renderStory(s) {
      const date = new Date(s.createdAt).toLocaleString();
      this._detail.innerHTML = `
        <h3>${s.title}</h3>
        <h4>Oleh: ${s.name}</h4>
        <img src="${s.photoUrl}" alt="Foto oleh ${s.name}" />
        <p>${s.description}</p>
        <p><small>📅 ${date}</small></p>`;
      if (s.lat && s.lon) {
        this._map.setView([s.lat, s.lon], 13);
        L.marker([s.lat, s.lon]).addTo(this._map).bindPopup(s.title).openPopup();
      }
    }
  
    showError(msg) { this._error.textContent = msg; }
  }
  