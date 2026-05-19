const fs = require("fs");
const path = require("path");

const cities = [
  "Downtown Phoenix",
  "North Phoenix",
  "West Phoenix",
  "East Phoenix",
  "South Phoenix",
  "scottsdale",
  "Glendale",
  "Peoria",
  "Tempe",
  "Mesa",
  "Gilbert",
  "Chandler",
];

const iconSvg =
  '<svg fill="none" width="20" height="20" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle r="3" cx="12" cy="10"></circle></svg>';

const nl = "\r\n";
let out = `            <div class="areas-grid areas-grid--compact">${nl}`;
for (const title of cities) {
  out += `              <div class="area-item area-item--compact">${nl}`;
  out += `                <div class="area-icon">${iconSvg}</div>${nl}`;
  out += `                <h3 class="section-subtitle area-item__title">${title}</h3>${nl}`;
  out += `              </div>${nl}`;
}
out += `            </div>`;

const gridRe =
  /            <motion class="areas-grid">[\s\S]*?            <\/div>(?=\r\n          <\/div>\r\n          <div\r\n            class="w-full h-\[4px\])/;

const gridRe2 =
  /            <div class="areas-grid">[\s\S]*?            <\/motion>(?=\r\n          <\/div>\r\n          <div\r\n            class="w-full h-\[4px\])/;

for (const rel of ["index.html", "locations/scottsdale-az/index.html"]) {
  const file = path.join(__dirname, "..", rel);
  let html = fs.readFileSync(file, "utf8");
  const re =
    /            <div class="areas-grid">[\s\S]*?            <\/motion>(?=\r\n          <\/div>\r\n          <div\r\n            class="w-full h-\[4px\])/;
  const re2 =
    /            <div class="areas-grid">[\s\S]*?            <\/motion>(?=\r\n          <\/div>\r\n          <div\r\n            class="w-full h-\[4px\])/;
  const fixed =
    /            <div class="areas-grid">[\s\S]*?            <\/div>(?=\r\n          <\/div>\r\n          <div\r\n            class="w-full h-\[4px\])/;
  if (!fixed.test(html)) {
    console.error("Pattern not found in", rel);
    process.exit(1);
  }
  html = html.replace(fixed, out);
  fs.writeFileSync(file, html);
  console.log("Patched", rel, "-", (html.match(/area-item--compact/g) || []).length, "cards");
}
