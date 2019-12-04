'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
//API_ROOT:'"https://smart-test.canature.com/web/api/"',
//URL:'"https://smart-h5test.canature.com/"',
//PK:'"a1SAIiTjWSK"'
  API_ROOT:'"https://smart.canature.com/web/api/"',//https://kaineng-test.yunext.com
  URL:'"https://smart-h5.canature.com/"',
  PK:'"a18UqSfcEvY"'
})
 