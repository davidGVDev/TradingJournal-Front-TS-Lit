import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { baseStyles } from '../design/base-styles';
import { auth } from '../state/auth-store';
import '../components/ui/app-button';

@customElement('login-page')
export class LoginPage extends LitElement {
  static styles = [baseStyles, css`
    :host {
      display: grid; place-items: center;
      min-height: 100vh; padding: var(--space-4);
      background: var(--color-surface);
    }
    .card {
      display: grid; grid-template-columns: 1fr 1fr;
      width: min(900px, 100%); min-height: 540px;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }
    .side { display: grid; align-content: center; gap: var(--space-4); padding: var(--space-8); }
    .cover { background: var(--color-border); }
    h1 { font: 700 1.8rem var(--font-title); text-align: center; }
    p { text-align: center; font-style: italic; color: var(--color-text-muted); }

    @media (max-width: 720px) {
      .card { grid-template-columns: 1fr; }
      .cover { display: none; }
    }
  `];

  private fakeLogin() {
    auth.login({
      token: 'dev-token',
      user: { id: '1', email: 'trader@gmail.com', nombres: 'David', apellidos: 'Ventura', role: 'ADMIN' },
    });
  }

  render() {
    return html`
      <div class="card">
        <div class="side">
          <h1>Bienvenido Trader</h1>
          <p>"Un nuevo día es una nueva oportunidad"</p>
          <app-button variant="dark" block @click=${this.fakeLogin}>Entrar (temporal)</app-button>
        </div>
        <div class="cover"></div>
      </div>
    `;
  }
}