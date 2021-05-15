const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    'bundle' : [
      './example/src/index.js'
    ]
  },
  devtool: "eval",
  output: {
    filename: '[name].js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'example'),
    compress: true,
    port: 8084,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      }
    ]
  },
};
