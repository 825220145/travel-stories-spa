import StoryModel from '../models/StoryModel.js';

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.view.bindSubmit(this.handleSubmit.bind(this));
  }

  async handleSubmit({ description, file, lat, lon }) {
    this.view.setLoading(true);
    const token = localStorage.getItem('token');
    const res = await StoryModel.addStory({ token, description, file, lat, lon });
    this.view.setLoading(false);

    if (!res.error) {
      alert('Story berhasil dibuat!');
      document.startViewTransition(() => {
        window.location.hash = '#/stories';
      });
    } else {
      this.view.showError(res.message);
    }
  }
}
