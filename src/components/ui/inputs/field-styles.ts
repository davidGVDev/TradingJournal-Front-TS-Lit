import { css } from 'lit';

export const fieldStyles = css`
  :host { display: block; }
  :host([hidden]) { display: none; }

  .field { display: grid; gap: var(--space-1); }

  label { font-size: .85rem; font-weight: 600; color: var(--color-text); }
  .field.disabled label { color: var(--color-text-muted); }
  .req { margin-left: 2px; color: var(--color-danger); }

  .control {
    width: 100%; height: var(--control-height);
    padding: 0 var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg); color: var(--color-text);
    font: 500 .95rem var(--font-body);
    transition: border-color .15s, box-shadow .15s, background .15s;
  }
  .control::placeholder { color: var(--color-text-muted); opacity: .7; }

  /* hover */
  .control:hover:not(:disabled) { border-color: var(--color-text-muted); }

  /* focus (active) */
  .control:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }

  /* readonly y disabled */
  .control:read-only:not(:disabled) { background: var(--color-surface); }
  .control:disabled {
    background: var(--color-surface); color: var(--color-text-muted);
    cursor: not-allowed; opacity: .7;
  }

  /* error */
  .field.invalid .control { border-color: var(--color-danger); }
  .field.invalid .control:focus {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-danger) 25%, transparent);
  }

  .message { font-size: .75rem; color: var(--color-text-muted); }
  .message.error { color: var(--color-danger); }
`;