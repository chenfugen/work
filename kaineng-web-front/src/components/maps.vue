<template lang="html">
<div class="maps" style="position:relative">
    <Tabs @on-click='handleSwitch'>
        <TabPane label="设备地图" name="deviceMap"></TabPane>
        <TabPane label="用户地图" name="userMap"></TabPane>
        <TabPane label="水质地图" name="qualityMap"></TabPane>
        <TabPane label="用水量地图" disabled name="consumptionMap"></TabPane>
    </Tabs>
    <Card class="inputCard">
        <Form inline class="marginTop" :label-width="100">
            <!-- <FormItem label='行政级别：' >
                <Select class="formInput" v-model='level'>
                    <Option value="district">区</Option>
                    <Option value="city">市</Option>
                    <Option value="province">省</Option>
                    <Option value="country">国</Option>
                </Select>
            </FormItem> -->
            <FormItem label='名称/地址代码：'>
                <Input class="formInput" v-model='district' />
            </FormItem>
            <Button @click='drawBounds'>查询</Button>
        </Form>
    </Card>
    <div id="deviceAddress" class="map"></div>
    <Spin fix size='large' v-if='loading'></Spin>
</div>
</template>
<script>
export default {
	name: 'maps',
	data() {
		return {
			district: '宁波市',
			level: 'city',
			polygons: [],
			map: null,
			markers: [],
			cluster: [],
			type: 1,
			deviceData: [],
			userData: [],
			tdsData: [],
			loading: false
		}
	},
	mounted() {
		this.initMap()
	},
	methods: {
		handleSwitch(name) {
			this.map.remove(this.markers);
			this.map.remove(this.cluster);
			this.markers = []
			this.cluster = []
			switch (name) {
				case 'deviceMap':
					this.getDeviceData()
					break;
				case 'userMap':
					this.getUserData()
					break;
				default:
					this.getTdsData()
			}
		},
		// 初始化地图
		initMap() {
			let that = this
			this.map = new AMap.Map("deviceAddress", {
				resizeEnable: true,
				zoom: 5,
				expandZoomRange: true,
			});
			this.getDeviceData()
		},
		drawBounds() {
			var district = null;
			let that = this
			//加载行政区划插件
			if (!district) {
				//实例化DistrictSearch
				var opts = {
					subdistrict: 0, //获取边界不需要返回下级行政区
					extensions: 'all', //返回行政区边界坐标组等具体信息
					level: 'city' //查询行政级别为 市
				};
				district = new AMap.DistrictSearch(opts);
			}
			//行政区查询
			district.setLevel(that.level)
			district.search(that.district, function(status, result) {
				that.map.remove(that.polygons) //清除上次结果
				that.polygons = [];
				var bounds = result.districtList[0].boundaries;
				if (bounds) {
					for (var i = 0, l = bounds.length; i < l; i++) {
						//生成行政区划polygon
						var polygon = new AMap.Polygon({
							strokeWeight: 1,
							path: bounds[i],
							fillOpacity: 0.4,
							fillColor: '#80d8ff',
							strokeColor: '#0091ea'
						});
						that.polygons.push(polygon);
					}
				}
				that.map.add(that.polygons)
				that.map.setFitView(that.polygons); //视口自适应
			});
		},
		// 设备信息
		getDeviceData() {
			this.loading = true
			this.type = 1
			let api = this.$api.manage_dataCenter_deviceCountData
			this.$Ax.get(api).then(res => {
				this.deviceData = res.data
				this.handleGetCityId(res.data)
			}).catch(err => {
				console.log(err);
			})
		},
		// 用户信息
		getUserData() {
			this.loading = true
			this.type = 1
			let api = this.$api.manage_dataCenter_userCountData
			this.$Ax.get(api).then(res => {
				this.userData = res.data				
				this.handleGetCityId(res.data)
			}).catch(err => {
				console.log(err);
			})
		},
		// 获取tds
		getTdsData() {
			this.loading = true
			this.type = 2
			let api = this.$api.manage_dataCenter_tdsData
			this.$Ax.get(api).then(res => {
				this.tdsData = res.data
				this.handleMaker(res.data)
			}).catch(err => {
				console.log(err);
			})
		},
		// 获取城市经纬度
		handleGetCityId(data) {
			let that = this
			let list = []
			for (let i in data) {
				var geocoder = new AMap.Geocoder({});
				geocoder.getLocation(data[i].city, function(status, result) {
					list.push({
						longitude: result.geocodes[0].location.lng,
						latitude: result.geocodes[0].location.lat,
						nums: data[i].nums
					})
					if (i == data.length - 1) {
						that.handleMaker(list)
					}
				});
			}
		},
		// 创建点
		handleMaker(list) {
			let that = this,
				num = 0
			for (let i in list) {
				if (this.type == 1) {
					num = list[i].nums
				} else {
					num = list[i].waterTds
				}
				this.markers.push(new AMap.Marker({
					position: [list[i].longitude, list[i].latitude],
					content: '<div style="background-color: #fff; height: 24px;text-align:center; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;">' + num +
						'</div>',
					offset: new AMap.Pixel(-15, -15),
					nums: num
				}))
			}
			this.handleMakerCluster()
		},
		// 创建聚合点
		handleMakerCluster() {
			let that = this
			let nums = 0
			var count = this.markers.length;
			var _renderClusterMarker = function(context) {
				nums = 0
				var factor = Math.pow(context.count / count, 1 / 18);
				var div = document.createElement('div');
				var Hue = 180 - factor * 180;
				var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
				var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
				var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
				var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
				div.style.backgroundColor = bgColor;
				var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
				div.style.width = div.style.height = size + 'px';
				div.style.border = 'solid 1px ' + borderColor;
				div.style.borderRadius = size / 2 + 'px';
				div.style.boxShadow = '0 0 1px ' + shadowColor;
				console.log(context.markers)
				for (let i in context.markers) {
					nums = nums + context.markers[i].Ce.nums
				}
				if (that.type == 2) {
					nums = (nums / context.count).toFixed(0)
				}
				div.innerHTML = nums
				div.style.color = fontColor;
				div.style.fontSize = '14px';
				div.style.lineHeight = size + 'px';
				div.style.color = '#fff';
				div.style.textAlign = 'center';
				context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
				context.marker.setContent(div)
			};
			this.cluster = new AMap.MarkerClusterer(that.map, that.markers, {
				gridSize: 80,
				renderClusterMarker: _renderClusterMarker
			});
			this.loading = false
		}
	}
}
</script>

<style scoped>
.map {
	height: 570px;
}

.custom-content-marker {
	position: relative;
	color: #fff !important;
}

.close-num {
	position: absolute;
	top: -20px;
}

.inputCard {
	position: absolute;
	z-index: 999;
	left: 20px;
	top: 60px;
	width: 360px;
	background-color: #fff;
	/* width: 150px;
	text-indent: 5px;
	height: 30px; */
}

.formInput {
	width: 150px;
}
</style>
