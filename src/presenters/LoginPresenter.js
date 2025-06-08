import AuthModel from '../models/AuthModel.js';
export default class LoginPresenter {
  constructor(view) {
    this.view = view;
    this.view.bindLogin(this.handleLogin.bind(this));
  }
  async handleLogin(credentials) {
    this.view.setLoading(true);
    const result = await AuthModel.login(credentials);
    this.view.setLoading(false);
    if (!result.error) {
      localStorage.setItem('token', result.loginResult.token);
      localStorage.setItem('userName', result.loginResult.name);
      document.startViewTransition(() => {
        window.location.hash = '#/stories';
      });
    } else {
      this.view.showError(result.message);
    }
  }
}
