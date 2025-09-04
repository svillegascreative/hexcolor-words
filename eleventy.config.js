export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("styles.css");
  return {
    dir: {
      input: "src"
    }
  };
}
