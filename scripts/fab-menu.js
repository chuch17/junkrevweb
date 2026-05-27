(function () {
  var SMS_HREF =
    "sms:4805772655?body=Hi%20raccoon%20team.%20I%27d%20like%20a%20quote%20for%20my%20junk%20removal.%20I%27ll%20send%20over%20the%20photos%20shortly."

  var LOCATIONS = [
    { label: "Scottsdale, Arizona", href: "/locations/scottsdale-az/" },
    { label: "Peoria, Arizona", href: "/" },
  ]

  function smoothScrollTo(target) {
    var el =
      typeof target === "string" ? document.querySelector(target) : target
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function buildFabMenu() {
    if (document.getElementById("fab-menu")) return

    var root = document.createElement("div")
    root.className = "fab-menu"
    root.id = "fab-menu"

    var panel = document.createElement("div")
    panel.className = "fab-menu-panel"
    panel.id = "fab-menu-panel"
    panel.setAttribute("aria-hidden", "true")

    var textLink = document.createElement("a")
    textLink.className = "fab-menu-item"
    textLink.href = SMS_HREF
    textLink.textContent = "Text a Photo Now"
    panel.appendChild(textLink)

    var servicesBtn = document.createElement("button")
    servicesBtn.type = "button"
    servicesBtn.className = "fab-menu-item"
    servicesBtn.textContent = "Services"
    servicesBtn.addEventListener("click", function () {
      smoothScrollTo("#services")
      closeMenu()
    })
    panel.appendChild(servicesBtn)

    var locationsWrap = document.createElement("div")
    locationsWrap.className = "fab-menu-locations"
    locationsWrap.setAttribute("data-fab-locations", "")

    var locationsBtn = document.createElement("button")
    locationsBtn.type = "button"
    locationsBtn.className = "fab-menu-item fab-menu-item--toggle"
    locationsBtn.setAttribute("aria-expanded", "false")
    locationsBtn.innerHTML =
      'Locations <span class="fab-menu-chevron" aria-hidden="true">▾</span>'
    locationsWrap.appendChild(locationsBtn)

    var locationsList = document.createElement("div")
    locationsList.className = "fab-menu-locations-list"
    locationsList.setAttribute("aria-hidden", "true")

    LOCATIONS.forEach(function (loc) {
      var link = document.createElement("a")
      link.className = "fab-menu-locations-link"
      link.href = loc.href
      link.textContent = loc.label
      link.addEventListener("click", function () {
        closeMenu()
      })
      locationsList.appendChild(link)
    })

    locationsWrap.appendChild(locationsList)
    panel.appendChild(locationsWrap)

    var quoteBtn = document.createElement("button")
    quoteBtn.type = "button"
    quoteBtn.className = "fab-menu-item"
    quoteBtn.textContent = "Get a Quote"
    quoteBtn.addEventListener("click", function () {
      smoothScrollTo("#quote")
      closeMenu()
    })
    panel.appendChild(quoteBtn)

    var trigger = document.createElement("button")
    trigger.type = "button"
    trigger.className = "fab-menu-trigger"
    trigger.id = "fab-menu-trigger"
    trigger.setAttribute("aria-expanded", "false")
    trigger.setAttribute("aria-controls", "fab-menu-panel")
    trigger.setAttribute("aria-label", "Open quick actions menu")
    trigger.innerHTML =
      '<span class="fab-menu-icon fab-menu-icon--menu" aria-hidden="true">+</span>'

    root.appendChild(panel)
    root.appendChild(trigger)
    document.body.appendChild(root)

    function closeLocationsDropdown() {
      locationsList.classList.remove("is-open")
      locationsList.setAttribute("aria-hidden", "true")
      locationsBtn.setAttribute("aria-expanded", "false")
    }

    function closeMenu() {
      panel.classList.remove("is-open")
      panel.setAttribute("aria-hidden", "true")
      trigger.classList.remove("is-active")
      trigger.setAttribute("aria-expanded", "false")
      trigger.setAttribute("aria-label", "Open quick actions menu")
      closeLocationsDropdown()
    }

    function openMenu() {
      panel.classList.add("is-open")
      panel.setAttribute("aria-hidden", "false")
      trigger.classList.add("is-active")
      trigger.setAttribute("aria-expanded", "true")
      trigger.setAttribute("aria-label", "Close quick actions menu")
    }

    trigger.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) {
        closeMenu()
      } else {
        openMenu()
      }
    })

    locationsBtn.addEventListener("click", function (e) {
      e.stopPropagation()
      var willOpen = !locationsList.classList.contains("is-open")
      closeLocationsDropdown()
      if (willOpen) {
        locationsList.classList.add("is-open")
        locationsList.setAttribute("aria-hidden", "false")
        locationsBtn.setAttribute("aria-expanded", "true")
      }
    })

    textLink.addEventListener("click", function () {
      closeMenu()
    })

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) {
        closeMenu()
      }
    })

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu()
    })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildFabMenu)
  } else {
    buildFabMenu()
  }
})()
