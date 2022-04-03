const webpack = require('webpack');

const { TEST_BROWSER } = process.env;
const runOnNode = TEST_BROWSER === 'ChromeHeadless';

module.exports = function (config) {
  config.set({
    browsers: [TEST_BROWSER || 'Chrome'],
    singleRun: runOnNode,
    frameworks: ['jasmine'],
    files: ['./test/**/*.spec.js'],
    reporters: [runOnNode ? 'spec' : 'kjhtml'],
    preprocessors: {
      './test/**/*.js': ['webpack'], //preprocess with webpack
    },
    webpack: {
      mode: runOnNode ? 'production' : 'development',
      module: {
        rules: [
          { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
          { test: /\.ts|.tsx$/, exclude: /node_modules/, use: ['ts-loader'] },
        ],
      },
      externals: {},
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      watch: true,
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development'),
        }),
      ],
    },
    webpackServer: {
      noInfo: true,
    },
  });
};
