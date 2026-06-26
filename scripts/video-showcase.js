(function () {
  function init(vshow) {
    var stage = vshow.querySelector("[data-vshow-stage]")
    var slides = Array.prototype.slice.call(vshow.querySelectorAll("[data-vshow-slide]"))
    var prev = vshow.querySelector("[data-vshow-prev]")
    var next = vshow.querySelector("[data-vshow-next]")
    var curEl = vshow.querySelector("[data-vshow-current]")
    var total = slides.length
    if (!total) return
    var idx = 0

    // Per-video centerpiece play button (YouTube-style). No autoplay.
    slides.forEach(function (s) {
      var vid = s.querySelector("[data-vshow-video]")
      var btn = s.querySelector("[data-vshow-play]")
      if (!vid || !btn) return
      btn.addEventListener("click", function () {
        var p = vid.play()
        if (p && p.catch) p.catch(function () {})
      })
      // Native <video controls> already toggles play/pause on click — do NOT
      // add a custom click handler here or it double-toggles (pause flicker).
      vid.addEventListener("play", function () { btn.classList.add("is-hidden") })
      vid.addEventListener("pause", function () { btn.classList.remove("is-hidden") })
      vid.addEventListener("ended", function () { btn.classList.remove("is-hidden") })
    })

    function render() {
      slides.forEach(function (s, i) {
        s.classList.remove("is-active", "is-behind")
        if (i === idx) {
          s.classList.add("is-active")
        } else {
          if (i === (idx + 1) % total) s.classList.add("is-behind")
          // Pause (but don't reset) any video we navigate away from.
          var vid = s.querySelector("[data-vshow-video]")
          if (vid && !vid.paused) {
            try { vid.pause() } catch (e) {}
          }
        }
      })
      if (curEl) curEl.textContent = String(idx + 1)
    }

    function go(d) {
      idx = (idx + d + total) % total
      render()
    }

    if (prev) prev.addEventListener("click", function () { go(-1) })
    if (next) next.addEventListener("click", function () { go(1) })

    // Keyboard arrows when the slider is focused.
    vshow.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(-1)
      else if (e.key === "ArrowRight") go(1)
    })

    render()
  }

  function boot() {
    document.querySelectorAll("[data-vshow]").forEach(init)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot)
  } else {
    boot()
  }
})()
