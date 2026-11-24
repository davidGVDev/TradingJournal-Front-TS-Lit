import {
  LitElement, html, nothing,
  type CSSResultGroup, type TemplateResult,
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { baseStyles } from '../../../design/base-styles';
import { fieldStyles } from './field-styles';

export abstract class FieldBase extends LitElement {
  // Hace que el elemento participe en un <form> nativo (FormData, submit, reset, validación)
  static formAssociated = true;

  // Permite que .focus() y el foco por teclado lleguen al <input> interno
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static styles: CSSResultGroup = [baseStyles, fieldStyles];

  protected internals = this.attachInternals();

  @property() label = '';
  @property({ reflect: true }) name = '';   // reflect: el <form> lee el ATRIBUTO name
  @property() value = '';
  @property() placeholder = '';
  @property() hint = '';
  @property() error = '';                    // error externo (p. ej. del backend)
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;

  @state() protected touched = false;        // el error se muestra tras interactuar
  @state() protected message = '';           // mensaje de validación actual
  @state() private formDisabled = false;     // deshabilitado por un <fieldset disabled>

  // Cada subclase debe poner id="control" a su <input>
  @query('#control') protected control!: HTMLInputElement;

  #defaultValue = '';

  // ── Ciclo de vida ───────────────────────────────────────────────
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('invalid', this.onInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('invalid', this.onInvalid);
  }

  firstUpdated() {
    this.#defaultValue = this.value;         // al hacer reset se vuelve a este valor
  }

  updated() {
    this.internals.setFormValue(this.value);
    this.syncInternals();
  }

  // ── Callbacks que llama el <form> ───────────────────────────────
  formDisabledCallback(disabled: boolean) { this.formDisabled = disabled; }

  formResetCallback() {
    this.value = this.#defaultValue;
    this.touched = false;
    this.message = '';
  }

  // ── Validación ──────────────────────────────────────────────────
  /** Pasa la validez del <input> interno al formulario (sin tocar el estado reactivo). */
  protected syncInternals() {
    const c = this.control;
    if (!c || c.validity.valid) return this.internals.setValidity({});
    this.internals.setValidity(c.validity, this.errorMessage(c.validity), c);
  }

  /** Espera el render y recalcula el mensaje visible. */
  protected async validate() {
    await this.updateComplete;
    this.syncInternals();
    this.message = this.internals.validationMessage;
  }

  /** Mensajes en español. Las subclases pueden ampliarlo. */
  protected errorMessage(v: ValidityState): string {
    const c = this.control;
    if (v.valueMissing) return 'Este campo es obligatorio';
    if (v.typeMismatch) return c.type === 'email' ? 'Ingresa un correo válido' : 'El formato no es válido';
    if (v.tooShort) return `Mínimo ${c.minLength} caracteres`;
    if (v.tooLong) return `Máximo ${c.maxLength} caracteres`;
    if (v.patternMismatch) return 'El formato no es válido';
    return c.validationMessage;
  }

  // Se dispara cuando el form intenta enviarse y este campo es inválido
  private onInvalid = (e: Event) => {
    e.preventDefault();                       // evita el globo nativo del navegador
    this.touched = true;
    this.validate();
  };

  // ── Handlers reutilizables ──────────────────────────────────────
  protected onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.validate();
  }

  protected onBlur() {
    this.touched = true;
    this.validate();
  }

  protected onChange() {
    // 'change' nativo no sale del Shadow DOM: lo re-emitimos
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  // ── Render ──────────────────────────────────────────────────────
  protected get isDisabled() { return this.disabled || this.formDisabled; }
  protected get shownMessage() { return this.error || (this.touched ? this.message : ''); }

  protected abstract renderControl(): TemplateResult;

  render() {
    const msg = this.shownMessage;
    return html`
      <div class=${classMap({ field: true, invalid: !!msg, disabled: this.isDisabled })}>
        ${this.label ? html`
          <label for="control">
            ${this.label}${this.required ? html`<span class="req" aria-hidden="true">*</span>` : nothing}
          </label>` : nothing}

        ${this.renderControl()}

        ${msg
          ? html`<div class="message error" id="message" role="alert">${msg}</div>`
          : this.hint ? html`<div class="message" id="message">${this.hint}</div>` : nothing}
      </div>
    `;
  }
}