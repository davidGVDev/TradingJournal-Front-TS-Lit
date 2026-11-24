import { css } from 'lit';

export const toggleStyles = css`
  :host { --toggle-border: color-mix(in srgb, var(--color-text-muted) 60%, var(--color-bg)); }

  .toggle {
    position: relative; justify-self: start;
    display: inline-flex; align-items: flex-start; gap: var(--space-2);
    font-size: .9rem; font-weight: 500; line-height: 20px;
    color: var(--color-text); cursor: pointer; user-select: none;
  }
  .toggle:has(.native:disabled) { cursor: not-allowed; color: var(--color-text-muted); }

  /* El input real: invisible, pero enfocable y accesible */
  .native { position: absolute; width: 0; height: 0; margin: 0; opacity: 0; }

  .req { margin-left: 2px; color: var(--color-danger); }

  /* El mensaje se alinea con el texto, no con el indicador */
  .message.indent { padding-left: var(--toggle-indent, 28px); }
`;