const fs = require("fs");
const path = require("path");

const D = "div";

// Phone map: Scottsdale = 480-577-2655; all other metros = site general line (623-888-1023)
const locations = [
  { slug: "phoenix-az", cityName: "Phoenix, Arizona", phone: "623-888-1023", tel: "6238881023" },
  { slug: "scottsdale-az", cityName: "Scottsdale, Arizona", phone: "480-577-2655", tel: "4805772655" },
  { slug: "peoria-az", cityName: "Peoria, Arizona", phone: "623-888-1023", tel: "6238881023" },
  { slug: "glendale-az", cityName: "Glendale, Arizona", phone: "623-888-1023", tel: "6238881023" },
  { slug: "mesa-az", cityName: "Mesa, Arizona", phone: "623-888-1023", tel: "6238881023" },
  { slug: "tempe-az", cityName: "Tempe, Arizona", phone: "623-888-1023", tel: "6238881023" },
  { slug: "gilbert-az", cityName: "Gilbert, Arizona", phone: "623-888-1023", tel: "6238881023" },
  { slug: "chandler-az", cityName: "Chandler, Arizona", phone: "623-888-1023", tel: "6238881023" },
];

const locationLinks = locations
  .map(
    (loc) =>
      `                        <a href="../${loc.slug}/" class="block px-4 py-2.5 text-sm text-zinc-200 hover:bg-[#f97316] hover:text-white font-black no-underline transition-colors duration-150">${loc.cityName.replace(", Arizona", ", AZ")}</a>`
  )
  .join("\n");

function buildPage(loc) {
  const title = `Junk Removal ${loc.cityName} | Clean Raccoon`;
  const shortArea = loc.cityName.replace(", Arizona", "");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${title}</title>
    <meta name="description" content="Professional junk removal and demolition in ${loc.cityName}. Call Clean Raccoon for fast local service." />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="utf-8" />
    <link rel="icon" href="../../images/favicon.png" type="image/png" />
    <link rel="stylesheet" href="https://unpkg.com/animate.css@4.1.1/animate.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config = { corePlugins: { preflight: false } };</script>
    <link rel="stylesheet" href="../../style.css" />
    <link rel="stylesheet" href="../../index.css" />
  </head>
  <body class="bg-neutral-950 text-white min-h-screen flex flex-col font-sans overflow-x-hidden">
    <nav class="navigation-root relative z-50 w-full bg-neutral-950/90 backdrop-blur-md border-b border-zinc-800 font-sans">
      <${D} class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <${D} class="flex items-center justify-between h-20">
          <${D} class="flex-shrink-0">
            <a href="../../index.html" class="flex items-center no-underline decoration-transparent">
              <img src="../../images/logo-white.png" alt="Clean Raccoon Logo" class="h-14 w-auto object-contain" />
            </a>
          </${D}>
          <${D} class="hidden md:flex items-center space-x-6">
            <details class="nav-locations-dropdown relative inline-block text-left group select-none">
              <summary class="flex items-center gap-1 text-white hover:text-[#f97316] font-black uppercase text-sm tracking-wider list-none cursor-pointer transition-colors duration-200 focus:outline-none">
                Locations
                <svg class="w-4 h-4 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </summary>
              <${D} class="absolute left-0 mt-3 w-60 rounded-md shadow-2xl bg-neutral-950 border border-zinc-800 z-50 py-1 focus:outline-none">
${locationLinks}
              </${D}>
            </details>
            <a href="../../index.html#services" class="text-white hover:text-[#f97316] font-black uppercase text-sm tracking-wider no-underline transition-colors duration-200">Services</a>
            <a href="../../index.html#quote" class="bg-orange-500 text-white px-5 py-2 rounded-md font-bold uppercase tracking-wide hover:bg-orange-600 transition-all inline-flex items-center gap-1 no-underline">Get a Quote</a>
          </${D}>
          <a href="tel:${loc.tel}" class="md:hidden bg-[#f97316] text-white font-bold uppercase text-xs px-3 py-2 rounded-md">Call</a>
        </${D}>
      </${D}>
    </nav>

    <section class="hero-contact relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-neutral-950">
      <video autoplay loop muted playsinline class="hidden md:block absolute top-0 left-0 w-full h-full object-cover z-0"><source src="../../videos/landfill.mp4" type="video/mp4" /></video>
      <video autoplay loop muted playsinline class="block md:hidden absolute top-0 left-0 w-full h-full object-cover z-0"><source src="../../videos/mobile-dumpster.mp4" type="video/mp4" /></video>
      <${D} class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.01)_0%,rgba(0,0,0,0.35)_50%,rgba(0,0,0,0.95)_100%)] md:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.01)_0%,rgba(0,0,0,0.38)_58%,rgba(0,0,0,0.95)_100%)] z-10 pointer-events-none"></${D}>

      <${D} class="relative z-20 container mx-auto px-4 text-center max-w-5xl pt-6 md:pt-12 flex flex-col items-center justify-center">
        <${D} class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 mb-2 w-full">
          <${D} class="flex-shrink-0 drop-shadow-[0_4px_25px_rgba(249,115,22,0.65)] md:-mr-8 relative z-30">
            <img src="../../images/logo.png" alt="Clean Raccoon Logo" class="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-52 lg:h-52 object-scale-down mx-auto" />
          </${D}>
          <h1 class="hero-title-shadow text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-normal uppercase text-white text-center relative z-20">Clean Raccoon</h1>
        </${D}>
        <p class="hero-subtitle-shadow text-base sm:text-lg md:text-2xl lg:text-3xl font-extrabold tracking-wide uppercase text-white mb-4 text-center px-2">Junk Removal &amp; Demolition</p>
        <${D} class="mb-5 animate-pulse">
          <span class="text-sm md:text-xl font-black tracking-widest text-white uppercase px-5 py-2 bg-gradient-to-r from-orange-600/80 via-[#f97316]/90 to-orange-600/80 border-2 border-[#f97316] rounded-md shadow-[0_0_15px_rgba(249,115,22,0.4)]">Proudly Serving ${loc.cityName}</span>
        </${D}>
        <p class="text-zinc-100 text-sm sm:text-base md:text-2xl max-w-md md:max-w-2xl font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed text-center mb-8 px-4">We haul away the stress in ${loc.cityName} so you can enjoy a clutter free environment.</p>
        <${D} class="flex justify-center items-center w-full">
          <a href="tel:${loc.tel}" class="bg-[#f97316] hover:bg-orange-600 text-white font-black uppercase tracking-wider text-lg px-8 py-4 rounded-md shadow-[0_4px_25px_rgba(249,115,22,0.55)] transition-all duration-200 transform hover:-translate-y-1 no-underline">Call Live Crew: ${loc.phone}</a>
        </${D}>
      </${D}>
      <${D} class="absolute bottom-0 left-0 w-full h-[4px] bg-[#f97316] z-30 shadow-[0_0_15px_rgba(249,115,22,0.5)]"></${D}>
    </section>

    <main class="w-full relative z-20 bg-neutral-950 flex-1">
      <section class="bg-white py-16 px-4">
        <${D} class="max-w-4xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl font-black text-neutral-900 uppercase mb-4">Full-Service Junk Removal in ${shortArea}</h2>
          <p class="text-neutral-600 mb-6">Residential cleanouts, commercial hauling, shed removal, and light demolition — serving ${loc.cityName} and nearby communities.</p>
          <a href="../../index.html#services" class="inline-flex items-center gap-2 bg-neutral-900 text-white font-bold uppercase tracking-wide px-6 py-3 rounded-md hover:bg-[#f97316] transition-colors">View All Services</a>
        </${D}>
      </section>
    </main>

    <footer class="bg-neutral-900 border-t border-zinc-800 py-12 relative z-20 mt-auto font-sans">
      <${D} class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-[#f97316] font-black text-xl uppercase tracking-wider mb-2">Clean Raccoon Hauling</p>
        <p class="text-zinc-400 max-w-xl mx-auto text-sm font-medium mb-4">Your premier local choice for professional junk removal, shed removals, light demolition, and bulk cleanups throughout the greater ${loc.cityName} service areas.</p>
        <${D} class="flex flex-col items-center justify-center gap-2 text-zinc-300 font-bold">
          <p>Direct Crew Line: <a href="tel:${loc.tel}" class="text-white hover:text-[#f97316] underline font-bold tracking-wide">${loc.phone}</a></p>
          <p class="text-xs text-zinc-500 font-semibold uppercase tracking-widest mt-4">© 2026 Clean Raccoon Junk Removal &amp; Demolition — ${loc.cityName}, AZ Hub</p>
          <a href="../../index.html" class="text-sm text-zinc-500 hover:text-[#f97316] mt-4 inline-block no-underline">← Back to main site</a>
        </${D}>
      </${D}>
    </footer>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("video").forEach(function (video) {
          var p = video.play();
          if (p && typeof p.catch === "function") p.catch(function () {});
        });
      });
    </script>
  </body>
</html>`;
}

const root = path.join(__dirname, "..", "locations");
for (const loc of locations) {
  const dir = path.join(root, loc.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), buildPage(loc));
  console.log("wrote", loc.slug);
}
