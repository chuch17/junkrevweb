/**
 * Single source of truth for hero copy and per-market phone numbers.
 *
 * Next.js usage:
 *   const data = locationData.scottsdale;
 *   <Hero dynamicText={data.heroText} />
 *   <Footer phone={data.phone} />
 *
 * Static site URLs use `slug` (e.g. locations/scottsdale-az/).
 * After edits: node scripts/generate-locations.js
 */

export type HomepageConfig = {
  heroText: string;
  phone: string;
};

export type CityLocationConfig = {
  /** Folder under /locations/ */
  slug: string;
  heroText: string;
  phone: string;
  cityName: string;
};

export const locationData = {
  homepage: {
    heroText: "Proudly Serving the Phoenix Metro Area",
    phone: "623-888-1023",
  },
  phoenix: {
    slug: "phoenix-az",
    heroText: "Proudly Serving Phoenix, Arizona",
    cityName: "Phoenix, Arizona",
    phone: "623-888-1023",
  },
  scottsdale: {
    slug: "scottsdale-az",
    heroText: "Proudly Serving Scottsdale, Arizona",
    cityName: "Scottsdale, Arizona",
    phone: "480-577-2655",
  },
  peoria: {
    slug: "peoria-az",
    heroText: "Proudly Serving Peoria, Arizona",
    cityName: "Peoria, Arizona",
    phone: "623-888-1023",
  },
  glendale: {
    slug: "glendale-az",
    heroText: "Proudly Serving Glendale, Arizona",
    cityName: "Glendale, Arizona",
    phone: "623-888-1023",
  },
  mesa: {
    slug: "mesa-az",
    heroText: "Proudly Serving Mesa, Arizona",
    cityName: "Mesa, Arizona",
    phone: "623-888-1023",
  },
  tempe: {
    slug: "tempe-az",
    heroText: "Proudly Serving Tempe, Arizona",
    cityName: "Tempe, Arizona",
    phone: "623-888-1023",
  },
  gilbert: {
    slug: "gilbert-az",
    heroText: "Proudly Serving Gilbert, Arizona",
    cityName: "Gilbert, Arizona",
    phone: "623-888-1023",
  },
  chandler: {
    slug: "chandler-az",
    heroText: "Proudly Serving Chandler, Arizona",
    cityName: "Chandler, Arizona",
    phone: "623-888-1023",
  },
} as const satisfies {
  homepage: HomepageConfig;
  phoenix: CityLocationConfig;
  scottsdale: CityLocationConfig;
  peoria: CityLocationConfig;
  glendale: CityLocationConfig;
  mesa: CityLocationConfig;
  tempe: CityLocationConfig;
  gilbert: CityLocationConfig;
  chandler: CityLocationConfig;
};

export type CityKey = Exclude<keyof typeof locationData, "homepage">;

export const CITY_KEYS: CityKey[] = [
  "phoenix",
  "scottsdale",
  "peoria",
  "glendale",
  "mesa",
  "tempe",
  "gilbert",
  "chandler",
];

export function telDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function getCityPages() {
  return CITY_KEYS.map((key) => {
    const entry = locationData[key];
    return {
      key,
      slug: entry.slug,
      heroText: entry.heroText,
      cityName: entry.cityName,
      phone: entry.phone,
      tel: telDigits(entry.phone),
    };
  });
}

/** Resolve config by URL slug (e.g. "scottsdale-az") */
export function getCityBySlug(slug: string) {
  return getCityPages().find((c) => c.slug === slug);
}
