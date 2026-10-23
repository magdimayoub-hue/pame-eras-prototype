// Eleventy build for the PAME ERAS website.
// Pages live in src/*.njk, shared layout in src/_includes, editable content in src/_data.
export default function (eleventyConfig) {
  // Files copied to the site unchanged
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/.nojekyll");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // Guidelines as [category, title] pairs, the shape the guidelines library script expects
  eleventyConfig.addFilter("guidelineTuples", items => items.map(g => [g.cat, g.title]));

  return {
    dir: {input: "src", output: "_site", includes: "_includes", data: "_data"},
    templateFormats: ["njk", "11ty.js"],
    htmlTemplateEngine: "njk"
  };
}
