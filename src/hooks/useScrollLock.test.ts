import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScrollLock } from './useScrollLock';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.body.removeAttribute('style');
  document.documentElement.removeAttribute('style');
});

describe('modal background scroll lock', () => {
  it('locks only while open and restores existing styles when closed', () => {
    document.body.style.setProperty('overflow', 'auto', 'important');
    document.documentElement.style.overflow = 'scroll';
    const { rerender } = renderHook(({ open }) => useScrollLock(open), { initialProps: { open: false } });
    expect(document.body.style.overflow).toBe('auto');
    rerender({ open: true });
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');
    rerender({ open: false });
    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.style.getPropertyPriority('overflow')).toBe('important');
    expect(document.documentElement.style.overflow).toBe('scroll');
  });

  it('keeps the page locked until every overlay closes, regardless of close order', () => {
    const first = renderHook(() => useScrollLock());
    const second = renderHook(() => useScrollLock());
    first.unmount();
    expect(document.body.style.overflow).toBe('hidden');
    second.unmount();
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('compensates for the scrollbar and restores the original body padding', () => {
    document.body.style.paddingRight = '12px';
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(window.innerWidth - 15);
    const modal = renderHook(() => useScrollLock());
    expect(document.body.style.paddingRight).toBe('27px');
    modal.unmount();
    expect(document.body.style.paddingRight).toBe('12px');
  });
});
