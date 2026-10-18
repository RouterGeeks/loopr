import { useLayoutEffect, useRef } from 'react';

// Restore focus only after an inline panel closes, never on initial render.
export function useCardFocus(mode: string) {
  const rootRef = useRef<HTMLDivElement>(null);
  const previousMode = useRef(mode);
  useLayoutEffect(() => {
    const previous = previousMode.current;
    previousMode.current = mode;
    if (mode === previous) return;
    if (mode === 'view') {
      const target = previous === 'choosing-delay' ? 'delay' : 'more';
      rootRef.current?.querySelector<HTMLButtonElement>(`[data-focus="${target}"]`)?.focus();
    } else if (mode === 'confirming-delete' || mode === 'choosing-delay') {
      rootRef.current?.querySelector<HTMLButtonElement>('[data-panel] button')?.focus();
    }
  }, [mode]);
  return rootRef;
}
