import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ToggleBase } from './toggle-base';
import '../ph-icon';

@customElement('app-input-check')
export class AppInputCheck extends ToggleBase {
  static styles = [ToggleBase.styles, css`
    :host { --toggle-indent: 28px; }

    .box {
      flex: none; display: grid; place-items: center;
      width: 20px; height: 20px;
      border: 1.5px solid var(--toggle-border); border-radius: 6px;
      background: var(--color-bg);
      color: transparent;
      transition: background .15s, border-color .15s, box-shadow .15s, color .15s;
    }
    .box ph-icon { width: 14px; height: 14px; }

    .toggle:hover .native:not(:checked):not(:disabled) + .box { border-color: var(--color-text-muted); }

    .native:checked + .box {
      background: var(--color-primary); border-color: var(--color-primary);
      color: var(--color-primary-contrast);
    }
    .native:focus-visible + .box {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 30%, transparent);
    }
    .native:disabled + .box { opacity: .5; }
    .field.invalid .box { border-color: var(--color-danger); }
  `];

  protected errorMessage(v: ValidityState) {
    if (v.valueMissing) return 'Debes marcar esta casilla';
    return super.errorMessage(v);
  }

  protected indicator() {
    return html`<span class="box"><ph-icon name="check"></ph-icon></span>`;
  }
}