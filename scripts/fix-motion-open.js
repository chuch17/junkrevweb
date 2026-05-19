const fs = require("fs");
const path = require("path");
const p = path.join(__dirname, "..", "locations", "scottsdale-az", "index.html");
let h = fs.readFileSync(p, "utf8");
const open = "<" + "motion" + ' class="nav-locations-menu"';
const fixed = "<" + ["d", "i", "v"].join("") + ' class="nav-locations-menu"';
if (h.includes(open)) {
  h = h.split(open).join(fixed);
  fs.writeFileSync(p, h);
  console.log("fixed open tag");
} else {
  console.log("already ok");
}
