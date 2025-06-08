import { getAllStories, saveStory, deleteStory } from '../indexedDB.js'; // Import IndexedDB functions

export default class StoryListView {
    constructor() {
      this.app = document.getElementById('main-content');
      this.markerMap = {};
    }

    get template() {
      return `
        <section class="container" aria-labelledby="stories-title">
          <h2 id="stories-title">Daftar Story</h2>
          <button id="add-btn" class="btn btn-primary">
            <i class="fa-solid fa-plus"></i> Tambah Story
          </button>
          <div id="map" style="height:300px;margin:1rem 0;"></div>
          <ul id="story-list" class="story-list"></ul>
          <p id="error-msg" role="alert" style="color:red;"></p>
        </section>`;
    }

    render() {
      this.app.innerHTML = this.template;
      this._list  = this.app.querySelector('#story-list');
      this._error = this.app.querySelector('#error-msg');
      this._map   = L.map('map').setView([0, 0], 2);

      const osm  = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OSM' }).addTo(this._map);
      const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',{ attribution:'© OTM' });
      L.control.layers({ OSM: osm, Topo: topo }).addTo(this._map);

      this.app.querySelector('#add-btn').addEventListener('click', () => {
        document.startViewTransition(() => {
          window.location.hash = '#/add';
        });
      });

      this.onFetch({});
    }

    bindFetch(cb)  { this.onFetch  = cb; }
    bindDelete(cb) { this.onDelete = cb; }

    setLoading(isLoading) {
      this._list.innerHTML = isLoading
        ? '<li class="story-item">Loading…</li>'
        : '';
    }

    // Update renderList untuk menambahkan data dari IndexedDB
    async renderList(stories) {
      Object.values(this.markerMap).forEach(m => this._map.removeLayer(m));
      this.markerMap = {};
      this._list.innerHTML = '';

      if (stories.length === 0) {
        this._error.textContent = "Tidak ada cerita untuk ditampilkan.";
      }

      stories.forEach(s => {
        const dateText   = new Date(s.createdAt).toLocaleDateString();
        const coordsText = (s.lat && s.lon)
          ? `(${s.lat.toFixed(2)}, ${s.lon.toFixed(2)})`
          : '–';

        const li = document.createElement('li');
        li.className = 'story-item';
        li.innerHTML = `
          <img src="${s.photoUrl}" alt="Foto oleh ${s.name}" />
          <p class="author">Oleh: ${s.name}</p>
          <p class="date">📅 ${dateText}</p>
          <p class="coords">📍 ${coordsText}</p>
          <p class="desc">${s.description.slice(0, 100)}…</p>
          <div class="btn-group">
            <button data-id="${s.id}" class="btn-detail btn btn-secondary">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button data-id="${s.id}" class="btn-delete btn btn-danger">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>`;
        this._list.appendChild(li);

        if (s.lat && s.lon) {
          const marker = L.marker([s.lat, s.lon])
            .addTo(this._map)
            .bindPopup(`<b>${s.title}</b><p>${s.description.slice(0,50)}…</p>`);
          this.markerMap[s.id] = marker;
        }

        li.querySelector('.btn-detail').addEventListener('click', () => {
          document.startViewTransition(() => {
            window.location.hash = `#/stories/${s.id}`;
          });
        });
        li.querySelector('.btn-delete').addEventListener('click', async () => {
          this.onDelete(s.id);
          await deleteStory(s.id);  // Hapus dari IndexedDB
        });
      });
    }

    toggleDeleteButton(id, isLoading) {
      const btn = this._list.querySelector(`.btn-delete[data-id="${id}"]`);
      if (!btn) return;
      if (isLoading) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled  = true;
      } else {
        btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        btn.disabled  = false;
      }
    }

    removeStoryLocal(id) {
      const btn = this._list.querySelector(`.btn-delete[data-id="${id}"]`);
      if (btn) btn.closest('.story-item').remove();
      const marker = this.markerMap[id];
      if (marker) {
        this._map.removeLayer(marker);
        delete this.markerMap[id];
      }
    }

    showError(msg) {
      this._error.textContent = msg;
    }
  }
