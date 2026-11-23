import { css } from 'lit';

export const baseStyles = css`
  :host {
    box-sizing: border-box;
    font-family: var(--font-body);
  }

  :where(*, *::before, *::after) {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }
`;
