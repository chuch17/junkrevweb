const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "..", "index.html");
let h = fs.readFileSync(p, "utf8");

h = h.replace(
  '<div class="navigation-brand">',
  '<motion class="navigation-brand flex items-center gap-3">'.replace("motion", "div")
);

const inner =
  '                    <motion class="flex flex-col leading-tight">\n' +
  '                      <span class="section-title">Clean Raccoon</span>\n' +
  '                      <span class="text-xs font-medium text-zinc-400">Junk Removal &amp; Demolition</span>\n' +
  "                    </motion>\n" +
  "                  </motion>\n" +
  "                </a>\n" +
  "                <button\n" +
  '                  id="navClose"';
const innerFixed = inner.replace(/motion/g, "div");

h = h.replace(
  `                    <span class="section-title">Clean Raccoon</span>
                  </div>
                </a>
                <button
                  id="navClose"`,
  innerFixed
);

fs.writeFileSync(p, h);
console.log("mobile nav tagline added");
