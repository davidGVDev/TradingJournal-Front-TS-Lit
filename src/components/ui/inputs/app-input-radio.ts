import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { FieldBase } from './field-base';
import { toggleStyles } from './toggle-styles';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@customElement('app-input-radio')
export class AppInputRadio extends FieldBase {
  static styles = [FieldBase.styles, toggleStyles, css`
    :host { --toggle-indent: 28px; }

    .legend { font-size: .85rem; font-weight: 600; }
    .field.disabled .legend { color: var(--color-text-muted); }

    .options { display: grid; gap: var(--space-2); }
    .options.horizontal { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-6); }

    .dot {
      flex: none; display: grid; place-items: center;
      width: 20px; height: 20px;
      border: 1.5px solid var(--toggle-border); border-radius: 50%;
      background: var(--color-bg);
      transition: background .15s, border-color .15s, box-shadow .15s;
    }
    .dot::after {
      content: ''; width: 8px; height: 8px; border-radius: 50%;
      background: var(--color-primary-contrast);
      transform: scale(0); transition: transform .15s ease;
    }

    .toggle:hover .native:not(:checked):not(:disabled) + .dot { border-color: var(--color-text-muted); }
    .native:checked + .dot { background: var(--color-primary); border-color: var(--color-primary); }
    .native:checked + .dot::after { transform: scale(1); }
    .native:focus-visible + .dot {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 30%, transparent);
    }
    .native:disabled + .dot { opacity: .5; }
    .field.invalid .dot { border-color: var(--color-danger); }
  `];

  @property({ attribute: false }) options: RadioOption[] = [];
  @property() direction: 'vertical' | 'horizontal' = 'vertical';

  // Sin selección no se envía nada (igual que un radio nativo)
  protected get formValue() { return this.value === '' ? null : this.value; }

  protected errorMessage(v: ValidityState) {
    if (v.valueMissing) return 'Selecciona una opción';
    return super.errorMessage(v);
  }

  private onSelect(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.touched = true;
    this.validate();
    this.onChange();
  }

  protected renderControl() {
    return html`
      <div class=${classMap({ options: true, horizontal: this.direction === 'horizontal' })}>
        ${this.options.map((o, i) => html`
          <label class="toggle">
            <input
              id=${i === 0 ? 'control' : nothing}
              class="native" type="radio" name="group"
              value=${o.value}
              .checked=${live(this.value === o.value)}
              ?required=${this.required}
              ?disabled=${this.isDisabled || !!o.disabled}
              @change=${this.onSelect}
              @blur=${this.onBlur}
            />
            <span class="dot"></span>
            <span class="text">${o.label}</span>
          </label>
        `)}
      </div>
    `;
  }

 
  render() {
    const msg = this.shownMessage;
    return html`
      <div
        class=${classMap({ field: true, invalid: !!msg, disabled: this.isDisabled })}
        role="radiogroup"
        aria-labelledby=${ifDefined(this.label ? 'legend' : undefined)}
        aria-required=${this.required ? 'true' : 'false'}
        aria-invalid=${msg ? 'true' : 'false'}>
        ${this.label ? html`
          <span class="legend" id="legend">
            ${this.label}${this.required ? html`<span class="req" aria-hidden="true">*</span>` : nothing}
          </span>` : nothing}
        ${this.renderControl()}
        ${this.renderMessage()}
      </div>
    `;
  }
}