import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { FieldBase } from './field-base';
import type { IconName } from '../icons';
import '../ph-icon';

@customElement('app-input-text')
export class AppInputText extends FieldBase {
  static styles = [FieldBase.styles, css`
    .wrap { position: relative; display: flex; align-items: center; }

    /* Espacio para los iconos dentro del input */
    .control.with-icon { padding-left: 40px; }
    .control.with-toggle { padding-right: 44px; }

    .leading {
      position: absolute; left: var(--space-3); top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem; color: var(--color-text-muted);
      pointer-events: none;                       /* el clic llega al input */
      transition: color .15s;
    }
    .wrap:focus-within .leading { color: var(--color-text); }
    .field.disabled .leading { opacity: .5; }

    .toggle {
      position: absolute; right: 4px; top: 50%;
      transform: translateY(-50%);
      display: grid; place-items: center; width: 32px; height: 32px;
      border: 0; border-radius: var(--radius-sm);
      background: none; color: var(--color-text-muted);
      font-size: 1.1rem; cursor: pointer;
      transition: color .15s, background .15s;
    }
    .toggle:hover:not(:disabled) { color: var(--color-text); background: var(--color-surface); }
    .toggle:focus-visible { outline: 2px solid var(--color-info); outline-offset: -2px; }
    .toggle:disabled { opacity: .5; cursor: not-allowed; }
  `];

  @property() type: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' = 'text';
  @property() autocomplete = 'off';
  @property() icon?: IconName;                    // icono a la izquierda
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property() pattern?: string;
  @property({ attribute: 'pattern-message' }) patternMessage = '';

  @state() private reveal = false;                // contraseña visible

  private get isPassword() { return this.type === 'password'; }
  private get inputType() { return this.isPassword && this.reveal ? 'text' : this.type; }

  protected errorMessage(v: ValidityState) {
    if (v.patternMismatch && this.patternMessage) return this.patternMessage;
    return super.errorMessage(v);
  }

  protected renderControl() {
    return html`
      <div class="wrap">
        ${this.icon ? html`<ph-icon class="leading" name=${this.icon}></ph-icon>` : nothing}

        <input
          id="control"
          class=${classMap({ control: true, 'with-icon': !!this.icon, 'with-toggle': this.isPassword })}
          type=${this.inputType}
          .value=${live(this.value)}
          placeholder=${this.placeholder}
          autocomplete=${this.autocomplete}
          ?required=${this.required}
          ?disabled=${this.isDisabled}
          ?readonly=${this.readonly}
          minlength=${ifDefined(this.minlength)}
          maxlength=${ifDefined(this.maxlength)}
          pattern=${ifDefined(this.pattern)}
          aria-invalid=${this.shownMessage ? 'true' : 'false'}
          aria-describedby="message"
          @input=${this.onInput}
          @blur=${this.onBlur}
          @change=${this.onChange}
        />

        ${this.isPassword ? html`
          <button
            type="button" class="toggle"
            ?disabled=${this.isDisabled}
            aria-label=${this.reveal ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed=${this.reveal ? 'true' : 'false'}
            @mousedown=${(e: Event) => e.preventDefault()}
            @click=${() => (this.reveal = !this.reveal)}>
            <ph-icon name=${this.reveal ? 'eye-slash' : 'eye'}></ph-icon>
          </button>` : nothing}
      </div>
    `;
  }
}