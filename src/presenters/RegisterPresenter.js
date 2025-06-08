import AuthModel from '../models/AuthModel.js';
export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
    this.view.bindRegister(this.handleRegister.bind(this));
  }
  async handleRegister(data) {
    this.view.setLoading(true);
    const res = await AuthModel.register(data);
    this.view.setLoading(false);
    if (!res.error) {
      this.view.showSuccess('Registrasi berhasil! Silakan login.');
      document.startViewTransition(() => {
        window.location.hash = '#/login';
      });
    } else {
      this.view.showError(res.message);
    }
  }
}
