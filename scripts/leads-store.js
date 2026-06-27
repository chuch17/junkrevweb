/*
 * LeadsStore — Supabase-backed lead read/write for Clean Raccoon.
 *
 * Public API (unchanged for the wizard + dashboard):
 *   submit(lead)  -> Promise<record>         (anonymous INSERT + photo upload)
 *   list()        -> Promise<record[]>       (requires admin session)
 *   remove(id)    -> Promise<void>           (requires admin session)
 * Admin auth helpers:
 *   signIn(password) -> Promise<{error}>
 *   signOut()        -> Promise
 *   hasSession()     -> Promise<boolean>
 */
(function () {
  var authClient = null
  var anonClient = null

  function ensureLib() {
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      throw new Error("Supabase client not loaded")
    }
  }

  // Admin client — persists the dashboard login session (used by list/remove/auth).
  function getAuthClient() {
    if (authClient) return authClient
    ensureLib()
    authClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
    return authClient
  }

  // Public client — ALWAYS anonymous. It ignores any admin session stored in
  // this browser, so a public quote submission is never sent as the logged-in
  // admin (whom RLS does not allow to INSERT leads).
  function getAnonClient() {
    if (anonClient) return anonClient
    ensureLib()
    anonClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, storageKey: "cr-anon-no-session" },
    })
    return anonClient
  }

  function mapRow(r) {
    return {
      id: r.id,
      createdAt: r.created_at,
      service: r.service || "",
      jobType: r.job_type || "",
      fullName: r.full_name || "",
      email: r.email || "",
      phone: r.phone || "",
      details: r.details || "",
      photos: (r.photos || []).map(function (u) {
        return { url: u, dataUrl: u }
      }),
    }
  }

  function dataUrlToBlob(dataUrl) {
    var parts = dataUrl.split(",")
    var mime = (parts[0].match(/:(.*?);/) || [])[1] || "image/jpeg"
    var bin = atob(parts[1])
    var arr = new Uint8Array(bin.length)
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
    return new Blob([arr], { type: mime })
  }

  function extFor(name, blob) {
    var m = /\.([a-z0-9]+)$/i.exec(name || "")
    if (m) return m[1].toLowerCase()
    var t = (blob && blob.type) || ""
    if (t.indexOf("png") > -1) return "png"
    if (t.indexOf("webp") > -1) return "webp"
    if (t.indexOf("gif") > -1) return "gif"
    return "jpg"
  }

  async function uploadPhotos(sb, photos) {
    var urls = []
    var folder =
      Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e9).toString(36)
    for (var i = 0; i < photos.length; i++) {
      var p = photos[i]
      var blob = p.file ? p.file : p.dataUrl ? dataUrlToBlob(p.dataUrl) : null
      if (!blob) continue
      var path = folder + "/" + i + "." + extFor(p.name, blob)
      var up = await sb.storage.from(window.CR_PHOTO_BUCKET).upload(path, blob, {
        contentType: blob.type || "image/jpeg",
        upsert: false,
      })
      if (up.error) throw up.error
      var pub = sb.storage.from(window.CR_PHOTO_BUCKET).getPublicUrl(path)
      urls.push(pub.data.publicUrl)
    }
    return urls
  }

  // Turn public photo URLs back into Storage object paths for deletion.
  function photoUrlsToPaths(urls) {
    if (!urls || !urls.length) return []
    var prefix = "/storage/v1/object/public/" + window.CR_PHOTO_BUCKET + "/"
    return urls
      .map(function (u) {
        var i = u.indexOf(prefix)
        return i >= 0 ? decodeURIComponent(u.slice(i + prefix.length)) : null
      })
      .filter(Boolean)
  }

  window.LeadsStore = {
    submit: async function (lead) {
      var sb = getAnonClient()
      var photoUrls = []
      if (lead.photos && lead.photos.length) {
        photoUrls = await uploadPhotos(sb, lead.photos)
      }
      // No .select() here: the anon role is (correctly) not allowed to READ
      // leads, so asking for the row back would fail. Insert only.
      var res = await sb.from("leads").insert({
        service: lead.service || "",
        job_type: lead.jobType || "",
        full_name: lead.fullName || "",
        email: lead.email || "",
        phone: lead.phone || "",
        details: lead.details || "",
        photos: photoUrls,
      })
      if (res.error) throw res.error
      return {
        service: lead.service, jobType: lead.jobType, fullName: lead.fullName,
        email: lead.email, phone: lead.phone, details: lead.details, photos: photoUrls,
      }
    },

    list: async function () {
      var sb = getAuthClient()
      var res = await sb.from("leads").select("*").order("created_at", { ascending: false })
      if (res.error) throw res.error
      return (res.data || []).map(mapRow)
    },

    remove: async function (id, photoUrls) {
      var sb = getAuthClient()
      var res = await sb.from("leads").delete().eq("id", id)
      if (res.error) throw res.error
      // Best-effort: also remove this lead's photos from Storage (no extra
      // permission needed — both deletes are allowed for the admin).
      var paths = photoUrlsToPaths(photoUrls)
      if (paths.length) {
        var del = await sb.storage.from(window.CR_PHOTO_BUCKET).remove(paths)
        if (del.error) console.error("Photo storage cleanup error:", del.error)
      }
    },

    // Delete all photos for a lead: clear the row first (so a failed update —
    // e.g. missing UPDATE policy — never orphans files), then remove the files.
    clearPhotos: async function (leadId, photoUrls) {
      var sb = getAuthClient()
      var res = await sb.from("leads").update({ photos: [] }).eq("id", leadId)
      if (res.error) throw res.error
      var paths = photoUrlsToPaths(photoUrls)
      if (paths.length) {
        var del = await sb.storage.from(window.CR_PHOTO_BUCKET).remove(paths)
        if (del.error) console.error("Photo storage cleanup error:", del.error)
      }
    },

    // ----- admin auth -----
    signIn: function (password) {
      var sb = getAuthClient()
      return sb.auth.signInWithPassword({ email: window.CR_ADMIN_EMAIL, password: password })
    },
    signOut: function () {
      return getAuthClient().auth.signOut()
    },
    hasSession: async function () {
      var res = await getAuthClient().auth.getSession()
      return !!(res.data && res.data.session)
    },
  }
})()
