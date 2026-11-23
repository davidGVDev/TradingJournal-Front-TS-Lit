import plus from '@phosphor-icons/core/assets/regular/plus-circle.svg?raw';
import trash from '@phosphor-icons/core/assets/regular/trash.svg?raw';
import pencil from '@phosphor-icons/core/assets/regular/pencil-simple.svg?raw';
import x from '@phosphor-icons/core/assets/regular/x.svg?raw';

export const icons = { plus, trash, pencil, x } as const;
export type IconName = keyof typeof icons;