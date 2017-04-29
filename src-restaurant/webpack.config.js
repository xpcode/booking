var path = require('path')
var webpack = require('webpack')

var config = {
  entry: [
    './src-restaurant/client/index.js'
  ],
  output: {
    publicPath: 'http://localhost:8082/',
    path: path.join(__dirname, './'),
    filename: 'static/restaurant/scripts/[name].js'
  },
  resolve: {
    extensions: ["", ".js"],
  },
  module: {
    modulesDirectories: ['node_modules'],
    loaders: [{
        test: /\.js$/,
        loader: 'babel',
        query: {
          cacheDirectory: true
        }
      }, {
        test: /\.(jpg|png|gif)$/,
        loader: 'url?limit=8192',
      }, {
        test: /\.less$/,
        loaders: ["style", "css", "less"],
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    host: '0.0.0.0',
    hot: true,
    inline: true,
    port: 8082,
  },
  devtool: 'sheap-source-map',
  cache: true,
}

module.exports = config
