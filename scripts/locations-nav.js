/**
 * Locations dropdown — global toggleLocationsNav() for inline onclick + enhancements.
 * Selectors: [data-locations-nav], [data-locations-trigger], [data-locations-menu]
 */
(function () {
  function closeAll(except) {
    document.querySelectorAll("[data-locations-nav]").forEach(function (wrapper) {
      if (wrapper === except) return;
      var menu = wrapper.querySelector("[data-locations-menu]");
      var trigger = wrapper.querySelector("[data-locations-trigger]");
      if (!menu || !trigger) return;
      menu.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    });
  }

  function setOpen(wrapper, open) {
    var menu = wrapper.querySelector("[data-locations-menu]");
    var trigger = wrapper.querySelector("[data-locations-trigger]");
    if (!menu || !trigger) return;
    if (open) closeAll(wrapper);
    menu.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  window.toggleLocationsNav = function (event, trigger) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!trigger || !trigger.closest) return false;
    var wrapper = trigger.closest("[data-locations-nav]");
    if (!wrapper) return false;
    var menu = wrapper.querySelector("[data-locations-menu]");
    if (!menu) return false;
    setOpen(wrapper, !menu.classList.contains("is-open"));
    return false;
  };

  function bindEnhancements() {
    document.querySelectorAll("[data-locations-nav] [data-locations-menu] a").forEach(function (link) {
      link.addEventListener("click", function () {
        var wrapper = link.closest("[data-locations-nav]");
        if (wrapper) setOpen(wrapper, false);
      });
    });

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-locations-nav]")) return;
      closeAll(null);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll(null);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindEnhancements);
  } else {
    bindEnhancements();
  }
})();
