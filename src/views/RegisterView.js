export default class RegisterView {
  constructor() { this.app = document.getElementById('main-content'); }
  get template() {
    return `
      <section class="auth-container" role="region" aria-labelledby="reg-title">
        <div class="auth-header register"><h2 id="reg-title">Create Account</h2></div>
        <form id="register-form" class="auth-form" novalidate>
          <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" id="name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div class="form-group" style="position:relative;">
            <label for="password">Password</label>
            <input type="password" id="password" required minlength="8" />
            <span class="toggle-password" aria-label="Toggle password visibility"><i class="fa-solid fa-eye"></i></span>
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
          <p class="helper-text">Sudah punya akun? <a href="#/login">Login di sini</a></p>
          <p id="error-msg" role="alert"></p>
          <p id="success-msg" role="status" style="color:green"></p>
        </form>
      </section>`;
  }
  render() {
    this.app.innerHTML = this.template;
    this._name = this.app.querySelector('#name');
    this._email = this.app.querySelector('#email');
    this._password = this.app.querySelector('#password');
    this._form = this.app.querySelector('#register-form');
    this._error = this.app.querySelector('#error-msg');
    this._success = this.app.querySelector('#success-msg');
    this._toggle = this.app.querySelector('.toggle-password');
    this._addListeners();
  }
  _addListeners() {
    this._toggle.addEventListener('click', () => {
      this._password.type = this._password.type === 'password' ? 'text' : 'password';
    });
    this._form.addEventListener('submit', e => {
      e.preventDefault();
      this.onRegister({
        name: this._name.value.trim(),
        email: this._email.value.trim(),
        password: this._password.value,
      });
    });
  }
  bindRegister(cb) { this.onRegister = cb; }
  setLoading(l) {
    this._form.querySelector('button').textContent = l ? 'Loading…' : 'Register';
  }
  showError(msg) { this._error.textContent = msg; this._success.textContent=''; }
  showSuccess(msg) { this._success.textContent = msg; this._error.textContent=''; }
}
