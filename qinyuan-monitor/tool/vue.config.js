// vue.config.js
const path = require('path');
const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? './' : './', // 公共路径
	indexPath: 'index.html', // 相对于打包路径index.html的路径
	outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
	assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
	lintOnSave: false, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
	runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
	parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
	pwa: {}, // 向 PWA 插件传递选项。
	chainWebpack: config => {
		config.resolve.symlinks(true); // 修复热更新失效
		config.resolve.alias // 添加别名
			.set('@', resolve('src'))
			.set('@assets', resolve('src/assets'))
			.set('@components', resolve('src/components'))
			.set('@views', resolve('src/views'))
			.set('@store', resolve('src/store'));
		// 压缩图片
		// 需要 npm i -D image-webpack-loader
		config.module
			.rule("images")
			.use("image-webpack-loader")
			.loader("image-webpack-loader")
			.options({
				mozjpeg: {
					progressive: true,
					quality: 65
				},
				optipng: {
					enabled: false
				},
				pngquant: {
					quality: [0.65, 0.9],
					speed: 4
				},
				gifsicle: {
					interlaced: false
				},
				webp: {
					quality: 75
				}
			});
		// 打包分析, 打包之后自动生成一个名叫report.html文件(可忽视)
		// if (IS_PROD) {
		//     config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
		//         {
		//             analyzerMode: "static"
		//         }
		//     ]);
		// }
	},
	configureWebpack: config => {
		// 开启 gzip 压缩
		// 需要 npm i -D compression-webpack-plugin
		const plugins = [];
		if (IS_PROD) {
			plugins.push(
				new CompressionWebpackPlugin({
					filename: "[path].gz[query]",
					algorithm: "gzip",
					test: productionGzipExtensions,
					threshold: 10240,
					minRatio: 0.8
				})
			);
		}
		config.plugins = [...config.plugins, ...plugins];
	},
	devServer: {
		host: "localhost",
		port: 8080, // 端口号
		https: false, // https:{type:Boolean}
		open: true, //配置自动启动浏览器
		hotOnly: true, // 热更新
		//proxy: 'http://localhost:8080'   // 配置跨域处理,只有一个代理
		proxy: { //配置多个跨域
			"/api": {
				target: "https://qinyuan-fangwei-chance-test.yunext.com/",
				changeOrigin: true,
				pathRewrite: {
					"^/api": ''
				}
			}
		}
	}
}
