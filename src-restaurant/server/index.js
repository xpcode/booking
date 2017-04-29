require('babel-polyfill')
require('babel-register')({
  sourceMaps: true,
  extensions: ['.js'],
  presets: ["es2015", 'stage-1', 'react'],
})
require('./app')
