import { PrimaryRegion, RegionMappingResult } from '../types';

// Pre-defined country groups
const GCC_COUNTRIES = new Set([
  'United Arab Emirates',
  'UAE',
  'Saudi Arabia',
  'Qatar',
  'Bahrain',
  'Kuwait',
  'Oman',
]);

const NORDIC_COUNTRIES = new Set([
  'Denmark',
  'Norway',
  'Finland',
  'Sweden',
]);

const EUROPE_COUNTRIES = new Set([
  ...NORDIC_COUNTRIES,
  'Germany',
  'France',
  'Switzerland',
  'United Kingdom',
  'UK',
  'Netherlands',
  'Italy',
  'Spain',
  'Austria',
  'Belgium',
  'Ireland',
  'Portugal',
  'Poland',
  'Czechia',
  'Czech Republic',
  'Greece',
  'Estonia',
  'Hungary',
  'Romania',
  'Croatia',
  'Slovakia',
  'Lithuania',
  'Latvia',
  'Slovenia',
  'Cyprus',
  'Luxembourg',
  'Malta',
  'Iceland',
]);

const ASIA_COUNTRIES = new Set([
  'Japan',
  'China',
  'South Korea',
  'Korea',
  'Singapore',
  'Malaysia',
  'Taiwan',
  'Hong Kong',
  'India',
  'Indonesia',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Pakistan',
  'Bangladesh',
  'Turkey',
  'Türkiye',
  'Israel',
]);

const USA_SYNONYMS = new Set([
  'United States',
  'USA',
  'United States of America',
  'US',
]);

const CANADA_SYNONYMS = new Set([
  'Canada',
]);

const OCEANIA_COUNTRIES = new Set([
  'Australia',
  'New Zealand',
  'Fiji',
  'Papua New Guinea',
]);

// Master list of all sovereign world countries for the searchable picker
export const ALL_COUNTRIES: string[] = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo (Congo-Brazzaville)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
  'Czechia', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia',
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo',
  'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen', 'Zambia', 'Zimbabwe'
].sort();

/**
 * Maps a single country name to its primary geopolitical browsing group and subgroups.
 * Enforces GCC precedence over Asia, and Nordic subgroup within Europe.
 */
export function getCountryRegion(country: string): RegionMappingResult {
  const normalized = country.trim();

  // 1. GCC takes strict precedence
  if (GCC_COUNTRIES.has(normalized)) {
    return {
      primaryRegion: 'GCC',
      isNordic: false,
      displayGroups: ['GCC'],
    };
  }

  // 2. USA top-level group
  if (USA_SYNONYMS.has(normalized)) {
    return {
      primaryRegion: 'USA',
      isNordic: false,
      displayGroups: ['USA'],
    };
  }

  // 3. Canada top-level group
  if (CANADA_SYNONYMS.has(normalized)) {
    return {
      primaryRegion: 'Canada',
      isNordic: false,
      displayGroups: ['Canada'],
    };
  }

  // 4. Europe and Nordic countries subgroup
  if (NORDIC_COUNTRIES.has(normalized)) {
    return {
      primaryRegion: 'Europe',
      isNordic: true,
      displayGroups: ['Europe', 'Nordic countries'],
    };
  }

  if (EUROPE_COUNTRIES.has(normalized)) {
    return {
      primaryRegion: 'Europe',
      isNordic: false,
      displayGroups: ['Europe'],
    };
  }

  // 5. Asia (excluding GCC)
  if (ASIA_COUNTRIES.has(normalized)) {
    return {
      primaryRegion: 'Asia',
      isNordic: false,
      displayGroups: ['Asia'],
    };
  }

  // 6. Oceania
  if (OCEANIA_COUNTRIES.has(normalized)) {
    return {
      primaryRegion: 'Oceania',
      isNordic: false,
      displayGroups: ['Oceania'],
    };
  }

  // 7. Other regions
  return {
    primaryRegion: 'Other regions',
    isNordic: false,
    displayGroups: ['Other regions'],
  };
}

/**
 * Automatically computes all assigned browsing groups for an array of countries (e.g. joint programs).
 */
export function getAssignedRegionsForCountries(countries: string[]): string[] {
  if (!countries || countries.length === 0) {
    return [];
  }

  const groupsSet = new Set<string>();

  for (const c of countries) {
    const result = getCountryRegion(c);
    result.displayGroups.forEach((g) => groupsSet.add(g));
  }

  if (groupsSet.size === 0) {
    groupsSet.add('Other regions');
  }

  return Array.from(groupsSet);
}

/**
 * Clean human-readable phrasing for assigned regions.
 * e.g. "Europe (Nordic countries)" instead of "Europe / Nordic countries"
 */
export function formatRegionDisplay(regions: string[]): string {
  if (!regions || regions.length === 0) return 'Global';
  if (regions.includes('Nordic countries') && regions.includes('Europe')) {
    const others = regions.filter((r) => r !== 'Nordic countries' && r !== 'Europe');
    const base = 'Europe (Nordic countries)';
    return others.length > 0 ? `${base}, ${others.join(', ')}` : base;
  }
  return regions.join(', ');
}
