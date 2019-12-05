<template>
	<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
		<div class="cityPara">
			<div class="bg">
				<div class="areaPara" @click="searchCity">
					<div class="AirImg"></div>
					<p class="temperature">{{weather.temperature}}℃</p>
					<p class="weatherMsg">
						<span>{{positionMsg.city}} {{weather.weather}}</span><span>空气质量  {{weather.humidity | airFilter}}</span></p>
					<van-icon name="arrow" class="link" />
				</div>
				<div class="water">
					<p class="waterTitle"><i class="iconfont iconliuliang" style="color: #fff;font-size:0.12rem;"></i> 本年总用水量（L）</p>
					<p class="cityWaters">{{totalWaters}}</p>
				</div>
			</div>
			<div class="chart" v-show="showChart">
				<p class="chartName">用水统计(L)</p>
				<ul class="van_tab">
					<li @click="tabSelect('week')" :class="{tabActive:isActive==1}">周</li>
					<li @click="tabSelect('month')" :class="{tabActive:isActive==2}">月</li>
				</ul>
				<div id="myChart" class="chartContent"></div>
			</div>
			<div style="height: 0.5rem;"></div>
			<div id="container" style="display: none;"></div>
			<tabbar :selected="selected"></tabbar>
		</div>
	</v-touch>
</template>
<script>
	import tabbar from '../../components/tabbar'
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				selected: 1,
				positionMsg: {
					city: "",
					lat: "",
					lng: "",
				},
				isActive: 1,
				weather: "",
				charts: '',
				waterLog: "",
				showChart: true,
				totalWaters: 0,
			}
		},
		mounted() {
			this.getWaterLog(1);
			this.getTotalWater();
			if(this.$route.query.city) {
				this.changeCity();
			} else {
				this.getWeather();
			}
		},
		methods: {
			getTotalWater() {
				this.$Axios.get("wechat/device/drinkWaterRecord/total").then((res) => {
					if(res.data.success) {
						this.totalWaters = res.data.data;
					}
				})
			},
			getDay(day) {
				var today = new Date();
				var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
				today.setTime(targetday_milliseconds); //注意，这行是关键代码
				var tMonth = today.getMonth();
				var tDate = today.getDate();
				tMonth = this.doHandleMonth(tMonth + 1);
				tDate = this.doHandleMonth(tDate);
				return tMonth + "-" + tDate;
			},
			doHandleMonth(month) {
				var m = month;
				if(month.toString().length == 1) {
					m = "0" + month;
				}
				return m;
			},
			tabSelect(e) {
				if(e == "week") {
					this.isActive = 1;
					this.getWaterLog(1);
				} else {
					this.isActive = 2;
					this.getWaterLog(2);
				}
			},
			getWaterLog(timetype) {
				this.$Axios.get("wechat/device/drinkWaterRecordData", {
					params: {
						"timeType": timetype,
						"type": 1,
					}
				}).then((res) => {
					if(res.data.success) {
						this.waterLog = res.data.data;
						let dataX = [];
						let dataY = [];
						let num = this.waterLog.length;
						if(num > 1) {
							this.waterLog.forEach(function(msg, index) {
								if(timetype == 1) {
									dataX.push(msg.date);
									dataY.push(msg.waterValue);
								} else {
									if(num > 29 && index > 0) {
										dataX.push(msg.date);
										dataY.push(msg.waterValue);
									} else {
										dataX.push(msg.date);
										dataY.push(msg.waterValue);
									}
								}
							})
						}else if(num==1){
							dataX = [this.getDay(-6), this.getDay(-5), this.getDay(-4), this.getDay(-3), this.getDay(-2), this.getDay(-1), this.getDay(0)];
							dataY = [0, 0, 0, 0, 0, 0,this.waterLog[0].waterValue];
						}else{
							this.$toast("暂无数据");
							this.showChart = false;
						}
						this.$nextTick(
							function() {
								this.drawLine(dataX, dataY);
							}
						)

					}
				})
			},
			getWeather() {
				let that = this;
				var geocoder, marker;
				geocoder = new AMap.Geocoder({
					city: "010", //城市设为北京，默认：“全国”
					radius: 1000 //范围，默认：500
				});
				let AirImg = document.getElementsByClassName("AirImg")[0];
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
							jsApiList: ["getLocation", "openLocation"]
						});
						wx.error(function(res) {
							that.location();
						});
						wx.ready(function() {
							wx.checkJsApi({
								jsApiList: ["getLocation", "openLocation"],
								success: function(res) {
									wx.getLocation({
										type: 'wgs84',
										success: function(res) {
											let center = [res.longitude, res.latitude];
											geocoder.getAddress(center, function(status, result) {
												if(status === 'complete' && result.regeocode) {
													let city;
													if(result.regeocode.addressComponent.city == "") {
														city = result.regeocode.addressComponent.province;
													} else {
														city = result.regeocode.addressComponent.city;
													}
													that.positionMsg.city = city;
													that.getAir(city);
													AMap.plugin('AMap.Weather', function() {
														var weather = new AMap.Weather();
														//查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
														weather.getLive(city, function(err, data) {
															if(!err) {
																that.weather = data;
																if((data.weather).search("晴") != -1) {
																	AirImg.style.background = "url(../../../static/image/qing@3x.png)";
																} else if((data.weather).search("雨") != -1) {
																	AirImg.style.background = "url(../../../static/image/yu@3x.png)";
																} else if((data.weather).search("阴") != -1) {
																	AirImg.style.background = "url(../../../static/image/yin@3x.png)";
																} else if((data.weather).search("多云") != -1) {
																	AirImg.style.background = "url(../../../static/image/duoyun@3x.png)";
																} else if((data.weather).search("霾") != -1) {
																	AirImg.style.background = "url(../../../static/image/mai@3x.png)";
																} else if((data.weather).search("雾") != -1) {
																	AirImg.style.background = "url(../../../static/image/wu@3x.png)";
																} else if((data.weather).search("冰雹") != -1) {
																	AirImg.style.background = "url(../../../static/image/bingbao@3x.png)";
																} else if((data.weather).search("雪") != -1) {
																	AirImg.style.background = "url(../../../static/image/xue@3x.png)";
																} else if((data.weather).search("风") != -1) {
																	AirImg.style.background = "url(../../../static/image/feng@3x.png)";
																} else {
																	AirImg.style.background = "url(../../../static/image/undefined@2x.png)";
																}
																AirImg.style.backgroundSize = "100%";
															}
														})
													})
												} else {
													alert(JSON.stringify(result))
												}
											});
										}
									});
								}
							})
						})
					}
				})
			},
			getAir(e) {
				this.$Ax.get("https://weather.yunext.com/api/v2/join?access_key=f5f711971149f7421d1512f879729ee7&app_name=kaineng").then((res) => {
					if(res.data.success) {
						this.$cookies.set("AirToken", res.data.data.token)
						this.$GetAir.get("https://weather.yunext.com/api/v2/pm25/last_data?app_type=1&app_name=kaineng&city=" + e).then((res) => {
							if(res.data.success) {
								this.weather.humidity = res.data.data.pm25;
							}
						})
					}
				}).catch((res) => {
					console.log(res)
				})
			},
			swiperleft() {
				this.$router.push({
					'path': '/map'
				});
			},
			swiperright() {
				this.$router.push({
					'path': '/device'
				});
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
					if(status == 'complete') {
						let city = result.addressComponent.city;
						that.positionMsg.city = city;
						that.getAir(city);
						AMap.plugin('AMap.Weather', function() {
							var weather = new AMap.Weather();
							//查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
							weather.getLive(city, function(err, data) {
								if(!err) {
									that.weather = data;
									if((data.weather).search("晴") != -1) {
										AirImg.style.background = "url(../../../static/image/qing@3x.png)";
									} else if((data.weather).search("雨") != -1) {
										AirImg.style.background = "url(../../../static/image/yu@3x.png)";
									} else if((data.weather).search("阴") != -1) {
										AirImg.style.background = "url(../../../static/image/yin@3x.png)";
									} else if((data.weather).search("多云") != -1) {
										AirImg.style.background = "url(../../../static/image/duoyun@3x.png)";
									} else if((data.weather).search("霾") != -1) {
										AirImg.style.background = "url(../../../static/image/mai@3x.png)";
									} else if((data.weather).search("雾") != -1) {
										AirImg.style.background = "url(../../../static/image/wu@3x.png)";
									} else if((data.weather).search("冰雹") != -1) {
										AirImg.style.background = "url(../../../static/image/bingbao@3x.png)";
									} else if((data.weather).search("雪") != -1) {
										AirImg.style.background = "url(../../../static/image/xue@3x.png)";
									} else if((data.weather).search("风") != -1) {
										AirImg.style.background = "url(../../../static/image/feng@3x.png)";
									} else {
										AirImg.style.background = "url(../../../static/image/undefined@2x.png)";
									}
									AirImg.style.backgroundSize = "100%";
								}
							})
						})
					}
				}
			},
			changeWeather(e) {
				let that = this;
				let map; //加载地图，调用浏览器定位服务
				let AirImg = document.getElementsByClassName("AirImg")[0];
				map = new AMap.Map('container', {
					resizeEnable: true
				});
				AMap.plugin('AMap.Weather', function() {
					var weather = new AMap.Weather();
					//查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
					weather.getLive(e, function(err, data) {
						if(!err) {
							that.weather = data;
							if((data.weather).search("晴") != -1) {
								AirImg.style.background = "url(../../../static/image/qing@3x.png)";
							} else if((data.weather).search("雨") != -1) {
								AirImg.style.background = "url(../../../static/image/yu@3x.png)";
							} else if((data.weather).search("阴") != -1) {
								AirImg.style.background = "url(../../../static/image/yin@3x.png)";
							} else if((data.weather).search("多云") != -1) {
								AirImg.style.background = "url(../../../static/image/duoyun@3x.png)";
							} else if((data.weather).search("霾") != -1) {
								AirImg.style.background = "url(../../../static/image/mai@3x.png)";
							} else if((data.weather).search("雾") != -1) {
								AirImg.style.background = "url(../../../static/image/wu@3x.png)";
							} else if((data.weather).search("冰雹") != -1) {
								AirImg.style.background = "url(../../../static/image/bingbao@3x.png)";
							} else if((data.weather).search("雪") != -1) {
								AirImg.style.background = "url(../../../static/image/xue@3x.png)";
							} else if((data.weather).search("风") != -1) {
								AirImg.style.background = "url(../../../static/image/feng@3x.png)";
							} else {
								AirImg.style.background = "url(../../../static/image/undefined@2x.png)";
							}
							AirImg.style.backgroundSize = "100%";
						}
					})
				})
			},
			drawLine(x, y) {
				let nowDay = this.getDay(0);
				//基于准备好的dom，初始化echarts实例
				this.charts = this.$echarts.init(document.getElementById('myChart'))
				// 绘制图表
				this.charts.setOption({
					color: ['#fff'],
					tooltip: {
						trigger: 'item',
						formatter: function(params) {
							return params.value + " L";
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: x,
						axisLabel: {
							show: true,
							textStyle: {
								color: '#aaa'
							}
						},
						axisTick: { //y轴刻度线
							show: false
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#eee', //左边线的颜色
								width: '1' //坐标线的宽度
							}
						}
					},
					yAxis: {
						type: 'value',
						boundaryGap: false,
						splitLine: {
							show: false,
						},
						axisTick: { //y轴刻度线
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#aaa'
							},
							formatter: function(value) {
								var texts = [];
								if(value % 1 == 0) {
									texts.push(value);
								}
								return texts;
							}
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#aaa', //左边线的颜色
								width: '0' //坐标线的宽度
							}
						}
					},
					series: [{
						data: y,
						type: 'line',
						smooth: true,
						symbolSize: 12, //设定实心点的大小
						areaStyle: {
							//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
									offset: 0,
									color: '#00B5E2 ' // 0% 处的颜色
								}, {
									offset: 1,
									color: '#fff' // 100% 处的颜色
								}],
								globalCoord: false
							}
						},
						itemStyle: {
							normal: {
								color: "#00B5E2",
								lineStyle: {
									color: "#00B5E2"
								},
								label: {
									show: true,
									color: "#000",
									formatter: function(param) {
										let currentValue = new String()
										if(param.name == nowDay) {
											currentValue = param.data;
										}
										return currentValue;
									}
								}
							},
						}
					}],
					grid: {
						x: 30,
						y: 30,
						x2: 15,
						y2: 25
					}
				});
			},
			searchCity() {
				this.$router.push("/changeCity")
			},
			changeCity() {
				this.positionMsg = this.$route.query;
				this.changeWeather(this.$route.query.city)
				this.getAir(this.$route.query.city);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.cityPara {
		.bg {
			height: 2.6rem;
			background: url(../../../static/image/data_bg.png) no-repeat;
			background-size: 100% 100%;
			.areaPara {
				height: 0.55rem;
				border-radius: 0.04rem 0.04rem 0px 0px;
				position: relative;
				.AirImg {
					position: absolute;
					left: 0.1rem;
					top: 0.15rem;
					width: 0.3rem;
					height: 0.3rem;
					background: url(../../../static/image/qing@3x.png) no-repeat;
					background-size: 100% 100%;
				}
				.temperature {
					position: absolute;
					display: inline;
					left: 0.4rem;
					top: 0.13rem;
					font-size: 0.23rem;
					color: #fff;
					letter-spacing: 0;
					text-align: right;
				}
				.weatherMsg {
					position: absolute;
					display: inline;
					left: 1rem;
					top: 0.13rem;
					font-size: 0.12rem;
					color: #fff;
					letter-spacing: 0;
					span {
						display: block;
					}
				}
				.link {
					float: right;
					width: 0.2rem;
					font-size: 0.14rem;
					color: #fff;
					margin: 0.25rem 0.02rem 0px 0px;
				}
			}
			.water {
				margin: 0.3rem 0rem;
				border-radius: 0.04rem 0.04rem;
				overflow: hidden;
				.cityWaters {
					margin-top: 0.05rem;
					font-size: 0.36rem;
					color: #fff;
					letter-spacing: 0;
					text-align: center;
					line-height: 0.4rem;
				}
				.waterTitle {
					opacity: 0.7;
					font-size: 0.12rem;
					color: #fff;
					opacity: 0.7;
					letter-spacing: 0;
					text-align: center;
					line-height: 0.32rem;
				}
			}
		}
		.chart {
			margin: -0.4rem 0.1rem 0.1rem 0.1rem;
			background: #FFFFFF;
			border-radius: 0.1rem 0.1rem;
			height: 2.7rem;
			overflow: hidden;
			position: relative;
			.chartName {
				position: absolute;
				font-size: 0.14rem;
				color: #666;
				letter-spacing: 0;
				left: 0.1rem;
				top: 0.15rem;
			}
			.van_tab {
				float: right;
				margin-right: 0.1rem;
				margin-top: 0.1rem;
				width: 0.85rem;
				border-radius: 0.02rem 0.02rem;
				border: 1px solid #eee;
				overflow: hidden;
				li {
					float: left;
					width: 50%;
					text-align: center;
					font-size: 0.12rem;
					line-height: 0.28rem;
					color: #333;
					background: #fff;
				}
				.tabActive {
					color: white;
					background: #00B5E2;
				}
				.line {
					position: absolute;
					bottom: 0px;
					left: 10%;
					width: 30%;
					height: 0.02rem;
					background: white;
					border-radius: 30% 30%;
				}
			}
			.chartContent {
				position: relative;
				height: 2rem;
				margin-top: 0.5rem;
				canvas {
					position: absolute;
					left: 0px;
					width: 100%;
					height: 1.5rem;
				}
			}
		}
	}
</style>