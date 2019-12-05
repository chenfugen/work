<template>
	<div>
		<div class="amap-page-container">
			<el-amap vid="amapDemo" class="amap-demo" :zoom="zoom" :center="center" :events="events" :mapStyle="mapstyle">
				<el-amap-marker vid="component-marker" v-for="(marker,index) in markers" :key="index" :position="marker.position" :content="marker.content" :events="marker.events"></el-amap-marker>
				<el-amap-marker vid="component-marker" :position="markerself.position" :content="markerself.content" :events="markerself.events"></el-amap-marker>
			</el-amap>
		</div>
		<div v-show="watarMsg" class="watarMsg">
			<p class="waterRegion">{{address}}水质</p>
			<p class="waterTitle" v-show="tds<=60">水质优，简单净化即可使用</p>
			<p class="waterTitle" v-show="tds>60 && tds<=100">水质一般，建议软化以及净化使用</p>
			<p class="waterTitle" v-show="tds>100">水质差，需要软化以及净化才能使用</p>
			<span class="waterNum">
				<p class="tdsValue">{{tds | tofixed}}</p>
				<p class="tdsName">TDS</p>
			</span>
		</div>
		<div class="location" @click="isWifi">
			<img src="../../../static/image/icon_map_location.png" />
		</div>
		<div class="van-overlay" v-show="isLocation" style="z-index: 2012;">
			<div class="van-toast van-toast--default van-toast--middle" style="z-index: 2009;">
				<div class="van-loading van-loading--circular van-loading--white" style="color: white;"><span class="van-loading__spinner van-loading__spinner--circular"><svg viewBox="25 25 50 50" class="van-loading__circular"><circle cx="50" cy="50" r="20" fill="none"></circle></svg></span></div>
				<div class="van-toast__text">定位中...</div>
			</div>
		</div>
		<tabbar :selected="selected"></tabbar>
	</div>
</template>

<script>
	import tabbar from '../../components/tabbar'
	export default {
		data() {
			let self = this;
			return {
				isLocation: true,
				selected: 2,
				map: "",
				mapstyle: "fresh",
				center: [121.707038, 31.167574],
				zoom: 6,
				address: '上海市',
				tds: "",
				selfAddress: "",
				selfTds: "",
				loaded: false,
				markerRefs: [],
				markers: [],
				events: {
					init(o) {
						self.map = o;
						setTimeout(() => {
							let cluster = new AMap.MarkerClusterer(o, self.markerRefs, {
								gridSize:60,
								renderCluserMarker: self._renderCluserMarker
							});
						}, 1000);
					}
				},
				markerself: {
					position: [121.707038, 31.167574],
					content: '<div style="text-align:center; background:url(https://a.amap.com/jsapi_demos/static/resource/img/user.png);height:30px;width:30px;background-size:100%;"></div>',
					events: {
						click: () => {
							self.address = self.selfAddress;
							self.tds = self.selfTds;
							self.watarMsg = !self.watarMsg;
						}
					}
				},
				citys: JSON.parse(sessionStorage.getItem("citys")),
				watarMsg: false,
			}
		},
		components: {
			tabbar
		},
		created() {
			this.isWifi();
			this.getTds("上海市");
		},
		methods: {
			getTds(cityName) {
				let self = this;
				let markers = [];
				for(let i = 0; i < self.citys.length; i++) {
					if(cityName == self.citys[i].cityName) {
						self.tds = self.citys[i].waterTds;
						self.selfTds = self.citys[i].waterTds;
					}
					let tds = (self.citys[i].waterTds).toFixed(0);
					markers.push({
						position: [self.citys[i].longitude - 0.02, self.citys[i].latitude],
						content: '<div style="text-align:center; background:url(../../../static/image/icon_location_blue@3x.png);height:53px;width:53px;background-size:100%;font-size:0.1rem;overflow:hidden;color:white"><p style="margin-top:10px">TDS</p>' + tds + '</div>',
						events: {
							init(o) {
								o.tds = self.citys[i].waterTds;
								self.markerRefs.push(o);
							},
							click(o) {
								self.citys[i].regionName = self.citys[i].regionName == null ? "" : self.citys[i].regionName;
								self.address = self.citys[i].cityName + self.citys[i].regionName;
								self.tds = self.citys[i].waterTds;
								self.zoom = 10;
								self.center = [self.citys[i].longitude, self.citys[i].latitude];
								self.watarMsg = true;
								if(self.citys[i].regionId == null) {
									self.getRegionTds(self.citys[i].provinceId, self.citys[i].cityId);
								}
							}
						}
					});
				}
				this.markers = markers;
			},
			getRegionTds(provinceId, cityId) {
				let self = this;
				let markers = [];
				self.$Axios.get("wechat/device/getTdsData", {
					params: {
						"level": 3,
						"provinceId": provinceId,
						"cityId": cityId,
					}
				}).then((res) => {
					let regions = res.data.data;
					for(var i in regions) {
						self.citys.push(regions[i]);
					}
					self.getTds();
				})
			},
			isWifi() {
				let that = this;
				var geocoder, marker;
				geocoder = new AMap.Geocoder({
					city: "010", //城市设为北京，默认：“全国”
					radius: 1000 //范围，默认：500
				});
				that.$Axios.get("wechat/user/getWxSignature", {
					params: {
						"url": that.$store.state.url,
						"customerId": "GE"
					}
				}).then((res) => {
					if(res.data.success) {
						const data = res.data.data;
						wx.config({
							beta: true,
							debug: false,
							appId: data.appId,
							timestamp: Number(data.timestamp),
							nonceStr: data.nonceStr,
							signature: data.signature,
							jsApiList: ["getLocation", "openLocation", "getNetworkType"]
						});
						wx.error(function(res) {
							that.location();
						});
						wx.ready(function() {
							wx.checkJsApi({
								jsApiList: ["getNetworkType", "getLocation"],
								success: function(res) {
									//									wx.getNetworkType({
									//										success: function(res) {
									//											var networkType = res.networkType;
									//											if(networkType == "wifi") {
									//												that.location();
									//											} else {
									wx.getLocation({
										type: 'wgs84',
										success: function(res) {
											let center = [res.longitude, res.latitude];
											AMap.convertFrom(center, 'gps', function(status, result) {
												if(result.info === 'ok') {
													let lnglats = [result.locations[0].lng, result.locations[0].lat];
													that.center = lnglats;
													that.markerself.position = lnglats;
													that.$forceUpdate();
													geocoder.getAddress(lnglats, function(status, result) {
														if(status === 'complete' && result.regeocode) {
															that.isLocation = false;
														    if(result.regeocode.addressComponent.city==""){
																that.address = result.regeocode.addressComponent.province;
																that.selfAddress = result.regeocode.addressComponent.province;
																that.getTds(result.regeocode.addressComponent.province);
															} else {
																that.address = result.regeocode.addressComponent.city;
																that.selfAddress = result.regeocode.addressComponent.city;
																that.getTds(result.regeocode.addressComponent.city);
															}
															that.watarMsg = true;
														} else {
															alert(JSON.stringify(result))
														}
													});
												}
											});
										},
										fail: function() {
											that.isLocation = false;
										}
									});
									//											}
									//										}
									//									});
								}
							})
						})
					}
				})
			},
			location() {
				let that = this;
				var map, geolocation; //加载地图，调用浏览器定位服务
				map = new AMap.Map('container', {
					resizeEnable: true
				});
				map.plugin('AMap.Geolocation', function() {
					geolocation = new AMap.Geolocation({
						enableHighAccuracy: true,
						timeout: 10000,
						buttonPosition: 'RB',
						buttonOffset: new AMap.Pixel(10, 20),
						zoomToAccuracy: true,
					});
					geolocation.getCurrentPosition(getCity);
				});

				function getCity(status, result) {
					if(status != 'complete') {
						that.isLocation = false;
					} else {
						that.isLocation = false;
						that.address = result.addressComponent.city;
						that.selfAddress = result.addressComponent.city;
						that.getTds(result.addressComponent.city);
						that.watarMsg = true;
						let center = [result.position.lng, result.position.lat]
						that.center = center;
						that.markerself.position = center;
					}
				}
			},
			_renderCluserMarker(context) {
				let tdsMean = 0;
				for(var i = 0; i < context.markers.length; i++) {
					tdsMean += context.markers[i].tds;
				}
				const count = this.markers.length;
				let factor = Math.pow(context.count / count, 1 / 18)
				let div = document.createElement('div');
				let Hue = 180 - factor * 180;
				let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
				let borderColor = 'hsla(' + Hue + ',100%,40%,1)';
				let shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
				div.style.backgroundColor = bgColor
				let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 40);
				div.style.width = div.style.height = size + 'px';
				div.style.background = "url(../../../static/image/icon_location_blue@3x.png)";
				div.style.backgroundSize = "100%";
				div.style.overflow = "hidden";
				div.innerHTML = "<p style='margin-top:8px'>TDS</p>" + (tdsMean / context.markers.length).toFixed(0);
				div.style.lineHeight = '15px';
				div.style.color = "white";
				div.style.fontSize = '10px';
				div.style.textAlign = 'center';
				context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
				context.marker.setContent(div);
			},
			searchMarch(val) {
				console.log(val);
			}
		}
	};
</script>
<style lang="scss">
	.amap-page-container,
	.amap-demo {
		width: 100%;
		height: 97vh;
		margin-top: -0.1rem;
	}
	
	.watarMsg {
		position: fixed;
		background: white;
		width: 94%;
		height: 0.8rem;
		bottom: 0.55rem;
		left: 3%;
		overflow: hidden;
		.waterRegion {
			line-height: 0.4rem;
			font-size: 0.16rem;
			padding-left: 0.15rem;
			margin-top: 0.05rem;
		}
		.waterTitle {
			padding-left: 0.15rem;
			font-size: 0.12rem;
			line-height: 0.3rem;
		}
		.waterNum {
			float: right;
			margin-right: 0.15rem;
			display: inline-block;
			margin-top: -0.65rem;
			border-radius: 50%;
			background: #267CFB;
			color: white;
			text-align: center;
			height: 0.6rem;
			width: 0.6rem;
			.tdsValue {
				padding: 0.15rem 0 0 0;
				font-size: 0.16rem;
			}
			.tdsName {
				font-size: 0.1rem;
			}
		}
	}
	
	.location {
		position: fixed;
		top: 0.1rem;
		right: 0.1rem;
		background: white;
		width: 0.35rem;
		height: 0.35rem;
		img {
			width: 0.25rem;
			display: block;
			margin: 0.05rem auto;
		}
	}
</style>