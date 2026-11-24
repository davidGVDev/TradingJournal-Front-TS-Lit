import '../components/ui/app-button';
import '../components/ui/ph-icon';
import '../components/ui/inputs/app-input-text';
import '../components/ui/inputs/app-input-number';
import '../components/ui/inputs/app-input-check';
import '../components/ui/inputs/app-input-switch';
import '../components/ui/inputs/app-input-radio';
import '../components/ui/inputs/app-input-select';
import '../components/ui/inputs/app-input-combobox';

import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../design/base-styles';

const GENDERS = [
  { value: 'male', label: 'Hombre' },
  { value: 'female', label: 'Mujer' },
  { value: 'other', label: 'Otro' },
];
const COUNTRIES = [
  { value: 'mx', label: 'México' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'ca', label: 'Canadá' },
  { value: 'uk', label: 'Reino Unido' },
  { value: 'au', label: 'Australia' },
];
const USERS = [
  { value: '1', label: 'Liam Johnson Smith', description: 'liam.johnson@gmail.com' },
  { value: '2', label: 'David Gustavo Ventura Villesca', description: 'david38ing@gmail.com' },
  { value: '3', label: 'Ana García López', description: 'ana.garcia@gmail.com' },
  { value: '4', label: 'Carlos Méndez Ruiz', description: 'carlos.mendez@gmail.com' },
  { value: '5', label: 'Sofía Hernández Cruz', description: 'sofia.hernandez@gmail.com' },
  { value: '6', label: 'Mateo Ramírez Soto', description: 'mateo.ramirez@gmail.com' },
  { value: '7', label: 'Valentina Torres Díaz', description: 'valentina.torres@gmail.com' },
  { value: '8', label: 'Diego Castillo Vega', description: 'diego.castillo@gmail.com' },
];

const USERS_PARTIAL = USERS.map((u) => (u.value === '3' ? { ...u, disabled: true } : u));

const SETUPS = ['Back macro', 'Contratendencia', 'Definido', 'Reingreso', 'Resistencia macro', 'Soporte macro', 'Sin operación']
  .map((s) => ({ value: s.toLowerCase().replace(/\s+/g, '-'), label: s }));

const COUNTRIES_PARTIAL = COUNTRIES.map((c) => (c.value === 'uk' ? { ...c, disabled: true } : c));
const GENDERS_PARTIAL = GENDERS.map((g) => (g.value === 'other' ? { ...g, disabled: true } : g));

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
    .form{
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-4);      
    }  
  `];

  @state() private output = '';

  private onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const data: Record<string, string | string[]> = {};
    for (const key of new Set(fd.keys())) {
      const all = fd.getAll(key) as string[];
      data[key] = all.length > 1 ? all : all[0];
    }
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
        <h2>Input texto con iconos</h2>
        <div class="grid">
          <app-input-text label="Usuario" icon="user" placeholder="Nombre de usuario"></app-input-text>
          <app-input-text label="Correo" type="email" icon="envelope-simple"
            placeholder="trader@gmail.com" autocomplete="email" required></app-input-text>
          <app-input-text label="Contraseña" type="password" icon="lock-simple"
            autocomplete="new-password" required minlength="8"
            pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
            pattern-message="Mínimo 8 caracteres, una mayúscula y un carácter especial"
            hint="Mín. 8, una mayúscula y un especial"></app-input-text>
          <app-input-text label="Buscar" icon="magnifying-glass" placeholder="Buscar trade..."></app-input-text>
          <app-input-text label="Con error externo" type="password" icon="lock-simple"
            value="abc12345" error="Contraseña incorrecta"></app-input-text>
          <app-input-text label="Deshabilitado" type="password" icon="lock-simple"
            value="secreto123" disabled></app-input-text>
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
        <h2>Check</h2>
        <div class="grid">
          <app-input-check label="Normal"></app-input-check>
          <app-input-check label="Marcado" checked></app-input-check>
          <app-input-check label="Obligatorio" required hint="Debes marcarlo para enviar"></app-input-check>
          <app-input-check label="Error externo" error="Debes aceptar los términos"></app-input-check>
          <app-input-check label="Deshabilitado" disabled></app-input-check>
          <app-input-check label="Deshabilitado y marcado" checked disabled></app-input-check>
        </div>
      </section>

      <section>
        <h2>Switch</h2>
        <div class="grid">
          <app-input-switch label="Notificaciones"></app-input-switch>
          <app-input-switch label="Activado" checked></app-input-switch>
          <app-input-switch label="Con ayuda" hint="Recibirás un correo al cerrar el día"></app-input-switch>
          <app-input-switch label="Deshabilitado" disabled></app-input-switch>
          <app-input-switch label="Deshabilitado y activo" checked disabled></app-input-switch>
        </div>
      </section>

      <section>
        <h2>Radio</h2>
        <div class="grid">
          <app-input-radio label="Género" .options=${GENDERS}></app-input-radio>
          <app-input-radio label="Con valor" value="female" .options=${GENDERS}></app-input-radio>
          <app-input-radio label="Horizontal" direction="horizontal" .options=${GENDERS}></app-input-radio>
          <app-input-radio label="Obligatorio" required hint="Elige una opción" .options=${GENDERS}></app-input-radio>
          <app-input-radio label="Opción deshabilitada" .options=${GENDERS_PARTIAL}></app-input-radio>
          <app-input-radio label="Grupo deshabilitado" value="male" disabled .options=${GENDERS}></app-input-radio>
        </div>
      </section>

      <section>
        <h2>Select</h2>
        <div class="grid">
          <app-input-select label="País" .options=${COUNTRIES}></app-input-select>
          <app-input-select label="Con valor" value="mx" .options=${COUNTRIES}></app-input-select>
          <app-input-select label="Placeholder propio" placeholder="Elige un país" .options=${COUNTRIES}></app-input-select>
          <app-input-select label="Obligatorio" required hint="Debes elegir uno" .options=${COUNTRIES}></app-input-select>
          <app-input-select label="Error externo" value="us" error="Este país no está disponible" .options=${COUNTRIES}></app-input-select>
          <app-input-select label="Opción deshabilitada" .options=${COUNTRIES_PARTIAL}></app-input-select>
          <app-input-select label="Deshabilitado" value="ca" disabled .options=${COUNTRIES}></app-input-select>
        </div>
      </section>

      <section>
        <h2>Combobox</h2>
        <div class="grid">
          <app-input-combobox label="Usuario" placeholder="Seleccione un usuario"
            search-placeholder="Buscar usuario..." .options=${USERS}></app-input-combobox>
          <app-input-combobox label="Con valor" value="2" .options=${USERS}></app-input-combobox>
          <app-input-combobox label="Setup" placeholder="Seleccione un setup" .options=${SETUPS}></app-input-combobox>
          <app-input-combobox label="Obligatorio" required hint="Debes elegir uno" .options=${USERS}></app-input-combobox>
          <app-input-combobox label="Error externo" value="1" error="Este usuario ya está asignado" .options=${USERS}></app-input-combobox>
          <app-input-combobox label="Opción deshabilitada" .options=${USERS_PARTIAL}></app-input-combobox>
          <app-input-combobox label="Deshabilitado" value="2" disabled .options=${USERS}></app-input-combobox>
        </div>
      </section>

      <section class="form">
        <h2>Formulario de prueba</h2>
        <form @submit=${this.onSubmit}>
          <div class="grid">
            <app-input-text name="usuario" label="Usuario" required minlength="3"></app-input-text>
            <app-input-text name="correo" label="Correo" type="email" required></app-input-text>
            <app-input-number name="stop" label="Tamaño del stop" required min="0"></app-input-number>
            <app-input-number name="puntos" label="Puntos obtenidos"></app-input-number>
            <app-input-radio name="genero" label="Género" required .options=${GENDERS}></app-input-radio>
            <app-input-check name="hobby" value="lectura" label="Lectura"></app-input-check>
            <app-input-check name="hobby" value="viajes" label="Viajes"></app-input-check>
            <app-input-check name="hobby" value="deporte" label="Deporte"></app-input-check>
            <app-input-switch name="notificaciones" label="Notificaciones"></app-input-switch>
            <app-input-check name="terminos" label="Acepto los términos"></app-input-check>
            <app-input-select name="pais" label="País" required .options=${COUNTRIES}></app-input-select>
            <app-input-combobox name="responsable" label="Responsable" required .options=${USERS}></app-input-combobox>
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