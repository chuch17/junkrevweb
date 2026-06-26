(function () {
  function initCarousel(carousel) {
    var track = carousel.querySelector("[data-reviews-track]")
    var prev = carousel.querySelector("[data-reviews-prev]")
    var next = carousel.querySelector("[data-reviews-next]")
    if (!track) return

    function step() {
      var card = track.querySelector(".review-card")
      if (!card) return track.clientWidth * 0.85
      var styles = window.getComputedStyle(track)
      var gap = parseFloat(styles.columnGap || styles.gap || "16") || 16
      return card.getBoundingClientRect().width + gap
    }

    if (prev) {
      prev.addEventListener("click", function () {
        track.scrollBy({ left: -step(), behavior: "smooth" })
      })
    }
    if (next) {
      next.addEventListener("click", function () {
        track.scrollBy({ left: step(), behavior: "smooth" })
      })
    }

    // Disable arrows at the ends.
    function updateArrows() {
      var maxScroll = track.scrollWidth - track.clientWidth - 2
      if (prev) prev.disabled = track.scrollLeft <= 2
      if (next) next.disabled = track.scrollLeft >= maxScroll
    }
    track.addEventListener("scroll", updateArrows, { passive: true })
    window.addEventListener("resize", updateArrows)
    updateArrows()
  }

  function init() {
    document.querySelectorAll("[data-reviews-carousel]").forEach(initCarousel)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
