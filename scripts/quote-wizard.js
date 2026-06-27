/*
 * Quote Wizard — multi-step lead capture modal.
 * Opened by the "Fill out a form" button in the call/text choice popup.
 * Submits through window.LeadsStore (mock now, Supabase later).
 */
(function () {
  var ICONS = {
    junk:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
    demo:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2l8 8-3 3-8-8z"/><path d="M11 5L3 13l3 3 8-8"/><path d="M3 21h10"/><path d="M6 16l-3 5"/></svg>',
    home:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>',
    commercial:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M16 21V9h3a2 2 0 0 1 2 2v10"/><path d="M8 7h2M8 11h2M8 15h2"/></svg>',
    camera:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  }

  var MAX_PHOTOS = 7
  var overlay, panel, body
  var state = blankState()

  function blankState() {
    return {
      step: 1,
      service: "",
      jobType: "",
      fullName: "",
      email: "",
      phone: "",
      details: "",
      photos: [], // { name, dataUrl }
    }
  }

  function el(html) {
    var t = document.createElement("template")
    t.innerHTML = html.trim()
    return t.content.firstChild
  }

  function build() {
    if (overlay) return
    overlay = document.createElement("div")
    overlay.className = "qw-overlay"
    overlay.setAttribute("aria-hidden", "true")
    overlay.innerHTML =
      '<div class="qw-panel" role="dialog" aria-modal="true" aria-label="Request a quote">' +
      '  <button type="button" class="qw-close" data-qw-close aria-label="Close">&times;</button>' +
      '  <div class="qw-progress" data-qw-progress aria-hidden="true"></div>' +
      '  <div class="qw-body" data-qw-body></div>' +
      "</div>"
    document.body.appendChild(overlay)
    panel = overlay.querySelector(".qw-panel")
    body = overlay.querySelector("[data-qw-body]")

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close()
    })
    overlay.querySelector("[data-qw-close]").addEventListener("click", close)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close()
    })
  }

  function open() {
    build()
    state = blankState()
    overlay.classList.add("is-open")
    overlay.setAttribute("aria-hidden", "false")
    document.body.style.overflow = "hidden"
    render()
  }

  function close() {
    if (!overlay) return
    overlay.classList.remove("is-open")
    overlay.setAttribute("aria-hidden", "true")
    document.body.style.overflow = ""
    state = blankState() // exiting mid-process clears everything; nothing submitted
    body.innerHTML = ""
  }

  function setProgress() {
    var p = overlay.querySelector("[data-qw-progress]")
    if (state.step > 4) {
      p.innerHTML = ""
      return
    }
    var dots = ""
    for (var i = 1; i <= 4; i++) {
      dots += '<span class="qw-dot' + (i <= state.step ? " is-on" : "") + '"></span>'
    }
    p.innerHTML = dots
  }

  function render() {
    setProgress()
    if (state.step === 1) return renderServices()
    if (state.step === 2) return renderJobType()
    if (state.step === 3) return renderDetails()
    if (state.step === 4) return renderSubmit()
    if (state.step === 5) return renderSuccess()
  }

  function backLink() {
    return '<button type="button" class="qw-back" data-qw-back>&larr; Back</button>'
  }
  function wireBack() {
    var b = body.querySelector("[data-qw-back]")
    if (b) b.addEventListener("click", function () { state.step--; render() })
  }

  // Step 1
  function renderServices() {
    body.innerHTML =
      '<h2 class="qw-title">Pick out the service you desire</h2>' +
      '<div class="qw-choices qw-choices--2">' +
      '  <button type="button" class="qw-choice" data-service="Junk Removal">' +
      '    <span class="qw-choice-icon">' + ICONS.junk + "</span>" +
      '    <span class="qw-choice-label">Junk Removal</span>' +
      "  </button>" +
      '  <button type="button" class="qw-choice" data-service="Demolition">' +
      '    <span class="qw-choice-icon">' + ICONS.demo + "</span>" +
      '    <span class="qw-choice-label">Demolition</span>' +
      "  </button>" +
      "</div>"
    body.querySelectorAll("[data-service]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.service = b.getAttribute("data-service")
        state.step = 2
        render()
      })
    })
  }

  // Step 2
  function renderJobType() {
    body.innerHTML =
      backLink() +
      '<h2 class="qw-title">What is this for?</h2>' +
      '<div class="qw-choices qw-choices--stack">' +
      '  <button type="button" class="qw-choice qw-choice--wide" data-jobtype="Residential">' +
      '    <span class="qw-choice-icon">' + ICONS.home + "</span>" +
      '    <span class="qw-choice-text"><span class="qw-choice-label">Residential</span>' +
      '      <span class="qw-choice-sub">This is a residential job. I want this job for my home.</span></span>' +
      "  </button>" +
      '  <button type="button" class="qw-choice qw-choice--wide" data-jobtype="Commercial">' +
      '    <span class="qw-choice-icon">' + ICONS.commercial + "</span>" +
      '    <span class="qw-choice-text"><span class="qw-choice-label">Commercial</span>' +
      '      <span class="qw-choice-sub">This is a commercial job for my business.</span></span>' +
      "  </button>" +
      "</div>"
    wireBack()
    body.querySelectorAll("[data-jobtype]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.jobType = b.getAttribute("data-jobtype")
        state.step = 3
        render()
      })
    })
  }

  // Step 3
  function renderDetails() {
    body.innerHTML =
      backLink() +
      '<h2 class="qw-title">Your details</h2>' +
      '<div class="qw-form">' +
      '  <label class="qw-field"><span class="qw-label">Full Name <em class="qw-req">*</em></span>' +
      '    <input type="text" data-f="fullName" class="qw-input" autocomplete="name" value="' + esc(state.fullName) + '" /></label>' +
      '  <label class="qw-field"><span class="qw-label">Email Address <span class="qw-opt">(Optional)</span></span>' +
      '    <input type="email" data-f="email" class="qw-input" autocomplete="email" value="' + esc(state.email) + '" /></label>' +
      '  <label class="qw-field"><span class="qw-label">Phone Number <em class="qw-req">*</em></span>' +
      '    <input type="tel" data-f="phone" class="qw-input" autocomplete="tel" value="' + esc(state.phone) + '" /></label>' +
      '  <div class="qw-field qw-field--area">' +
      '    <span class="qw-label">Details <span class="qw-opt">(Optional)</span></span>' +
      '    <div class="qw-area-wrap">' +
      '      <textarea data-f="details" class="qw-input qw-textarea" placeholder="Text your details here">' + esc(state.details) + "</textarea>" +
      '      <button type="button" class="qw-photo-add" data-qw-photo aria-label="Add photos">' +
      '        <span class="qw-photo-plus">+</span>' + ICONS.camera +
      '        <span class="qw-photo-count" data-qw-photo-count></span>' +
      "      </button>" +
      "    </div>" +
      "  </div>" +
      '  <div class="qw-error" data-qw-error></div>' +
      '  <button type="button" class="qw-next" data-qw-next>Continue</button>' +
      "</div>"
    wireBack()

    body.querySelectorAll("[data-f]").forEach(function (inp) {
      inp.addEventListener("input", function () {
        state[inp.getAttribute("data-f")] = inp.value
      })
    })
    body.querySelector("[data-qw-photo]").addEventListener("click", openPhotoModal)
    updatePhotoCount()

    body.querySelector("[data-qw-next]").addEventListener("click", function () {
      var err = body.querySelector("[data-qw-error]")
      if (!state.fullName.trim()) return (err.textContent = "Please enter your full name.")
      if (!state.phone.trim()) return (err.textContent = "Please enter your phone number.")
      err.textContent = ""
      state.step = 4
      render()
    })
  }

  function updatePhotoCount() {
    var c = body.querySelector("[data-qw-photo-count]")
    if (!c) return
    c.textContent = state.photos.length ? String(state.photos.length) : ""
    c.style.display = state.photos.length ? "flex" : "none"
  }

  // Photo upload mini-modal (nested)
  function openPhotoModal() {
    var m = el(
      '<div class="qw-photo-modal" data-qw-photo-modal>' +
        '<div class="qw-photo-box" role="dialog" aria-modal="true" aria-label="Upload photos">' +
        '  <button type="button" class="qw-photo-close" data-qw-photo-close aria-label="Close">&times;</button>' +
        '  <h3 class="qw-photo-title">Upload Photos <span class="qw-opt">(Optional)</span></h3>' +
        '  <label class="qw-drop"><input type="file" accept="image/*" multiple data-qw-files hidden />' +
        '    <span class="qw-drop-icon">' + ICONS.camera + "</span>" +
        '    <span class="qw-drop-text">Tap to choose photos</span></label>' +
        '  <p class="qw-drop-note" data-qw-drop-note>Maximum of 7 photos</p>' +
        '  <div class="qw-thumbs" data-qw-thumbs></div>' +
        '  <button type="button" class="qw-photo-done" data-qw-photo-done>Done</button>' +
        "</div>" +
        "</div>"
    )
    panel.appendChild(m)

    function closeM() {
      m.remove()
      updatePhotoCount()
    }
    m.addEventListener("click", function (e) {
      if (e.target === m) closeM()
    })
    m.querySelector("[data-qw-photo-close]").addEventListener("click", closeM)
    m.querySelector("[data-qw-photo-done]").addEventListener("click", closeM)

    var thumbs = m.querySelector("[data-qw-thumbs]")
    var dropNote = m.querySelector("[data-qw-drop-note]")
    function refreshNote() {
      if (!dropNote) return
      dropNote.textContent =
        state.photos.length >= MAX_PHOTOS
          ? "Maximum reached (" + MAX_PHOTOS + " photos)"
          : "Maximum of " + MAX_PHOTOS + " photos (" + state.photos.length + "/" + MAX_PHOTOS + ")"
    }
    function paint() {
      thumbs.innerHTML = ""
      state.photos.forEach(function (p, i) {
        var t = el(
          '<div class="qw-thumb"><img src="' + p.dataUrl + '" alt="' + esc(p.name) + '" />' +
            '<button type="button" class="qw-thumb-x" aria-label="Remove">&times;</button></div>'
        )
        t.querySelector(".qw-thumb-x").addEventListener("click", function () {
          state.photos.splice(i, 1)
          paint()
        })
        thumbs.appendChild(t)
      })
      refreshNote()
    }
    paint()

    m.querySelector("[data-qw-files]").addEventListener("change", function (e) {
      var picked = Array.prototype.slice.call(e.target.files || []).filter(function (f) {
        return /^image\//.test(f.type)
      })
      var remaining = Math.max(0, MAX_PHOTOS - state.photos.length)
      var toAdd = picked.slice(0, remaining)
      toAdd.forEach(function (file) {
        var reader = new FileReader()
        reader.onload = function () {
          if (state.photos.length >= MAX_PHOTOS) return
          state.photos.push({ name: file.name, dataUrl: reader.result, file: file })
          paint()
        }
        reader.readAsDataURL(file)
      })
      if (picked.length > toAdd.length && dropNote) {
        dropNote.textContent = "You can attach up to " + MAX_PHOTOS + " photos."
      }
      e.target.value = ""
    })
  }

  // Step 4
  function renderSubmit() {
    var summary =
      '<div class="qw-summary">' +
      row("Service", state.service) +
      row("Job type", state.jobType) +
      row("Name", state.fullName) +
      row("Phone", state.phone) +
      (state.email ? row("Email", state.email) : "") +
      (state.photos.length ? row("Photos", state.photos.length + " attached") : "") +
      "</div>"
    body.innerHTML =
      backLink() +
      '<h2 class="qw-title">Submit Quote Request</h2>' +
      summary +
      '<div class="qw-error" data-qw-error></div>' +
      '<button type="button" class="qw-submit" data-qw-submit>Submit Quote Request</button>' +
      '<div class="qw-submit-row"><button type="button" class="qw-submit qw-submit--sm" data-qw-submit>Submit Quote Request</button></div>'
    wireBack()
    body.querySelectorAll("[data-qw-submit]").forEach(function (b) {
      b.addEventListener("click", doSubmit)
    })
  }

  function row(k, v) {
    return '<div class="qw-srow"><span class="qw-skey">' + k + '</span><span class="qw-sval">' + esc(String(v)) + "</span></div>"
  }

  function doSubmit() {
    var btns = body.querySelectorAll("[data-qw-submit]")
    btns.forEach(function (b) { b.disabled = true; b.textContent = "Submitting…" })
    window.LeadsStore.submit({
      service: state.service,
      jobType: state.jobType,
      fullName: state.fullName,
      email: state.email,
      phone: state.phone,
      details: state.details,
      photos: state.photos,
    }).then(function () {
      state.step = 5
      render()
    }).catch(function (e) {
      // Full detail to console for debugging; friendly message to the visitor.
      try { console.error("Quote submit failed:", e) } catch (_) {}
      var err = body.querySelector("[data-qw-error]")
      if (err) err.textContent = "Sorry, that didn't go through. Please try again, or call/text us directly."
      btns.forEach(function (b) { b.disabled = false; b.textContent = "Submit Quote Request" })
    })
  }

  // Step 5 — success
  function renderSuccess() {
    body.innerHTML =
      '<div class="qw-success">' +
      '  <span class="qw-success-icon">' + ICONS.check + "</span>" +
      '  <h2 class="qw-title">Thank you for filling out.</h2>' +
      '  <p class="qw-success-text">Your quote request will be in contact shortly.</p>' +
      '  <button type="button" class="qw-next" data-qw-done>Close</button>' +
      "</div>"
    body.querySelector("[data-qw-done]").addEventListener("click", close)
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  }

  window.QuoteWizard = { open: open, close: close }
})()
