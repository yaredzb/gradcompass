import type { Program } from '../types';

export type AppRoute = { view: 'catalog' | 'tree' | 'not-found' } | { view: 'detail'; programId: string };

export function programPath(program: Pick<Program, 'id' | 'university' | 'officialName'>) {
  const name = `${program.university} ${program.officialName.replace(/^\[DEMO EXAMPLE\]\s*/i, '')}`;
  const normalized = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
  const slug = Array.from(normalized).slice(0, 120).join('').replace(/-$/, '') || 'program';
  return `/programs/${encodeURIComponent(program.id)}/${encodeURIComponent(slug)}`;
}

export function parseRoute(pathname: string): AppRoute {
  if (pathname === '/') return { view: 'catalog' };
  if (/^\/directory\/?$/.test(pathname)) return { view: 'tree' };
  const match = pathname.match(/^\/programs\/([^/]+)(?:\/[^/]+)?\/?$/);
  if (match) {
    try { return { view: 'detail', programId: decodeURIComponent(match[1]) }; }
    catch { /* Malformed URLs show the not-found screen. */ }
  }
  return { view: 'not-found' };
}
