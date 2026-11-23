import '../components/ui/app-button';
import '../components/ui/ph-icon';

import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { baseStyles } from '../design/base-styles';

@customElement("playground-page")
export class PlaygroundPage extends LitElement {

  static styles = [baseStyles, css`
    
    section {
      margin-bottom: var(--space-8);
    }
    h2 {
      font-family: var(--font-title);
    }
    .row {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }
  `];

  render() {
    return html`
      <section>
        <h2>Botones</h2>
        <div class="row">
          <app-button>Guardar</app-button>
          <app-button variant="dark">Login</app-button>
          <app-button variant="outline">Cancelar</app-button>
          <app-button variant="danger">
            <ph-icon slot="icon" name="trash"></ph-icon> Eliminar
          </app-button>
          <app-button variant="ghost">Ghost</app-button>
          <app-button loading>Cargando</app-button>
          <app-button disabled>Deshabilitado</app-button>
        </div>
      </section>
    `;
  }
}
