require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
})
require('jsdom-global/register')
require('./tests.js')
