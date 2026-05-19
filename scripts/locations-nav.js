/**
 * Locations dropdown toggle (vanilla JS — mirrors React useState for static HTML).
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

  function init() {
    document.querySelectorAll("[data-locations-nav]").forEach(function (wrapper) {
      var trigger = wrapper.querySelector("[data-locations-trigger]");
      var menu = wrapper.querySelector("[data-locations-menu]");
      if (!trigger || !menu) return;

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = menu.classList.contains("is-open");
        setOpen(wrapper, !isOpen);
      });

      menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          setOpen(wrapper, false);
        });
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
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
