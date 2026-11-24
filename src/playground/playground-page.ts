import '../components/ui/app-button';
import '../components/ui/ph-icon';
import '../components/ui/inputs/app-input-text';
import '../components/ui/inputs/app-input-number';

import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../design/base-styles';

@customElement('playground-page')
export class PlaygroundPage extends LitElement {
  static styles = [baseStyles, css`
    :host { display: block; padding: var(--space-8); }
    section { margin-bottom: var(--space-8); }
    h2 { font-family: var(--font-title); margin-bottom: var(--space-3); }
    .row { display: flex; gap: var(--space-3); flex-wrap: wrap; }
    .grid {
      display: grid; gap: var(--space-4);
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      margin-bottom: var(--space-4);
    }
    pre {
      margin-top: var(--space-4); padding: var(--space-4);
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-md); font-size: .85rem; overflow: auto;
    }
  `];

  @state() private output = '';

  private onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
    this.output = JSON.stringify(data, null, 2);
  }

  @property() textError = "Error externo, verifica el valor";

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

      <section>
        <h2>Input texto</h2>
        <div class="grid">
          <app-input-text label="Normal" placeholder="Escribe algo"></app-input-text>
          <app-input-text label="Con valor" value="David"></app-input-text>
          <app-input-text label="Obligatorio" required hint="Aparece un * en la etiqueta"></app-input-text>
          <app-input-text label="Error externo" value="trader01" error=${this.textError}></app-input-text>
          <app-input-text label="Deshabilitado" value="No editable" disabled></app-input-text>
          <app-input-text label="Solo lectura" value="Solo lectura" readonly></app-input-text>
          <app-input-text label="Correo" type="email" placeholder="trader@gmail.com" required></app-input-text>
          <app-input-text
            label="Contraseña" type="password" required minlength="8"
            pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
            pattern-message="Mínimo 8 caracteres, una mayúscula y un carácter especial"
            hint="Mín. 8, una mayúscula y un especial"></app-input-text>
        </div>
      </section>

      <section>
        <h2>Input número</h2>
        <div class="grid">
          <app-input-number label="Puntos obtenidos" hint="2 decimales por defecto"></app-input-number>
          <app-input-number label="Con límites (0 a 10)" min="0" max="10" value="3.00" required></app-input-number>
          <app-input-number label="Enteros" decimals="0" placeholder="Contratos"></app-input-number>
          <app-input-number label="Paso de 0.25" step="0.25" hint="Tick del ES"></app-input-number>
          <app-input-number label="Deshabilitado" value="5.00" disabled></app-input-number>
        </div>
      </section>

      <section>
        <h2>Formulario de prueba</h2>
        <form @submit=${this.onSubmit}>
          <div class="grid">
            <app-input-text name="usuario" label="Usuario" required minlength="3"></app-input-text>
            <app-input-text name="correo" label="Correo" type="email" required></app-input-text>
            <app-input-number name="stop" label="Tamaño del stop" required min="0"></app-input-number>
            <app-input-number name="puntos" label="Puntos obtenidos"></app-input-number>
          </div>
          <div class="row">
            <app-button type="submit">Enviar</app-button>
            <app-button type="reset" variant="outline">Limpiar</app-button>
          </div>
        </form>
        <pre>${this.output || 'Aquí aparece lo que enviaría el formulario'}</pre>
      </section>
    `;
  }
}