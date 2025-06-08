const BASE = 'https://story-api.dicoding.dev/v1';

export default class StoryModel {
  static async fetchAll({ token, page = 1, size = 20, location = 1 }) {
    const res = await fetch(`${BASE}/stories?page=${page}&size=${size}&location=${location}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }

  static async fetchById(id, token) {
    const res = await fetch(`${BASE}/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }

  static async addStory({ token, description, file, lat, lon }) {
    const form = new FormData();
    form.append('description', description);
    form.append('photo', file);
    if (lat) form.append('lat', lat);
    if (lon) form.append('lon', lon);

    const res = await fetch(`${BASE}/stories`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    return res.json();
  }
}
