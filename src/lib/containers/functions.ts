import type { CSSProperties } from 'react';

export type SlotPosition = 'left' | 'center' | 'right';

const positionStyles: Record<SlotPosition, CSSProperties> = {
  left: { transform: 'translateX(-100%)' },
  center: { transform: 'translateX(0%)' },
  right: { transform: 'translateX(100%)' },
};

export function getCurrentStyle(position: SlotPosition): CSSProperties {
  return positionStyles[position];
}

export function getPosition(element: HTMLElement | null): { x: number; y: number } {
  let xPosition = 0;
  let yPosition = 0;
  let el = element;

  while (el) {
    xPosition += el.offsetLeft - el.scrollLeft + el.clientLeft;
    yPosition += el.offsetTop - el.scrollTop + el.clientTop;
    el = el.offsetParent as HTMLElement | null;
  }

  return { x: xPosition, y: yPosition };
}
