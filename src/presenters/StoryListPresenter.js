import StoryModel from '../models/StoryModel.js';

export default class StoryListPresenter {
  constructor(view) {
    this.view = view;
    this.view.bindFetch(this.fetchStories.bind(this));
    this.view.bindDelete(this.handleDelete.bind(this));
  }

  async fetchStories(params) {
    this.view.setLoading(true);
    const token = localStorage.getItem('token');
    const res = await StoryModel.fetchAll({ token, ...params });
    this.view.setLoading(false);
    if (!res.error) {
      this.view.renderList(res.listStory);
    } else {
      this.view.showError(res.message);
    }
  }

  async handleDelete(id) {
    if (!confirm('Yakin ingin menghapus story ini?')) return;

    // hanya tombol delete yang loading
    this.view.toggleDeleteButton(id, true);
    let isDeleted = false;
    try {
      const token = localStorage.getItem('token');
      const res = await StoryModel.deleteStory(id, token);
      if (!res.error) {
        isDeleted = true;
      } else {
        this.view.showError(res.message);
      }
    } catch (err) {
      this.view.showError('Gagal ke server: ' + err.message);
    } finally {
      this.view.toggleDeleteButton(id, false);
      if (isDeleted) {
        this.view.removeStoryLocal(id);
      }
    }
  }
}
