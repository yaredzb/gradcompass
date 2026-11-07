import { useLayoutEffect } from 'react';

let locks = 0;
let restoreScroll: (() => void) | undefined;

/** Keep the page locked until the last open overlay closes. */
export function useScrollLock(isOpen = true) {
  useLayoutEffect(() => {
    if (!isOpen) return;
    if (locks === 0) {
      const root = document.documentElement;
      const body = document.body;
      const properties = [[root, 'overflow'], [body, 'overflow'], [body, 'padding-right']] as const;
      const previous = properties.map(([element, property]) => ({
        element, property,
        value: element.style.getPropertyValue(property),
        priority: element.style.getPropertyPriority(property),
      }));
      const scrollbarWidth = root.clientWidth > 0 ? window.innerWidth - root.clientWidth : 0;
      const padding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      root.style.setProperty('overflow', 'hidden');
      body.style.setProperty('overflow', 'hidden');
      if (scrollbarWidth > 0) body.style.setProperty('padding-right', `${padding + scrollbarWidth}px`);
      restoreScroll = () => previous.forEach(({ element, property, value, priority }) => {
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      });
    }
    locks++;
    return () => {
      locks--;
      if (locks === 0) { restoreScroll?.(); restoreScroll = undefined; }
    };
  }, [isOpen]);
}
