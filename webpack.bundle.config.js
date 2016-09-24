const webpack = require('webpack');
const PACKAGE = require('./package.json');
const fullYear = new Date().getFullYear();
const banner = PACKAGE.name + ' - ' + PACKAGE.version + '\n' +
  'Author : '+PACKAGE.author+'\n'+
  'Copyright (c) '+ (fullYear!== 2016 ? '2016,' : '') + fullYear + ' to ' + PACKAGE.author + ' - ignitersworld.com , released under the '+PACKAGE.license+' license.'
  /* +PACKAGE.homepage */;

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
    libraryTarget : 'umd',
    library : 'NumberFormat'
  },
  resolveLoader: {
    modulesDirectories: ['','node_modules']
  },
  externals: {
    react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
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
    }),
    new webpack.BannerPlugin(banner)
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
