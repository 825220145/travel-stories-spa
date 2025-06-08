class HeaderComponent extends HTMLElement {
    connectedCallback() {
      this.render();
    }
  
    render() {
      const name = localStorage.getItem('userName');
      this.innerHTML = `
        <header role="banner">
          <h1><i class="fa-solid fa-plane-departure"></i> Travel Stories</h1>
          ${name ? `
            <div class="header-actions">
              <span class="welcome">Hi, ${name}</span>
              <button id="logout-btn" class="btn btn-secondary">Logout</button>
            </div>
          ` : ''}
        </header>
      `;
      if (name) {
        this.querySelector('#logout-btn').addEventListener('click', () => {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          window.location.hash = '#/login';
        });
      }
    }
  }
  customElements.define('header-component', HeaderComponent);
  