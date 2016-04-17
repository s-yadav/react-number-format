module.exports = {
  entry: {
    'bundle' : [
      './example/src/index.js'
    ]
  },
  devtool: "eval",
  debug: true,
  output: {
    publicPath: "http://localhost:8080/",
    // path: path.join(__dirname, "public","js"),
    filename: '[name].js'
  },
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  resolve: {
    extensions: ['','.js'] //can add jsx also but not required
  },
  module: {
    loaders: [
      // { test: /\.css$/, loaders: ['style', 'css']},
      // { test: /\.cjsx$/, loaders: ['react-hot', 'coffee', 'cjsx']},
      // { test: /\.coffee$/, loader: 'coffee' }
      {test: /\.js$/, loaders:['babel','eslint-loader'], exclude: /node_modules/},
      //{ test: /\.css$/, loader: "style-loader!css-loader" },
    ]
  }
};
