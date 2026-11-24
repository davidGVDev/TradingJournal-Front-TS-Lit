import plus from "@phosphor-icons/core/assets/regular/plus-circle.svg?raw";
import trash from "@phosphor-icons/core/assets/bold/trash-bold.svg?raw";
import pencil from "@phosphor-icons/core/assets/regular/pencil-simple.svg?raw";
import x from "@phosphor-icons/core/assets/regular/x.svg?raw";
import check from "@phosphor-icons/core/assets/bold/check-bold.svg?raw";
import caretDown from "@phosphor-icons/core/assets/regular/caret-down.svg?raw";
import magnifyingGlass from "@phosphor-icons/core/assets/regular/magnifying-glass.svg?raw";
import caretUpDown from "@phosphor-icons/core/assets/regular/caret-up-down.svg?raw";
import eye from "@phosphor-icons/core/assets/regular/eye.svg?raw";
import eyeSlash from "@phosphor-icons/core/assets/regular/eye-slash.svg?raw";
import envelopeSimple from "@phosphor-icons/core/assets/regular/envelope-simple.svg?raw";
import lockSimple from "@phosphor-icons/core/assets/regular/lock-simple.svg?raw";
import user from "@phosphor-icons/core/assets/regular/user.svg?raw";

export const icons = {
  plus,
  trash,
  pencil,
  x,
  check,
  "caret-down": caretDown,
  "magnifying-glass": magnifyingGlass,
  "caret-up-down": caretUpDown,
  eye,
  'eye-slash': eyeSlash,
  'envelope-simple': envelopeSimple,
  'lock-simple': lockSimple,
  user,
} as const;
export type IconName = keyof typeof icons;
