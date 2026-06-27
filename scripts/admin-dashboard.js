/*
 * Private lead dashboard controller (/quote-request/).
 *
 * Auth is real: the password is verified by Supabase Auth (signInWithPassword)
 * against an admin user you create in the Supabase dashboard. Lead data is only
 * returned after a valid session exists (enforced by Row Level Security), so the
 * leads cannot be read by anyone holding the public key. The 20-try / 24h
 * lockout below is a client-side UX guard on top of Supabase's own rate limits.
 */
(function () {
  var MAX_ATTEMPTS = 20
  var LOCKOUT_MS = 24 * 60 * 60 * 1000 // 24 hours
  var BASELINE_ROWS = 10
  var ATTEMPTS_KEY = "cr_admin_attempts"
  var LOCK_KEY = "cr_admin_lock_until"

  var gate, passInput, loginBtn, msg, dash, rowsEl, countEl, viewer, viewerImg
  var currentLeads = []

  function $(s, r) { return (r || document).querySelector(s) }

  function getLockUntil() { return parseInt(localStorage.getItem(LOCK_KEY) || "0", 10) }
  function getAttempts() { return parseInt(localStorage.getItem(ATTEMPTS_KEY) || "0", 10) }
  function isLocked() { return Date.now() < getLockUntil() }

  function fmtRemaining(ms) {
    var h = Math.floor(ms / 3600000)
    var m = Math.ceil((ms % 3600000) / 60000)
    return h > 0 ? h + "h " + m + "m" : m + "m"
  }

  function showMsg(text, ok) {
    msg.textContent = text
    msg.classList.toggle("is-ok", !!ok)
  }

  function refreshGateState() {
    if (isLocked()) {
      loginBtn.disabled = true
      passInput.disabled = true
      showMsg("Too many attempts. Locked for " + fmtRemaining(getLockUntil() - Date.now()) + ".", false)
    } else {
      loginBtn.disabled = false
      passInput.disabled = false
    }
  }

  async function attemptLogin() {
    if (isLocked()) { refreshGateState(); return }
    var val = passInput.value
    if (!val) { showMsg("Enter your password.", false); return }
    loginBtn.disabled = true
    showMsg("Checking…", true)
    try {
      var res = await window.LeadsStore.signIn(val)
      if (res && res.error) throw res.error
      localStorage.removeItem(ATTEMPTS_KEY)
      unlock()
      return
    } catch (e) {
      var attempts = getAttempts() + 1
      localStorage.setItem(ATTEMPTS_KEY, String(attempts))
      loginBtn.disabled = false
      if (attempts >= MAX_ATTEMPTS) {
        localStorage.setItem(LOCK_KEY, String(Date.now() + LOCKOUT_MS))
        localStorage.removeItem(ATTEMPTS_KEY)
        refreshGateState()
        return
      }
      showMsg("Incorrect password. " + (MAX_ATTEMPTS - attempts) + " attempt(s) left.", false)
      passInput.value = ""
      passInput.focus()
    }
  }

  function unlock() {
    gate.setAttribute("hidden", "")
    dash.removeAttribute("hidden")
    renderGrid()
  }

  async function lock() {
    try { await window.LeadsStore.signOut() } catch (e) {}
    dash.setAttribute("hidden", "")
    gate.removeAttribute("hidden")
    passInput.value = ""
    showMsg("", false)
    refreshGateState()
    passInput.focus()
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }

  function fmtDate(iso) {
    if (!iso) return ""
    var d = new Date(iso)
    if (isNaN(d)) return esc(iso)
    return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
  }

  function cellEmpty() { return '<span class="admin-empty-cell">—</span>' }

  function photosCell(lead) {
    if (!lead.photos || !lead.photos.length) return cellEmpty()
    var links = lead.photos
      .map(function (p, i) {
        return '<a class="admin-photo-link" data-photo="' + esc(p.url || p.dataUrl) + '">Photo ' + (i + 1) + "</a>"
      })
      .join("")
    return (
      '<div class="admin-photos-cell">' +
      '<button type="button" class="admin-photos-clear" data-clear-photos="' + esc(lead.id) +
      '" title="Delete all photos" aria-label="Delete all photos">&times;</button>' +
      '<div class="admin-photos-links">' + links + "</div>" +
      "</div>"
    )
  }

  function renderGrid() {
    countEl.textContent = "Loading…"
    window.LeadsStore.list()
      .then(function (leads) {
        currentLeads = leads
        countEl.textContent = leads.length + " lead" + (leads.length === 1 ? "" : "s")
        var rowCount = Math.max(BASELINE_ROWS, leads.length)
        var html = ""
        for (var i = 0; i < rowCount; i++) {
          var lead = leads[i]
          if (lead) {
            html +=
              '<tr class="is-filled">' +
              '<td class="admin-col-num">' + (i + 1) + "</td>" +
              "<td>" + (fmtDate(lead.createdAt) || cellEmpty()) + "</td>" +
              "<td>" + (esc(lead.fullName) || cellEmpty()) + "</td>" +
              "<td>" + (esc(lead.phone) || cellEmpty()) + "</td>" +
              "<td>" + (esc(lead.email) || cellEmpty()) + "</td>" +
              "<td>" + (lead.service ? '<span class="admin-tag">' + esc(lead.service) + "</span>" : cellEmpty()) + "</td>" +
              "<td>" + (lead.jobType ? '<span class="admin-tag admin-tag--job">' + esc(lead.jobType) + "</span>" : cellEmpty()) + "</td>" +
              '<td class="admin-cell-details">' + (esc(lead.details) || cellEmpty()) + "</td>" +
              "<td>" + photosCell(lead) + "</td>" +
              '<td><button class="admin-del" data-del="' + esc(lead.id) + '">Delete</button></td>' +
              "</tr>"
          } else {
            html +=
              "<tr><td class=\"admin-col-num\">" + (i + 1) +
              "</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
          }
        }
        rowsEl.innerHTML = html
        rowsEl.querySelectorAll("[data-del]").forEach(function (b) {
          b.addEventListener("click", function () {
            if (!confirm("Delete this lead permanently?")) return
            var id = b.getAttribute("data-del")
            var lead = currentLeads.filter(function (l) { return l.id === id })[0]
            var urls = lead ? lead.photos.map(function (p) { return p.url || p.dataUrl }) : []
            window.LeadsStore.remove(id, urls).then(renderGrid).catch(function (e) {
              console.error("delete failed:", e)
              alert("Couldn't delete: " + (e && e.message ? e.message : e))
            })
          })
        })
        rowsEl.querySelectorAll("[data-photo]").forEach(function (a) {
          a.addEventListener("click", function () { openViewer(a.getAttribute("data-photo")) })
        })
        rowsEl.querySelectorAll("[data-clear-photos]").forEach(function (b) {
          b.addEventListener("click", function () {
            var id = b.getAttribute("data-clear-photos")
            var lead = currentLeads.filter(function (l) { return l.id === id })[0]
            var urls = lead ? lead.photos.map(function (p) { return p.url || p.dataUrl }) : []
            if (!confirm("Delete ALL photos for this lead? This removes them from the dashboard and from Supabase storage, and can't be undone.")) return
            b.disabled = true
            window.LeadsStore.clearPhotos(id, urls)
              .then(renderGrid)
              .catch(function (e) {
                b.disabled = false
                console.error("clearPhotos failed:", e)
                alert("Couldn't delete the photos: " + (e && e.message ? e.message : e))
              })
          })
        })
      })
      .catch(function (e) {
        countEl.textContent = "Error loading leads"
        console.error(e)
      })
  }

  function openViewer(src) { viewerImg.src = src; viewer.classList.add("is-open") }
  function closeViewer() { viewer.classList.remove("is-open"); viewerImg.src = "" }

  function init() {
    gate = $("[data-admin-gate]"); passInput = $("[data-admin-pass]"); loginBtn = $("[data-admin-login]")
    msg = $("[data-admin-msg]"); dash = $("[data-admin-dash]"); rowsEl = $("[data-admin-rows]")
    countEl = $("[data-admin-count]"); viewer = $("[data-admin-viewer]"); viewerImg = $("[data-admin-viewer-img]")

    loginBtn.addEventListener("click", attemptLogin)
    passInput.addEventListener("keydown", function (e) { if (e.key === "Enter") attemptLogin() })
    var refreshBtn = $("[data-admin-refresh]"); if (refreshBtn) refreshBtn.addEventListener("click", renderGrid)
    var logoutBtn = $("[data-admin-logout]"); if (logoutBtn) logoutBtn.addEventListener("click", lock)
    $("[data-admin-viewer-close]").addEventListener("click", closeViewer)
    viewer.addEventListener("click", function (e) { if (e.target === viewer) closeViewer() })
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && viewer.classList.contains("is-open")) closeViewer() })

    // Password show/hide eye toggle (closed eyelid = hidden, open eye = visible).
    var eyeBtn = $("[data-admin-eye]")
    if (eyeBtn) {
      var EYE_CLOSED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9c3.5 4.5 14.5 4.5 18 0"/><line x1="5.5" y1="12.6" x2="4.5" y2="14.8"/><line x1="12" y1="13.7" x2="12" y2="16.2"/><line x1="18.5" y1="12.6" x2="19.5" y2="14.8"/></svg>'
      var EYE_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>'
      eyeBtn.innerHTML = EYE_CLOSED
      eyeBtn.addEventListener("click", function () {
        var show = passInput.type === "password"
        passInput.type = show ? "text" : "password"
        eyeBtn.innerHTML = show ? EYE_OPEN : EYE_CLOSED
        eyeBtn.setAttribute("aria-pressed", show ? "true" : "false")
        eyeBtn.setAttribute("aria-label", show ? "Hide password" : "Show password")
        passInput.focus()
      })
    }

    refreshGateState()
    // Always require the password on every page load/refresh: the dashboard
    // starts locked (gate shown, dash hidden in the HTML) and we never
    // auto-resume a saved session. Entering the password re-authenticates and
    // unlocks. The in-page "Refresh" button re-fetches leads without reloading,
    // so it does NOT log you out.
    passInput.focus()
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init)
  else init()
})()
