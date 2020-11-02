<template>
	<div class="productionSet">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="产品列表"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="刷新" @add="update"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getProductList" />
		</div>
		<el-dialog :title="activeName" width="30%" class="edit" :visible.sync="dialogEditVisible">
			<el-form :model="editForm" status-icon :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
				<el-form-item :label="editForm.productModel">
					<span class="describe">需要激活 </span>
					<el-switch :width='60' active-text="开启"  inactive-text="关闭" class="switch" v-model="editForm.activate" ></el-switch>
				</el-form-item>
				<el-divider></el-divider>
				<el-form-item label="用户信息">
						<span class="describe">收集信息 </span>
					<el-switch :width='60' active-text="开启"  inactive-text="关闭" class="switch" v-model="editForm.colUserInfo"></el-switch>
				</el-form-item>
				<el-form-item label="短信验证">
					<span class="describe">发送短信 </span>
					<el-switch :width='60' active-text="开启"  inactive-text="关闭" class="switch" v-model="editForm.smsValidate"></el-switch>
				</el-form-item>
				<el-form-item label="设备地址">
					<span class="describe">收集信息 </span>
					<el-switch :width='60' active-text="开启"  inactive-text="关闭" class="switch" v-model="editForm.colDevAddress"></el-switch>
				</el-form-item>
				<el-divider></el-divider>
				<el-form-item label="滤芯防伪">
					<span class="describe">防伪验证 </span>
					<el-switch :width='60' active-text="开启"  inactive-text="关闭" class="switch" v-model="editForm.filterAntifake"  @change="filterAntifake"></el-switch>
				</el-form-item>
				<el-form-item v-for="(item,index) in productFilter" :key="index" :label="item.name" class="filter">
					<el-switch v-model="item.value" :active-value="true" :inactive-value="false" inactive-text="是否验证" @change="switchSelect(index,item.value)"></el-switch>
				</el-form-item>
				<el-divider></el-divider>
				<el-form-item label="滤芯提醒">
					<span class="describe">到期提醒 </span>
					<el-switch :width='60' active-text="开启"  inactive-text="关闭" class="switch" v-model="editForm.filterAlert" ></el-switch>
				</el-form-item>
				<el-form-item style="margin-top: 10px;">
					<el-button type="primary" @click="submitForm('editForm')">确认</el-button>
					<el-button @click="resetForm('editForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog :title="activeName" width="40%" :visible.sync="dialogFilterVisible">
			<el-form :model="filterForm" status-icon :rules="filterRules" ref="filterForm" label-width="200px" class="demo-ruleForm">
				<p class="title">{{filterForm.productModel}}</p>
				<el-form-item v-for="(item,index) in filterForm.filterErps" :key="index" :label="item.name+'(filter'+item.attrIndex+')'">
					<el-select v-model="item.erpItemCode" style="width:90%;" multiple collapse-tags filterable placeholder="支持模糊查询滤芯"
					 @change="selectFilter()">
						<el-option label="万能产品" value="universal"></el-option>
						<el-option v-for="(code,index) in filterList" :key="code.value" :label="code.itemName+'('+code.itemCode+')'"
						 :value="code.itemCode">
						</el-option>
					</el-select>
				</el-form-item>
				<p v-if="hint" class="hint">暂无滤芯</p>
				<el-form-item>
					<el-button type="primary" @click="submitForm('filterForm')">确认</el-button>
					<el-button @click="resetForm('filterForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog :title="activeName" width="70%" class="editor" :visible.sync="dialogSetVisible">
			<el-form :model="filterForm" status-icon :rules="editForm" ref="editForm" label-width="20px" class="demo-ruleForm">
				<el-form-item>
					<div class="tab">
						<div class="menu">
							<p>页面列表</p>
							<el-tabs tab-position="left" v-model="editableTabsValue" @tab-click="handleClick">
								<el-tab-pane label="激活帮助页面" name="first"></el-tab-pane>
								<el-tab-pane label="滤芯安装引导" name="second"></el-tab-pane>
								<el-tab-pane label="蓝牙权限引导" name="third"></el-tab-pane>
							</el-tabs>
						</div>
						<div class="set">
							<p><span>页面编辑</span></p>
							<el-button class="setDefault" size="mini" type="primary" @click="setDefaultForm()">设为默认值</el-button>
							<editor :content="richText" ref="editors"></editor>
						</div>
					</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('editForm')">确认</el-button>
					<el-button @click="resetForm('editForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import breadcrumb from "../../components/breadcrumb.vue"
	import modelBar from "../../components/modelBar.vue"
	import search from "../../components/searchList.vue"
	import tablePage from "../../components/table.vue"
	import pagination from "../../components/pagination.vue"
	import editor from '../../components/editor.vue'
	export default {
		data() {
			return {
				navigation: [{
						name: "配置中心",
						path: ""
					},
					{
						name: "产品设置",
						path: ""
					}
				],
				searchParams: {
					activate: null,
					isUser: null,
					isNote: null,
					address: null,
					filterAntifake: null,
					filterAlert: null,
					status: null,
					filterCode: null
				},
				searchList: [{
						label: "是否激活",
						prop: "activate",
						type: 'select',
						options: [{
							label: "是",
							value: 1
						}, {
							label: "否",
							value: 0
						}]
					},
					{
						label: "用户信息",
						prop: "colUserInfo",
						type: 'select',
						options: [{
							label: "收集",
							value: 1
						}, {
							label: "不收集",
							value: 0
						}]
					},
					{
						label: "短信验证",
						prop: "smsValidate",
						type: 'select',
						options: [{
							label: "开启",
							value: 1
						}, {
							label: "关闭",
							value: 0
						}]
					},
					{
						label: "设备地址",
						prop: "colDevAddress",
						type: 'select',
						options: [{
							label: "收集",
							value: 1
						}, {
							label: "不收集",
							value: 0
						}]
					},
					{
						label: "滤芯防伪",
						prop: "filterAntifake",
						type: 'select',
						options: [{
							label: "验证",
							value: 1
						}, {
							label: "不验证",
							value: 0
						}]
					},
					{
						label: "滤芯提醒",
						prop: "filterAlert",
						type: 'select',
						options: [{
							label: "开启",
							value: 1
						}, {
							label: "关闭",
							value: 0
						}]
					},
					{
						label: "产品状态",
						prop: "inUse",
						type: 'select',
						options: [{
							label: "启用",
							value: 1
						}, {
							label: "禁用",
							value: 0
						}]
					},
					{
						label: "产品型号",
						prop: "productKey",
						type: 'select',
						type: 'select',
						filterable: true,
						options: []
					}
				],
				loading: true,
				tableDable: [],
				productFilter: [],
				columns: [{
						prop: 'productModel',
						label: '产品型号',
						align: 'left',
					},
					{
						prop: 'activate',
						label: '是否激活',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.activate ? "是" : "否")
						}
					},
					{
						prop: 'colUserInfo',
						label: '用户信息',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.colUserInfo ? "收集" : "不收集")
						}
					},
					{
						prop: 'smsValidate',
						label: '短信验证',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.smsValidate ? "开启" : "关闭")
						}
					},
					{
						prop: 'colDevAddress',
						label: '设备地址',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.colDevAddress ? "收集" : "不收集")
						}
					},
					{
						prop: 'filterAntifake',
						label: '滤芯防伪',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.filterAntifake ? "验证" : "不验证")
						}
					},
					{
						prop: 'filterAlert',
						label: '滤芯提醒',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.filterAlert ? "开启" : "关闭")
						}
					},
					{
						prop: 'inUse',
						label: '产品状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									type: params.row.inUse ? '' : 'danger'
								} // 组件的props
							}, params.row.inUse ? "启用" : "禁用")
						}
					},
					{
						prop: 'hadFileNum',
						label: '配置文件',
						align: 'left',
						render: (h, params) => {
							return h('span', [
								h('el-link', {
									props: {
										type: 'primary',
									},
									on: {
										click: () => {
											this.set(params.row)
										}
									}
								}, params.row.fileNum + '/3'),
							])
						}
					},
					{
						label: '操作',
						width: 200,
						align: 'left',
						fixed: "right",
						operates: [{
								label: '编辑',
								type: 'primary',
								disabled: false,
								method: (index, row) => {
									this.edit(row)
								}
							},
							{
								label: '滤芯',
								type: 'primary',
								disabled: false,
								method: (index, row) => {
									this.filter(row)
								}
							},
							{
								label: '禁用',
								type: 'primary',
								disabled: false,
								render: (h, params) => {
									return h('span', [
										h('el-link', {
											props: {
												type: 'primary',
											},
											on: {
												click: () => {
													this.end(params.row)
												}
											}
										}, params.row.inUse ? '禁用' : '启用'),
									])
								}
							}
						]
					}
				],
				activeName: "编辑",
				dialogEditVisible: false,
				dialogFilterVisible: false,
				dialogSetVisible: false,
				hint: false,
				guideType: null, //ACTIVATION:激活 INSTALL:安装 BLUETOOTH:蓝牙
				richText: null,
				id: null,
				editForm: {
					productKey: "沁园1号",
					productModel: null,
					activate: null,
					isUser: null,
					isNote: null,
					address: null,
					filterAntifake: null,
					filterAlert: null,
					status: null,
				},
				filterForm: {
					productModel: null,
					productKey: null,
					filterErps: []
				},
				editRules: {},
				filterRules: {},
				filterList: [],
				editableTabsValue: "first",
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
			pagination,
			editor
		},
		created() {
			this.$store.commit('updateTime');
			this.getProductList();
			this.getProductModel();
			this.getERPlist();
		},
		methods: {
			getERPlist() {
				let api = this.$Api.manage_getErpCodeList;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						this.filterList = res.data;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			submitForm(formName) {
				if (formName == "searchParams") {
					this.page = 1;
					this.limit = 10;
					this.getProductList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = "";
							let data = {};
							let obj = {};
							this.productFilter.forEach((item, index) => {
								obj[item.identifier] = item.value;
							})
							if (this.activeName == "产品设置") {
								api = this.$Api.manage_productSet_updateSetting;
								data = {
									filterAntifakeMap: obj,
									...this.editForm
								}
								this.$Axios.post(api, {
									productSetting: JSON.stringify(data)
								}).then((res) => {
									if (res.success) {
										this.$message({
											message: "操作成功",
											type: 'success'
										});
										this.dialogEditVisible = false;
										this.getProductList();
									} else {
										this.$message({
											message: res.msg,
											type: 'warning'
										});
									}
								})
							}
							if (this.activeName == "滤芯设置") {
								api = this.$Api.manage_number_updateFilterErp;
								let filterErps = this.filterForm.filterErps;
								let filters = {};
								for (let i in filterErps) {
									filters[filterErps[i].identifier] = {};
									for (let j in filterErps[i].erpItemCode) {
										this.filterList.map(ele => {
											if (ele.itemCode == filterErps[i].erpItemCode[j]) {
												filters[filterErps[i].identifier][filterErps[i].erpItemCode[j]] = ele.itemName;
											}
										})
									}
								}
								let data = {
									productKey: this.filterForm.productKey,
									filters: filters
								}
								this.$Axios.post(api, {
									productFilterStr: JSON.stringify(data)
								}).then((res) => {
									if (res.success) {
										this.$message({
											message: "操作成功",
											type: 'success'
										});
										this.dialogFilterVisible = false;
										this.getProductList();
									} else {
										this.$message({
											message: res.msg,
											type: 'warning'
										});
									}
								})
							}
							if (this.activeName == "产品配置") {
								api = this.$Api.manage_guideUpload;
								data = {
									richText: this.$refs.editors.getContent(),
									identityId: this.id,
									guideType: this.guideType,
								}
								this.$Axios.post(api, data).then((res) => {
									if (res.success) {
										this.$message({
											message: "操作成功",
											type: 'success'
										});
										this.dialogSetVisible = false;
										this.getProductList();
									} else {
										this.$message({
											message: res.msg,
											type: 'warning'
										});
									}
								})
							}
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				}
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.searchParams = {
						activate: null,
						isUser: null,
						isNote: null,
						address: null,
						filterAntifake: null,
						filterAlert: null,
						status: null,
						filterCode: null
					}
					this.page = 1;
					this.limit = 10;
					this.getProductList();
				} else {
					this.$refs[formName].resetFields();
					this.dialogEditVisible = false;
					this.dialogFilterVisible = false;
					this.dialogSetVisible = false;
				}
			},
			setDefaultForm() {
				let title = this.editableTabsValue == "first" ? "激活帮助页面" : this.editableTabsValue == "second" ? "滤芯安装页面" : "蓝牙权限引导";
				this.$confirm('确定要将该产品' + title + '设置为默认值?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.setDefaultGuide();
				}).catch((res) => {});
			},
			formatDate(res) {
				if (res == null) {
					return '--';
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
			switchSelect(i, bool) {
				this.productFilter[i].value = bool ? true : false;
				let index = 0
				this.productFilter.forEach((item, j) => {
					if (item.value) {
						index++
					}
					if (index > 0) {
						this.editForm.filterAntifake = true;
					} else {
						this.editForm.filterAntifake = false;
					}
				})
				this.$forceUpdate();
			},
			selectFilter() {
				this.$forceUpdate();
			},
			update() {
				let api = this.$Api.manage_productSet_fresh;
				this.$Axios.post(api).then((res) => {
					if (res.success) {
						this.$message({
							message: "刷新成功",
							type: 'success'
						});
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			handleClick(tab, event) {		
				this.$refs.editors.clearContent();
				switch (tab.name) {
					case "first":
						this.guideType = "ACTIVATION";
						this.getGuide()
						break
					case "second":
						this.guideType = "INSTALL";
						this.getGuide()
						break
					case "third":
						this.guideType = "BLUETOOTH";
						this.getGuide()
						break
				};
			},
			edit(row) {
				this.editForm = {
					productModel: row.productModel,
					productKey: row.productKey,
					activate: row.activate,
					inUse: row.inUse,
					smsValidate: row.smsValidate,
					colDevAddress: row.colDevAddress,
					filterAntifake: row.filterAntifake,
					filterAlert: row.filterAlert,
					colUserInfo: row.colUserInfo,
				}
				this.activeName = "产品设置";
				this.getProductFilter(row.productKey, "edit");
			},
			filter(row) {
				this.activeName = "滤芯设置";
				this.filterForm = {
					productKey: row.productKey,
					productModel: row.productModel,
					filterErps: [],
				}
				this.getProductFilter(row.productKey, "filter");
			},
			set(row) {
				this.activeName = "产品配置";
				this.dialogSetVisible = true;
				this.editableTabsValue = "first";
				this.id = row.productKey;
				this.guideType = "ACTIVATION";
				this.getGuide()
			},
			getGuide() {
				let api = this.$Api.manage_getGuide;
				let that=this;
				this.$Axios.get(api, {
					params: {
						identityId: this.id,
						guideType: this.guideType
					}
				}).then((res) => {
					if (res.success) {
						that.richText = res.data;
						this.$refs.editors.setContent();
					} else {
						this.$message({
							message: res.msg,
							type: 'warning'
						});
					}
				})
			},
			setDefaultGuide() {
				let api = this.$Api.manage_setDefaultGuide;
				this.$Axios.post(api, {
					richText: this.$refs.editors.getContent(),
					guideType: this.guideType
				}).then((res) => {
					if (res.success) {
						this.$message({
							message: "操作成功",
							type: 'success'
						});
						this.dialogSetVisible = false;
						this.getProductList();
					} else {
						this.$message({
							message: res.msg,
							type: 'warning'
						});
					}
				})
			},
			getProductFilter(productKey, method) {
				this.$Axios.get(this.$Api.manage_productSet_filters, {
					params: {
						productKey: productKey,
					}
				}).then((res) => {
					if (res.success) {
						this.hint = res.data.length == 0 ? true : false;
						for (let i in res.data) {
							this.productFilter[i] = {
								name: res.data[i].name,
								identifier: res.data[i].identifier,
								value: res.data[i].antifake == null ? false : res.data[i].antifake,
							}
							this.filterForm.filterErps[i] = {
								attrIndex: res.data[i].attrIndex,
								name: res.data[i].name,
								identifier: res.data[i].identifier,
								erpItemCode: res.data[i].erpItemCodes,
							}
						}
						if (method == "edit") {
							this.dialogEditVisible = true;
						} else {
							this.dialogFilterVisible = true;
						}
					} else {
						this.$message({
							message: res.msg,
							type: 'warning'
						});
					}
				})
			},
			filterAntifake() {
				for (let i in this.productFilter) {
					this.productFilter[i].value = this.editForm.filterAntifake
				}
			},
			end(row) {
				let activeName = row.inUse ? "禁用" : "启用";
				this.$confirm('确定要' + activeName + '该产品?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$Axios.post(this.$Api.manage_productSet_updateInUse, {
						productSetting: JSON.stringify({
							"inUse": row.inUse ? false : true,
							"productKey": row.productKey
						})
					}).then((res) => {
						if (res.success) {
							this.$message.success("操作成功")
							this.getProductList();
						} else {
							this.$message({
								message: res.msg,
								type: 'warning'
							});
						}
					})
				}).catch((res) => {});
			},
			getProductModel() {
				let api = this.$Api.manage_getProductList;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						let list = [];
						for (let i in res.data) {
							list[i] = {
								label: res.data[i].productModel,
								value: res.data[i].productKey,
							}
						}
						this.searchList[7].options = list;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			getProductList() {
				let api = this.$Api.manage_productSet_list;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						...this.searchParams
					}
				}).then((res) => {
					this.loading = false;
					if (res.success) {
						this.tableDable = res.data;
						this.total = res.total;
					} else {
						this.$message({
							message: res.msg,
							type: 'warning'
						});
					}
				}).catch((res) => {
					this.$message({
						message: res.msg,
						type: 'warning'
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	.productionSet {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);


		}

		.el-divider--horizontal {
			margin: 10px 0px;
		}

		.edit {
	.describe{
		color: #1F9AD6;
		margin-right: 5px;
	}

			.el-form-item__label {
				text-align: left;
				margin-left: 10px;
			}
		.el-form-item__content {
				float: right;
				margin-right: 20px;			
			}
			.filter {
				.el-form-item__label {
					color: #1F9AD6;
				}
			}
			.switch .el-switch__label {
			    position: absolute;
			    color: #fff !important;
			    z-index: 1;
			    display: none;
			}
			.switch .is-active{
			    display: block;
			}
			.switch .el-switch__label--left span{
			    margin-left: 20px;
			}
			
		}

		.title {
			margin-left: 25px;
			font-weight: bold;
			line-height: 30px;
		}

		.hint {
			text-align: center;
		}

		.editor {
			.el-button {
				float: right;
				margin-right: 10px;
			}
		}

		.tab {
			width: 100%;
			display: block;

			.menu {
				width: 130px;
				height: 250px;
				float: left;
				font-weight: bold;

			}

			.set {
				float: right;
				width: calc(100% - 130px);
				min-width: 700px;
				height: 420px;
				position: relative;

				span {
					font-weight: bold;
				}

				.setDefault {
					position: absolute;
					right: 0px;
					top: 10px;
				}
			}

		}
	}
</style>
