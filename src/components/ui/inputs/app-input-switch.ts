import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ToggleBase } from './toggle-base';

@customElement('app-input-switch')
export class AppInputSwitch extends ToggleBase {
  static styles = [ToggleBase.styles, css`
    :host { --toggle-indent: 48px; }

    .track {
      flex: none; position: relative;
      width: 40px; height: 22px; margin-top: -1px;
      border-radius: 999px; background: var(--toggle-border);
      transition: background .2s, box-shadow .15s;
    }
    .track::after {
      content: ''; position: absolute; top: 3px; left: 3px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #fff; box-shadow: var(--shadow-sm);
      transition: transform .2s ease;
    }

    .native:checked + .track { background: var(--color-primary); }
    .native:checked + .track::after { transform: translateX(18px); }
    .native:focus-visible + .track {
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 30%, transparent);
    }
    .native:disabled + .track { opacity: .5; }
    .field.invalid .track { outline: 2px solid var(--color-danger); outline-offset: 1px; }
  `];

  protected get inputRole() { return 'switch'; }

  protected indicator() {
    return html`<span class="track"></span>`;
  }
}