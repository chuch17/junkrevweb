const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..")

const HOME_META =
  "Clean Raccoon provides fast, eco-friendly junk removal and demolition across Peoria, Phoenix, Scottsdale, and AZ. Call 623-888-1023 for a free quote today."

const CITY_META = {
  Peoria:
    "Clean Raccoon provides fast, eco-friendly junk removal, property cleanouts, and light demolition in Peoria, AZ. Call 623-888-1023 for a free quote today.",
  Phoenix:
    "Clean Raccoon provides fast, eco-friendly junk removal, property cleanouts, and light demolition in Phoenix, AZ. Call 623-888-1023 for a free quote today.",
  Scottsdale:
    "Clean Raccoon provides fast, eco-friendly junk removal, property cleanouts, and light demolition in Scottsdale, AZ. Call 623-888-1023 for a free quote today.",
  Glendale:
    "Clean Raccoon provides fast, eco-friendly junk removal, property cleanouts, and light demolition in Glendale, AZ. Call 623-888-1023 for a free quote today.",
  Tempe:
    "Clean Raccoon provides fast, eco-friendly residential and commercial junk removal and demolition in Tempe, AZ. Call 623-888-1023 for a free quote today.",
  Mesa:
    "Clean Raccoon provides fast, eco-friendly residential and commercial junk removal and demolition in Mesa, AZ. Call 623-888-1023 for a free quote today.",
  Gilbert:
    "Clean Raccoon provides fast, eco-friendly junk removal, property cleanouts, and light demolition in Gilbert, AZ. Call 623-888-1023 for a free quote today.",
  Chandler:
    "Clean Raccoon provides fast, eco-friendly junk removal, property cleanouts, and light demolition in Chandler, AZ. Call 623-888-1023 for a free quote today.",
}

const CITY_SLUGS = {
  "scottsdale-az": "Scottsdale",
  "peoria-az": "Peoria",
  "phoenix-az": "Phoenix",
  "glendale-az": "Glendale",
  "tempe-az": "Tempe",
  "mesa-az": "Mesa",
  "gilbert-az": "Gilbert",
  "chandler-az": "Chandler",
}

function metaTag(content) {
  return `    <meta name="description" content="${content}" />`
}

function setMetaDescription(html, content) {
  const tag = metaTag(content)
  if (html.includes('name="description"')) {
    return html.replace(
      /\s*<meta name="description" content="[^"]*" \/>/,
      "\n" + tag
    )
  }
  return html.replace(/<meta charset="utf-8" \/>/, `<meta charset="utf-8" />\n${tag}`)
}

function addSemanticLandmarks(html) {
  if (html.includes('id="main-content"')) {
    return html
  }

  html = html.replace(
    /(<div class="home-container10">\s*)(<navigation-wrapper)/,
    '$1<header class="site-header" role="banner">\n        $2'
  )
  html = html.replace(
    /(<\/navigation-wrapper>)(\s*)(<section)/,
    "$1\n        </header>\n        <main id=\"main-content\">$2$3"
  )
  html = html.replace(
    /(\s*)(<footer-wrapper class="footer-wrapper">)/,
    "        </main>\n$1$2"
  )

  return html
}

function addServiceArticles(html) {
  html = html.replace(
    /<div class="home-thq-service-card-elm1 service-card">/,
    '<article class="home-thq-service-card-elm1 service-card">'
  )

  html = html.replace(
    `                </div>
              </div>
                <div class="home-thq-service-card-elm2 service-card">`,
    `                </div>
              </article>
                <article class="home-thq-service-card-elm2 service-card">`
  )

  html = html.replace(
    `                </div>
              </div>
              <div class="service-card">`,
    `                </div>
              </article>
              <article class="service-card">`
  )
  html = html.replace(
    `                </div>
              </div>
              <div class="service-card">`,
    `                </div>
              </article>
              <article class="service-card">`
  )
  html = html.replace(
    `                </div>
              </div>
            </div>
          </div>
          <div
            class="w-full h-[4px] bg-[#f97316]`,
    `                </div>
              </article>
            </div>
          </div>
          <div
            class="w-full h-[4px] bg-[#f97316]`
  )

  return html
}

function processFile(filePath, metaContent) {
  let html = fs.readFileSync(filePath, "utf8")
  html = setMetaDescription(html, metaContent)
  html = addSemanticLandmarks(html)
  html = addServiceArticles(html)
  fs.writeFileSync(filePath, html, "utf8")
  console.log("Updated", path.relative(root, filePath))
}

processFile(path.join(root, "index.html"), HOME_META)

for (const [slug, city] of Object.entries(CITY_SLUGS)) {
  const filePath = path.join(root, "locations", slug, "index.html")
  processFile(filePath, CITY_META[city])
}
