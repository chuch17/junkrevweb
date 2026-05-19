const D = "div";

function buildNavHtml(homeHref, logoSrc, servicesHref, quoteHref, locationLinksHtml, options = {}) {
  const { mobileAction = "menu", tel = "" } = options;
  const mobileControls =
    mobileAction === "call"
      ? `<a href="tel:${tel}" class="md:hidden bg-[#f97316] text-white font-bold uppercase text-xs px-3 py-2 rounded-md no-underline">Call</a>`
      : `<button type="button" id="navToggle" aria-label="Open Menu" aria-controls="mobileOverlay" aria-expanded="false" class="navigation-mobile-toggle md:!hidden flex text-white hover:text-[#f97316] p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>`;

  return buildNavInner(homeHref, logoSrc, servicesHref, quoteHref, locationLinksHtml, mobileControls);
}

function buildNavInner(homeHref, logoSrc, servicesHref, quoteHref, locationLinksHtml, mobileControls) {
  return `    <nav class="navigation-root relative z-50 w-full bg-neutral-900 text-white border-b border-zinc-800 font-sans">
      <${D} class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <${D} class="flex items-center justify-between gap-4">
          <${D} class="flex-shrink-0 min-w-0">
            <a href="${homeHref}" class="flex items-center gap-3 no-underline decoration-transparent">
              <img src="${logoSrc}" alt="Clean Raccoon" class="h-10 w-auto object-contain flex-shrink-0" />
              <span class="text-sm font-medium text-zinc-100 hidden md:block whitespace-nowrap">Junk Removal &amp; Demolition</span>
            </a>
          </${D}>
          <${D} class="hidden md:flex items-center space-x-6 flex-shrink-0">
            <details class="nav-locations-dropdown relative inline-block text-left group select-none">
              <summary class="flex items-center gap-1 text-white hover:text-[#f97316] font-black uppercase text-sm tracking-wider list-none cursor-pointer transition-colors duration-200 focus:outline-none">
                Locations
                <svg class="w-4 h-4 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </summary>
              <${D} class="absolute left-0 mt-3 w-60 rounded-md shadow-2xl bg-neutral-950 border border-zinc-800 z-50 py-1 focus:outline-none">
${locationLinksHtml}
              </${D}>
            </details>
            <a href="${servicesHref}" class="text-white hover:text-[#f97316] font-black uppercase text-sm tracking-wider no-underline transition-colors duration-200">Services</a>
            <a href="${quoteHref}" class="bg-orange-500 text-white px-5 py-2 rounded-md font-bold uppercase tracking-wide hover:bg-orange-600 transition-all inline-flex items-center gap-1 no-underline">Get a Quote</a>
          </${D}>
          <${D} class="flex items-center gap-2 flex-shrink-0">
            ${mobileControls}
          </${D}>
        </${D}>
      </${D}>
    </nav>`;
}

module.exports = { buildNavHtml };
