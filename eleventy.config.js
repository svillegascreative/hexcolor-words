import lightningCSS from "@11tyrocks/eleventy-plugin-lightningcss";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("styles.css");

  eleventyConfig.addPlugin(lightningCSS);

  return {
    // use nunjucks everywhere
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    dir: {
      input: "src",
    },
  };
}
