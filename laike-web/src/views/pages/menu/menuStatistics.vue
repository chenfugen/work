<template>
	<div id="menu-statistics">
		<div id="model" style="width:calc((100% - 24px)/3);height:50%;margin-right:24px;">
			<div class="inputForm1">
				<!-- <el-select v-model.trim="select1" style="width:128px" placeholder="产品型号" @change="getDeviceModelMenuStatistics">
                    <el-option v-for="(i,x) in $store.state.oldStore.deviceModels" :key="x" :label="i" :value="i"></el-option>
				</el-select>-->
			</div>
			<div ref="spread" style="width:100%;height:100%"></div>
		</div>
		<div id="faultTrend" style="width:calc((100% - 24px)/3*2);height:50%;">
			<div class="inputForm">
				<el-select
					v-model.trim="select"
					style="width:128px"
					placeholder="产品型号"
					@change="getMenuNewTendency"
				>
					<el-option v-for="(i,x) in $store.state.oldStore.deviceModels" :key="x" :label="i" :value="i"></el-option>
				</el-select>
			</div>
			<div class="radio">
				<el-radio-group v-model.trim="radio1" size="small" @change="getMenuNewTendency">
					<el-radio-button label="1">24时</el-radio-button>
					<el-radio-button label="2">月</el-radio-button>
					<el-radio-button label="3">年</el-radio-button>
				</el-radio-group>
			</div>
			<div ref="faultTrend" style="width:100%;height:100%"></div>
		</div>
	</div>
</template>

<script>
import indexEcharts from "../../../indexEcharts";
export default {
	mounted() {},
	data() {
		return {
			select: "CF5", //产品型号
			select1: "", //产品型号
			radio1: "1",
			faultTrendData: {
				title: "菜谱新增",
				subtext: "总数(个)",
				type: "line",
				tip: "{b}<br/> 菜谱新增：{c}个",
				sname: "2019-6",
				tatol: "9999",
				name: [],
				value: [],
			},
			spreadData: {
				title: "菜谱总量",
				subtext: "总计(个)",
				tatol: "",
				tip: "{b}\n {c}个 ({d}%)",
				name: [],
				value: [],
			},
		};
	},
	watch: {},
	mounted() {
		const that = this;
		window.onresize = () => {
			return (() => {
				this.$echarts.init(that.$refs.faultTrend).resize();
				this.$echarts.init(that.$refs.spread).resize();
			})();
		};
		this.indexEcharts();
	},
	methods: {
		indexEcharts() {
			this.getMenuNewTendency();
			this.getDeviceModelMenuStatistics();
		},
		getMenuNewTendency() {
			let ajax = this.$http.menuNewTendency;
			if (this.select === "CF5") {
				ajax = this.$http.menuNewTendency5;
			}
			ajax({
				deviceModel: this.select,
				type: this.radio1, //1：24小时（默认），2：月，3：年
			}).then((res) => {
				if (res.data.success) {
					this.faultTrendData.name = [];
					this.faultTrendData.value = [];
					res.data.datas.forEach((item) => {
						this.faultTrendData.name.push(item[0]);
						this.faultTrendData.value.push(item[1]);
					});
					indexEcharts.newTrend(
						this.$refs.faultTrend,
						this.faultTrendData
					);
				}
			});
		},
		getDeviceModelMenuStatistics() {
			this.$http.deviceModelMenuStatistics().then((res) => {
				if (res.data.success) {
					this.spreadData.name = [];
					this.spreadData.value = [];
					res.data.datas.forEach((item) => {
						this.spreadData.name.push(item[0]);
						this.spreadData.value.push({
							name: item[0],
							value: item[1],
						});
					});
					this.spreadData.total = res.data.total;
					indexEcharts.model(this.$refs.spread, this.spreadData);
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
#menu-statistics {
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
		> .inputForm1 {
			top: 24px;
			right: 20px;
			position: absolute;
			z-index: 1;
			.el-input__inner {
				height: 32px;
				line-height: 32px;
			}
			i {
				line-height: 32px;
			}
		}
	}
	#faultTrend,
	#spread {
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
		> .inputForm {
			top: 24px;
			left: 120px;
			position: absolute;
			z-index: 1;
			.el-input__inner {
				height: 32px;
				line-height: 32px;
			}
			i {
				line-height: 32px;
			}
		}
	}
}
</style>
