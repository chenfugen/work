<template>
	<div class="orderDetail">
		<breadcrumb :menu="navigation"></breadcrumb>
		<el-row class="orderContent" :gutter="12">
			<el-col :span="4">
				<el-card shadow="hover">
					<p class="title">产品型号</p>
					<p class="orderValue">{{orderDetail.erpName==null?"--":orderDetail.erpName}}</p>
				</el-card>
			</el-col>
			<el-col :span="4">
				<el-card shadow="hover">
					<p class="title">ERP编码</p>
					<p class="orderValue">{{orderDetail.erpCode}}</p>
				</el-card>
			</el-col>
			<el-col :span="4">
				<el-card shadow="hover">
					<p class="title">
						<span>工单号</span>
						<el-tag v-if="orderDetail.hadRepeat==1" class="tag" size="mini">重码</el-tag>
					</p>
					<p class="orderValue">{{orderDetail.orderCode}}</p>
				</el-card>
			</el-col>
			<el-col :span="4">
				<el-card shadow="hover">
					<p class="title">工厂-产线</p>
					<p class="orderValue">{{orderDetail.factoryName+"-"+orderDetail.productLineName}}</p>
				</el-card>
			</el-col>
			<el-col :span="4">
				<el-card shadow="hover">
					<p class="title">进度</p>
					<p class="orderValue">{{orderDetail.finishedTotal==null?0+"/"+orderDetail.planTotal:orderDetail.finishedTotal+"/"+orderDetail.planTotal}}</p>
				</el-card>
			</el-col>
			<el-col :span="4">
				<el-card shadow="hover">
					<p class="title">今日已生产</p>
					<p class="orderValue">{{finishedTotal}}</p>
				</el-card>
			</el-col>
		</el-row>
		<div class="content">
			<model-bar title="数码扫描"></model-bar>
			<el-input placeholder="请扫描滤芯二维码" ref="myNameId" class="filterCode" v-model.trim="deviceId" autofocus @change="change()"
			 @focus="focus($event)" @keyup.enter.native="payCode()" @keydown.229.native="shift()"></el-input>
			<audio controls="controls" hidden :src="tone" ref="audio"></audio>
			<model-bar title="扫描结果"></model-bar>
			<div class="scanResult">
				<div v-if="!showResult">
					<img src="../../assets/image/blank_no_data.png" alt="扫描结果">
					<p class="scanHint">暂无数据，请扫描数码开始检测</p>
				</div>
				<div v-else>
					<div class="resultTable">
						<table-page :tableDable="tableDable" :columns="columns"></table-page>
					</div>
					<div class="resultType">
						<p class="resultBox" :class="[checkStatus==1?'success':'failure']">
							<img v-if="checkStatus==1" src="../../assets/image/work_order_icon_success.png" alt="成功">
							<img v-else src="../../assets/image/work_order_icon_failure.png" alt="失败">
							<span>{{ checkStatus==1?"成功":"失败"}}</span>
						</p>
						<p v-if="checkResult=='重码'" class="message" :class="[orderDetail.hadRepeat==0?'warning':'danger']">{{checkResult}}</p>
					</div>
				</div>
			</div>
		</div>
		<div class="content">
			<model-bar title="生产记录"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="复检" @add="add"></search>
			<table-page :page="page" :limit="limit" :tableDable="orderLog" :columns="logcolumns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getCheckRecordPageList" />
		</div>
	</div>
</template>

<script>
	import breadcrumb from "../../components/breadcrumb.vue"
	import modelBar from "../../components/modelBar.vue"
	import search from "../../components/searchList.vue"
	import tablePage from "../../components/table.vue"
	import pagination from "../../components/pagination.vue"
	export default {
		data() {
			return {
				navigation: [{
						name: "滤芯产测",
						path: ""
					},
					{
						name: "任务工单",
						path: "/taskOrder"
					},
					{
						name: "工单详情",
						path: ""
					}
				],
				orderDetail: {},
				finishedTotal: 0,
				isChinese: true,
				deviceId: "",
				tone: "",
				searchList: [{
					label: "滤芯数码",
					prop: "filterCode",
					type: 'input',
				}],
				searchParams: {
					filterCode: null,
				},
				orderLog: [],
				logcolumns: [{
						prop: 'erpName',
						label: '产品型号',
						align: 'left',
					}, {
						prop: 'encrNumber',
						label: '滤芯编码',
						align: 'left',
						width: 240,
						render: (h, params) => {
							return h('div', [
								h('span', params.row.encrNumber), h('el-tag', {
									props: {
										size: 'mini'
									},
									style: {
										"margin-left": '5px',
										display: params.row.repeatStatus === 1 ? 'inline-block' : 'none'
									}
								}, "重码")
							])
						}
					},
					{
						prop: 'checkTime',
						label: '检测时间',
						align: 'left',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.checkTime))
						}
					},
					{
						prop: 'checkStatus',
						label: '检测状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									size: 'mini',
									effect: 'dark',
									type: params.row.checkStatus == 1 ? 'success' : 'danger'
								} // 组件的props
							}, params.row.checkStatus == 1 ? '成功' : '失败')
						}
					},
					{
						prop: 'status',
						label: '数码状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: 'dark',
									size: "mini",
									type: params.row.checkStatus === 1 ? 'success' : params.row.failCode === "622" ? 'warning' : 'danger'
								} //组件的props
							}, params.row.checkStatus == 1 ? '已生产' : params.row.failCode === "622" ? '重复检测' : '非法数码')
						}
					}
				],
				tableDable: [],
				checkStatus: "",
				checkResult: "",
				showResult: false,
				columns: [{
						prop: 'erpName',
						label: '产品型号',
						align: 'left',
					}, {
						prop: 'filterCode',
						label: '滤芯编码',
						align: 'left',
					},
					{
						prop: 'checkTime',
						label: '检测时间',
						align: 'left',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.checkTime))
						}
					}
				],
				total: 0, //数据总条数
				page: 1, //默认显示第1页
				limit: 10 //默认一次显示10条数据
			}
		},
		components: {
			breadcrumb,
			modelBar,
			search,
			tablePage,
			pagination
		},
		mounted() {
			this.$nextTick(() => {
				this.$refs["myNameId"].focus()
			})
			this.getOrderDetail();
			this.getcheckTotal();
			this.getCheckRecordPageList();
		},
		methods: {
			formatDate(res) {
				let date = new Date(res);
				let Y = date.getFullYear() + '-';
				let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
				let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
				let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
				let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
				return Y + M + D + h + m + s;
			},
			submitForm(formName) {
				this.getCheckRecordPageList();
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						filterCode: null,
					}
				}
			},
			add() {
				this.$router.push("/recheck/" + this.$route.params.id);
			},
			change() {
				this.$refs["myNameId"].select()
			},
			focus(event) {
				event.currentTarget.select();
			},
			getFilter(name, url) {
				let urlPrefix = url.split("?")[0].split("//")[1];
				if (urlPrefix != this.$store.state.filterURL) {
					this.$message({
						message: "非法数码地址",
						type: 'warning',
					});
					return null;
				} else {
					return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(
						/\+/g, '%20')) || null                
				}
			},
			payCode() {
				let that = this;
				that.deviceId = that.getFilter("filter", this.deviceId);
				if(that.deviceId){
					that.checkTask(that.deviceId);
					let time = setTimeout(() => {
						this.$refs["myNameId"].select()
						clearTimeout(time);
					}, 900)
				}	
			},
			shift() {
				if (this.isChinese) {
					this.$message({
						message: "请切换成英文输入法",
						type: 'warning',
					});
					this.isChinese = false;
					let timer = setTimeout(() => {
						this.isChinese = true;
						this.deviceId = "";
						clearTimeout(timer);
					}, 1000)
				}
			},
			checkTask(filterCode) {
				let api = this.$Api.manage_reCheckRecord;
				this.$Axios.post(api, {
					taskId: this.$route.params.id,
					filterCode: filterCode,
				}).then((res) => {
					if (res.success) {
						this.tableDable = res.data.resultList;
						this.checkStatus = res.data.checkStatus;
						this.checkResult = res.data.checkResult;
						this.showResult = true;
						if (this.checkResult == "重码") {
							this.tone = require("../../assets/music/repeated.mp3");
						} else if (this.checkStatus !== 1 && this.checkResult != "重码") {
							this.$message({
								message: this.checkResult,
								type: 'warning'
							});
							this.tone = require("../../assets/music/error.mp3");
						} else {
							this.tone = require("../../assets/music/success.mp3");
						}
						this.$nextTick(() => {
							this.$refs.audio.currentTime = 0; //从头开始播放提示音
							this.$refs.audio.play();
						})
					} else {
						this.tone = "../../assets/music/error.mp3";
						this.showResult = false;
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
					this.getOrderDetail();
					this.getcheckTotal();
					this.getCheckRecordPageList();
				}).catch((res) => {});
			},
			getOrderDetail() {
				let api = this.$Api.manage_getProductionTaskInfo;
				this.$Axios.get(api, {
					params: {
						id: this.$route.params.id
					}
				}).then((res) => {
					if (res.success) {
						this.orderDetail = res.data;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
			getCheckRecordPageList() {
				let api = this.$Api.manage_record;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						taskId: this.$route.params.id,
						...this.searchParams
					}
				}).then((res) => {
					if (res.success) {
						this.orderLog = res.data;
						this.total = res.total;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
			getcheckTotal() {
				let api = this.$Api.manage_countTodayCheckRecord;
				this.$Axios.get(api, {
					params: {
						taskId: this.$route.params.id
					}
				}).then((res) => {
					if (res.success) {
						this.finishedTotal = res.data.todayCount;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
		}
	}
</script>

<style lang="scss">
	.orderDetail {
		.content {
			padding: 5px 20px;
			background: white;
			margin-top: 10px;
			overflow: hidden;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);

			.filterCode {
				font-size: 30px;
				padding: 5px;
			}

			.scanResult {
				position: relative;
				text-align: center;

				.scanHint {
					text-align: center;
					position: absolute;
					top: 0px;
					left: 0px;
					width: 100%;
					line-height: 80px;
					font-size: 20px;
					color: #999999;
				}

				.resultTable {
					width: 83%;
					display: inline-block;
					margin-right: 2%;
					vertical-align: top;
				}

				.resultType {
					width: 15%;
					display: inline-block;

					.resultBox {
						width: 100%;
						border-radius: 8px;
						color: white;
						margin: 0px;
						height: 100px;
						line-height: 100px;
						font-size: 30px;
						text-align: center;

						img {
							margin-right: 10px;
							margin-bottom: -15px;
						}
					}

					.message {
						width: 100%;
						line-height: 40px;
						border-radius: 8px;
						text-align: center;
						font-size: 18px;

					}

					.success {
						background: #67c23a;
					}

					.failure {
						background: #E64555;
						color: white;
					}

					.danger {
						background: #FFE7EE;
						color: #F23B5A;
					}

					.warning {
						color: white;
						background: #e6a23c;
					}
				}
			}
		}

		.orderContent {
			margin-top: 15px;

			.title {
				font-size: 12px;
				color: #666666;
				letter-spacing: 0;
				line-height: 20px;
			}

			.tag {
				font-size: 10px;
				margin-left: 10px;
			}

			.el-tag {
				height: 20px;
				line-height: 20px;
			}

			.orderValue {
				font-size: 16px;
				color: #333333;
				letter-spacing: 0;
				line-height: 24px;
				font-weight: bold;
			}
		}
	}
</style>
