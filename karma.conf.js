var webpack = require('webpack');

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        singleRun: false,
        frameworks: ['jasmine'],
        files: [
            './test/input_test.js'
        ],
        reporters: ['kjhtml'],
        preprocessors: {
          './test/*.js': [ 'webpack','sourcemap'] //preprocess with webpack
        },
        webpack: {
            module: {
                loaders: [
                    {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
                    {test: /\.json$/, loaders: ['json-loader']}
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        }
    });
};
