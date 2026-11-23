import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { baseStyles } from "../../design/base-styles";

@customElement("app-button")
export class AppButton extends LitElement {
  static formAssociated = true;
  private internals = this.attachInternals();

  static styles = [
    baseStyles,
    css`
      :host {
        display: inline-block;
      }
      :host([block]) {
        display: block;
      }
      :host([block]) button {
        width: 100%;
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        height: var(--control-height);
        padding: 0 var(--space-4);
        border: 1px solid transparent;
        border-radius: var(--radius-md);
        font: 600 0.9rem var(--font-body);
        cursor: pointer;
        transition:
          background 0.15s,
          transform 0.05s,
          opacity 0.15s;
      }
      button:active:not(:disabled) {
        transform: translateY(1px);
      }
      button:focus-visible {
        outline: 2px solid var(--color-info);
        outline-offset: 2px;
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .primary {
        background: var(--color-primary);
        color: var(--color-primary-contrast);
      }
      .primary:hover:not(:disabled) {
        background: var(--color-primary-hover);
      }
      .dark {
        background: #1a1a1a;
        color: #fff;
      }
      .outline {
        background: transparent;
        border-color: var(--color-border);
        color: var(--color-text);
      }
      .danger {
        background: red;
        border-color: var(--color-danger);
        color: var(--color-bg);
      }
      .ghost {
        background: var(--color-bg-gray);
        color: var(--color-text);
      }
      .ghost:hover:not(:disabled) {
        background: var(--color-surface);
      }

      .spinner {
        width: 1em;
        height: 1em;
        border-radius: 50%;
        border: 2px solid currentColor;
        border-right-color: transparent;
        animation: spin 0.6s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ];

  @property() variant: "primary" | "dark" | "outline" | "danger" | "ghost" =
    "primary";
  @property() type: "button" | "submit" | "reset" = "button";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean, reflect: true }) block = false;

  private _onClick() {
    if (this.type === "submit") this.internals.form?.requestSubmit();
    if (this.type === "reset") this.internals.form?.reset();
  }

  render() {
    return html`
      <button
        class=${classMap({ [this.variant]: true })}
        ?disabled=${this.disabled || this.loading}
        @click=${this._onClick}
      >
        ${this.loading
          ? html`<span class="spinner"></span>`
          : html`<slot></slot>`}
        <slot></slot>
      </button>
    `;
  }
}
