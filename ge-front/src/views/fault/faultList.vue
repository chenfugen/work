<template>
<div class="faultList">
	<Row type="flex" justify="space-around" class="marginTop">
		<Col span='8'>
		<Card>
			<Row>
				<Col span='4' offset='10' class="fault_icon" style="margin-left:45%;">
				</Col>
			</Row>
			<div style="text-align:center" class="marginTop">{{faultTotal}}</div>
			<div style="text-align:center">故障总计</div>
			<div class="marginBottom" style="margin-top:10px;">
				<span class="left" style="font-size: 12px;color: #FC8437;text-align: center;line-height: 12px;">今日新增故障{{statisticalForm.deviceFaultCountDay}}</span>
				<span class="right" style="font-size: 12px;color: #5FD487;text-align: center;line-height: 12px;">今日解决故障{{statisticalForm.deviceFaultCountDay}}</span>
			</div>
		</Card>
		<Row>
			<Col span='12'>
			<Card class="marginTop" style="height:160px;">
				<Row>
					<Col span='4' offset='8' class="fault_deviceMonth" style="margin-left:38%;">
					</Col>
				</Row>
				<div class="marginTop" style="text-align:center;font-size:20px;">{{statisticalForm.faultDeviceCountMonth}}</div>
				<div class="" style="text-align:center;font-size:12px;color:#999;">近一月上线故障设备数</div>
			</Card>
			</Col>
			<Col span='12'>
			<Card class="marginTop marginLeft" style="height:160px;">
				<Row>
					<Col span='4' offset='8' class="fault_deviceTotal" style="margin-left:36%;">
					</Col>
				</Row>
				<div style="text-align:center;font-size:20px;" class="marginTop">{{statisticalForm.faultDeviceCount}}</div>
				<div style="text-align:center;font-size:12px;color:#999;">故障设备总数</div>
			</Card>
			</Col>
		</Row>
		</Col>
		<Col span='16'>
		<Card class="marginLeft" style="height:335px;position:relative">
			<div class="clearfloat">
				<span class="left">故障统计</span>
				<span class="right">
					<span style="display:block;font-size: 16px;color: #3F4656;text-align:center">{{faultTotal}}</span>
					<span style="display:block;font-size: 14px;color: #3F4656;">故障总计</span>
				</span>
			</div>
			<div id='faultHistogram' style="width: 100%;height:200px;"></div>
			<Spin fix v-if='loadingChart'></Spin>
		</Card>
		</Col>
	</Row>
	<!-- <Card class="faultHistogramBox marginTop">

	</Card> -->
	<div class="faultList-content">
		<div class="searchBox marginTop">
			<searchForm ref='searchForm' @handleSearch='getTableData()' :configList='staticData.configList'></searchForm>
		</div>
		<div class="marginTop">
			<tableComponent ref='tableComponent' :columns='staticData.columns' :showBatchDel='false'></tableComponent>
		</div>
	</div>
</div>
</template>
<script>
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
import staticData from '@/staticData/static_faultList.js'
var echarts = require('echarts');
export default {
	name: 'faultList',
	data() {
		return {
			staticData,
			faultTotal: 0,
			loadingChart: false,
			statisticalForm: {
				deviceFaultCountDay: 0,
				faultDeviceCount: 0,
				faultDeviceCountMonth: 0,
			}
		}
	},
	created() {},
	mounted() {
		this.getTableData()
		this.getDataStatistical()
		this.getTotalFault()
	},
	components: {
		searchForm,
		tableComponent
	},
	methods: {
		// 获取列表数据
		getTableData() {
			let para = this.$refs.searchForm.handleSubmit()
			this.$refs.tableComponent.getData(this.$api.manage_fault_list, para, true)
		},
		// 获取各类故障统计
		getTotalFault() {
			let api = this.$api.manage_fault_data_count
			this.$Ax.get(api).then(res => {
				this.statisticalForm = res.data
			}).catch(err => {
				console.log(err);
			})
		},
		// 获取统计数据
		getDataStatistical() {
			this.loadingChart = true
			let api = this.$api.manage_fault_deviceFault_data
			this.$Ax.get(api).then(res => {
				let dataxLine = [],
					dataList = [],
					total = 0
				for (let i in res.data) {
					total = total + res.data[i].count
					dataxLine.push(res.data[i].name)
					dataList.push(res.data[i].count)
				}
				this.faultTotal = total
				this.handleInitFaultHistogram(dataxLine, dataList)
			}).catch(err => {
				console.log(err);
			})
		},
		// 绘制柱状图
		handleInitFaultHistogram(dataxLine, dataList) {
			var FaultHistogram = echarts.init(document.getElementById('faultHistogram'));
			var option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					},
					formatter: function(params) {
						var tar = params[0];
						return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
					}
				},
				dataZoom: [{
					type: 'inside', //图表下方的伸缩条
					show: true, //是否显示
				}],
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					splitLine: {
						show: false
					},
					data: dataxLine,
					nameLocation: 'end', //坐标轴名称显示位置。
					axisLabel: { //坐标轴刻度标签的相关设置。
						interval: 0,
						rotate: "45"
					}
				},
				yAxis: {
					type: 'value'
				},
				series: [{
					name: '发生次数',
					type: 'bar',
					stack: '总量',
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: '#FFCA8B'
							}, {
								offset: 1,
								color: '#FBAF54'
							}]),
							label: {
								show: true, //开启显示
								position: 'top', //在上方显示
								textStyle: { //数值样式
									color: '#FBAF54',
									fontSize: 16
								}
							}
						}
					},
					barWidth: 24,
					data: dataList
				}]
			};
			FaultHistogram.setOption(option);
			this.loadingChart = false
		},
		// 处理时间显示形式
		dealTime(date) {
			return this.$Utils.dealTime(date)
		},
		// 处理空数据
		dealNullData(data) {
			return this.$Utils.dealNullData(data)
		},

	}
}
</script>
<style scoped>
.statistical-box {
	width: 180px;
	height: 180px;
	border-radius: 100px;
	border: 2px solid #999;
	text-align: center;
	background-color: #f7f7f7;
}

.statistical-box-num {
	margin-top: 30px;
	line-height: 60px;
	font-size: 50px;
	font-weight: 900;
	color: #f7f7f7;
}

.statistical-box-txt {
	line-height: 40px;
}

.faultHistogramBox {
	overflow: hidden;
}

.faultList-content {
	margin-top: 20px;
	padding: 20px 0;
	background-color: #fff;
	border-radius: 4px;
}

.searchBox {
	margin-left: 20px;
}

.actionBox {
	margin-left: 20px;
}

.searchBtn {
	margin-left: 20px;
	padding: 1px 6px;
	font-size: 18px;
}

.fault_icon {
	border-radius: 100px;
	height: 40px;
	width: 40px;
	background-image: url(../../assets/fault_total.png);
}

.fault_deviceMonth {
	border-radius: 100px;
	height: 40px;
	width: 40px;
	background-image: url(../../assets/fault_device_month.png);
}

.fault_deviceTotal {
	border-radius: 100px;
	height: 40px;
	width: 40px;
	background-image: url(../../assets/fault_device_total.png);
}
</style>
