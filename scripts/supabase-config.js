/*
 * Public Supabase config for the Clean Raccoon lead system.
 * These two values are the PUBLISHABLE (anon) credentials — they are designed
 * to live in public frontend code. The service_role key is NOT here and must
 * never be committed. Security is enforced by Row Level Security in the DB:
 *   - anyone (anon) may INSERT a lead (the wizard)
 *   - only an authenticated admin may SELECT/DELETE leads (the dashboard)
 */
window.SUPABASE_URL = "https://urhvhdiledsmeeznizcj.supabase.co"
window.SUPABASE_ANON_KEY = "sb_publishable_cYruaPzlA1VJnntyCMdh6g_sfwR8uc-"

// Email used for the admin dashboard login (you set its password in Supabase).
window.CR_ADMIN_EMAIL = "cleanraccoon.junkremoval@gmail.com"

// Storage bucket that holds lead photos.
window.CR_PHOTO_BUCKET = "lead-photos"
