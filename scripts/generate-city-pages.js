const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..")
const templatePath = path.join(root, "locations", "scottsdale-az", "index.html")

const CITIES = [
  { slug: "peoria-az", name: "Peoria" },
  { slug: "phoenix-az", name: "Phoenix" },
  { slug: "glendale-az", name: "Glendale" },
  { slug: "tempe-az", name: "Tempe" },
  { slug: "mesa-az", name: "Mesa" },
  { slug: "gilbert-az", name: "Gilbert" },
  { slug: "chandler-az", name: "Chandler" },
]

const NAV_LINKS = [
  { slug: "scottsdale-az", label: "Scottsdale, Arizona" },
  { slug: "peoria-az", label: "Peoria, Arizona" },
  { slug: "phoenix-az", label: "Phoenix, Arizona" },
  { slug: "glendale-az", label: "Glendale, Arizona" },
  { slug: "tempe-az", label: "Tempe, Arizona" },
  { slug: "mesa-az", label: "Mesa, Arizona" },
  { slug: "gilbert-az", label: "Gilbert, Arizona" },
  { slug: "chandler-az", label: "Chandler, Arizona" },
]

function buildNavDesktop() {
  const links = NAV_LINKS.map(
    (item) =>
      `                        <a href="/locations/${item.slug}/" class="nav-locations-menu-link">${item.label}</a>`
  ).join("\n")
  return `                      <div class="nav-locations-menu" data-locations-menu>
${links}
                        <a href="/" class="nav-locations-menu-link">Homepage</a>
                      </div>`
}

function buildNavMobile() {
  const links = NAV_LINKS.map(
    (item) =>
      `                      <a href="/locations/${item.slug}/" class="nav-locations-menu-link navigation-mobile-link">${item.label}</a>`
  ).join("\n")
  return `                    <div class="nav-locations-menu nav-locations-menu--mobile" data-locations-menu>
${links}
                      <a href="/" class="nav-locations-menu-link navigation-mobile-link">Homepage</a>
                    </div>`
}

function updateNavigation(html) {
  html = html.replace(
    /<div class="nav-locations-menu" data-locations-menu>[\s\S]*?<\/div>/,
    buildNavDesktop()
  )
  html = html.replace(
    /<div class="nav-locations-menu nav-locations-menu--mobile" data-locations-menu>[\s\S]*?<\/div>/,
    buildNavMobile()
  )
  return html
}

function customizeForCity(html, city) {
  let out = html
  out = out.replace(
    "<title>Clean Raccoon | Scottsdale, AZ</title>",
    `<title>Clean Raccoon | ${city.name}, AZ</title>`
  )
  out = out.replace(
    'aria-label="Clean Raccoon Scottsdale hero"',
    `aria-label="Clean Raccoon ${city.name} hero"`
  )
  out = out.replace(
    /Fast, reliable, and eco-friendly junk removal serving Scottsdale\s+and surrounding Arizona communities\./,
    `Fast, reliable, and eco-friendly junk removal serving ${city.name}\n              and surrounding Arizona communities.`
  )
  out = out.replace(
    /<p class="hero-desktop-location">Serving Scottsdale, Arizona<\/p>/,
    `<p class="hero-desktop-location">Serving ${city.name}, Arizona</p>`
  )
  out = out.replace(/Serving Scottsdale, Arizona/g, `Serving ${city.name}, Arizona`)
  return out
}

const template = fs.readFileSync(templatePath, "utf8")

for (const city of CITIES) {
  const outDir = path.join(root, "locations", city.slug)
  fs.mkdirSync(outDir, { recursive: true })
  let page = customizeForCity(template, city)
  page = updateNavigation(page)
  fs.writeFileSync(path.join(outDir, "index.html"), page, "utf8")
  console.log("Wrote locations/" + city.slug + "/index.html")
}

const scottsdalePath = path.join(root, "locations", "scottsdale-az", "index.html")
fs.writeFileSync(scottsdalePath, updateNavigation(template), "utf8")
console.log("Updated locations/scottsdale-az/index.html navigation")

const indexPath = path.join(root, "index.html")
const indexHtml = fs.readFileSync(indexPath, "utf8")
fs.writeFileSync(indexPath, updateNavigation(indexHtml), "utf8")
console.log("Updated index.html navigation")
