import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { auth } from './state/auth-store';
import './pages/login-page';
import './pages/main-page';
import './playground/playground-page';

@customElement('app-root')
export class AppRoot extends LitElement {
  @state() private logged = auth.isAuthenticated;

  private sync = () => { this.logged = auth.isAuthenticated; };

  connectedCallback() {
    super.connectedCallback();
    auth.addEventListener('change', this.sync);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    auth.removeEventListener('change', this.sync);
  }

  render() {
    // Atajo de desarrollo: localhost:5173/?playground
    if (location.search.includes('playground')) return html`<playground-page></playground-page>`;

    return this.logged
      ? html`<main-page></main-page>`
      : html`<login-page></login-page>`;
  }
}