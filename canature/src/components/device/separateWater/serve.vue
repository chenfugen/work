<template>
	<div id="serve">
		<div class="serveMsg">
			<van-circle v-model="currentRate" :rate="servePercent*10" size="100" :stroke-width="50" color="#00B5E2 " layer-color="#eee" :speed="10" class="main" />
			<p class="waterNum">{{days}}<span class="unit">天</span></p>
			<p class="water_title">开能智能已为您服务</p>
			<p v-show="days>0" class="dot" :class="{'serve0':servePercent==0,'serve1':servePercent==1,'serve2':servePercent==2,'serve3':servePercent==3,'serve4':servePercent==4,'serve5':servePercent==5,'serve6':servePercent==6,'serve7':servePercent==7,'serve8':servePercent==8,'serve9':servePercent==9,'serve10':servePercent==10}"></p>
		</div>
		<div id="waterChart" class="waterChart"></div>
		<p class="serveTitle">TDS：水中溶解性固体总量；TOC：水质总有机碳含量</p>
	    <hr style="height:1px;border:none;border-top:1px dashed #eee;" />
		<p class="explain">
			TDS:水质优(0~50mg/L)；水质一般(50~100mg/L)；水质差(≥100mg/L)
		</p>
		<p class="explain">
			TOC:水质优(0~0.5mg/L)；水质一般(0.5~1.0mg/L)；水质差(≥1.0mg/L)
		</p>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				currentRate: 0,
				servePercent: 1,
				charts: "",
				waterLog: "",
				days: "",
				device:""
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.query.deviceId).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;
						this.getWaterLog(1);
						this.getSeviceDay();
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			getSeviceDay() {
				this.$Axios.get("wechat/device/usedDays", {
					params: {
						"productKey": this.device.productKey,
						"deviceName": this.device.deviceName,
					}
				}).then((res) => {
					if(res.data.success) {
						this.days = res.data.data;
						switch(true) {
							case this.days == 0:
								this.servePercent = 0;
								break;
							case this.days <= 60:
								this.servePercent = 1;
								break;
							case this.days <= 120:
								this.servePercent = 2;
								break;
							case this.days <= 180:
								this.servePercent = 3;
								break;
							case this.days <= 240:
								this.servePercent = 4;
								break;
							case this.days <= 300:
								this.servePercent = 5;
								break;
							case this.days <= 360:
								servePercent;
								break;
							case this.days <= 420:
								this.servePercent = 7;
								break;
							case this.days <= 480:
								this.servePercent = 8;
								break;
							case this.days <= 540:
								this.servePercent = 9;
								break;
							default:
								this.servePercent = 10;
								break;
						}
					}
				})
			},
			getWaterLog(timetype) {
				this.$Axios.get("wechat/device/tdsRecordData", {
					params: {
						"productKey": this.device.productKey,
						"deviceName": this.device.deviceName,
						"timeType": timetype,
					}
				}).then((res) => {
					if(res.data.success) {
						this.waterLog = res.data.data;
						let dataX = [];
						let dataY1 = [];
						let dataY2 = [];
						let num = this.waterLog.length;
						let filterType=this.device.filterType;
						if(num > 1) {
							this.waterLog.forEach(function(msg, index) {
								if(timetype == 1) {
									dataX.push(msg.date);
									if(filterType=="RO") {
										dataY1.push(msg.tdsOut);
										dataY2.push(msg.tdsIn);
									} else {
										dataY1.push(msg.tocOut);
										dataY2.push(msg.tocIn);
									}
								} else {
									if(num > 29 && index > 0) {
										dataX.push(msg.date);
										if(filterType=="RO") {
											dataY1.push(msg.tdsOut);
											dataY2.push(msg.tdsIn);
										} else {
											dataY1.push(msg.tocOut);
											dataY2.push(msg.tocIn);
										}
									} else {
										dataX.push(msg.date);
										if(filterType=="RO") {
											dataY1.push(msg.tdsOut);
											dataY2.push(msg.tdsIn);
										} else {
											dataY1.push(msg.tocOut);
											dataY2.push(msg.tocIn);
										}
									}
								}
							})
						} else if(num == 1) {
							dataX = [this.getDay(-6), this.getDay(-5), this.getDay(-4), this.getDay(-3), this.getDay(-2), this.getDay(-1), this.getDay(0)];
							if(this.device.filterType == "RO") {
								dataY1 = [0, 0, 0, 0, 0, 0, this.waterLog[0].tdsOut];
								dataY2 = [0, 0, 0, 0, 0, 0, this.waterLog[0].tdsIn];
							} else {
								dataY1 = [0, 0, 0, 0, 0, 0, this.waterLog[0].tocOut];
								dataY2 = [0, 0, 0, 0, 0, 0, this.waterLog[0].tocIn];
							}
						} else {
							if(this.device.filterType=="RO") {
								this.$dialog.alert({
									title: '提示',
									message: '您的设备暂无数据....'
								}).then(() => {
									this.$router.go(-1);
								});
							} else {
								this.$dialog.alert({
									title: '提示',
									message: '累计放水30min后，才可读取有效TOC值'
								}).then(() => {
									this.$router.go(-1);
								});
							}
						}
						this.$nextTick(
							function() {
								this.drawLine(dataX, dataY1, dataY2);
							}
						)
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
			drawLine(x, y1, y2) {
				let nowDay = this.getDay(0);
				//基于准备好的dom，初始化echarts实例
				this.charts = this.$echarts.init(document.getElementById('waterChart'))
				// 绘制图表
				this.charts.setOption({
					color: ['#30B3FC'],
					tooltip: {
						trigger: 'item',
						formatter: function(params) {
							return params.value + " ppm";
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: x,
						axisLabel: {
							show: true,
							textStyle: {
								color: '#fff'
							}
						},
						axisTick: { //y轴刻度线
							show: false
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#aaa', //左边线的颜色
								width: '0' //坐标线的宽度
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
								if(value % 20 == 0) {
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
						data: y1,
						type: 'line',
						smooth: true,
						symbol: 'circle', //设定为实心点
						symbolSize: 12, //设定实心点的大小		
						itemStyle: {
							normal: {
								color: "#30B3FC",
								lineStyle: {
									color: "#30B3FC"
								},
								label: {
									show: true,
									color: "#aaa",
									formatter: function(param) {
										let currentValue = new String()
										if(param.name == nowDay) {
											currentValue = "净水水质:" + param.data;
										}
										return currentValue;
									}
								}
							},
						}
						//						markLine: {
						//							symbol: "none",
						//							data: [{
						//								silent: false, //鼠标悬停事件  true没有，false有
						//								lineStyle: { //警戒线的样式  ，虚实  颜色
						//									type: "dashed",
						//									color: "#267CFB",
						//								},
						//								label: {
						//									normal: {
						//										show: true,
						//										position: 'middle',
						//										formatter: '原水水质：50',
						//										color: "#aaa"
						//									}
						//								},
						//								yAxis: 100 // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
						//							}]
						//						}
					}, {
						data: y2,
						type: 'line',
						smooth: true,
						symbol: 'circle', //设定为实心点
						symbolSize: 12, //设定实心点的大小		
						itemStyle: {
							normal: {
								color: "#ccc",
								lineStyle: {
									color: "#ccc",
									type: "dashed"
								},
								label: {
									show: true,
									color: "#aaa",
									formatter: function(param) {
										let currentValue = new String()
										if(param.name == nowDay) {
											currentValue = "原水水质:" + param.data;
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
						x2: 35,
						y2: 25
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	#serve {
		background: white;
		.serveMsg {
			width: 1.8rem;
			height: 1.8rem;
			margin: 0.5rem auto 0rem auto;
			position: relative;
			.main {
				position: absolute;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 1.85rem;
			}
			.waterNum {
				padding-top: 0.5rem;
				font-size: 0.45rem;
				color: #333;
				font-weight: lighter;
				text-align: center;
				line-height: 0.4rem;
				.unit {
					font-size: 0.1rem;
				}
			}
			.water_title {
				opacity: 0.7;
				font-size: 0.12rem;
				color: #999;
				letter-spacing: 0;
				text-align: center;
			}
		}
		.dot {
			position: absolute;
			width: 0.28rem;
			height: 0.28rem;
			border-radius: 50%;
			background: #FFFFFF;
			box-shadow: 0 0 10px #eee;
		}
		.serve0 {
			top: -0.1rem;
			right: 0.75rem;
		}
		.serve1 {
			top: 0.15rem;
			right: 0.15rem;
		}
		.serve2 {
			top: 0.7rem;
			right: -0.1rem;
		}
		.serve3 {
			top: 1.2rem;
			right: 0.03rem;
		}
		.serve4 {
			top: 1.5rem;
			right: 0.35rem;
		}
		.serve5 {
			top: 1.6rem;
			right: 0.75rem;
		}
		.serve6 {
			top: 1.4rem;
			left: 0.2rem;
		}
		.serve7 {
			top: 1rem;
			left: -0.05rem;
		}
		.serve8 {
			top: 0.5rem;
			left: -0.05rem;
		}
		.serve9 {
			top: 0.05rem;
			left: 0.25rem;
		}
		.serve10 {
			top: -0.1rem;
			right: 0.75rem;
		}
		.serveTitle{
			margin: 0.1rem 0.15rem;
			font-size: 0.12rem;
			color: #333333;
			letter-spacing: 0;
			line-height: 0.22rem;
		}
		.explain{
			margin: 0.1rem 0.15rem;
			font-size: 0.1rem;
			color: #333333;
			letter-spacing: 0;
			line-height: 0.22rem;
		}
		.waterChart {
			position: relative;
			height: 2rem;
			canvas {
				position: absolute;
				left: 0px;
				width: 100%;
				height: 1.5ren;
			}
		}
	}
</style>