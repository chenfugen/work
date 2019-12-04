<template>
	<div :class="isBg?'chart':'charts'">
		<p class="chartName">用水统计(L)</p>
		<ul class="van_tab">
			<li @click="tabSelect('data')" :class="{tabActive:isActive}">周</li>
			<li @click="tabSelect('week')" :class="{tabActive:!isActive}">月</li>
			<p  class="line"></p>
		</ul>
		<div :id="idName" class="chartContent"></div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				waterLog: "",
				isActive: true,
			}
		},
		props: {
			idName: String,
			device: Object,
			isBg: {
				type: Boolean,
				default: true,
			}
		},
		mounted() {
			console.log(this.isBg)
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
			doHandleMonth(month){
				var m = month;
				if(month.toString().length == 1) {
					m = "0" + month;
				}
				return m;
			},
			tabSelect(e) {
				if(e == "data") {
					this.isActive = true;
					let line = document.getElementsByClassName("line")[0];
					line.style.left = "10%"
					this.getWaterLog(1);
				} else {
					this.isActive = false;
					let line = document.getElementsByClassName("line")[0];
					line.style.left = "60%";
					this.getWaterLog(2);
				}
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
						this.isHint = false;
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
							dataY = [0, 0, 0, 0, 0, 0,this.waterLog[0].waterValue];
						} else {	
							this.$toast("设备刚使用，暂无用水统计数据");
							dataX = [this.getDay(-6), this.getDay(-5), this.getDay(-4), this.getDay(-3), this.getDay(-2), this.getDay(-1), this.getDay(0)];
							dataY = [0, 0, 0, 0, 0, 0, 0];
						}
						this.$nextTick(
							function() {
								if(this.isBg) {
									this.drawLine(dataX, dataY);
								} else {
									this.drawcolorLine(dataX, dataY);
								}
							}
						)
					}
				})
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
								color: '#fff'
							}
						},
						axisTick: { //y轴刻度线
							show: false
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#fff', //左边线的颜色
								width: '1' //坐标线的宽度
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
								color: '#fff'
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
								color: '#fff', //左边线的颜色
								width: '0' //坐标线的宽度
							}
						}
					},
					series: [{
						data: y,
						type: 'line',
						smooth: true,
						symbol: 'circle', //设定为实心点
						symbolSize: 12, //设定实心点的大小
						itemStyle: {
							normal: {
								color: "#30B3FC",
								lineStyle: {
									color: "#fff"
								},
								label: {
									show: true,
									color: "#fff",
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
			drawcolorLine(x, y) {
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
		margin: 0px 0.1rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 0.08rem;
		height: 2.6rem;
		overflow: hidden;
		position: relative;
		.chartName {
			float: left;
			font-size: 0.14rem;
			color: #fff;
			letter-spacing: 0;
			line-height: 0.28rem;
			width: 1.2rem;
			height: 0.3rem;
			margin: 0.08rem 0.1rem;
		}
		.van_tab {
			position: absolute;
			top: 0.08rem;
			right: 0.05rem;
			width: 1.2rem;
			z-index: 999;
			li {
				float: left;
				width: 50%;
				text-align: center;
				font-size: 0.12rem;
				line-height: 0.3rem;
				color: #ccc;
			}
			.tabActive {
				color: white;
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
			canvas {
				position: absolute;
				left: 0px;
				width: 100%;
				height: 1.5ren;
			}
		}
	}
	
	.charts {
		margin: 0px 0.1rem;
		background: white;
		border-radius: 0.08rem;
		height: 2.6rem;
		position: relative;
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
		.van_tab {
			position: absolute;
			top: 0.08rem;
			right: 0.05rem;
			width: 1.1rem;
			z-index: 999;
			li {
				float: left;
				width: 0.45rem;
				margin-left: 0.05rem;
				text-align: center;
				font-size: 0.12rem;
				line-height: 0.22rem;
				color: #333;
			}
			.tabActive {
				color: #267CFB;
				border: 1px solid #267CFB;
				border-radius: 0.13rem;
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