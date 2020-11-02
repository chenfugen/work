<template>
	<div class="digitalStatistics">
		<breadcrumb :menu="navigation"></breadcrumb>
		<el-select v-model="erpCode" filterable @change="search" placeholder="全部滤芯型号">
			<el-option label="全部" :value="null"></el-option>
			<el-option v-for="(item,index) in erpList" :key="item.index" :label="item.itemName+'('+item.itemCode+')'" :value="item.itemCode">
			</el-option>
		</el-select>
		<div class="content">
			<p class="title">已生成（个）</p>
			<p class="data">{{total}}</p>
			<img src="../../assets/image/numerical_code_management_pic_generated_bg.png" alt="水纹">
			<el-row :gutter="12">
				<el-col v-if="AllCount.length==2" :span="4" class="statusContent"></el-col>
				<el-col v-for="(item,index) in  AllCount" :key="index" :span="8" class="statusContent">
					<el-card shadow="always">
						<div class="left">
							<el-progress type="circle" :stroke-width="15" v-if="!isNaN(Number(Math.round(item.count*100/total).toFixed(0)))"
							 :percentage="Number((item.count*100/total).toFixed(2))" :color="item.status==100?pramary:item.status==200?warning:success"></el-progress>
						</div>
						<div class="right">
							<p class="status">{{item.status==100?"待生产（个）":item.status==200?"待激活（个）":"已激活（个）"}}</p>
							<p class="statusData pramary">{{item.count}}</p>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
		<el-row :gutter="12" style="margin-top: 20px;">
			<el-col v-for="(item,index) in count" :key="index" :span="8" class="monthContent">
				<span v-if="item.status==200">
					<img class="left" src="../../assets/image/numerical_code_management_pic_this_month_bg.png" alt="生产">
					<img class="right" src="../../assets/image/numerical_code_management_icon_month_production.png" alt="生产">
				</span>
				<span v-else-if="item.status==300">
					<img class="left" src="../../assets/image/numerical_code_management_pic_this_month_bg.png" alt="激活">
					<img class="right" src="../../assets/image/numerical_code_management_icon_month_activation.png" alt="激活">
				</span>
				<span v-else>
					<img class="left" src="../../assets/image/numerical_code_management_pic_this_month_bg.png" alt="生成">
					<img class="right" src="../../assets/image/numerical_code_management_icon_month_generate.png" alt="生产">
				</span>
				<el-card shadow="always">
					<p class="month">{{item.status=='created'?"本月已生成（个）":item.status==200?"本月生产（个）":"本月激活（个）"}}</p>
					<p class="monthData">{{item.count}}</p>
					<p class="date">{{item.status=='created'?"昨日已生成（个）":item.status==200?"昨日生产（个）":"昨日激活（个）"}}</p>
					<p class="dateData ">{{item.dataCount}}</p>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import breadcrumb from "../../components/breadcrumb.vue"
	export default {
		data() {
			return {
				navigation: [{
						name: "数码管理",
						path: ""
					},
					{
						name: "数码统计",
						path: "/digitalStatistics"
					}
				],
				options: [{
					value: '选项1',
					label: '黄金糕'
				}, {
					value: '选项2',
					label: '双皮奶'
				}, {
					value: '选项3',
					label: '蚵仔煎'
				}, {
					value: '选项4',
					label: '龙须面'
				}, {
					value: '选项5',
					label: '北京烤鸭'
				}],
				erpCode: '',
				isShow: false,
				monthStartTime: "",
				monthEndTime: "",
				startTime: "",
				endTime: "",
				AllCount: [],
				count: [],
				erpList: [],
				total: null,
				warning: "#F7BA63",
				pramary: "#3EA7D8",
				success: "#56BF73",
			}
		},
		components: {
			breadcrumb,
		},
		created() {
			this.getMonth();
			this.getERPlist();
			this.getAllNumberCount();
			this.getMonthNumberCount();
		},
		methods: {
			getMonth() {
				let date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth();
				let dates = new Date(year, month + 1, 0).getDate();
				let nextMonthFirstDay = new Date(date.getFullYear(), month, 1);
				let nextMonthEndDay = new Date(date.getFullYear(), month, dates);
				this.startTime = this.formatDate(date.setTime(date.getTime() - 24 * 60 * 60 * 1000), true);
				this.endTime = this.formatDate(date, false);
				this.monthStartTime = this.formatDate(nextMonthFirstDay, true);
				this.monthEndTime = this.formatDate(nextMonthEndDay, false);
			},
			formatDate(res, end) {
				if (res == null) {
					return '--';
				} else {
					let date = new Date(res);
					let Y = date.getFullYear() + '-';
					let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
					let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
					let h = "";
					let m = "";
					let s = "";
					if (end) {
						h = '00' + ':';
						m = '00' + ':';
						s = '00';
					} else {
						h = '23' + ':';
						m = '59' + ':';
						s = '59';
					}
					return Y + M + D + h + m + s;
				}
			},
			getERPlist() {
				let api = this.$Api.manage_getErpCodeList;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						this.erpList = res.data;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			getAllNumberCount() {
				let api = this.$Api.manage_number_getAllNumberCount;
				this.$Axios.get(api, {
					params: {
						erpCode: this.erpCode
					}
				}).then((res) => {
					if (res.success) {
						this.AllCount = res.data;
						this.total = 0;
						this.AllCount.forEach((item, index) => {
							this.total += item.count
						})
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
			getMonthNumberCount() {
				let api = this.$Api.manage_number_getNumberCount;
				this.$Axios.get(api, {
					params: {
						erpCode: this.erpCode,
						startTime: this.monthStartTime,
						endTime: this.monthEndTime,
					}
				}).then((res) => {
					if (res.success) {
						for (let i in res.data) {
							this.count[i] = {};
							this.count[i].status = Object.keys(res.data[i])[0];
							this.count[i].count = Object.values(res.data[i])[0];
						}
						this.getNumberCount();
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
			getNumberCount() {
				let api = this.$Api.manage_number_getNumberCount;
				this.$Axios.get(api, {
					params: {
						erpCode: this.erpCode,
						startTime: this.startTime,
						endTime: this.endTime,
					}
				}).then((res) => {
					if (res.success) {
						let dateCount = res.data;
						this.count.forEach((item, i) => {
							if (item.status == Object.keys(dateCount[i])[0]) {
								item.dataCount = Object.values(dateCount[i])[0];
							}
						})
						this.$forceUpdate();
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
			search() {
				//this.isShow =this.erpCode== null ? false : true;
				this.getAllNumberCount();
				this.getMonthNumberCount();
			},
			getList(index, row) {
				console.log(' row:', row)
			}
		}
	}
</script>

<style lang="scss">
	.digitalStatistics {
		.content {
			margin-top: 15px;
			padding: 15px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
			border-radius: 8px;
			text-align: center;
			position: relative;
			min-width: 950px;

			.title {
				font-size: 16px;
				color: #666666;
				font-weight: bold;
				letter-spacing: 0;
				text-align: center;
				line-height: 22px;
			}

			.data {
				font-size: 40px;
				color: #001689;
				letter-spacing: 0;
				text-align: center;
				line-height: 20px;
			}

			img {
				position: absolute;
				width: 100%;
				top: 140px;
				left: 0px;
			}

			.statusContent {
				margin-top: 80px;
				text-align: left;

				.left {
					float: left;
					margin-top: -5px;
					width: 45%;
					text-align: center;
				}

				.right {
					float: right;
					width: 50%;
					margin-top: -5px;
				}

				.status {
					font-size: 14px;
					color: #333333;
					letter-spacing: 0;
					font-weight: bold;
					line-height: 22px;
				}

				.statusData {
					font-size: 30px;
					letter-spacing: 0;
					line-height: 38px;
				}

				.success {
					color: #56BF73;
				}

				.warning {
					color: #F7BA63;
				}

				.pramary {
					color: #3EA7D8;
				}

			}
		}
		.monthContent {
			text-align: center;
			position: relative;

			img {
				position: absolute;
			}

			.left {
				left: 8px;
				top: 0px;
				height: 100%;
			}

			.right {
				right: 8px;
				bottom: 0px;
			}

			.month {
				font-size: 14px;
				color: #666666;
				letter-spacing: 0;
				line-height: 15px;
			}

			.monthData {
				font-size: 30px;
				color: #333333;
				letter-spacing: 0;
				line-height: 20px;
			}

			.date {
				font-size: 14px;
				color: #999999;
				letter-spacing: 0;
				line-height: 15px;
			}

			.dateData {
				font-size: 22px;
				color: #333333;
				letter-spacing: 0;
				line-height: 20px;
			}
		}

	}
</style>
