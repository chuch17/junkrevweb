const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "..", "locations", "scottsdale-az", "index.html");
let html = fs.readFileSync(p, "utf8");

html = html.replace(
  /\s*<p class="hero-title-shadow text-base sm:text-lg md:text-2xl lg:text-3xl font-black tracking-normal uppercase text-white text-center mt-4 px-2">\s*Serving Scottsdale, Arizona\s*<\/p>\s*/,
  "\n"
);

const scottsdaleTag =
  '\n            <p class="hero-title-shadow text-base sm:text-lg md:text-2xl lg:text-3xl font-black tracking-normal uppercase text-white text-center mx-auto w-full block mt-6 px-2">\n              Serving Scottsdale, Arizona\n            </p>\n';

const re =
  /(\s*<\/div>\s*<\/div>\s*<\/motion>\s*<\/motion>\s*<\/motion>\s*<\/motion>\s*<\/motion>\s*\n\s*<div\s*\n\s*class="absolute bottom-0 left-0 w-full h-\[4px\] bg-\[#f97316\] z-30 shadow-\[0_0_15px_rgba\(249,115,22,0\.5\)\]")/;

// Simpler: insert before hero orange bar (first occurrence after hero-contact)
const heroSectionStart = html.indexOf('class="hero-contact');
const heroSectionEnd = html.indexOf("</section>", heroSectionStart);
const hero = html.slice(heroSectionStart, heroSectionEnd);

const barIdx = hero.indexOf(
  'class="absolute bottom-0 left-0 w-full h-[4px] bg-[#f97316] z-30 shadow-[0_0_15px_rgba(249,115,22,0.5)]"'
);
if (barIdx === -1) {
  console.error("hero bar not found");
  process.exit(1);
}

const beforeBar = hero.lastIndexOf("</motion>", barIdx);
// wrong - use lastIndexOf </motion> before bar in hero slice - actually last closing container

const insertPoint = heroSectionStart + hero.lastIndexOf("\n\n          <motion", barIdx);
// Still wrong

const marker = `          </motion>

          <motion
            class="absolute bottom-0 left-0 w-full h-[4px] bg-[#f97316] z-30 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
          ></motion>
        </section>`;

const markerDiv = marker.replace(/motion/g, "div");

if (!html.includes(markerDiv)) {
  // try without self-closing split
  const m2 = `          </div>

          <motion
            class="absolute bottom-0 left-0 w-full h-[4px] bg-[#f97316] z-30 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
          ></div>
        </section>`.replace(/motion/g, "motion");
  console.error("marker missing", html.includes("Serving Scottsdale"));
  process.exit(1);
}

const replacement = `          </motion>
${scottsdaleTag}
          <motion
            class="absolute bottom-0 left-0 w-full h-[4px] bg-[#f97316] z-30 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
          ></motion>
        </section>`.replace(/motion/g, "div");

html = html.replace(markerDiv, replacement);

html = html.replace('src="images/logo.png"', 'src="../../images/logo.png"');

fs.writeFileSync(p, html);
console.log("fixed scottsdale hero layout");
