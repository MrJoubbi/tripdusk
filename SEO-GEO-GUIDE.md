# TripDusk — SEO & GEO Guide

Everything wired into the site, plus a repeatable process so every new page ranks by default.
**SEO** = classic search (Google/Bing). **GEO** = Generative Engine Optimization — getting cited by AI answers (Google AI Overviews, ChatGPT, Perplexity, Claude).

---

## ✅ What's already built in

| Layer | Where | Purpose |
|---|---|---|
| Unique `<title>` + meta description | every page `<head>` | Google's blue link + snippet |
| Canonical URL | every page | Prevents duplicate-content penalties |
| Open Graph + Twitter cards | every page | Rich previews on social/messaging |
| Structured data (JSON-LD) | every page `<head>` | Rich results + **the #1 GEO signal** |
| `Organization` + `WebSite` schema | every page | Brand entity Google/AI can trust |
| `BreadcrumbList` schema | every page | Breadcrumb rich result + site structure |
| `CollectionPage` + `ItemList` | lane/destination pages | Helps AI list your topics |
| `FAQPage` schema | contact page | FAQ rich result + AI Q&A citations |
| `sitemap.xml` | root | Tells Google every URL |
| `robots.txt` | root | Allows Google **and** AI crawlers |
| `llms.txt` | root | Emerging GEO standard — a map for AI models |
| `site.webmanifest` + theme-color | root | PWA / mobile polish |
| Social share image | `assets/img/og-image.svg` | 1200×630 branded preview |
| Semantic, mobile-first, fast HTML | all pages | Core Web Vitals + crawlability |
| Reusable article template | `_post-template.html` | New posts are SEO-ready in minutes |

---

## 🚀 How to add a new article (the fast path)

1. **Copy** `_post-template.html` → rename to your keyword slug
   e.g. `best-esims-long-term-travel.html` (lowercase, hyphens, keyword-rich — never `post1.html`).
2. **Find & replace** every `{{PLACEHOLDER}}`:
   - `{{TITLE}}` — 55-60 chars, **keyword first**: *"Best eSIMs for Long-Term Travel (2026)"*
   - `{{DESCRIPTION}}` — 140-160 chars, keyword + a reason to click
   - `{{SLUG}}` — the filename without `.html`
   - `{{PARENT_NAME}}` / `{{PARENT_SLUG}}` / `{{PARENT_DATA_PAGE}}` — the lane it belongs to (`Nomad Life` / `nomad-life` / `nomad`)
   - `{{SECTION}}`, `{{AUTHOR}}`, `{{DATE_ISO}}` (`2026-08-20`), `{{DATE_HUMAN}}`, `{{READ_TIME}}`, `{{H1_HEADLINE}}`
3. **Write** the article inside `<div class="prose">`.
4. **Add the URL** to `sitemap.xml` (copy a `<url>` block, change `<loc>` + `<lastmod>`).
5. **Link to it** — add a card on the parent lane page so it isn't an orphan.
6. **Validate** (see checklist) and publish.

> Tip: the `<title>` tag has one job — the keyword. The `<h1>` can be catchier. They don't have to match.

---

## 🧠 GEO: getting cited by AI answers

AI engines quote content that is **clear, factual, and well-structured**. Do this in every post:

- **Answer first.** Put the direct answer in the opening 2-3 sentences, before the story. AI lifts that.
- **Question-shaped H2s.** Use the exact phrasing people ask: *"How much does an eSIM cost?"* not *"Pricing"*.
- **Lists & tables.** Bullet points and comparison tables get quoted far more than paragraphs.
- **One fact per sentence.** Short, self-contained sentences are easier to cite.
- **Be specific.** Real numbers, dates, place names. Vague copy never gets picked up.
- **Keep FAQ blocks** at the bottom of posts (mirror them into `FAQPage` JSON-LD — see contact.html).
- **E-E-A-T.** Real author name, the About page, and "we actually went" language build the trust AI models weigh.

---

## 🔎 On-page SEO checklist (per post)

- [ ] One `<h1>` only; logical `<h2>`/`<h3>` below it
- [ ] Target keyword in title, H1, URL, first 100 words, and one H2
- [ ] Meta description 140-160 chars, compelling
- [ ] 1,500+ words for pillar topics; genuinely useful, not padded
- [ ] 3-5 **internal links** to related TripDusk pages + links back from them
- [ ] Descriptive `alt` text on every real image
- [ ] Affiliate links marked `rel="sponsored nofollow"`
- [ ] Real images compressed (WebP/AVIF, < 200 KB) with width/height set
- [ ] Added to `sitemap.xml`

---

## 🖼 Replace the social image (recommended)

`og-image.svg` looks right when opened, but **Facebook, X/Twitter, LinkedIn and iMessage don't reliably render SVG previews.** Export a **1200×630 PNG or JPG**, save it as `assets/img/og-image.png`, then swap the `og:image` / `twitter:image` URLs (and extension) across the pages. Per-post images perform even better.

---

## 🛠 Before you go live (one-time + ongoing)

**One-time**
- [ ] Buy/confirm the domain and deploy over HTTPS (Netlify, Vercel, Cloudflare Pages — all free, all give SSL)
- [ ] Set up **Google Search Console** → submit `sitemap.xml`
- [ ] Set up **Bing Webmaster Tools** (powers ChatGPT search) → submit sitemap
- [ ] Create the real social accounts and update the `sameAs` URLs in the JSON-LD (currently `instagram.com/tripdusk` etc. — placeholders)
- [ ] Add analytics (Plausible/Fathom = privacy-friendly, or GA4)

**Validate anytime**
- Rich Results Test → https://search.google.com/test/rich-results
- Schema validator → https://validator.schema.org
- OG preview → https://opengraph.dev
- Mobile-friendly & speed → https://pagespeed.web.dev

**Ongoing**
- Publish consistently (the site promises "every Friday" — keep that rhythm)
- Update `<lastmod>` in the sitemap when you meaningfully edit a page
- Refresh old posts yearly (update the year in titles, prices, links)

---

## 📍 A note on "local/geo" targeting

TripDusk is global, so we optimize by **destination**, not by a single business location. If you ever add a physical base or offer location-specific services, add `LocalBusiness` schema and a Google Business Profile. For now, destination-based pages (e.g. "Lisbon for nomads") are your geo play — each one targets a place name.

---

*Questions this guide doesn't answer? The structure is intentionally simple — copy an existing page and follow the pattern.*
