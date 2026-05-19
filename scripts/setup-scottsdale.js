const fs = require("fs");
const path = require("path");

const TAG = "div";
const root = path.join(__dirname, "..");
const indexPath = path.join(root, "index.html");
const stylePath = path.join(root, "style.css");
const outDir = path.join(root, "locations", "scottsdale-az");
const outPath = path.join(outDir, "index.html");

function desktopLocationsNav(scottsdaleHref, homeHref) {
  return `
                    <details class="nav-locations-dropdown">
                      <summary class="navigation-link uppercase tracking-wider font-bold font-sans text-white hover:text-orange-500 transition-colors cursor-pointer list-none flex items-center gap-1">
                        <span>Locations</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <${TAG} class="nav-locations-menu">
                        <a href="${scottsdaleHref}" class="nav-locations-menu-link">Scottsdale, Arizona</a>
                        <a href="${homeHref}" class="nav-locations-menu-link">Homepage</a>
                      </${TAG}>
                    </details>
`;
}

function mobileLocationsNav(scottsdaleHref, homeHref) {
  return `
                  <details class="nav-locations-dropdown nav-locations-dropdown--mobile">
                    <summary class="navigation-mobile-link uppercase tracking-wider font-bold font-sans text-white cursor-pointer list-none flex items-center justify-between py-2">
                      <span>Locations</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                    </summary>
                    <${TAG} class="nav-locations-menu nav-locations-menu--mobile">
                      <a href="${scottsdaleHref}" class="nav-locations-menu-link navigation-mobile-link">Scottsdale, Arizona</a>
                      <a href="${homeHref}" class="nav-locations-menu-link navigation-mobile-link">Homepage</a>
                    </${TAG}>
                  </details>
`;
}

function injectLocationsNav(html, scottsdaleHref, homeHref) {
  if (html.includes("nav-locations-dropdown")) {
    return html;
  }

  html = html.replace(
    /(<a href="(?:#services|\.\.\/\.\.\/index\.html#services)">[\s\S]*?<\/a>)/,
    `$1${desktopLocationsNav(scottsdaleHref, homeHref)}`
  );

  html = html.replace(
    `<${TAG} class="navigation-mobile-links">`,
    `<${TAG} class="navigation-mobile-links">${mobileLocationsNav(scottsdaleHref, homeHref)}`
  );

  return html;
}

function addScottsdaleSubtitle(html) {
  if (html.includes("Serving Scottsdale, Arizona")) {
    return html;
  }
  const tag =
    '\n            <p class="hero-title-shadow text-base sm:text-lg md:text-2xl lg:text-3xl font-black tracking-normal uppercase text-white text-center mx-auto w-full block mt-6 px-2">\n              Serving Scottsdale, Arizona\n            </p>\n';
  const marker =
    '          </div>\n\n          <motion\n            class="absolute bottom-0 left-0 w-full h-[4px] bg-[#f97316] z-30 shadow-[0_0_15px_rgba(249,115,22,0.5)]"';
  const markerDiv = marker.replace(/motion/g, "motion").replace(/motion/g, "motion");
  return html.replace(marker.replace(/motion/g, "div"), tag + marker.replace(/motion/g, "motion"));
}

function scottsdaleFooterPhone(html) {
  const footerStart = html.indexOf('<footer class="footer-root">');
  if (footerStart === -1) return html;
  const footerEnd = html.indexOf("</footer>", footerStart) + "</footer>".length;
  const footer = html
    .slice(footerStart, footerEnd)
    .replace(/tel:6238881023/g, "tel:4805772655")
    .replace(/\(623\) 888-1023/g, "480-577-2655");
  return html.slice(0, footerStart) + footer + html.slice(footerEnd);
}

function toScottsdalePaths(html) {
  let out = html
    .replace(/href="\.\//g, 'href="../../')
    .replace(/src="\.\//g, 'src="../../')
    .replace(/href="images\//g, 'href="../../images/')
    .replace(/src="images\//g, 'src="../../images/')
    .replace(/href="videos\//g, 'href="../../videos/')
    .replace(/src="videos\//g, 'src="../../videos/');
  out = out.replace(/href="index\.html/g, 'href="../../index.html');
  out = out.replace(/href="#/g, 'href="../../index.html#');
  return out;
}

function appendNavCss() {
  const block = `
/* Locations dropdown */
.nav-locations-dropdown { position: relative; display: inline-block; }
.nav-locations-dropdown summary::-webkit-details-marker { display: none; }
.nav-locations-menu {
  position: absolute; left: 0; top: calc(100% + 8px); min-width: 220px;
  background: #111827; border: 1px solid rgba(255,255,255,0.12); border-radius: 6px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.45); z-index: 9999; padding: 4px 0; overflow: hidden;
}
.nav-locations-menu--mobile {
  position: relative; top: auto; left: auto; margin-top: 8px;
  box-shadow: none; border: 1px solid rgba(255,255,255,0.08);
}
.nav-locations-menu-link {
  display: block; padding: 12px 16px; color: #f4f4f5; font-weight: 700; font-size: 14px;
  text-transform: uppercase; letter-spacing: 0.06em; text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
.nav-locations-menu-link:hover, .nav-locations-menu-link:focus {
  background: #f97316; color: #fff; text-decoration: none;
}
.navigation-root { position: relative; z-index: 1000; }
`;
  let css = fs.readFileSync(stylePath, "utf8");
  if (!css.includes("nav-locations-dropdown")) {
    fs.writeFileSync(stylePath, css + block);
  }
}

let indexHtml = fs.readFileSync(indexPath, "utf8");
indexHtml = injectLocationsNav(indexHtml, "locations/scottsdale-az/", "index.html");
fs.writeFileSync(indexPath, indexHtml);
appendNavCss();

let scottsdaleHtml = toScottsdalePaths(indexHtml);
scottsdaleHtml = scottsdaleHtml.replace(
  /href="locations\/scottsdale-az\/"/g,
  'href="./"'
);
scottsdaleHtml = scottsdaleHtml.replace(
  /href="index\.html"/g,
  'href="../../index.html"'
);
scottsdaleHtml = addScottsdaleSubtitle(scottsdaleHtml);
scottsdaleHtml = scottsdaleFooterPhone(scottsdaleHtml);
scottsdaleHtml = scottsdaleHtml.replace(
  /<title>Clean Raccoon<\/title>/,
  "<title>Clean Raccoon | Scottsdale, AZ</title>"
);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, scottsdaleHtml);

console.log("Updated index.html with Locations nav");
console.log("Wrote locations/scottsdale-az/index.html");
