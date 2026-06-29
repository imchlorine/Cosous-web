module.exports = function (eleventyConfig) {
  // Only my Nunjucks templates are processed. Everything else is copied verbatim.
  eleventyConfig.setTemplateFormats(["njk"]);

  [
    // Landing, error, and metadata files (unchanged static files)
    "src/index.html",
    "src/404.html",
    "src/robots.txt",
    "src/sitemap.xml",
    // Shared static assets
    "src/assets",
    "src/images",
    "src/auth",
    // Help: stylesheet, runtime script, content JSON, and the language redirect stub
    "src/help/help.css",
    "src/help/help.js",
    "src/help/faq.en.json",
    "src/help/faq.zh.json",
    "src/help/faq.es.json",
    "src/help/faq.ja.json",
    "src/help/index.html",
    // Legal: stylesheet, runtime script, content JSON, and the language redirect stubs
    "src/legal/legal.css",
    "src/legal/legal.js",
    "src/legal/legal.en.json",
    "src/legal/legal.zh.json",
    "src/legal/legal.es.json",
    "src/legal/legal.ja.json",
    "src/legal/privacy.html",
    "src/legal/terms.html",
  ].forEach((path) => eleventyConfig.addPassthroughCopy(path));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
