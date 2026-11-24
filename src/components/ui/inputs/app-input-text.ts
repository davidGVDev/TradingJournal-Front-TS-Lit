import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { FieldBase } from './field-base';

@customElement('app-input-text')
export class AppInputText extends FieldBase {
  @property() type: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' = 'text';
  @property() autocomplete = 'off';
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property() pattern?: string;
  @property({ attribute: 'pattern-message' }) patternMessage = '';

  protected errorMessage(v: ValidityState) {
    if (v.patternMismatch && this.patternMessage) return this.patternMessage;
    return super.errorMessage(v);
  }

  protected renderControl() {
    return html`
      <input
        id="control" class="control"
        type=${this.type}
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
    `;
  }
}