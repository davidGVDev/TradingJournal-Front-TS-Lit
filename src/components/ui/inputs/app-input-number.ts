import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { FieldBase } from './field-base';

@customElement('app-input-number')
export class AppInputNumber extends FieldBase {
  static styles = [FieldBase.styles, css`
    input[type='number'] { appearance: textfield; font-variant-numeric: tabular-nums; }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  `];

  @property({ type: Number }) decimals = 2;
  @property({ type: Number }) min?: number;
  @property({ type: Number }) max?: number;
  @property() step = '';                       // sobrescribe el paso calculado (p. ej. 0.25)

  get valueAsNumber() {
    return this.value === '' ? NaN : Number(this.value);
  }

  private get stepAttr() {
    if (this.step) return this.step;
    return this.decimals > 0 ? (1 / 10 ** this.decimals).toFixed(this.decimals) : '1';
  }

  protected errorMessage(v: ValidityState) {
    if (v.rangeUnderflow) return `El valor mínimo es ${this.min}`;
    if (v.rangeOverflow) return `El valor máximo es ${this.max}`;
    if (v.stepMismatch) {
      if (this.step) return `Debe ser múltiplo de ${this.step}`;
      return this.decimals ? `Máximo ${this.decimals} decimales` : 'Solo números enteros';
    }
    if (v.badInput) return 'Ingresa un número válido';
    return super.errorMessage(v);
  }

  // Al salir del campo: 3 → 3.00
  protected onBlur() {
    const c = this.control;
    if (c.value !== '' && !c.validity.badInput) {
      this.value = Number(c.value).toFixed(this.decimals);
    }
    super.onBlur();
  }

  // Bloquea caracteres que <input type="number"> deja pasar (notación científica)
  private onKeydown(e: KeyboardEvent) {
    const blocked = ['e', 'E', '+'];
    if (this.decimals === 0) blocked.push('.', ',');
    if (blocked.includes(e.key)) e.preventDefault();
  }

  protected renderControl() {
    return html`
      <input
        id="control" class="control"
        type="number" inputmode="decimal"
        .value=${live(this.value)}
        step=${this.stepAttr}
        min=${ifDefined(this.min)}
        max=${ifDefined(this.max)}
        placeholder=${this.placeholder || (0).toFixed(this.decimals)}
        ?required=${this.required}
        ?disabled=${this.isDisabled}
        ?readonly=${this.readonly}
        aria-invalid=${this.shownMessage ? 'true' : 'false'}
        aria-describedby="message"
        @input=${this.onInput}
        @keydown=${this.onKeydown}
        @blur=${this.onBlur}
        @change=${this.onChange}
      />
    `;
  }
}