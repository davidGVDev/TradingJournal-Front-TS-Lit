import { html, nothing, type CSSResultGroup, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { FieldBase } from './field-base';
import { toggleStyles } from './toggle-styles';

export abstract class ToggleBase extends FieldBase {
  static styles: CSSResultGroup = [FieldBase.styles, toggleStyles];

  @property({ type: Boolean, reflect: true }) checked = false;

  #defaultChecked = false;

  /** Cada subclase dibuja su indicador (casilla, interruptor...). */
  protected abstract indicator(): TemplateResult;

  /** role del <input>; el switch lo cambia a "switch". */
  protected get inputRole(): string | undefined { return undefined; }

  // Como un checkbox nativo: marcado envía su value (o "on"), desmarcado no envía nada
  protected get formValue() { return this.checked ? this.value || 'on' : null; }

  firstUpdated() {
    super.firstUpdated();
    this.#defaultChecked = this.checked;
  }

  formResetCallback() {
    super.formResetCallback();
    this.checked = this.#defaultChecked;
  }

  protected onToggle(e: Event) {
    this.checked = (e.target as HTMLInputElement).checked;
    this.touched = true;
    this.validate();
    this.onChange();
  }

  protected renderControl() {
    return html`
      <label class="toggle">
        <input
          id="control" class="native" type="checkbox"
          role=${ifDefined(this.inputRole)}
          .checked=${live(this.checked)}
          ?required=${this.required}
          ?disabled=${this.isDisabled}
          aria-invalid=${this.shownMessage ? 'true' : 'false'}
          aria-describedby="message"
          @change=${this.onToggle}
          @blur=${this.onBlur}
        />
        ${this.indicator()}
        <span class="text">
          <slot>${this.label}</slot>${this.required ? html`<span class="req" aria-hidden="true">*</span>` : nothing}
        </span>
      </label>
    `;
  }

  render() {
    return html`
      <div class=${classMap({ field: true, invalid: !!this.shownMessage, disabled: this.isDisabled })}>
        ${this.renderControl()}
        ${this.renderMessage('indent')}
      </div>
    `;
  }
}