# Preview the new TripDusk on new.tripdusk.com

Host the new static site on a subdomain — **your live WordPress and all 100 posts stay completely untouched.** ~10 minutes.

The upload file: **`tripdusk-staging.zip`** (sent in chat). It includes a block-all `robots.txt` so the preview is never indexed, and the pages' canonical tags already point at the live `tripdusk.com`, so the preview can't compete with your real site in Google.

---

## 1. DNS — add the subdomain
In whatever manages `tripdusk.com`'s DNS, add:

| Type | Name | Value |
|------|------|-------|
| A | `new` | `YOUR_VPS_IP` |

That makes `new.tripdusk.com` point at your server. Check: `dig new.tripdusk.com +short` → your VPS IP.

## 2. Create the subdomain site in your panel

**aaPanel:** Website → **Add site** → Domain: `new.tripdusk.com` → submit.
→ Document root is created at `/www/wwwroot/new.tripdusk.com`

**CyberPanel:** Websites → **Create Website** (or *Create Child Domain* under tripdusk.com) → Domain: `new.tripdusk.com` → pick any PHP → Create.
→ Document root is `/home/new.tripdusk.com/public_html`

## 3. Upload the site
1. Download **`tripdusk-staging.zip`** (from chat).
2. In the panel's **File Manager**, open the subdomain's document root.
3. Delete any default files there (e.g. a placeholder `index.html`).
4. **Upload** `tripdusk-staging.zip`, then **Extract** it in place.
5. Confirm `index.html` now sits directly in the docroot (not inside a `tripdusk-staging/` subfolder). If it extracted into a subfolder, move the contents up one level.

## 4. Issue SSL (HTTPS)
- **aaPanel:** the site → **SSL** → **Let's Encrypt** → apply.
- **CyberPanel:** Websites → List → **Manage** → **Issue SSL**.

## 5. Keep it private (recommended)
- **aaPanel:** the site → **Site protection / Password access** → set a username + password.
- **CyberPanel:** add password protection to the path, or just rely on the included block-all `robots.txt`.

Then open **https://new.tripdusk.com** and click through everything — all 45 pages, the dropdown nav, and the Sunset Finder.

---

## When you're happy — the real cutover (later, carefully)
Because your live site earns ~224k visits from ~100 posts, we do NOT overwrite it. Instead we'll plan one of:
- **Migrate** your real posts (and their URLs) into the new design, so you keep traffic AND get the rebrand, or
- **Redirect map** old → new URLs where content matches, for anything we don't carry over.

## Updating the preview later
```
cd /Users/macpro/Desktop/tripdusk && npm run build
```
Then re-upload the `_site` contents (or a fresh zip) to the subdomain docroot.
