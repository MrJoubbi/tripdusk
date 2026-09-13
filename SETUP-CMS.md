# TripDusk — Visual editor (CMS) + deployment

You now have a **WordPress-style editor** at `tripdusk.com/admin`. You write and hit Publish; it saves to GitHub; GitHub builds the site and pushes it to your VPS automatically. Your custom design is untouched — articles are just content now.

```
 ┌──────────┐   write & publish   ┌────────┐   auto-build+deploy   ┌──────────────┐
 │  /admin  │ ──────────────────▶ │ GitHub │ ────────────────────▶ │  VPS (Nginx) │
 │ (editor) │                     │  repo  │   (GitHub Actions)    │  https site  │
 └──────────┘                     └────────┘                       └──────────────┘
```

---

## How the project works now

- **Articles** live as Markdown in `content/posts/*.md`. The CMS edits these.
- **Design pages** (home, lanes, about, contact) stay as hand-built `.html` — unchanged.
- **Eleventy** (`npm run build`) turns Markdown → styled pages in `_site/`.
- The **VPS serves `_site/`**; it never builds anything.

### Local preview (on your Mac)
```bash
npm install      # first time only
npm start        # builds + serves at http://localhost:4178 with live reload
```

### Add an article without the CMS (optional)
Copy an existing file in `content/posts/`, change the front matter and text, save. Same result as the CMS.

---

## Part A — Put the project on GitHub (one time)

1. Create a free account at github.com, then create a **private** repo named `tripdusk` (empty — no README).
2. In the project folder on your Mac:
```bash
cd /Users/macpro/Desktop/tripdusk
git init && git add . && git commit -m "TripDusk site + CMS"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/tripdusk.git
git push -u origin main
```
3. Open `admin/config.yml` and set `repo: YOUR_GITHUB_USERNAME/tripdusk`, commit, push.

---

## Part B — Turn on the editor login (GitHub OAuth)

The `/admin` editor signs you in with GitHub. That needs a tiny free auth helper (a Cloudflare Worker). ~10 minutes, once.

1. **Create a GitHub OAuth App:** GitHub → Settings → Developer settings → OAuth Apps → *New OAuth App*.
   - Homepage URL: `https://tripdusk.com`
   - Authorization callback URL: `https://YOUR-WORKER.workers.dev/callback` (you'll get this URL in the next step — come back and fill it in)
   - Save the **Client ID** and generate a **Client Secret**.
2. **Deploy the auth worker:** follow the short README at
   `https://github.com/sveltia/sveltia-cms-auth` — it's a copy-paste Cloudflare Worker. Set its `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to the values from step 1. Cloudflare gives you a `https://…workers.dev` URL — paste it back into the OAuth App's callback URL.
3. **Point the CMS at it:** add this to the top of `admin/config.yml`, then commit + push:
```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/tripdusk
  branch: main
  base_url: https://YOUR-WORKER.workers.dev
```

> **No-OAuth fallback:** you can skip Part B entirely and still edit — open a file in `content/posts/` on github.com, click the pencil, edit, commit. That also triggers a deploy. The `/admin` editor is just nicer.

---

## Part C — Auto-deploy to your VPS (one time)

1. **Create an SSH key** for GitHub to use (on your Mac):
```bash
ssh-keygen -t ed25519 -f ~/.ssh/tripdusk_deploy -N ""
ssh-copy-id -i ~/.ssh/tripdusk_deploy.pub USER@YOUR_VPS_IP
```
2. **Add GitHub secrets:** repo → Settings → Secrets and variables → Actions → *New repository secret*:
   - `VPS_HOST` = your VPS IP
   - `VPS_USER` = your SSH username
   - `VPS_SSH_KEY` = the **private** key contents (`cat ~/.ssh/tripdusk_deploy`)
3. That's it — `.github/workflows/deploy.yml` already builds and rsyncs `_site/` to `/opt/tripdusk/_site/` on every push.

---

## Part D — Prepare the VPS (one time)

1. **DNS:** point `tripdusk.com` and `www` A-records at your VPS IP. Verify: `dig tripdusk.com +short`.
2. **Install Docker:** `curl -fsSL https://get.docker.com | sudo sh`
3. **Get the repo + configs onto the VPS:**
```bash
sudo mkdir -p /opt/tripdusk && sudo chown -R $USER /opt/tripdusk
git clone https://github.com/YOUR_GITHUB_USERNAME/tripdusk.git /opt/tripdusk
```
4. **Set your Let's Encrypt email** in `/opt/tripdusk/docker-compose.yml` (the three email lines).
5. **First deploy:** push any change (or run the workflow manually from GitHub → Actions → *Run workflow*) so `_site/` gets built and copied to the VPS.
6. **Start serving:**
```bash
cd /opt/tripdusk && docker compose up -d
```
`acme-companion` fetches HTTPS certificates automatically. Visit **https://tripdusk.com**. Open ports if needed: `sudo ufw allow 80,443/tcp`.

---

## Your day-to-day from now on

1. Go to **tripdusk.com/admin**
2. Click **New Article**, fill in the fields, write, hit **Publish**
3. Wait ~1–2 minutes (GitHub builds + deploys) → it's live

No terminal, no rebuild, no server restart. That's the whole loop.

---

## After launch (SEO/GEO)

- [ ] Confirm `https://tripdusk.com/sitemap.xml` and `/robots.txt` load
- [ ] Google Search Console + Bing Webmaster Tools → submit the sitemap
- [ ] Rich Results Test on the eSIM article → search.google.com/test/rich-results
- [ ] Replace placeholder affiliate links + social URLs (see `SEO-GEO-GUIDE.md`)

## Troubleshooting

- **Editor won't log in:** the OAuth worker URL in `config.yml` `base_url` is wrong, or the callback URL on the GitHub OAuth App doesn't match the worker. Use the github.com pencil-edit fallback meanwhile.
- **Published but site unchanged:** check GitHub → Actions for a failed run (usually a wrong VPS secret).
- **403 on the site:** `_site/` on the VPS is empty — run the workflow once to populate it.
- **Cert not issued:** DNS isn't pointing at the VPS yet, or ports 80/443 are blocked/in use.
