(function () {
  var CALL_HREF = "tel:6238881023"
  var SMS_HREF =
    "sms:4805772655?body=Hi%20raccoon%20team.%20I%27d%20like%20a%20quote%20for%20my%20junk%20removal.%20I%27ll%20send%20over%20the%20photos%20shortly."

  function buildModal() {
    if (document.getElementById("call-text-modal")) return

    var overlay = document.createElement("div")
    overlay.id = "call-text-modal"
    overlay.className = "call-text-modal-overlay"
    overlay.setAttribute("aria-hidden", "true")

    overlay.innerHTML =
      '<div class="call-text-modal-panel" role="dialog" aria-labelledby="call-text-modal-title" aria-modal="true">' +
      '  <button type="button" class="call-text-modal-close" aria-label="Close">&times;</button>' +
      '  <h2 id="call-text-modal-title" class="call-text-modal-title">How would you like to reach us?</h2>' +
      '  <div class="call-text-modal-actions">' +
      '    <a href="' +
      CALL_HREF +
      '" class="call-text-modal-btn call-text-modal-btn--call">Call Us Today</a>' +
      '    <a href="' +
      SMS_HREF +
      '" class="call-text-modal-btn call-text-modal-btn--text">Text Us Now</a>' +
      "  </div>" +
      "</div>"

    document.body.appendChild(overlay)

    var closeBtn = overlay.querySelector(".call-text-modal-close")

    function closeModal() {
      overlay.classList.remove("is-open")
      overlay.setAttribute("aria-hidden", "true")
    }

    function openModal() {
      overlay.classList.add("is-open")
      overlay.setAttribute("aria-hidden", "false")
    }

    closeBtn.addEventListener("click", closeModal)

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal()
    })

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        closeModal()
      }
    })

    document.querySelectorAll("[data-call-text-trigger]").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault()
        openModal()
      })
    })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildModal)
  } else {
    buildModal()
  }
})()
