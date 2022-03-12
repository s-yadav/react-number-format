const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    bundle: ['./example/src/index.js'],
  },
  devtool: 'eval',
  output: {
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'example'),
    },
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.ts|.tsx$/, exclude: /node_modules/, use: ['ts-loader'] },
    ],
  },
};
