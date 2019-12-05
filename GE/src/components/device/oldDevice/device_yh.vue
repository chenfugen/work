<template>
	<div>
		<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
			<div class="deviceDetail">
				<div class="searchIcon">
					<div class="saveWater" @click="set(1)">
						<img src="../../../../static/image/icon_bottle.png" class="bottle" />
						<p class="bottleTitle">已节约(个)</p>
						<p class="bottleNumber">{{deviceMsg.saveBottleNumber.value}}
							<van-icon name="arrow" />
						</p>
					</div>
					<img src="../../../../static/image/icon_qrcode.png" class="qrcodeIcon" @click="set(2)" />
				</div>
				<div class="flow">
					<p class="waterNum">45<span>m³</span></p>
					<p class="water_title">可使用水量</p>
					<img src="../../../../static/image/bg@3x.png" />
					<van-circle v-model="currentRate" :rate="currentRate" size="100" :stroke-width="50" color="#00B5E2 " layer-color="none" :speed="10" class="main" />
				</div>
				<div class="tab">
					<van-tabs type="card" color="#005EB8" @change="showChart">
						<van-tab title="水质数据"></van-tab>
						<van-tab title="用水统计"></van-tab>
					</van-tabs>
				</div>
				<div class="chart" v-show="!isShowDate">
					<p class="chartName">用水统计(L)</p>
					<ul class="van_tab">
						<li @click="tabSelect('data')" :class="{tabActive:isActive}">今日</li>
						<li @click="tabSelect('week')" :class="{tabActive:!isActive}">一周</li>
					</ul>
					<div id="myChart" class="chartContent"></div>
				</div>
				<ul class="waterMsg" v-show="isShowDate">
					<li>
						<p class="waterSet">当前流速(L/H)</p>
						<p class="waterValue">{{deviceMsg.flowRate.value}}</p>
						<div class="line"></div>
					</li>
					<li>
						<p class="waterSet">最大流量(L/M)</p>
						<p class="waterValue">{{deviceMsg.peakFlowCycle.value}}</p>
					</li>
					<li>
						<p class="waterSet">周期已用水量(m³)</p>
						<p class="waterValue">{{deviceMsg.flowTotalPeriod.value}}</p>
						<div class="line"></div>
					</li>
					<li>
						<p class="waterSet">冲洗启动</p>
						<p class="waterValue">{{deviceMsg.regenEn.value[0]==1?"on":"off"}}</p>
					</li>
					<li>
						<p class="waterSet">冲洗间隔(天)</p>
						<p class="waterValue">{{deviceMsg.regenCyc.value}}</p>
						<div class="line"></div>
					</li>
					<li v-if="deviceMsg.materLife2.value<=deviceMsg.materLife1.value" @click="searchFilter(device.productKey)">
						<p class="waterSet">耗材2寿命(%)</p>
						<p class="waterValue">{{deviceMsg.materLife2.value}}
							<van-icon class="link" name="arrow" />
						</p>
					</li>
					<li v-else @click="searchFilter(device.productKey)">
						<p class="waterSet">耗材1寿命(%)</p>
						<p class="waterValue">{{deviceMsg.materLife1.value}}
							<van-icon class="link" name="arrow" />
						</p>
					</li>
				</ul>
				<div style="width:100%;height:1rem;"></div>
				<div class="device_hint" v-show="isnormal==2" @click='checkFault'>
					<van-notice-bar :scrollable="false" background="#fff" mode="link">
						检测到设备出现故障，请排查故障或联系客服
					</van-notice-bar>
				</div>
				<ul class="tabbar">
					<li class="tabbar_li" @click="fraceWash">
						<p class="tabbar_img"><img :src="washImg" /></p>
						<p class="tabbar_text">{{washText}}</p>
					</li>
					<li class="tabbar_li" @click="makeWash">
						<p class="tabbar_img"><img :src="makeWashImg" /></p>
						<p class="tabbar_text">{{makeWashText}}</p>
					</li>
					<li class="tabbar_li" @click="goMore">
						<p class="tabbar_img"><img src="../../../../static/image/icon_more@2x.png" /></p>
						<p class="tabbar_text">更多</p>
					</li>
				</ul>
			</div>
		</v-touch>
		<van-dialog v-model="phoneShow" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
			<p class="content">客户热线 <span style="color:#1E9FFF;">400-8201199</span></p>
		</van-dialog>
	</div>
</template>

<script>
	import * as func from '../../../../static/js/func'
	export default {
		data() {
			return {
				msg: 'Welcome to Your Vue.js App',
				currentRate: 30,
				isShowDate: true,
				isnormal: 1,
				phoneShow: false,
				isActive: true,
				deviceMsg: this.$store.state.deviceMsg,
				productKey: "",
				DeviceName: "",
				DeviceSecret: "",
				timestamp: new Date().getTime(),
				client: "",
				device: "",
				washImg: "../../../../static/image/icon_coerce_nor@2x.png",
				makeWashImg: "../../../../static/image/icon_appointment_nor@2x.png",
				washText: "强制冲洗",
				makeWashText: "预约冲洗",
				charts: '',
				dataX: ['12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
				dataY: [10, 12, 16, 24, 26, 30, 22],
				deviceList: this.$store.state.deviceList
			}
		},
		mounted() {
			let that = this;
			that.init();
			this.$store.state.client.on('message', function(topic, message, packet) {
				if(that.$route.params.id) {
					that.init();
				}
			})
		},
		methods: {
			showChart(value) {
				this.isShowDate = !this.isShowDate;
				if(value == 1) {
					this.dataX = [this.getHours(-6), this.getHours(-5), this.getHours(-4), this.getHours(-3), this.getHours(-2), this.getHours(-1), this.getHours(0)];
					this.$nextTick(
						function() {
							this.drawLine(this.dataX, this.dataY);
						}
					)
				}
			},
			tabSelect(e) {
				if(e == "data") {
					this.isActive = true;
					this.dataX = [this.getHours(-6), this.getHours(-5), this.getHours(-4), this.getHours(-3), this.getHours(-2), this.getHours(-1), this.getHours(0)];
					this.dataY = [10, 12, 16, 24, 26, 30, 22];
				} else {
					this.isActive = false;
					this.dataY = [30, 35, 38, 44, 36, 40, 32]
					this.dataX = [this.getDay(-6), this.getDay(-5), this.getDay(-4), this.getDay(-3), this.getDay(-2), this.getDay(-1), this.getDay(0)];
				}
				this.drawLine(this.dataX, this.dataY);
			},
			getHours(hours) {
				let now = new Date().getTime();
				let targetday_milliseconds = now + 1000 * 60 * 60 * hours;
				let nowHours = new Date(targetday_milliseconds).getHours()
				if(nowHours < 10) {
					nowHours = "0" + nowHours;
				}
				return nowHours + ":00";
			},
			getDay(day) {
				var today = new Date();
				var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
				today.setTime(targetday_milliseconds); //注意，这行是关键代码
				var tMonth = today.getMonth();
				var tDate = today.getDate();
				tMonth = this.doHandleMonth(tMonth + 1);
				tDate = this.doHandleMonth(tDate);
				return tMonth + "." + tDate;
			},
			doHandleMonth(month) {
				var m = month;
				if(month.toString().length == 1) {
					m = "0" + month;
				}
				return m;
			},
			swiperleft() {
				let pageNum = Number(this.$route.params.num) + Number(1);
				if(pageNum >= this.deviceList.length) {
					this.$toast("已是最后一个设备");
				} else {
					let productKey = this.deviceList[pageNum].productKey;
					let deviceId = this.deviceList[pageNum].deviceId;
					let bindType = this.deviceList[pageNum].bindType;
					let pageName=this.$route.path.split("/")[1].split("/")[0];
					this.$router.push({
						path: func.getPath(pageName,productKey, deviceId, bindType, pageNum)
					})
				}
			},
			swiperright() {
				let pageNum = this.$route.params.num - 1;
				if(pageNum < 0) {
					this.$router.push({
						path: "/device"
					})
				} else {
					let productKey = this.deviceList[pageNum].productKey;
					let deviceId = this.deviceList[pageNum].deviceId;
					let bindType = this.deviceList[pageNum].bindType;
					let pageName=this.$route.path.split("/")[1].split("/")[0];
					this.$router.push({
						path: func.getPath("CUFDeviceOne", productKey, deviceId, bindType, pageNum)
					})
				}
			},
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.params.id).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;
						document.title = this.device.deviceNickName== this.device.deviceName? this.device.productName:this.device.deviceNickName
						this.deviceMsg = res.data.data.property;
						this.$cookies.set('firmwareVersion', this.device.firmwareVersion);
						this.$store.commit("changeDevice", this.deviceMsg);
						if(this.deviceMsg.materLife2.value < 10) {
							if(this.$cookies.get('showTime') == null || this.$cookies.get('showTime') == this.getDay(0)) {
								this.$dialog.alert({
									message: '该设备滤芯需要更换'
								}).then(() => {
									this.$cookies.set('showTime', this.getDay(1))
								});
							}
						}
						this.isnormal = this.device.status == "offline" ? 0 : 1;
						if(this.device.deviceFault) {
							this.isnormal = 2;
						}
						if(this.deviceMsg.regenEnSchedule) {
							this.makeWashImg = "../../../../static/image/icon_appointment_sel@2x.png";
						}
						if(this.deviceMsg.regenEn.value[0] == 1) {
							this.washImg = "../../../../static/image/icon_coerce_sel@2x.png";
							this.washText = "冲洗中.."
						}
						this.washText = this.device.productKey == "a12KzXXwRii" ? "强制再生" : "强制冲洗";
						this.makeWashText = this.device.productKey == "a12KzXXwRii" ? "预约再生" : "预约冲洗";
						this.$forceUpdate();
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			fraceWash() {
				let that = this;
				const deviceMsg = {
					"regenEn": [1]
				}
				const para = {
					productKey: this.device.productKey,
					deviceName: this.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				if(this.deviceMsg.regenEn.value[0] == 1) {
					this.$toast("设备正在冲洗中，请稍后");
					return false;
				}
				that.setDeviceProperty(para, "wash");
			},
			makeWash() {
				let that = this;
				if(that.deviceMsg.regenEnSchedule) {
					that.$Ax.post('common/cancel/scheduleRegenEn?commonKey=' + that.$store.state.commonKey, {
						productKey: that.device.productKey,
						deviceName: that.device.deviceName,
					}).then((res) => {
						if(res.data.success) {
							that.$toast.loading({
								mask: true,
								message: '取消预约中...'
							});
							that.init();
							that.makeWashImg = "../../../../static/image/icon_appointment_nor@2x.png";
							that.makeWashText = "预约冲洗"
						} else {
							this.$toast(res.data.message);
						}
					})
				} else {
					if(that.deviceMsg.regenTimeHourMin.value[0] == "00" && that.deviceMsg.regenTimeHourMin.value[1] == "00") {
						that.$dialog.confirm({
							title: '警告提示',
							message: '请先设置冲洗的启动时间',
							confirmButtonText: "前往"
						}).then(() => {
							this.$router.push("/paraSet?deviceId=" + this.$route.params.id);
						}).catch(() => {});
						return false;
					}
					//					if(that.deviceMsg.regenCyc.value == 0){
					//						that.$dialog.confirm({
					//							title: '警告提示',
					//							message: '请先设置冲洗间隔时间',
					//							confirmButtonText: "前往"
					//						}).then(() => {
					//							this.$router.push("/paraSet?deviceId=" + this.$route.params.id);
					//						}).catch(() => {});
					//						return false;
					//					}
					that.deviceMsg.regenTimeHourMin.value[1] = that.deviceMsg.regenTimeHourMin.value[1] < 10 ? "0" + this.deviceMsg.regenTimeHourMin.value[1] : that.deviceMsg.regenTimeHourMin.value[1];
					that.deviceMsg.regenTimeHourMin.value[0] = that.deviceMsg.regenTimeHourMin.value[0] < 10 ? "0" + this.deviceMsg.regenTimeHourMin.value[0] : that.deviceMsg.regenTimeHourMin.value[0];
					that.$Axios.post('wechat/device/schedule/regenEn', {
						productKey: that.device.productKey,
						deviceName: that.device.deviceName,
						time: that.deviceMsg.regenTimeHourMin.value[0] + ":" + that.deviceMsg.regenTimeHourMin.value[1],
						days: that.deviceMsg.regenCyc.value,
					}).then((res) => {
						if(res.data.success) {
							this.$toast.loading({
								mask: true,
								message: '预约中...'
							});
							that.makeWashImg = "../../../../static/image/icon_appointment_sel@2x.png";
							that.makeWashText = "预约启动"
							that.init();
						} else {
							this.$toast(res.data.message);
						}
					}).catch((err) => {
						console.log(err);
					})
				}
			},
			setDeviceProperty(e, name) {
				this.$Axios.post('common/setDeviceProperty', e).then((res) => {
					if(res.data.success) {
						this.$toast.loading({
							mask: true,
							message: '设置中...'
						});
						this.deviceMsg.regenEn.value[0] = 1;
						if(name == "wash") {
							this.washImg = "../../../../static/image/icon_coerce_sel@2x.png";
							this.washText = "冲洗中.."
						}
					} else {
						this.$toast(res.data.message);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			checkFault() {
				this.phoneShow = true;
			},
			showFilter() {
				this.filter = !this.filter;
			},
			drawLine(x, y) {
				let hours = this.getHours(0);
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
								if(value % 10 == 0) {
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
										if(param.name == hours) {
											currentValue = param.data;
										}
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
			onClickLeft() {
				this.client.end(true);
				this.$router.go(-1);
			},
			goMore() {
				let urlName = "/more?deviceId=" + this.$route.params.id + "&bindType=" + this.$route.params.bindType+ "&isnormal=" + this.isnormal;
				this.$router.push(urlName);
			},
			set(e) {
				let urlName;
				switch(e) {
					case 1:
						urlName = "/waterServe?deviceId=" + this.$route.params.id;
						break;
					case 2:
						if(this.$route.params.bindType == 2) {
							this.$toast("您是该设备分享用户，无法分享")
							return false;
						}
						urlName = "/qrcode?deviceId=" + this.$route.params.id;
						break;
					default:
						break;
				}
				this.$router.push(urlName);
			},
			searchFilter(productKey) {
				this.$router.push("/filter?productKey=" + productKey);
			},
			beforeClose(action, done) {
				if(action === 'confirm') {
					window.location.href = "tel:4008201199";
					done();
				} else {
					done();
				}
			}
		}
	}
</script>
<style lang="scss">
	.deviceDetail {
		color: white;
		overflow: hidden;
		.van-hairline--bottom::after {
			border-bottom-width: 0px;
		}
		.van-nav-bar__title {
			color: white;
			font-size: 0.15rem;
		}
		.van-nav-bar .van-icon {
			color: white;
		}
		.searchIcon {
			width: 100%;
			height: 0.36rem;
			margin-top: 0.05rem;
			padding: 0.05rem 0rem;
			background: white;
			.saveWater {
				width: 0.6rem;
				float: left;
				height: 0.36rem;
				margin-left: 0.1rem;
				position: relative;
				.bottle {
					position: absolute;
					width: 0.25rem;
					top: 0.05rem;
					left: 0px;
				}
				.bottleTitle {
					position: absolute;
					width: 1rem;
					height: 0.15rem;
					font-size: 0.1rem;
					color: #999999;
					top: 0.0rem;
					left: 0.3rem;
				}
				.bottleNumber {
					position: absolute;
					width: 1rem;
					height: 0.15rem;
					font-size: 0.12rem;
					color: #005EB8;
					top: 0.2rem;
					left: 0.3rem;
				}
			}
			.qrcodeIcon {
				float: right;
				width: 0.2rem;
				margin: 0.1rem 0.1rem;
			}
		}
		.flow {
			width: 100%;
			background: white;
			height: 2.5rem;
			position: relative;
			overflow: hidden;
			img {
				position: absolute;
				left: 50%;
				top: 0px;
				width: 2.5rem;
				margin-left: -1.25rem;
			}
			.main {
				width: 100%;
				height: 1.85rem;
				margin-top: 0.28rem;
			}
			.waterNum {
				position: absolute;
				top: 35%;
				left: 50%;
				margin-left: -0.9rem;
				width: 2rem;
				z-index: 9999;
				font-size: 0.5rem;
				color: #333;
				font-weight: lighter;
				text-align: center;
				line-height: 0.55rem;
				span {
					font-size: 0.14rem;
					color: #666666;
				}
			}
			.water_title {
				position: absolute;
				top: 60%;
				left: 50%;
				margin-left: -0.5rem;
				width: 1rem;
				z-index: 9999;
				opacity: 0.7;
				font-size: 0.12rem;
				color: #999;
				letter-spacing: 0;
				text-align: center;
				line-height: 0.28rem;
			}
		}
		.tab {
			background: white;
			padding: 0.1rem 0rem;
		}
		.waterMsg {
			height: 2.5rem;
			background: white;
			li {
				float: left;
				width: 50%;
				height: 0.8rem;
				text-align: center;
				border-top: 1px solid #EAEFF3;
				position: relative;
				.waterValue {
					font-size: 0.22rem;
					color: #005EB8;
					letter-spacing: 0;
					line-height: 0.3rem;
					overflow: hidden;
				}
				.waterSet {
					opacity: 0.5;
					font-size: 0.12rem;
					color: #999;
					letter-spacing: 0;
					line-height: 0.3rem;
					margin-top: 0.1rem;
				}
				.line {
					position: absolute;
					height: 100%;
					width: 1px;
					top: 1px;
					right: 0px;
					background: #EAEFF3;
				}
				.link {
					font-size: 0.2rem;
					color: #005EB8;
					opacity: 0.7;
				}
			}
			.filter {
				text-shadow: 0 0 5px #eee;
			}
		}
		.van-tabs__nav--card {
			border-radius: 0.03rem;
		}
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
				width: 1rem;
				height: 0.3rem;
				margin: 0.08rem 0.1rem;
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
		.device_hint {
			position: fixed;
			left: 0px;
			bottom: 0.82rem;
			width: 100%;
			background: white;
			border-bottom: 1px solid #eee;
		}
		.tabbar {
			position: fixed;
			left: 0px;
			bottom: 0rem;
			height: 0.82rem;
			width: 100%;
			background: white;
			.tabbar_li {
				float: left;
				width: 33%;
				height: 100%;
				text-align: center;
				.tabbar_img {
					width: 0.44rem;
					height: 0.44rem;
					margin: 0.1rem auto;
					img {
						vertical-align: top;
						width: 100%;
						height: 100%;
					}
				}
				.tabbar_text {
					font-size: 0.13rem;
					color: #333333;
					letter-spacing: 0;
					margin-top: -0.05rem;
				}
			}
		}
		.oprateList {
			width: 100%;
			height: 1.9rem;
			background: white;
			.oprateWay {
				float: left;
				width: 33%;
				height: 0.9rem;
				text-align: center;
				.oprateImg {
					width: 0.44rem;
					height: 0.44rem;
					margin: 0.14rem auto;
					img {
						vertical-align: top;
						width: 100%;
						height: 100%;
					}
				}
				.oprateName {
					font-size: 0.12rem;
					color: #333333;
					letter-spacing: 0;
					margin-top: -0.05rem;
				}
			}
		}
		.content {
			padding: 40px 0px;
			text-align: center;
			color: #bbb;
		}
	}
</style>