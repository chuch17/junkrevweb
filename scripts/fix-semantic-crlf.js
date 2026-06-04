const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..")
const slugs = [
  "scottsdale-az",
  "peoria-az",
  "phoenix-az",
  "glendale-az",
  "tempe-az",
  "mesa-az",
  "gilbert-az",
  "chandler-az",
]
const files = [path.join(root, "index.html"), ...slugs.map((s) => path.join(root, "locations", s, "index.html"))]

function fixServiceArticles(html) {
  if (!html.includes("home-thq-service-card-elm1")) {
    return html
  }

  if (html.includes('<div class="home-thq-service-card-elm1 service-card">')) {
    html = html.replace(
      /<div class="home-thq-service-card-elm1 service-card">/,
      '<article class="home-thq-service-card-elm1 service-card">'
    )
  }

  if (html.includes('</article>\r\n                <div class="home-thq-service-card-elm2')) {
    html = html.replace(
      '                <div class="home-thq-service-card-elm2 service-card">',
      '<article class="home-thq-service-card-elm2 service-card">'
    )
  } else {
    html = html.replace(
      `                </div>\r\n              </div>\r\n                <div class="home-thq-service-card-elm2 service-card">`,
      `                </div>\r\n              </article>\r\n                <article class="home-thq-service-card-elm2 service-card">`
    )
  }

  if (html.includes('</article>\r\n              <article class="service-card">')) {
    // elm2 already closed
  } else if (html.includes('</article>\r\n              <div class="service-card">')) {
    html = html.replace(
      `                </div>\r\n              </div>\r\n              <div class="service-card">`,
      `                </div>\r\n              </article>\r\n              <article class="service-card">`
    )
  } else {
    html = html.replace(
      `                </div>\r\n              </div>\r\n              <div class="service-card">`,
      `                </div>\r\n              </article>\r\n              <article class="service-card">`
    )
    html = html.replace(
      `                </div>\r\n              </div>\r\n              <div class="service-card">`,
      `                </div>\r\n              </article>\r\n              <article class="service-card">`
    )
  }

  if (html.includes('</article>\r\n            </div>\r\n          </div>\r\n          <div\r\n            class="w-full h-[4px]')) {
    return html
  }

  return html.replace(
    `                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div\r\n            class="w-full h-[4px] bg-[#f97316]`,
    `                </div>\r\n              </article>\r\n            </div>\r\n          </div>\r\n          <div\r\n            class="w-full h-[4px] bg-[#f97316]`
  )
}

for (const filePath of files) {
  let html = fs.readFileSync(filePath, "utf8")

  // Fix malformed </main> insertion
  html = html.replace(/<\/div>\s*<\/main>/g, "</div>\r\n        </main>\r\n")

  // Fix article opened with div closed (partial first run)
  html = html.replace(
    /<article class="home-thq-service-card-elm1 service-card">([\s\S]*?)                <\/div>\r\n              <\/div>\r\n                <div class="home-thq-service-card-elm2 service-card">/,
    `<article class="home-thq-service-card-elm1 service-card">$1                </div>\r\n              </article>\r\n                <article class="home-thq-service-card-elm2 service-card">`
  )

  html = fixServiceArticles(html)
  fs.writeFileSync(filePath, html, "utf8")
  console.log("Fixed", path.relative(root, filePath))
}
