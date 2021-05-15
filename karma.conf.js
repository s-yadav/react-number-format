const webpack = require("webpack");

const { TEST_BROWSER } = process.env;
const runOnNode = TEST_BROWSER === "ChromeHeadless";

module.exports = function(config) {
  config.set({
    browsers: [TEST_BROWSER || "Chrome"],
    singleRun: runOnNode,
    frameworks: ["jasmine"],
    files: ["./test/**/*.spec.js"],
    reporters: [runOnNode ? "spec" : "kjhtml"],
    preprocessors: {
      "./test/**/*.js": ["webpack", "sourcemap"] //preprocess with webpack
    },
    webpack: {
      mode: "none",
      module: {
        rules: [
          { test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"] }
        ]
      },
      externals: {},
      watch: true
    },
    webpackServer: {
      noInfo: true
    }
  });
};
