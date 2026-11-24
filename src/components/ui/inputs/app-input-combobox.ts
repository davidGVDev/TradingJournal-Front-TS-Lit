import { html, css, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FieldBase } from './field-base';
import '../ph-icon';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

// Ignora mayúsculas y acentos: "garcia" encuentra "García"
const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

@customElement('app-input-combobox')
export class AppInputCombobox extends FieldBase {
  static styles = [FieldBase.styles, css`
    /* ── Botón disparador ───────────────────────── */
    button.control {
      display: flex; align-items: center; justify-content: space-between; gap: var(--space-2);
      text-align: left; cursor: pointer;
    }
    button.control[aria-expanded='true'] {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 30%, transparent);
    }
    .value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    button.control.empty .value { color: var(--color-text-muted); }
    button.control ph-icon { flex: none; font-size: 1rem; color: var(--color-text-muted); }

    /* ── Panel (popover) ────────────────────────── */
    .panel {
      position: fixed; inset: auto; margin: 0; padding: 0; overflow: hidden;
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      background: var(--color-bg); color: var(--color-text);
      box-shadow: var(--shadow-md);
    }
    /* display solo cuando está abierto: si lo pones en .panel, el panel se vería siempre */
    .panel:popover-open { display: flex; flex-direction: column; }

    .search {
      display: flex; align-items: center; gap: var(--space-2);
      padding: 0 var(--space-3);
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text-muted);
    }
    .search input {
      flex: 1; min-width: 0; height: 42px;
      border: 0; outline: 0; background: transparent;
      color: var(--color-text); font: 500 .9rem var(--font-body);
    }
    .search input::placeholder { color: var(--color-text-muted); }

    .list {
      flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
      display: grid; gap: 2px; padding: var(--space-2);
    }
    .option {
      display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm); cursor: pointer;
    }
    .option.active { background: color-mix(in srgb, var(--color-text) 6%, transparent); }
    .option.disabled { opacity: .5; cursor: not-allowed; }
    .option-text { display: grid; min-width: 0; }
    .option-label { font-size: .9rem; font-weight: 500; }
    .option.rich .option-label { font-weight: 700; }
    .option-desc {
      font-size: .8rem; color: var(--color-text-muted);
      overflow: hidden; text-overflow: ellipsis;
    }
    .option ph-icon { flex: none; color: var(--color-text-muted); }
    .empty-msg { padding: var(--space-4); text-align: center; font-size: .9rem; color: var(--color-text-muted); }
  `];

  @property({ attribute: false }) options: ComboboxOption[] = [];
  @property({ attribute: 'search-placeholder' }) searchPlaceholder = 'Buscar…';
  @property({ attribute: 'empty-text' }) emptyText = 'Sin resultados';

  @state() private open = false;
  @state() private query = '';
  @state() private activeIndex = -1;

  @query('#control') private trigger!: HTMLButtonElement;
  @query('#panel') private panel!: HTMLElement;
  @query('#search') private search!: HTMLInputElement;

  // ── Datos derivados ─────────────────────────────────────────────
  private get selected() {
    return this.options.find((o) => o.value === this.value);
  }

  private get filtered() {
    const q = norm(this.query.trim());
    if (!q) return this.options;
    return this.options.filter((o) => norm(`${o.label} ${o.description ?? ''}`).includes(q));
  }

  private firstEnabled(items: ComboboxOption[]) {
    return items.findIndex((o) => !o.disabled);
  }

  // ── Validación: un <button> no tiene la suya ────────────────────
  protected syncInternals() {
    if (this.required && this.value === '') {
      this.internals.setValidity({ valueMissing: true }, 'Selecciona una opción', this.trigger);
    } else {
      this.internals.setValidity({});
    }
  }

  // ── Ciclo de vida ───────────────────────────────────────────────
  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopTracking();
  }

  // ── Abrir y cerrar (lo dispara el navegador con popovertarget) ──
  private onBeforeToggle(e: ToggleEvent) {
    if (e.newState !== 'open') return;
    this.query = '';
    const items = this.options;
    const sel = items.findIndex((o) => o.value === this.value);
    this.activeIndex = sel >= 0 ? sel : this.firstEnabled(items);
    this.place();
    this.open = true;
    window.addEventListener('resize', this.reposition);
    window.addEventListener('scroll', this.reposition, true);
  }

  private async onToggle(e: ToggleEvent) {
    this.open = e.newState === 'open';
    if (this.open) {
      await this.updateComplete;
      this.search.focus();
      this.scrollActive();
    } else {
      this.stopTracking();
      this.touched = true;           // el error aparece al cerrar sin elegir
      this.validate();
    }
  }

  private stopTracking() {
    window.removeEventListener('resize', this.reposition);
    window.removeEventListener('scroll', this.reposition, true);
  }

  // ── Posición: bajo el botón, o arriba si abajo no cabe ──────────
  private place() {
    const r = this.trigger.getBoundingClientRect();
    const gap = 4, margin = 8, ideal = 320;
    const below = window.innerHeight - r.bottom - margin;
    const above = r.top - margin;
    const openUp = below < 240 && above > below;
    const s = this.panel.style;

    s.left = `${r.left}px`;
    s.width = `${r.width}px`;
    s.maxHeight = `${Math.min(ideal, (openUp ? above : below) - gap)}px`;
    if (openUp) {
      s.top = 'auto';
      s.bottom = `${window.innerHeight - r.top + gap}px`;
    } else {
      s.bottom = 'auto';
      s.top = `${r.bottom + gap}px`;
    }
  }

  private reposition = (e?: Event) => {
    if (e && e.composedPath().includes(this.panel)) return;   // ignora el scroll de la propia lista
    this.place();
  };

  // ── Selección ───────────────────────────────────────────────────
  private choose(o: ComboboxOption) {
    if (o.disabled) return;
    this.value = o.value;
    this.panel.hidePopover();
    this.trigger.focus();
    this.touched = true;
    this.validate();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.onChange();
  }

  // ── Búsqueda y teclado ──────────────────────────────────────────
  private onSearchInput(e: Event) {
    e.stopPropagation();             // el 'input' del buscador no debe salir del componente
    this.query = (e.target as HTMLInputElement).value;
    this.activeIndex = this.firstEnabled(this.filtered);
  }

  private move(step: 1 | -1) {
    const items = this.filtered;
    if (!items.length) return;
    let i = this.activeIndex === -1 ? (step === 1 ? -1 : 0) : this.activeIndex;
    for (let n = 0; n < items.length; n++) {
      i = (i + step + items.length) % items.length;
      if (!items[i].disabled) { this.activeIndex = i; break; }
    }
    this.scrollActive();
  }

  private async scrollActive() {
    await this.updateComplete;
    this.renderRoot.querySelector('.option.active')?.scrollIntoView({ block: 'nearest' });
  }

  private onSearchKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); this.move(1); break;
      case 'ArrowUp': e.preventDefault(); this.move(-1); break;
      case 'Enter': {
        e.preventDefault();
        const o = this.filtered[this.activeIndex];
        if (o) this.choose(o);
        break;
      }
      case 'Tab':                    // cierra y deja que Tab siga desde el botón
        this.panel.hidePopover();
        this.trigger.focus();
        break;
    }
  }

  private onTriggerKeydown(e: KeyboardEvent) {
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !this.open) {
      e.preventDefault();
      this.panel.showPopover();
    }
  }

  // ── Render ──────────────────────────────────────────────────────
  private renderPanel() {
    const items = this.filtered;
    return html`
      <div class="search">
        <ph-icon name="magnifying-glass"></ph-icon>
        <input
          id="search" type="text" autocomplete="off"
          role="combobox" aria-expanded="true" aria-autocomplete="list"
          aria-controls="list"
          aria-activedescendant=${this.activeIndex >= 0 ? `opt-${this.activeIndex}` : ''}
          aria-label=${this.label || 'Buscar'}
          placeholder=${this.searchPlaceholder}
          .value=${this.query}
          @input=${this.onSearchInput}
          @keydown=${this.onSearchKeydown} />
      </div>

      <div class="list" id="list" role="listbox" aria-label=${this.label}
           @mousedown=${(e: Event) => e.preventDefault()}>
        ${items.length === 0
          ? html`<div class="empty-msg">${this.emptyText}</div>`
          : items.map((o, i) => {
              const isSelected = o.value === this.value;
              return html`
                <div
                  id="opt-${i}" role="option"
                  aria-selected=${isSelected ? 'true' : 'false'}
                  aria-disabled=${o.disabled ? 'true' : 'false'}
                  class=${classMap({
                    option: true,
                    active: i === this.activeIndex,
                    disabled: !!o.disabled,
                    rich: !!o.description,
                  })}
                  @click=${() => this.choose(o)}
                  @pointermove=${() => { if (!o.disabled && this.activeIndex !== i) this.activeIndex = i; }}>
                  <span class="option-text">
                    <span class="option-label">${o.label}</span>
                    ${o.description ? html`<span class="option-desc">${o.description}</span>` : nothing}
                  </span>
                  ${isSelected ? html`<ph-icon name="check"></ph-icon>` : nothing}
                </div>`;
            })}
      </div>
    `;
  }

  protected renderControl() {
    const sel = this.selected;
    return html`
      <button
        id="control" type="button"
        class=${classMap({ control: true, empty: !sel })}
        popovertarget="panel"
        ?disabled=${this.isDisabled}
        aria-haspopup="listbox"
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-invalid=${this.shownMessage ? 'true' : 'false'}
        aria-describedby="message"
        @keydown=${this.onTriggerKeydown}>
        <span class="value">${sel?.label ?? (this.placeholder || 'Seleccione…')}</span>
        <ph-icon name="caret-up-down"></ph-icon>
      </button>

      <div id="panel" class="panel" popover="auto"
           @beforetoggle=${this.onBeforeToggle}
           @toggle=${this.onToggle}>
        ${this.open ? this.renderPanel() : nothing}
      </div>
    `;
  }
}