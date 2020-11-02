<template>
	<div class="deviceLog">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="searchBox">
			<img class="searchBg" src="../../assets/image/customer_service_pic_search_top_bg.png" alt="搜索">
			<p class="title">搜索</p>
			<div class="searchForm">
				<el-input class="searchInput" placeholder="请输入设备SN码/MAC地址/滤芯数码" v-model.trim="searchContent" @keyup.enter.native="search"></el-input>
				<el-button class="searchButton" size="medium" type="primary" @click="search">搜 索</el-button>
			</div>
		</div>
		<div class="deviceContent">
			<model-bar :title="searchResult==0?'搜索信息':searchResult==1?'滤芯信息':'设备信息'"></model-bar>
			<div class="scanBox" v-if="searchResult==0">
				<img src="../../assets/image/blank_no_data.png" alt="扫描结果">
				<p class="scanHint">暂无数据</p>
			</div>
			<div v-else>
				<div v-if="searchResult==1" class="deviceList" :class="[searchResult==1?'block':'inline']">
					<el-table :data="codeDate" :header-cell-style="{background:'#F2F6FA'}">
						<el-table-column prop="encrNumber" label="滤芯数码">
						</el-table-column>
						<el-table-column label="产品型号">
							<template slot-scope="scope">{{ scope.row.allPower ? "万能产品" : scope.row.erpProductName == null ? "万能产品" : scope.row.erpProductName}}</template>
						</el-table-column>
						<el-table-column prop="remainCount" label="可用次数">
						</el-table-column>
					</el-table>
				</div>
				<div v-else class="deviceList" :class="[searchResult==1?'block':'inline',{'active':checked==0}]" > <!-- @click="" -->
					<el-table :data="deviceDate"  ref="singleTable" :header-cell-style="{background:'#F2F6FA'}"   highlight-current-row  @current-change="seachDevice" >
						<el-table-column  label="设备SN">
							<template  slot-scope="scope">
								{{ scope.row.sncode==null || scope.row.sncode=="null"?"--":scope.row.sncode}}
							</template>
						</el-table-column>
						<el-table-column prop="identityId" label="设备MAC">
						</el-table-column>
						<el-table-column prop="productModel" label="产品型号">
						</el-table-column>
					</el-table>
				</div>
				<div class="filterList" v-if="searchResult!=1">
					<el-row :gutter="12">
						<el-col class="filter" v-for="(item,index) in filters" :key="index" :span="8" @click.native="selectFilter(item)">
							<el-card :shadow="checked==item.attrIndex?'always':'never'">
								{{item.name}}
							</el-card>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div class="searchContent">
			<model-bar :title="searchDevice==0?'搜索结果':searchDevice==1?'滤芯记录':'设备记录'"></model-bar>
			<div class="scanResult">
				<div class="scanBox" v-if="searchDevice==0">
					<img src="../../assets/image/blank_no_data.png" alt="扫描结果">
					<p class="scanHint">暂无数据</p>
				</div>
				<div v-else>
					<div class="resultTable" v-if="searchDevice==1">
						<table-page :tableDable="filterDate" :columns="filterColumns"></table-page>
						<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getActivatelog" />
					</div>
					<div class="resultTable" v-else>
						<search :searchList="deviceSearchList" :searchParams="deviceSearchParams" formName="deviceSearch" @resetForm="resetForm"
						 @submitForm="submitForm"></search>
						<table-page :tableDable="deviceLog" :columns="deviceColumns"></table-page>
						<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getActivateList" />
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
					name: "设备日志",
					path: ""
				}],
				searchContent: "",
				dialogFormVisible: false,
				filterDate: [],
				filterColumns: [{
						prop: 'type',
						label: '操作',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									size: 'mini',
									type: params.row.type === 1 ? '' : 'primary'
								}
							}, params.row.type === 1 ? '复位' : '反复位')
						}
					}, {
						prop: 'operateTime',
						label: '操作时间',
						width: 160,
						align: 'left',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.operateTime))
						}
					},
					{
						prop: 'sn',
						label: '设备SN',
						align: 'left',
					},
					{
						prop: 'phone',
						label: '用户（手机号码）',
						align: 'left',
					},
					{
						prop: 'pkModel',
						label: '操作型号',
						align: 'left',
					},
					{
						prop: 'operateSource',
						label: '方式',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.operateSource === 1 ? '小程序' : '客服中心')
						}
					},
					{
						prop: 'dataSource',
						label: '数据来源',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.dataSource === 1 ? '产测' : params.row.dataSource === 2 ? '客服中心' : '小程序')
						}
					},
					{
						prop: 'operator',
						label: '操作人',
						align: 'left',
					}
				],
				searchDevice: 0,
				searchResult: 0, // 1、滤芯数码，2、SN码 ，3、MAC地址
				userSearchList: [{
					label: "用户名称",
					prop: "username",
					type: 'input',
				}, {
					label: "电话号码",
					prop: "number",
					type: 'input',
				}],
				deviceSearchList: [{
						label: "操作",
						prop: "operateType",
						type: 'select',
						options: [{
							label: "复位",
							value: "ACTIVATE"
						}, {
							label: "反复位",
							value: "ANTI_ACTIVATE"
						}]
					},
					{
						label: "方式",
						prop: "operateSource",
						type: 'select',
						options: [{
							label: "小程序",
							value: "MINI_PROGRAM"
						}, {
							label: "客服服务",
							value: "CUSTOMER_SERVICE"
						}]
					}
				],
				filters: [],
				checked: 0,
				sncode: null,
				identityId: null,
				userSearchParams: {},
				deviceSearchParams: {
					operateType: null,
					operateSource: null
				},
				filterIdentityId: null,
				filterCode: null,
				deviceColumns: [{
						prop: 'operateType',
						label: '操作',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									size: 'mini',
									type: params.row.operateType === "ACTIVATE" ? '' : 'primary'
								}
							}, params.row.operateType === "ACTIVATE" ? '激活' : '反激活')
						}
					},
					{
						prop: 'userPhone',
						label: '激活用户',
						align: 'left',
					},
					{
						prop: 'content',
						label: '内容',
						align: 'left',
						render: (h, params) => {
							return h('span',(params.row.operator ||"")+(params.row.operateType === "ACTIVATE" ?'对该设备激活' : '对该设备反激活'))
						}
					},
					{
						prop: 'operateTime',
						label: '操作时间',
						align: 'left',
						sortable: true,
						width: 160,
						render: (h, params) => {
							return h('span', this.formatDate(params.row.operateTime))
						}
					},
					{
						prop: 'operateSource',
						label: '方式',
						align: 'left',
						render: (h, params) => {
							return h('span', {
								style: {
									color: params.row.operateSource === "CUSTOMER_SERVICE" ? '#1F9AD6' : '#67c23a'
								}
							}, params.row.operateSource === "CUSTOMER_SERVICE" ? '客服服务' : '小程序')
						}
					},
				],
				page: 1,
				limit: 10,
				total: 0,
				deviceDate: [],
				codeDate: [],
				deviceLog: [],
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

		},
		methods: {
			formatDate: res => {
				if (res == "" || res == undefined || res == null) {
					return "--";
				} else {
					let date = new Date(res);
					let Y = date.getFullYear() + '-';
					let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
					let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
					let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
					let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
					let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
					return Y + M + D + h + m + s;
				}
			},
			submitForm(formName) {
				if (formName == "deviceSearch") {
					this.page = 1;
					this.limit = 10;
					let searchContent = this.searchContent.length;
					if (this.searchResult == 2) {
						this.sncode = this.searchContent;
						this.identityId = null;
					} else if (this.searchResult == 3) {
						this.sncode = null;
						this.identityId = this.searchContent;
					}
					this.getDeviceList();
				}
			},
			resetForm(formName) {
				if (formName == "deviceSearch") {
					this.deviceSearchParams = {
						operateType: null,
						operateSource: null,
					}
					this.page = 1;
					this.limit = 10;
					let searchContent = this.searchContent.length;
					if (this.searchResult == 2) {
						this.sncode = this.searchContent;
						this.identityId = null;
					} else if (this.searchResult == 3) {
						this.sncode = null;
						this.identityId = this.searchContent;
					}
					this.getDeviceList();
				} else {
					this.$refs[formName].resetFields();
				}
			},
			getFilters(pk) {
				let api = this.$Api.manage_productSet_filters;
				this.$Axios.get(api, {
					params: {
						productKey: pk,
					}
				}).then((res) => {
					if (res.success) {
						this.filters = res.data;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
						this.filters =[];
					}
				})
			},
			seachDevice(row) {
				this.checked = 0;
				this.searchDevice = 2;
				this.sncode =row.sncode==null?"":row.sncode;
				this.identityId=row.identityId;
				this.getActivateList()
			},
			selectFilter(row) {
				this.page = 1;
				this.limit = 10;
				this.filterIdentityId = row.identifier;		
				this.getActivatelog();
				this.checked = row.attrIndex;
				this.searchDevice = 1;
			},
			search() {
				let searchContent = this.searchContent.length;
				// 1、滤芯数码，2、SN码 ，3、MAC地址
				this.searchResult = searchContent == 24 ? 1 : (searchContent == 20 ? 2 : searchContent == 12 || searchContent == 15 ?
					3 : 0);
				this.searchDevice = searchContent == 24 ? 1 : (searchContent == 20 ? 2 : searchContent == 12 || searchContent == 15 ?
					3 : 0);
				if (this.searchResult == 1) {
					this.filterCode=this.searchContent;
					this.getFilterList(this.searchContent);					
					this.getActivatelog();
				} else if (this.searchResult == 2) {
					this.sncode = this.searchContent;
					this.identityId = "";
					this.getDeviceList();
				} else if (this.searchResult == 3) {
					this.sncode="";
					this.identityId = this.searchContent;
					this.getDeviceList();
				} else {
					this.$message.error('请输入正确的内容');
				}
			},
			getActivateList() {
				let api = this.$Api.manage_customer_getDeviceActiveRecordList;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						sncode: this.sncode,
						identityId: this.identityId,
						...this.deviceSearchParams
					}
				}).then((res) => {
					this.loading = false;
					if (res.success) {
						this.deviceLog = res.data;
						this.total = res.total;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
						this.deviceLog = [];
						this.total =0;
					}
				}).catch((res) => {});
			},
			getActivatelog() {
				let api = this.$Api.manage_customer_getFilterActiveRecordList;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						filterCode: this.filterCode,
						identifier:  this.filterIdentityId,
					}
				}).then((res) => {
					this.loading = false;
					if (res.success) {
						this.filterDate = res.data;
						this.total = res.total;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
			request(api, data) {
				this.$Axios.get(api, {
					params: data
				}).then((res) => {
					if (res.success) {
						if (this.searchResult == 1) {
							this.codeDate = res.data;
						} else {
							this.deviceDate = res.data;
							this.getFilters(res.data[0].productKey);
							this.getActivateList()
						}
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
						this.codeDate=[];
						this.deviceDate=[];
					}
				}).catch((res) => {});
			},
			getDeviceList() {
				let api = this.$Api.manage_customer_getSnDeviceList;
				let data = {
					pageNum: this.page,
					pageSize: this.limit,
					sncode: this.sncode,
					identityId: this.identityId,
				}
				this.request(api, data)
			},
			getFilterList(filterCode) {
				let api = this.$Api.manage_customer_getFilterList;
				let data = {
					pageNum: 1,
					pageSize: 10,
					filterCode: filterCode
				}
				this.request(api, data)
			},
			edit() {

			},
			deviceList() {

			},
			searchLog() {

			},
			activateLog() {

			},
			end() {

			},
			reset() {

			},
			addResetNum() {

			}
		}
	}
</script>

<style lang="scss">
	.deviceLog {
		.searchBox {
			background: #FFFFFF;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
			border-radius: 8px;
			position: relative;
			width: 100%;
			height: 300px;

			.searchBg {
				position: absolute;
				top: 30px;
				left: 50%;
				margin-left: -120px;
			}

			.title {
				position: absolute;
				top: 50px;
				left: 0px;
				z-index: 999;
				width: 100%;
				text-align: center;
				font-size: 32px;
				color: #1F9AD6;
				letter-spacing: 0;
				line-height: 40px;
			}

			.searchForm {
				position: absolute;
				width: 60%;
				left: 50%;
				top: 145px;
				margin-left: -30%;
				text-align: center;


				.el-input__inner {
					background-color: #F5F7FA;
					border-color: #E4E7ED;
					color: #333333;
				}

				.searchButton {
					margin-top: 20px;
					width: 40%;
				}
			}

			.searchForm:focus-within {
				input {
					border-color: #1F9AD6;
				}
			}
		}

		.deviceContent {
			background: #FFFFFF;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
			border-radius: 8px;
			padding: 0px 20px;
			margin-top: 20px;
			overflow: hidden;
			position: relative;

			.scanBox {
				text-align: center;

				.scanHint {
					text-align: center;
					position: absolute;
					top: 60px;
					left: 0px;
					width: 100%;
					line-height: 80px;
					font-size: 20px;
					color: #999999;
				}
			}

			.deviceList {
				display: inline-block;
				cursor: pointer;
			}

			.active {
				box-shadow: 0 2px 12px 0 rgba(31, 154, 214, 0.3);
			}

			.filterList {
				width: 49%;
				float: right;

				.el-card {
					text-align: center;

				}

				.is-always-shadow {
					box-shadow: 0 2px 12px 0 rgba(31, 154, 214, 0.3);
				}

				.filter {
					cursor: pointer;
					margin-bottom: 10px;
				}
			}


			.block {
				width: 100%;
			}

			.inline {
				width: 50%;
			}


		}

		.searchContent {
			background: #FFFFFF;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
			border-radius: 8px;
			padding: 0px 20px;
			margin-top: 20px;
			overflow: hidden;
			position: relative;

			.reset {
				position: absolute;
				right: 20px;
				top: 15px;
			}

			.scanResult {
				position: relative;

				.scanBox {
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
				}

				.resultTable {
					width: 100%;
				}
			}
		}

	}
</style>
