// One-off: pull all WordPress posts via REST API into _data/wpposts.json
const https = require("https");
const fs = require("fs");

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
      let d = ""; r.on("data", (c) => (d += c)); r.on("end", () => res({ status: r.statusCode, body: d }));
    }).on("error", rej);
  });
}
const strip = (s) => (s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

(async () => {
  let all = [];
  for (let page = 1; page <= 3; page++) {
    const u = "https://tripdusk.com/wp-json/wp/v2/posts?per_page=100&page=" + page + "&_embed=1";
    const r = await get(u);
    if (r.status !== 200) break;
    const arr = JSON.parse(r.body);
    all = all.concat(arr);
    if (arr.length < 100) break;
  }
  const posts = all.map((p) => {
    const fm = p._embedded && p._embedded["wp:featuredmedia"] && p._embedded["wp:featuredmedia"][0];
    const terms = p._embedded && p._embedded["wp:term"]
      ? [].concat.apply([], p._embedded["wp:term"]).filter((t) => t.taxonomy === "category").map((t) => t.name) : [];
    let desc = strip(p.excerpt && p.excerpt.rendered);
    if (desc.length > 160) desc = desc.slice(0, 157).replace(/\s+\S*$/, "") + "…";
    return {
      slug: p.slug,
      title: strip(p.title && p.title.rendered),
      date: (p.date || "").slice(0, 10),
      modified: (p.modified || "").slice(0, 10),
      description: desc,
      image: (fm && fm.source_url) || "",
      cats: terms,
      origUrl: p.link,
      contentHtml: (p.content && p.content.rendered) || ""
    };
  });
  fs.mkdirSync("_data", { recursive: true });
  fs.writeFileSync("_data/wpposts.json", JSON.stringify(posts));
  const imgs = posts.reduce((n, p) => n + ((p.contentHtml.match(/<img/g) || []).length), 0);
  console.log("posts:", posts.length, "| featured imgs:", posts.filter((p) => p.image).length, "| inline imgs:", imgs);
  const reserved = new Set(["index", "romantic-escapes", "nomad-life", "golden-hour", "destinations", "about", "contact", "sunset-finder", "admin", "assets", "sitemap", "robots"]);
  const col = posts.filter((p) => reserved.has(p.slug));
  console.log(col.length ? "COLLISIONS: " + col.map((p) => p.slug).join(", ") : "no slug collisions ✓");
  // also collisions with the 36 new sample posts
  const newSlugs = fs.existsSync("content/posts") ? fs.readdirSync("content/posts").filter(f => f.endsWith(".md")).map(f => f.replace(".md", "")) : [];
  const col2 = posts.filter(p => newSlugs.includes(p.slug));
  console.log(col2.length ? "overlap with new posts: " + col2.map(p => p.slug).join(", ") : "no overlap with new sample posts ✓");
})();
