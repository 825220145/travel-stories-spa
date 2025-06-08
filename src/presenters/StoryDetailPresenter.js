import StoryModel from '../models/StoryModel.js';
export default class StoryDetailPresenter {
  constructor(view) {
    this.view = view;
    this.view.bindFetch(this.fetchDetail.bind(this));
  }
  async fetchDetail(id) {
    this.view.setLoading(true);
    const token = localStorage.getItem('token');
    const res = await StoryModel.fetchById(id, token);
    this.view.setLoading(false);
    if (!res.error) {
      this.view.renderStory(res.story);
    } else {
      this.view.showError(res.message);
    }
  }
}
