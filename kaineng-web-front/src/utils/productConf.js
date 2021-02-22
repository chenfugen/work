const development = [{
		productKey: 'a1C6AilwYUc',
		name: '商用WIFI',
		flag: 'commercialRO',
	}, {
		productKey: 'a1EUR5GZocU',
		name: '商用2G',
		flag: 'commercialRO',
	}, {
		productKey: 'a1ZLeXs5VCX',
		name: '新月',
		flag: 'xinyue',
	}, {
		productKey: 'a12KzXXwRii',
		name: '雨荷',
		flag: 'xinyue',
	}],
	release = [{
		productKey: 'a1C6AilwYUc',
		name: '商用WIFI',
		flag: 'commercialRO',
	}, {
		productKey: 'a1EUR5GZocU',
		name: '商用2G',
		flag: 'commercialRO',
	}, {
		productKey: 'a1ZLeXs5VCX',
		name: '新月',
		flag: 'xinyue',
	}, {
		productKey: 'a12KzXXwRii',
		name: '雨荷',
		flag: 'xinyue',
	}],
	production = [{
		productKey: 'a1C6AilwYUc',
		name: '商用WIFI',
		flag: 'commercialRO',
	}, {
		productKey: 'a1EUR5GZocU',
		name: '商用2G',
		flag: 'commercialRO',
	}, {
		productKey: 'a1ZLeXs5VCX',
		name: '新月',
		flag: 'xinyue',
	}, {
		productKey: 'a12KzXXwRii',
		name: '雨荷',
		flag: 'xinyue',
	}],
	env = process.env.VUE_APP_ENV
// var proConf =
var proConf = (env == 'development') ? development : (env == 'release') ? release : production

export {
	proConf
}