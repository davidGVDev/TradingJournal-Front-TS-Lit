import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { icons, type IconName } from './icons';

// Se codifica una sola vez por icono
const urls = new Map<string, string>();
const toUrl = (name: IconName) => {
  let url = urls.get(name);
  if (!url) {
    url = `url("data:image/svg+xml,${encodeURIComponent(icons[name])}")`;
    urls.set(name, url);
  }
  return url;
};

@customElement('ph-icon')
export class PhIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-block; flex: none;
      width: 1.25em; height: 1.25em;
      vertical-align: -0.2em;
    }
    .icon {
      display: block; width: 100%; height: 100%;
      background-color: currentColor;
      -webkit-mask: var(--icon) center / contain no-repeat;
      mask: var(--icon) center / contain no-repeat;
    }
  `;

  @property() name!: IconName;

  render() {
    if (!(this.name in icons)) {
      console.warn(`<ph-icon>: "${this.name}" no está registrado en icons.ts`);
      return nothing;
    }
    return html`<span class="icon" style=${styleMap({ '--icon': toUrl(this.name) })}></span>`;
  }
}