import { describe, expect, it } from 'vitest';
import { parseRoute, programPath } from './routes';

describe('program URLs', () => {
  it('encodes the original ID and produces a readable slug', () => {
    const path = programPath({ id: 'original/id 1', university: 'Université Aalto', officialName: '[DEMO EXAMPLE] M.Sc. in AI' });
    expect(path).toBe('/programs/original%2Fid%201/universite-aalto-m-sc-in-ai');
    expect(parseRoute(path)).toEqual({ view: 'detail', programId: 'original/id 1' });
    expect(parseRoute('/programs/original%2Fid%201/a-different-name')).toEqual(parseRoute(path));
    expect(parseRoute('/programs/original%2Fid%201')).toEqual(parseRoute(path));
  });
  it('rejects malformed IDs and unknown paths', () => {
    expect(parseRoute('/programs/%E0%A4/bad')).toEqual({ view: 'not-found' });
    expect(parseRoute('/programs')).toEqual({ view: 'not-found' });
    expect(parseRoute('/other')).toEqual({ view: 'not-found' });
  });
});
