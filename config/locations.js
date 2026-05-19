/**
 * Node build mirror of config/locations.ts — keep in sync.
 * Next: locationData.scottsdale → static URL: locations/scottsdale-az/
 */

const locationData = {
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
};

const CITY_KEYS = [
  "phoenix",
  "scottsdale",
  "peoria",
  "glendale",
  "mesa",
  "tempe",
  "gilbert",
  "chandler",
];

function telDigits(phone) {
  return phone.replace(/\D/g, "");
}

function getCityPages() {
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

function getCityBySlug(slug) {
  return getCityPages().find((c) => c.slug === slug);
}

module.exports = {
  locationData,
  CITY_KEYS,
  telDigits,
  getCityPages,
  getCityBySlug,
};
