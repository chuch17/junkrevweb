const fs = require("fs");
const path = require("path");

const TAG = ["d", "i", "v"].join("");
const p = path.join(__dirname, "..", "locations", "scottsdale-az", "index.html");
let h = fs.readFileSync(p, "utf8");

function desktopNav() {
  return `
                    <${TAG} class="nav-locations-dropdown" data-locations-nav>
                      <button type="button" class="nav-locations-trigger navigation-link uppercase tracking-wider font-bold font-sans text-white hover:text-orange-500 transition-colors cursor-pointer flex items-center gap-1" data-locations-trigger aria-expanded="false" aria-haspopup="true">
                        <span>Locations</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                      </button>
                      <${TAG} class="nav-locations-menu" data-locations-menu>
                        <a href="locations/scottsdale-az/" class="nav-locations-menu-link">Scottsdale, Arizona</a>
                        <a href="/" class="nav-locations-menu-link">Homepage</a>
                      </${TAG}>
                    </${TAG}>`;
}

function mobileNav() {
  return `
                  <${TAG} class="nav-locations-dropdown nav-locations-dropdown--mobile" data-locations-nav>
                    <button type="button" class="nav-locations-trigger navigation-mobile-link uppercase tracking-wider font-bold font-sans text-white cursor-pointer flex items-center justify-between py-2 w-full text-left" data-locations-trigger aria-expanded="false" aria-haspopup="true">
                      <span>Locations</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <${TAG} class="nav-locations-menu nav-locations-menu--mobile" data-locations-menu>
                      <a href="locations/scottsdale-az/" class="nav-locations-menu-link navigation-mobile-link">Scottsdale, Arizona</a>
                      <a href="/" class="nav-locations-menu-link navigation-mobile-link">Homepage</a>
                    </${TAG}>
                  </${TAG}>`;
}

h = h.replace(/<details class="nav-locations-dropdown">[\s\S]*?<\/details>/, desktopNav().trim());
h = h.replace(
  /<details class="nav-locations-dropdown nav-locations-dropdown--mobile">[\s\S]*?<\/details>/,
  mobileNav().trim()
);
h = h.replace(/<\/?motion>/g, (m) => m.replace("motion", TAG));

if (!h.includes("locations-nav.js")) {
  h = h.replace("</body>", '    <script src="../../scripts/locations-nav.js" defer></script>\n  </body>');
}

fs.writeFileSync(p, h);
console.log("patched scottsdale nav");
