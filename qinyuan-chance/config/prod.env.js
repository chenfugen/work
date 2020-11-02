'use strict'
let env
switch (process.env.npm_lifecycle_event) {
  case 'test':
    env = '"test"'
    break
  case 'release':
    env = '"release"'
    break
  default:
    env = '"production"'
}
module.exports = {
  NODE_ENV: env
}
