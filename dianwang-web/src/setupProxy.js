const proxy = require("http-proxy-middleware");
module.exports = function(app) {
    app.use(
        proxy('/web/api', {
            target: "https://zc.yunext.com", // "https://dianwang-test.yunext.com",
            changeOrigin: true, // needed for virtual hosted sites
            ws: true, // proxy websockets
            pathRewrite: {
                '^/web/api': '/web/api'
            }
        })
    );
};
