<template>
	<div class="taskDetail">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="数码扫描"></model-bar>
			<el-input placeholder="请扫描滤芯二维码" ref="scanDeviceId" class="filterCode" v-model.trim="deviceId" autofocus @change="change()"
			 @focus="focus($event)" @keyup.enter.native="payCode()" @keydown.229.native="shift()"></el-input>
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
				</div>
			</div>
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
						name: "成品抽检",
						path: ""
					},
					{
						name: "开始抽检",
						path: ""
					}
				],
				deviceId: "",
				searchList: [{
					label: "滤芯数码",
					prop: "name",
					type: 'input',
				}],
				searchParams: {
					name: null,
				},
				tableDable: [],
				showResult: false,
				isChinese: true,
				columns: [{
						prop: 'erpName',
						label: '产品名称',
						align: 'left',
					}, {
						prop: 'erpCode',
						label: 'ERP编码',
						align: 'left',
					}, {
						prop: 'filterCode',
						label: '滤芯数码',
						align: 'left',
						width: 220
					},
					{
						prop: 'productTime',
						label: '生产时间',
						align: 'left',
						sortable: true,
						render: (h, params) => {
							return h('span', params.row.productTime == null ? '--' : this.formatDate(params.row.productTime))
						}
					},
					{
						prop: 'orderCode',
						label: '工单号',
						align: 'left',
					},
					{
						prop: 'status',
						label: '状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
									props: {
										effect: 'dark',
										size: "mini",
										type: params.row.status === 200 ? 'success' : params.row.status === 300 ? 'success' : 'warning'
									} // 组件的props
								}, params.row.status === 200 ? (params.row.source == 2 ? '待激活' : '已生产') : params.row.status === 300 ? '已激活' :
								'待生产')
						}
					},
					{
						label: '操作',
						align: 'left',
						render: (h, params) => {
							return h('el-link', {
								props: {
									type: 'primary',
								},
								style: {
									display: params.row.status === 100 ? "none" : "inline-block"
								},
								on: {
									click: () => {
										this.activate(params.row)
									}
								}
							}, params.row.source == 1 ? (params.row.status === 200 ? '复位至待生产' : params.row.status === 300 ? '复位至待激活' :
								'--') : params.row.source == 2 ? (params.row.status === 300 ? '复位至待激活' : '--') : (params.row.status === 300 ?
								'复位至待生产' : '--'))
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
		created() {
			this.$nextTick(() => {
				this.$refs["scanDeviceId"].focus()
			})
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
			activate(row) {
				let cue = row.status == 200 ? "复位至待生产" : "复位至待激活";
				this.$confirm('确定将该滤芯' + cue + '?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_reset;
					this.$Axios.post(api, {
						taskId: row.taskId,
						filterCode: row.filterCode,
						source: row.source,
					}).then((res) => {
						if (res.success) {
							this.$message({
								message: "操作成功",
								type: 'success'
							});

							this.checkTask(this.deviceId);
						} else {
							this.$message({
								message: res.message,
								type: 'warning'
							});
						}
					})
				}).catch(() => {})
			},
			change() {
				this.$refs["scanDeviceId"].select()
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
						this.$refs["scanDeviceId"].select()
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
				let api = this.$Api.manage_spotCheck;
				this.$Axios.post(api, {
					filterCode: filterCode,
				}).then((res) => {
					if (res.success) {
						this.tableDable = res.data.resultList;
						this.showResult = true;
					} else {
						this.showResult = false;
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
	.taskDetail {
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
					position: absolute;
					top: 0px;
					left: 0px;
					width: 100%;
					line-height: 80px;
					font-size: 20px;
					color: #999999;
				}

				.resultTable {
					width: 100%;
					display: inline-block;
					margin-right: 2%;
					vertical-align: top;
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
