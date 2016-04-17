const webpack = require('webpack');

module.exports = {
  entry: {
    'dist/react-number-format' : [
      './src/number_format.js'
    ],
    'dist/react-number-format.min' : [
      './src/number_format.js'
    ]
  },
  debug: false,
  output: {
    // publicPath: "http://localhost:8081/public/js/",
    // path: path.join(__dirname, "public","js"),
    filename: '[name].js',
    libraryTarget : 'umd'
  },
  resolveLoader: {
    modulesDirectories: ['','node_modules']
  },
  externals: {
    react : 'React'
  },
  plugins: [
    new webpack.DefinePlugin({
      // This has effect on the react lib size.
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
          include: /\.min\.js$/,
          minimize: true
    })
  ],
  resolve: {
    extensions: ['','.js'] //can add jsx also but not required
  },
  module: {
    loaders: [
      {test: /\.js$/, loaders:['babel','eslint-loader'], exclude: /node_modules/},
    ]
  }
};
