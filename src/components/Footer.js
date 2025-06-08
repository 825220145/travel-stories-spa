class FooterComponent extends HTMLElement {
    connectedCallback() {
      const year = new Date().getFullYear();
      this.innerHTML = `
        <footer role="contentinfo">
          <p>&copy; ${year} Travel Stories. All rights reserved.</p>
        </footer>
      `;
    }
  }
  customElements.define('footer-component', FooterComponent);
  