import { TOP_UNIVERSITIES, TopUniversity } from './topUniversities';

export interface UniversitySuggestion {
  id: string;
  name: string;
  country: string;
}

const cache = new Map<string, UniversitySuggestion[]>();

/**
 * Fast hybrid university search:
 * 1. Instant local search across top 300+ global universities & acronyms (0ms response).
 * 2. Prefix-wildcard remote query to ROR for any global institution.
 */
export async function searchUniversities(
  query: string,
  signal?: AbortSignal
): Promise<UniversitySuggestion[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];

  if (cache.has(q)) return cache.get(q)!;

  // 1. Instant local matching (supports names, countries, and aliases like KTH, MIT, TUM, AAU)
  const localMatches: UniversitySuggestion[] = TOP_UNIVERSITIES.filter((u) => {
    const nameMatch = u.name.toLowerCase().includes(q);
    const countryMatch = u.country.toLowerCase().includes(q);
    const aliasMatch = u.aliases?.some((a) => a.toLowerCase().includes(q));
    return nameMatch || countryMatch || aliasMatch;
  }).map((u) => ({
    id: `local-${u.name}`,
    name: u.name,
    country: u.country,
  }));

  // If query is very short, local matches are sufficient
  if (q.length < 2) {
    return localMatches.slice(0, 10);
  }

  // 2. Fetch from ROR with prefix wildcard so typing "chal" matches "Chalmers"
  let remoteMatches: UniversitySuggestion[] = [];
  try {
    const cleanTerm = q.replace(/[+\-=!(){}\[\]^"~*?:\\/|&<>]/g, ' ').trim();
    const wildcardQuery = `${cleanTerm}*`;
    const params = new URLSearchParams({
      query: wildcardQuery,
      filter: 'types:education',
    });

    const timeout = AbortSignal.timeout(4000);
    const response = await fetch(
      `https://api.ror.org/v2/organizations?${params}`,
      { signal: signal ? AbortSignal.any([signal, timeout]) : timeout }
    );

    if (response.ok) {
      const data = await response.json();
      remoteMatches = (data.items || [])
        .map((item: any) => ({
          id: item.id || `ror-${Math.random()}`,
          name:
            item.names?.find((n: any) => n.types?.includes('ror_display'))
              ?.value ||
            item.names?.[0]?.value ||
            '',
          country: [
            ...new Set(
              (item.locations || [])
                .map((loc: any) => loc.geonames_details?.country_name)
                .filter(Boolean)
            ),
          ].join(', '),
        }))
        .filter((item: UniversitySuggestion) => item.name);
    }
  } catch {
    // Graceful fallback to local matches if ROR fails or is offline
  }

  // Combine and deduplicate
  const combined = [...localMatches];
  remoteMatches.forEach((rm) => {
    if (
      !combined.some(
        (cm) => cm.name.toLowerCase() === rm.name.toLowerCase()
      )
    ) {
      combined.push(rm);
    }
  });

  const finalResults = combined.slice(0, 12);
  if (cache.size >= 200) cache.delete(cache.keys().next().value!);
  cache.set(q, finalResults);
  return finalResults;
}
