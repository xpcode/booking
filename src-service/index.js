require('babel-polyfill')
require('babel-register')({
  sourceMaps: true,
  extensions: ['.js', '.jsx'],
  presets: ["es2015", "stage-1"],
})
require('./app')
