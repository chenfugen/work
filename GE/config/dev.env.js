'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT:'"https://smart.canature.com/web/api/"',
//API_ROOT:'"https://kaineng-test.yunext.com/web/api/"',
  URL:'"https://smart.gewater.cn/"',
  PK:'"a18UqSfcEvY"'  
})
