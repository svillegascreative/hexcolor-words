import lightningCSS from "@11tyrocks/eleventy-plugin-lightningcss";
import esbuild from "esbuild";

export default function (eleventyConfig) {
  // process JS:
  eleventyConfig.addTemplateFormats('js');
  eleventyConfig.addExtension('js', {
	  outputFileExtension: 'js',
    compile: async (content, path) => {
      if (path !== './src/scripts/index.js') {
        return;
      }

      return async () => {
        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [path],
          minify: true,
          bundle: true,
          write: false,
        });

        return output.outputFiles[0].text;
      }
    }
  });

  // process CSS:
  eleventyConfig.addPlugin(lightningCSS);

  // pass through fonts & images:
  eleventyConfig.addPassthroughCopy("src/fonts")
  eleventyConfig.addPassthroughCopy("src/images")

  return {
    // use nunjucks everywhere:
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    dir: {
      input: "src",
    },
  };
}
