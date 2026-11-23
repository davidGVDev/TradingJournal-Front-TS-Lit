import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { icons, type IconName } from "./icons";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

@customElement("ph-icon")
export class PhIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      width: 1.25em;
      height: 1.25em;
    }
    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `;

  @property() name!: IconName;

  reder() {
    return html`${unsafeSVG(icons[this.name] ?? "")}`;
  }
}
