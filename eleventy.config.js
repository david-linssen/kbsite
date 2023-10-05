const fs = require("fs");
const path = require("path");
const htmlmin = require("html-minifier");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

// module import collections
const { getAllPosts } = require('./config/collections.js');

module.exports = function (eleventyConfig) {

    if (process.env.ELEVENTY_PRODUCTION) {
        eleventyConfig.addTransform("htmlmin", htmlminTransform);
    }
    
    console.log(process.env);

    eleventyConfig.setServerOptions({
        showAllHosts: true,
        port: 8080
    });

    // Passthrough static files
    eleventyConfig.addPassthroughCopy({ "./src/static": "." });
    eleventyConfig.addPassthroughCopy({ "./src/admin/config.yml": "./admin/config.yml"});
    eleventyConfig.addPassthroughCopy('./src/images/**/*.gif');

    // Passthrough fonts (also needed at ./fonts for font.conf)
    eleventyConfig.addPassthroughCopy({ "./fonts": "/fonts" });

    // Watch targets
    eleventyConfig.addWatchTarget("./src/styles/");

    // RSS feeds
    eleventyConfig.addPlugin(pluginRss);

    // Filters
    eleventyConfig.addPlugin(require('./config/filters.js'));

    // Work with subdirectories as root
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
    
    // Collections
    eleventyConfig.addCollection('blogposts', getAllPosts);

    // Images
    eleventyConfig.addPlugin(require('./config/images.js'));

    var pathPrefix = "";
    if (process.env.GITHUB_REPOSITORY) {
        pathPrefix = process.env.GITHUB_REPOSITORY.split('/')[1];
    }

    return {
        dir: {
            input: "src",
        },
        pathPrefix
    }
};

function htmlminTransform(content, outputPath) {
    if (outputPath.endsWith(".html")) {
        let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true
        });
        return minified;
    }
    return content;
}


