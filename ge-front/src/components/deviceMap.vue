<!--  -->
<template>
<div class="">
	<Tabs value="deviceMap" @on-click='handleSwitch'>
		<TabPane label="设备地图" name="deviceMap"></TabPane>
		<TabPane label="用户地图" name="userMap"></TabPane>
		<TabPane label="水质地图" name="qualityMap"></TabPane>
		<TabPane label="用水量地图" disabled name="consumptionMap"></TabPane>
	</Tabs>
	<!-- <div :id="'map_echarts_' + id" :style="mapSize"></div> -->
</div>
</template>

<script>
import {
	provinceMap
} from "@/utils/provinceMap";
let mapid = 0;
let myChart = null;
let map = null;
let mydata = [{
		name: "北京",
		value: randomData()
	},
	{
		name: "天津",
		value: randomData()
	},
	{
		name: "上海",
		value: randomData()
	},
	{
		name: "重庆",
		value: randomData()
	},
	{
		name: "河北",
		value: randomData()
	},
	{
		name: "河南",
		value: randomData()
	},
	{
		name: "云南",
		value: randomData()
	},
	{
		name: "辽宁",
		value: randomData()
	},
	{
		name: "黑龙江",
		value: randomData()
	},
	{
		name: "湖南",
		value: randomData()
	},
	{
		name: "安徽",
		value: randomData()
	},
	{
		name: "山东",
		value: randomData()
	},
	{
		name: "新疆",
		value: randomData()
	},
	{
		name: "江苏",
		value: randomData()
	},
	{
		name: "浙江",
		value: randomData()
	},
	{
		name: "江西",
		value: randomData()
	},
	{
		name: "湖北",
		value: randomData()
	},
	{
		name: "广西",
		value: randomData()
	},
	{
		name: "甘肃",
		value: randomData()
	},
	{
		name: "山西",
		value: randomData()
	},
	{
		name: "内蒙古",
		value: randomData()
	},
	{
		name: "陕西",
		value: randomData()
	},
	{
		name: "吉林",
		value: randomData()
	},
	{
		name: "福建",
		value: randomData()
	},
	{
		name: "贵州",
		value: randomData()
	},
	{
		name: "广东",
		value: randomData()
	},
	{
		name: "青海",
		value: randomData()
	},
	{
		name: "西藏",
		value: randomData()
	},
	{
		name: "四川",
		value: randomData()
	},
	{
		name: "宁夏",
		value: randomData()
	},
	{
		name: "海南",
		value: randomData()
	},
	{
		name: "台湾",
		value: randomData()
	},
	{
		name: "香港",
		value: randomData()
	},
	{
		name: "澳门",
		value: randomData()
	}
];
export default {
	props: {
		height: {
			type: [String, Number],
			default: 500
		},
		width: {
			type: [String, Number],
			// default: 950
		}
	},
	data() {
		return {
			apiList: {
				deviceMap: '',
				userMap: '',
				qualityMap: '',
				consumptionMap: '',
			},
			module: 'deviceMap',
			dataApi: '',
			waiting: false,
			id: "",
			publicPath: process.env.BASE_URL,
			option: {
				title: {
					text: "全国设备分布",
					left: "center",
					textStyle: {
						color: "#fff"
					}
				},
				bmap: {
					center: [114.31, 30.52],
					zoom: 12,
					roam: true
				},
				series: [{
					name: "baidu_map",
					type: "scatter",
					coordinateSystem: "bmap",
					data: [],
				}],
			},
			optionMap: {
				backgroundColor: "#FFFFFF",
				title: {
					subtext: ""
				},
				tooltip: {
					trigger: "item"
				},
				visualMap: { //左侧小导航图标
					// type: "piecewise",
					show: true,
					// x: "left",
					// y: "center",
					// splitList: splitList,
					color: ['#0087ED', '#DEF1FF'],
					// color: ["#5475f5", "#9feaa5", "#85daef", "#74e2ca", "#e6ac53", "#9fb5ea"]
				},
				series: [{ //配置属性
					name: "china_map",
					type: "map",
					map: "china",
					roam: false,
					top: 60,
					// scaleLimit: {
					// 	min: 1,
					// 	max: 1,
					// },
					label: {
						normal: {
							show: true //省份名称
						},
						emphasis: {
							show: false
						}
					},
					data: mydata //数据
				}],
			}
		}
	},
	computed: {
		mapSize() {
			let height =
				typeof this.height === "number" ? this.height + "px" : this.height;
			let width =
				typeof this.width === "number" ? this.width + "px" : this.width;
			return `width:${width};height:${height};`;
		}
	},
	created() {
		this.id = mapid++;
		this.apiList = {
			deviceMap: this.$api.manage_dataCenter_deviceCountData,
			userMap: this.$api.manage_dataCenter_userCountData,
			qualityMap: this.$api.manage_dataCenter_tdsData,
			consumptionMap: '',
		}
		this.dataApi = this.apiList[this.module]
		this.getDeviceMapData()
	},
	mounted() {
		myChart = echarts.init(document.getElementById("map_echarts_" + this.id));
	},
	methods: {
		// 切换数据
		handleSwitch(name) {
			this.module = name
			this.dataApi = this.apiList[this.module]
			this.getDeviceMapData()
		},
		// 获取设备地图数据
		getDeviceMapData() {
			let api = this.dataApi,
				para = {
					level: 1
				}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				let maxValue = 0
				if (this.module != 'qualityMap') {
					for (let i in mydata) {
						mydata[i].value = 0
						for (let x in res.data) {
							if (res.data[x].province.indexOf(mydata[i].name) != -1) {
								if (res.data[x].nums > maxValue) {
									maxValue = res.data[x].nums
								}
								mydata[i].value = res.data[x].nums
							}
						}
					}
				} else {
					for (let i in mydata) {
						mydata[i].value = 0
						for (let x in res.data) {
							if (res.data[x].provinceName.indexOf(mydata[i].name) != -1) {
								if (res.data[x].outWaterTds > maxValue) {
									maxValue = res.data[x].outWaterTds
								}
								mydata[i].value = res.data[x].outWaterTds
							}
						}
					}
				}
				this.getSplitList(maxValue)
				this.$nextTick(function() {
					this.initChart();
				});
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
		},
		// 获取省数据
		getProvinceData(provinceName) {
			if (this.waiting) {
				return false
			}
			this.waiting = true
			let region = this.$store.state.common.region,
				provinceId = ''
			for (let i in region) {
				if (region[i].name.indexOf(provinceName) != -1) {
					provinceId = region[i].provinceId
					region = region[i]
					break;
				}
			}
			let api = this.dataApi,
				para = {
					level: 2,
					provinceId: provinceId
				}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				let data = this.getMockData(provinceName)
				if (this.module != 'qualityMap') {
					for (let i in data) {
						data[i].value = 0
						for (let x in res.data) {
							if (res.data[x].city.indexOf(data[i].name) != -1) {
								data[i].value = res.data[x].nums
							}
						}
					}
				}
				const series = [{
					name: "province_map",
					map: provinceName,
					data: data
				}];
				let maxValue = 0
				for (let i in data) {
					if (maxValue < data[i].value) {
						maxValue = data[i].value
					}
				}
				// splitList = []
				this.getSplitList(maxValue, series)
				this.waiting = false
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
		},
		// 获取分级大小
		getSplitList(maxValue, series) {
			// if (maxValue < 10) {
			// 	splitList = [{
			// 		start: 10,
			// 		end: 5,
			// 	}, {
			// 		start: 5,
			// 		end: 0
			// 	}]
			// } else {
			// 	let flage = true,
			// 		split = maxValue.toFixed(0)
			// 	while (true) {
			// 		split++
			// 		if (split % 6 == 0) {
			// 			break
			// 		}
			// 	}
			// 	let part = split / 6
			// 	for (let i = 6; i > 0; i--) {
			// 		splitList.push({
			// 			end: split,
			// 			start: split - part
			// 		})
			// 		split = split - part
			// 	}
			// }
			// myChart.clear();
			myChart.setOption({
				series
			});
		},
		// 设置地图配置
		setOption(option) {
			myChart.setOption(option);
		},
		// 获取模拟数据
		getMockData(name) {
			return echarts.getMap(name).geoJson.features.map(el => {
				return {
					name: el.properties.name,
					value: randomData()
				};
			});
		},
		// 获取地区数据
		getDeviceRegion(val) {
			let cityId = '',
				provinceId = '',
				cityList = JSON.parse(sessionStorage.getItem('city')) || [],
				provinceList = this.$store.state.common.region
			for (let i in cityList) {
				if (cityList[i].name.indexOf(val.name) != -1) {
					cityId = cityList[i].cityId
				}
			}
			for (let i in provinceList) {
				if (cityId.indexOf(provinceList[i].provinceId) != -1) {
					provinceId = provinceList[i].provinceId
				}
			}
			let api = this.dataApi,
				para = {
					level: 3,
					cityId: cityId,
					provinceId: provinceId,
				}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				let points = res.data,
					options = {
						size: BMAP_POINT_SIZE_SMALL,
						shape: BMAP_POINT_SHAPE_STAR,
						color: "#d340c3"
					};
				let pointCollection = new BMap.PointCollection(points, options); // 初始化PointCollection
				pointCollection.addEventListener("click", function(e) {
					alert("单击点的坐标为：" + e.point.lng + "," + e.point.lat); // 监听点击事件
				});
				map.addOverlay(pointCollection); // 添加Overlay
			}).catch(err => {
				// eslint-disable-next-line
				console.log(err);
			})
		},
		// 初始化图表
		initChart() {
			myChart.on("click", val => {
				// 中国地图 =》省级地图
				if (val.seriesName === "china_map") {
					addScript(val.name, this).then(() => {
						this.getProvinceData(val.name)
					});
				}
				// 省级地图 =》市级地图
				// else if (val.seriesName === "province_map" && val.name) {
				// 	myChart.setOption(this.option);
				// 	map = myChart
				// 		.getModel()
				// 		.getComponent("bmap")
				// 		.getBMap();
				// 	// map.clearOverlays();
				// 	getBoundary(val.name);
				// 	this.getDeviceRegion(val)
				// }
			});
			this.setOption(this.optionMap);
		}
	}
};

function randomData() {
	return Math.round(Math.random() * 500);
}
// 对应市级地图边界变色
function getBoundary(name) {
	let bdary = new BMap.Boundary();
	bdary.get(name, function(rs) {
		//获取行政区域
		// map.clearOverlays();        //清除地图覆盖物
		let count = rs.boundaries.length; //行政区域的点有多少个
		for (let i = 0; i < count; i++) {
			let ply = new BMap.Polygon(rs.boundaries[i], {
				strokeWeight: 2, //设置多边形边线线粗
				strokeOpacity: 1, //设置多边形边线透明度0-1
				StrokeStyle: "solid", //设置多边形边线样式为实线或虚线，取值 solid 或 dashed
				strokeColor: "#ff0000", //设置多边形边线颜色
				fillColor: "#00ffff", //设置多边形填充颜色
				fillOpacity: 0.01
			}); //建立多边形覆盖物
			map.addOverlay(ply); //添加覆盖物
			map.setViewport(ply.getPath()); //调整视野
		}
	});
}
// 动态引入省级地图数据
function addScript(province, self) {
	return new Promise((resolve, reject) => {
		if (provinceMap[province]) {
			let script = document.createElement("script");
			script.src =
				self.publicPath + "map/province/" + provinceMap[province] + ".js";
			script.onload = function() {
				resolve();
				script = null;
			};
			script.onerror = function() {
				reject(`下载${province}地图失败`);
				script = null;
			};
			document.head.appendChild(script);
		}
	});
}
</script>
