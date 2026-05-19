const fs = require("fs");
const path = require("path");
const { buildNavHtml } = require("./nav-template.js");
const { getCityPages } = require("../config/locations.js");

const indexPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(indexPath, "utf8");

const locations = getCityPages();
const locationLinks = locations
  .map(
    (loc) =>
      `                        <a href="locations/${loc.slug}/" class="block px-4 py-2.5 text-sm text-zinc-200 hover:bg-[#f97316] hover:text-white font-black no-underline transition-colors duration-150">${loc.cityName.replace(", Arizona", ", AZ")}</a>`
  )
  .join("\n");

const nav = buildNavHtml(
  "index.html",
  "./images/logo-white.png",
  "#services",
  "#quote",
  locationLinks,
  { mobileAction: "menu" }
);

const start = html.indexOf('<nav class="navigation-root');
if (start === -1) {
  const alt = html.indexOf('class="navigation-root relative');
  const navOpen = html.lastIndexOf("<nav", alt);
  if (navOpen === -1) throw new Error("nav not found");
  var startIdx = navOpen;
} else {
  var startIdx = start;
}
const end = html.indexOf("</nav>", startIdx) + "</nav>".length;

html = html.slice(0, startIdx) + nav.trim() + html.slice(end);
fs.writeFileSync(indexPath, html);
console.log("patched index.html navbar");
