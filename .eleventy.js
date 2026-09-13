const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  // Allow raw HTML inside Markdown (tables, callouts, affiliate links with rel)
  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true, linkify: true, typographer: true })
  );

  // Copy static assets & hand-built pages through untouched
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("llms.txt");
  [
    "index.html",
    "destinations.html",
    "romantic-escapes.html",
    "nomad-life.html",
    "golden-hour.html",
    "sunset-finder.html",
    "about.html",
    "contact.html",
  ].forEach((f) => eleventyConfig.addPassthroughCopy(f));

  // Date helpers
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("humanDate", (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
  );

  return {
    dir: { input: ".", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
