<template>
	<div id="index">
		<!-- 在离线统计 -->
		<div
			id="offline"
			ref="offline"
			style="
				width: calc((100% - 24px) / 3);
				height: calc(48% - 24px);
				margin: 0 24px 24px 0;
			"
		>
			在离线统计
		</div>
		<div
			id="newTrend"
			style="
				width: calc((100% - 24px) / 3 * 2);
				height: calc(48% - 24px);
				margin-bottom: 24px;
			"
		>
			<div class="radio">
				<el-radio-group v-model.trim="radio1" size="small">
					<el-radio-button label="1">24时</el-radio-button>
					<el-radio-button label="2">月</el-radio-button>
					<el-radio-button label="3">年</el-radio-button>
				</el-radio-group>
			</div>
			<div ref="newTrend" style="width: 100%; height: 100%"></div>
		</div>
		<div
			id="category"
			ref="category"
			style="
				width: calc((100% - 24px) / 3);
				height: 52%;
				margin-right: 24px;
			"
		>
			产品型号统计
		</div>
		<div
			id="model"
			style="
				width: calc((100% - 24px) / 3);
				height: 52%;
				margin-right: 24px;
			"
		>
			<div class="select">
				<el-select v-model.trim="value" @change="deviceModelStatistics">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</div>
			<div ref="model" style="width: 100%; height: 100%"></div>
		</div>
		<div
			id="spread"
			ref="spread"
			style="width: calc((100% - 96px) / 3); height: 52%"
		>
			设备分布
		</div>
	</div>
</template>

<script>
import indexEcharts from "../indexEcharts";
export default {
	data() {
		return {
			offline: {},
			options: [
				{
					value: "智能烹饪机",
					label: "智能烹饪机",
				},
			],
			value: "智能烹饪机",
			radio1: "1",
			modelData: {
				title: "产品类型统计",
				subtext: "总数(台)",
				total: "",
				tip: "{b} {c}台 ({d}%)",
				name: [],
				value: [],
			},
			newTrendData: {
				title: "设备新增趋势",
				subtext: "总数(台)",
				type: "line",
				sname: "2019-6-2",
				tal: "9999",
				tip: "{b}\n 新增设备：{c}",
				name: [],
				value: [],
			},
			category: {
				title: "产品型号统计",
				subtext: "总数(台)",
				total: "",
				tip: "{b}\n {c}台 ({d}%)",
				name: [],
				value: [],
				total: "",
			},
			spread: {
				name: [],
				value: [],
				total: "",
				barValue: [],
				barData: [],
			},
		};
	},
	watch: {
		$route(to, from) {
			if (this.$route.name != "菜谱详情") {
				// if(!this.$store.state.oldStore.token){
				// sessionStorage.removeItem("store");
				// this.$store.commit('del_token',1);
				// this.$router.push({path: '/login'});
				// }
			}
			if (this.$store.state.oldStore.deviceTypes.length == 0) {
				this.selectDeviceModel(); //获取产品型号集合
				this.selectDeviceType(); //获取产品类型集合
			}
		},
		radio1() {
			this.$http.deviceNewTendency({ type: this.radio1 }).then((res) => {
				if (res.data && res.data.success) {
					this.newTrendData.name = [];
					this.newTrendData.value = [];
					res.data.datas.forEach((item) => {
						this.newTrendData.name.push(item[0]);
						this.newTrendData.value.push(item[1]);
					});
					indexEcharts.newTrend(
						this.$refs.newTrend,
						this.newTrendData
					);
				}
			});
		},
	},
	mounted() {
		this.indexEcharts();
		const that = this;
		window.onresize = () => {
			return (() => {
				this.$echarts.init(that.$refs.offline).resize();
				this.$echarts.init(that.$refs.newTrend).resize();
				this.$echarts.init(that.$refs.category).resize();
				this.$echarts.init(that.$refs.model).resize();
				this.$echarts.init(that.$refs.spread).resize();
			})();
		};
		this.selectType();
	},
	methods: {
		// 获取各类统计数据
		indexEcharts() {
			this.$http.onlineOfflineStatistics().then((res) => {
				if (res.data && res.data.success) {
					this.offline = res.data;
					indexEcharts.offline(this.$refs.offline, this.offline);
				}
			});
			this.$http.deviceNewTendency({ type: this.radio1 }).then((res) => {
				if (res.data && res.data.success) {
					this.newTrendData.name = [];
					this.newTrendData.value = [];
					res.data.datas.forEach((item) => {
						this.newTrendData.name.push(item[0]);
						this.newTrendData.value.push(item[1]);
					});
					indexEcharts.newTrend(
						this.$refs.newTrend,
						this.newTrendData
					);
				}
			});
			this.$http.deviceTypeStatistics().then((res) => {
				if (res.data && res.data.success) {
					this.modelData.name = [];
					this.modelData.value = [];
					let total = 0;
					res.data.datas.forEach((item) => {
						this.modelData.name.push(item[0]);
						this.modelData.value.push({
							name: item[0],
							value: item[1],
						});
						total = +item[1];
					});
					this.modelData.total = total;
					indexEcharts.model(this.$refs.category, this.modelData);
				}
			});
			this.$http.deviceDistribution().then((res) => {
				if (res.data && res.data.success) {
					this.spread.name = [];
					this.spread.value = [];
					res.data.datas.forEach((item) => {
						this.spread.name.push(item[0]);
						this.spread.barValue.push(item[1]);
						this.spread.value.push({
							name: item[0],
							value: item[1],
						});
						this.spread.barData.push(this.offline.total);
					});
					this.spread.total = this.offline.total;
					indexEcharts.spread(this.$refs.spread, this.spread);
				}
			});
			this.deviceModelStatistics();
		},
		// 获取全局——设备型号集合
		selectDeviceModel() {
			this.$http.selectDeviceModel().then((res) => {
				if (res.data && res.data.success) {
					this.$store.commit("add_deviceModels", res.data.rows);
				}
			});
		},
		// 获取全局——设备类型列表
		selectDeviceType() {
			this.$http.selectDeviceType().then((res) => {
				if (res.data && res.data.success) {
					this.$store.commit("add_deviceTypes", res.data.rows);
				}
			});
		},
		// 获取全局——设备类型型号集合
		selectType() {
			this.$http.selectType().then((res) => {
				if (res.data && res.data.success) {
					this.$store.commit("add_types", res.data.data);
				}
			});
		},
		// 获取全局——产品型号统计
		deviceModelStatistics() {
			this.$http
				.deviceModelStatistics({ deviceType: this.value })
				.then((res) => {
					if (res.data && res.data.success) {
						this.category.name = [];
						this.category.value = [];
						res.data.datas.forEach((item) => {
							this.category.name.push(item[0]);
							this.category.value.push({
								name: item[0],
								value: item[1],
							});
						});
						this.category.total = res.data.total;
						indexEcharts.model(this.$refs.model, this.category);
					}
				});
		},
	},
	destroyed() {
		window.onresize = null;
	},
};
</script>

<style lang="less">
#index {
	float: left;
	// overflow-y: auto;
	// overflow-x: hidden;
	height: 100%;
	width: 100%;
	min-height: 660px;
	> div {
		border-radius: 4px;
		background: #fff;
		box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
		float: left;
	}
	#model {
		position: relative;
		> p {
			float: left;
			padding: 24px 0 0 24px;
			font-size: 14px;
			color: #59626c;
			font-weight: bold;
		}
		> .select {
			height: 24px;
			top: 24px;
			right: 14px;
			width: 110px;
			position: absolute;
			z-index: 1;
			.el-input__icon {
				line-height: 24px;
			}
			input.el-input__inner {
				height: 24px;
			}
		}
	}
	#newTrend {
		position: relative;
		> .radio {
			top: 24px;
			right: 30px;
			position: absolute;
			z-index: 1;
			.el-radio-button__orig-radio:checked + .el-radio-button__inner {
				background-color: #f02b54;
				border-color: #f02b54;
				box-shadow: -1px 0 0 0 #f02b54;
				color: #fff;
			}
			.el-radio-button__inner:hover {
				color: #f02b54;
			}
		}
	}
}
</style>
