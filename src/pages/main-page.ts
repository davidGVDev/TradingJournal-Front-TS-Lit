import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { baseStyles } from '../design/base-styles';
import { auth } from '../state/auth-store';
import '../components/ui/app-button';

@customElement('main-page')
export class MainPage extends LitElement {
  static styles = [baseStyles, css`
    :host { display: block; min-height: 100vh; }
    header {
      display: flex; justify-content: space-between; align-items: center;
      height: 64px; padding: 0 var(--space-6);
      border-bottom: 1px solid var(--color-border);
    }
    strong { font: 700 1.25rem var(--font-title); }
    main { padding: var(--space-6); }
  `];

  render() {
    return html`
      <header>
        <strong>Trading Journal</strong>
        <app-button variant="outline" @click=${() => auth.logout()}>Salir</app-button>
      </header>
      <main>
        <h1>Main page</h1>
        <p>Hola, ${auth.user?.nombres}</p>
      </main>
    `;
  }
}