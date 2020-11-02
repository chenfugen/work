'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT:'"https://zc.yunext.com/web/api/"',
  URL:'"http://localhost:8080/"',
  PK:'"a18UqSfcEvY"'  
})
