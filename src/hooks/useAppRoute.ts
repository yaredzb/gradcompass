import { useCallback, useEffect, useState } from 'react';
import { parseRoute } from '../lib/routes';

export function useAppRoute() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  const navigate = useCallback((path: string, replace = false) => {
    if (path === window.location.pathname + window.location.search + window.location.hash) return;
    if (replace) window.history.replaceState(null, '', path);
    else window.history.pushState(null, '', path);
    setPathname(window.location.pathname);
  }, []);
  return { route: parseRoute(pathname), pathname, navigate };
}
