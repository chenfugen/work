const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://kepler-test.yunext.com',
      changeOrigin: true
    })
  )
}
