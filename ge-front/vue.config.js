const path = require('path')
const dir = `dist/${process.env.VUE_APP_ENV}`
// vue.config.js
module.exports = {
    // 修改的配置
    // 生成构建文件的目录
    outputDir: path.resolve(__dirname, dir),
    // 指定生成的 index.html 的输出路径 (相对于 outputDir)
    indexPath: path.resolve(__dirname, `${dir}/index.html`),
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
    publicPath: '/',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://ge-test.yunext.com',
                // target: 'https://smart.canature.com/',
                changeOrigin: true,
                ws: false,
                secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}