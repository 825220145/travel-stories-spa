export default class LoginView {
  constructor() {
    this.app = document.getElementById('main-content');
  }
  get template() {
    return `
      <section class="auth-container" role="region" aria-labelledby="login-title">
        <div class="auth-header"><h2 id="login-title">Welcome Back</h2></div>
        <form id="login-form" class="auth-form" novalidate>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required aria-required="true" />
          </div>
          <div class="form-group" style="position:relative;">
            <label for="password">Password</label>
            <input type="password" id="password" required minlength="8" />
            <span class="toggle-password" aria-label="Toggle password visibility"><i class="fa-solid fa-eye"></i></span>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
          <p class="helper-text">Belum punya akun? <a href="#/register">Register di sini</a></p>
          <p id="error-msg" role="alert"></p>
        </form>
      </section>`;
  }
  render() {
    this.app.innerHTML = this.template;
    this._email = this.app.querySelector('#email');
    this._password = this.app.querySelector('#password');
    this._form = this.app.querySelector('#login-form');
    this._error = this.app.querySelector('#error-msg');
    this._toggle = this.app.querySelector('.toggle-password');
    this._addListeners();
  }
  _addListeners() {
    this._toggle.addEventListener('click', () => {
      this._password.type = this._password.type === 'password' ? 'text' : 'password';
    });
    this._form.addEventListener('submit', e => {
      e.preventDefault();
      this.onLogin({ email: this._email.value.trim(), password: this._password.value });
    });
  }
  bindLogin(cb) { this.onLogin = cb; }
  setLoading(l) {
    this._form.querySelector('button').textContent = l ? 'Loading…' : 'Login';
  }
  showError(msg) { this._error.textContent = msg; }
}
