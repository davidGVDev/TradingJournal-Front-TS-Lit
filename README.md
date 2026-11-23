# Trading Journal · Front con Lit

Reescritura **solo del front** de mi diario de trading, hecha con [Lit](https://lit.dev/) y web components propios. El backend (NestJS) se mantiene.

El objetivo del proyecto es doble:

- **Aprender Lit a fondo**: construir mis propios componentes en vez de depender de una librería de UI.
- **Usar pocas dependencias**: sin Tailwind, Redux, Formik ni router externo. Solo Lit, Vite, TypeScript e iconos de Phosphor.

> Estado: **en construcción**. Este README documenta únicamente lo que ya está hecho (hasta el paso 1).

---

## Stack

| Herramienta | Uso |
| --- | --- |
| [Lit](https://lit.dev/) | Web components |
| TypeScript | Tipado |
| [Vite](https://vitejs.dev/) | Servidor de desarrollo y build |
| [@phosphor-icons/core](https://phosphoricons.com/) | Iconos (SVG importados como texto con `?raw`) |

---

## Cómo correrlo

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`.

Requisitos en `tsconfig.json` (necesarios para los decoradores de Lit):

```json
"experimentalDecorators": true,
"useDefineForClassFields": false
```

---

## Arquitectura

La app tiene **solo dos páginas** y no usa router. `app-root` decide cuál mostrar según haya sesión o no:

```
<app-root>
  ├─ sin sesión → <login-page>
  └─ con sesión → <main-page>
```

La sesión vive en `auth-store`, un `EventTarget` propio. Cuando cambia (login o logout), `app-root` lo detecta y cambia de página automáticamente.

---

## Estructura de carpetas

```
src/
├─ app-root.ts            Decide entre login y main según la sesión
├─ main.ts                Punto de entrada (importa estilos y app-root)
├─ vite-env.d.ts
│
├─ state/
│  └─ auth-store.ts       Sesión (login / logout / persistencia)
│
├─ pages/
│  ├─ login-page.ts       Tarjeta dividida con acceso temporal
│  └─ main-page.ts        Esqueleto: encabezado + botón de salir
│
├─ components/
│  └─ ui/
│     ├─ app-button.ts    Botón con variantes
│     ├─ ph-icon.ts       Icono de Phosphor
│     └─ icons.ts         Catálogo de iconos usados
│
├─ design/
│  ├─ tokens.css          Variables de diseño (colores, fuentes, espaciado)
│  ├─ global.css          Reset del documento
│  └─ base-styles.ts      Reset compartido para el Shadow DOM
│
└─ playground/
   └─ playground-page.ts  Página de pruebas de componentes
```

---

## Sistema de diseño

### Tokens (`design/tokens.css`)

Todo el aspecto visual sale de variables CSS en `:root`. Las custom properties **atraviesan el Shadow DOM**, por eso son la base del theming.

| Grupo | Variables |
| --- | --- |
| Marca | `--color-primary` (`#FFBF00`), `--color-primary-hover`, `--color-primary-contrast` |
| Semánticos | `--color-success`, `--color-danger`, `--color-info`, `--color-warning` |
| Superficies | `--color-bg`, `--color-surface`, `--color-border` |
| Texto | `--color-text`, `--color-text-muted` |
| Tipografía | `--font-body` (Quicksand), `--font-title` (Dosis), `--font-metric` (Barlow Condensed) |
| Espaciado | `--space-1` a `--space-8` |
| Forma | `--radius-sm/md/lg`, `--shadow-sm/md`, `--control-height` |

**Tema:** claro por defecto (`color-scheme: light`). El modo oscuro existe pero es opt-in: solo se activa con `<html data-theme="dark">`, no por la preferencia del sistema operativo.

### Reset en el Shadow DOM (`design/base-styles.ts`)

Los estilos de `global.css` **no entran** a los componentes, porque el Shadow DOM los aísla. Por eso cada componente incluye `baseStyles`, que pone `margin: 0`, `padding: 0` y `box-sizing` con `:where()` (especificidad cero, así nunca pisa los estilos propios):

```ts
static styles = [baseStyles, css`/* estilos del componente */`];
```

### Fuentes

Quicksand, Dosis y Barlow Condensed, cargadas desde Google Fonts en `index.html`.

---

## Componentes

### `<ph-icon>`

Renderiza un icono de Phosphor. Hereda el color con `currentColor` y el tamaño con `font-size`.

```html
<ph-icon name="trash"></ph-icon>
```

Para agregar un icono nuevo, impórtalo en `components/ui/icons.ts`:

```ts
import gear from '@phosphor-icons/core/assets/regular/gear-six.svg?raw';
export const icons = { /* ... */ gear } as const;
```

Solo se empaquetan los iconos que se importan ahí.

### `<app-button>`

Botón con variantes, estado de carga y slot para icono. Es *form-associated*, así que `type="submit"` y `type="reset"` funcionan con un `<form>` nativo.

| Propiedad | Valores | Por defecto |
| --- | --- | --- |
| `variant` | `primary` · `dark` · `outline` · `danger` · `ghost` | `primary` |
| `type` | `button` · `submit` · `reset` | `button` |
| `loading` | boolean (muestra spinner y deshabilita) | `false` |
| `disabled` | boolean | `false` |
| `block` | boolean (ocupa todo el ancho) | `false` |

```html
<app-button variant="dark" block type="submit">Login</app-button>

<app-button variant="danger">
  <ph-icon slot="icon" name="trash"></ph-icon> Eliminar
</app-button>
```

---

## Sesión: `auth-store`

Store propio, sin librerías. Persiste la sesión en `localStorage` (clave `tj:session`) y emite un evento `change` cada vez que cambia.

```ts
import { auth } from './state/auth-store';

auth.login({ token, user });       // guarda la sesión y notifica
auth.logout();                     // la borra y notifica
auth.isAuthenticated;              // boolean
auth.user;                         // { id, email, nombres, apellidos, role } | null
auth.token;                        // string | null

auth.addEventListener('change', () => { /* reaccionar */ });
```

Roles definidos: `ADMIN`, `TEACHER`, `STUDENT`.

---

## Páginas

### `<login-page>`

Tarjeta dividida: formulario a la izquierda y panel de imagen a la derecha (se oculta en pantallas menores a 720 px).

> **Temporal:** el botón "Entrar" crea una sesión falsa para poder probar la división entre páginas. Todavía no hay formulario real ni conexión con el backend.

### `<main-page>`

Esqueleto con encabezado, saludo al usuario y botón **Salir** (`auth.logout()`).

---

## Cómo probar lo hecho

1. Abrir `http://localhost:5173`: aparece el **login**.
2. Pulsar **Entrar (temporal)**: pasa a la **main page** y saluda al usuario.
3. Recargar la página: se mantiene en la main page (la sesión persiste).
4. Pulsar **Salir**: vuelve al login.
5. Abrir `http://localhost:5173/?playground`: muestra la página de pruebas de componentes.

El atajo `?playground` está en `app-root.ts` y es solo para desarrollo.

---

## Decisiones de diseño tomadas

- **Dos páginas, sin router.** Con solo login y main no se justifica un router.
- **Estado propio con `EventTarget`** en lugar de Redux.
- **Tokens CSS** como única fuente de verdad visual, para que el theming funcione a través del Shadow DOM.
- **Tema claro** en toda la app.
- **Iconos bajo demanda:** solo se importan los SVG que se usan.

---

## Próximo paso

Pop up de registro: componente `app-dialog` (sobre el `<dialog>` nativo) abierto desde el login.
