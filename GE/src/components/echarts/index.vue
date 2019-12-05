<template>
	<div class="chart">
		<p class="chartName">用水统计(L)</p>
		<ul class="van_tab" v-if="showTab">
			<li @click="tabSelect('week')" :class="{tabActive:isActive}">周</li>
			<li @click="tabSelect('month')" :class="{tabActive:!isActive}">月</li>
		</ul>
		<p v-else class="totalUseWaters"><span>总累计用水量(L)：</span><span class="waters">{{waterVolTotal}}</span></p>
		<div :id="idName" class="chartContent"></div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				waterLog: "",
				isActive: true,
				showTab: true,
			}
		},
		props: {
			idName: String,
			device: Object,
			IsshowTab: {
				type: Boolean,
				default: true,
			},
			waterVolTotal: Number
		},
		mounted() {
			this.showTab = this.IsshowTab;
		},
		methods: {
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
			getWaterLog(timetype) {
				this.$Axios.get("wechat/device/drinkWaterRecordData", {
					params: {
						"productKey": this.device.productKey,
						"deviceName": this.device.deviceName,
						"timeType": timetype,
						"type": 2,
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
						} else if(num == 1) {
							dataX = [this.getDay(-6), this.getDay(-5), this.getDay(-4), this.getDay(-3), this.getDay(-2), this.getDay(-1), this.getDay(0)];
							dataY = [0, 0, 0, 0, 0, 0, this.waterLog[0].waterValue];
						} else {
							this.$toast("设备刚使用，暂无用水统计数据");
							dataX = [this.getDay(-6), this.getDay(-5), this.getDay(-4), this.getDay(-3), this.getDay(-2), this.getDay(-1), this.getDay(0)];
							dataY = [0, 0, 0, 0, 0, 0, 0];
						}
						this.$nextTick(
							function() {
								this.drawLine(dataX, dataY);
							}
						)
						this.$forceUpdate();
					}
				})
			},
			tabSelect(e) {
				if(e == "week") {
					this.isActive = true;
					this.getWaterLog(1);
				} else {
					this.isActive = false;
					this.getWaterLog(2);
				}
			},
			drawLine(x, y) {
				let nowDay = this.getDay(0);
				//基于准备好的dom，初始化echarts实例				
				this.charts = this.$echarts.init(document.getElementById(this.idName))
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
								color: '#aaa', //左边线的颜色
								width: '0' //坐标线的宽度
							}
						}
					},
					yAxis: {
						type: 'value',
						boundaryGap: false,
						splitLine: {
							show: false
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
									color: '#2A80FF' // 0% 处的颜色
								}, {
									offset: 1,
									color: '#7BEAFF' // 100% 处的颜色
								}],
								globalCoord: false
							}
						},
						itemStyle: {
							normal: {
								color: "#30B3FC",
								lineStyle: {
									color: "#30B3FC"
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
			}
		}
	}
</script>
<style lang="scss">
	.chart {
		background: white;
		height: 2.6rem;
		position: relative;
		border-top: 1px solid #EAEFF3;
		.chartName {
			float: left;
			font-size: 0.14rem;
			color: #333;
			letter-spacing: 0;
			line-height: 0.28rem;
			width: 1.2rem;
			height: 0.3rem;
			margin: 0.08rem 0.1rem;
		}
		.totalUseWaters {
			float: right;
			margin: 0.1rem;
			max-width: 1.5rem;
			font-size: 0.12rem;
			color: #666;
			text-align: left;
			line-height: 0.26rem;
			.waters {
				color: #333;
			}
		}
		.van_tab {
			position: absolute;
			top: 0.15rem;
			right: 0.15rem;
			width: 0.92rem;
			z-index: 999;
			border-radius: 0.05rem;
			overflow: hidden;
			border: 1px solid #EEEEEE;
			li {
				float: left;
				width: 0.46rem;
				text-align: center;
				font-size: 0.12rem;
				line-height: 0.28rem;
				color: #999;
			}
			.tabActive {
				background: #00B5E2;
				color: white;
			}
		}
		.chartContent {
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