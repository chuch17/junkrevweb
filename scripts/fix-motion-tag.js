const fs = require("fs");
const path = require("path");
const p = path.join(__dirname, "..", "index.html");
let h = fs.readFileSync(p, "utf8");
const bad = "</" + "motion>";
const good = "</" + ["d", "i", "v"].join("") + ">";
if (h.includes(bad)) {
  h = h.split(bad).join(good);
  fs.writeFileSync(p, h);
  console.log("fixed", bad, "->", good);
} else {
  console.log("no bad tag found");
}
