import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { FieldBase } from './field-base';
import '../ph-icon';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@customElement('app-input-select')
export class AppInputSelect extends FieldBase {
  static styles = [FieldBase.styles, css`
    .wrap { position: relative; }

    select.control {
      appearance: none;
      padding-right: 40px;
      cursor: pointer;
      text-overflow: ellipsis;
    }

    /* Mientras no hay selección, el texto se ve como un placeholder */
    select.control.empty { color: var(--color-text-muted); }
    select.control option { color: var(--color-text); background: var(--color-bg); }

    .chevron {
      position: absolute; top: 50%; right: var(--space-3);
      transform: translateY(-50%);
      font-size: 1rem; color: var(--color-text-muted);
      pointer-events: none;                      /* el clic pasa al <select> */
      transition: color .15s;
    }
    .wrap:focus-within .chevron { color: var(--color-text); }
    .field.disabled .chevron { opacity: .5; }
  `];

  @property({ attribute: false }) options: SelectOption[] = [];

  protected errorMessage(v: ValidityState) {
    if (v.valueMissing) return 'Selecciona una opción';
    return super.errorMessage(v);
  }

  private onSelect(e: Event) {
    this.value = (e.target as HTMLSelectElement).value;
    this.touched = true;
    this.validate();
    this.onChange();
  }

  protected renderControl() {
    return html`
      <div class="wrap">
        <select
          id="control"
          class=${classMap({ control: true, empty: this.value === '' })}
          ?required=${this.required}
          ?disabled=${this.isDisabled}
          aria-invalid=${this.shownMessage ? 'true' : 'false'}
          aria-describedby="message"
          @input=${this.onInput}
          @change=${this.onSelect}
          @blur=${this.onBlur}>

          <option value="" .selected=${live(this.value === '')}>
            ${this.placeholder || 'Seleccione…'}
          </option>

          ${this.options.map((o) => html`
            <option
              value=${o.value}
              ?disabled=${o.disabled}
              .selected=${live(this.value === o.value)}>
              ${o.label}
            </option>`)}
        </select>
        <ph-icon class="chevron" name="caret-down"></ph-icon>
      </div>
    `;
  }
}