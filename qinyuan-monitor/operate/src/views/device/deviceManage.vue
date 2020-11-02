<template>
	<div class="digitalManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="设备管理"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="批量管理" @add="batchManage"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getdeviceList" />
		</div>
		<el-dialog :title="activeName" width="30%" class="eidt" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="激活状态" prop="activateStatus">
					<el-select class="select" v-model="ruleForm.activateStatus" placeholder="请选择激活状态">
						<el-option v-for="item in activateStatus" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<div class="switch">
					<el-form-item label="用户信息" prop="colUserInfo">
						<span class="describe">需要收集 </span>
						<el-switch  :width='60' active-text="开启"  inactive-text="关闭" class="switch" v-model="ruleForm.colUserInfo"></el-switch>
					</el-form-item>
					<el-form-item label="短信验证"  prop="smsValidate">
						<span class="describe">发送短信 </span>
						<el-switch  :width='60' active-text="开启" inactive-text="关闭" class="switch"  v-model="ruleForm.smsValidate"></el-switch>
					</el-form-item>
					<el-form-item label="设备地址" prop="colDevAddress">
						<span class="describe">收集信息 </span>
						<el-switch  :width='60' active-text="开启" inactive-text="关闭" class="switch" v-model="ruleForm.colDevAddress"></el-switch>
					</el-form-item>
					<el-form-item label="用户信息">
						<el-button type="text" @click="userSet">设置</el-button>
					</el-form-item>
				</div>
				<el-divider></el-divider>
				<div v-if="userInfo" key="1">
					<el-form-item label="用户姓名" prop="username">
						<el-input v-model.trim="ruleForm.username" placeholder="请输入用户姓名" autocomplete="off" clearable></el-input>
					</el-form-item>
					<el-form-item label="用户性别" prop="userGender">
						<el-select class="select" v-model="ruleForm.userGender" placeholder="请选择用户性别">
							<el-option label="男" value="1"></el-option>
							<el-option label="女" value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="联系方式" prop="userPhone">
						<el-input v-model.trim="ruleForm.userPhone" placeholder="请输入联系方式" autocomplete="off" clearable></el-input>
					</el-form-item>
					<el-form-item label="省市区" prop="address">
						<el-cascader v-model="ruleForm.address" clearable :options="addressList"></el-cascader>				
					</el-form-item>
					<el-form-item label="设备地址" prop="devAddress">
						<el-input v-model.trim="ruleForm.devAddress" placeholder="请输入设备地址" autocomplete="off" clearable></el-input>
					</el-form-item>
					<el-divider></el-divider>
				</div>
				<el-form-item label="设备SN导入" prop="sncodeList">
					<el-input type="textarea" :autosize="{ minRows:5, maxRows: 6}" maxlength="1000" show-word-limit v-model="ruleForm.sncodeList"
					 placeholder="请输入需要进行操作的设备SN,以空格进行区分"></el-input>
					<div class="readFile">
						<el-button size="mini" type="primary" @click="handleClick">文件导入</el-button>
						<input type="file" style="opacity: 0;width: 0px;" ref="readFile" @change="readFiles" />
					</div>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
					<el-button @click="resetForm('ruleForm')">取消</el-button>
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
	import citys from "../../assets/js/area.js"
	import addressList from "../../assets/js/address.js"
	export default {	
		data() {	
			let checkPhone = (rule, value, callback) => {
				const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
				if (!value) {
					return callback(new Error('电话号码不能为空'))
				}
				setTimeout(() => {
					if (!Number.isInteger(+value)) {
						callback(new Error('请输入数字值'))
					} else {
						if (phoneReg.test(value)) {
							callback()
						} else {
							callback(new Error('电话号码格式不正确'))
						}
					}
				}, 100)
			}
			return {
				navigation: [{
						name: "设备管理",
						path: ""
					},
					{
						name: "设备配置",
						path: ""
					}
				],
				searchList: [{
						label: "设备SN",
						prop: "sncode",
						type: 'input',
					},
					{
						label: "设备MAC",
						prop: "identityId",
						type: 'input',
					},
					{
						label: "用户号码",
						prop: "userPhone",
						type: 'input',
					},
					{
						label: "设备型号",
						prop: "productKey",
						type: 'select',
						filterable: true,
						options: []
					}
				],
				searchParams: {
					sncode: null,
					identityId: null,
					userPhone: null,
					productKey: null,
				},
				activateStatus: [{
					label: "未激活",
					value: 0
				}, {
					label: "已激活",
					value: 1
				}],
				userInfo: false,
				activeName: "设备配置",
				addressList:addressList,
				tableDable: [],
				dialogFormVisible: false,
				ruleForm: {
					activateStatus: null,
					colUserInfo: false,
					smsValidate: false,
					colDevAddress: false,
					sncodeList: null,
					userPhone: null,
					devAddress: null,
					userGender: null,
					username: null,
					address:[],
				},
				rules: {
					activateStatus: [{
						required: true,
						message: '请选择激活状态',
						trigger: 'change'
					}],					
					userPhone: [{
						required:true,
					    validator: checkPhone,
						trigger: 'blur'
					}],
					userGender: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					username: [{
						required: true,
						message: '请输入用户姓名',
						trigger: 'blur'
					}],
					address: [{
						type: 'array',
						required: true,
						message: '请选择省市区',
						trigger: 'change'
					}],
					devAddress: [{
						required: true,
						message: '请输入设备地址',
						trigger: 'blur'
					}],
					sncodeList: [{
						required: true,
						message: '请输入操作的设备SN',
						trigger: 'blur'
					}]
				},
				columns: [{
						prop: 'sncode',
						label: '设备SN',
						align: 'left',
					},
					{
						prop: 'identityId',
						label: '设备MAC',
						align: 'left',
					},
					{
						prop: 'userPhone',
						label: '用户号码（激活）',
						align: 'left',
					},
					{
						prop: 'productModel',
						label: '设备型号',
						align: 'left',
					},
					{
						prop: '',
						label: '设备地址',
						align: 'left',
						render: (h, params) => {
							return h('span', this.getAddress(params.row))
						}
					},
					{
						label: '操作',
						width: 100,
						align: 'left',
						fixed: "right",
						operates: [{
								label: '详情',
								type: 'primary',
								disabled: false,
								method: (index, row) => {
									this.detail(row)
								}
							 },
							// {
							// 	label: '删除',
							// 	type: 'primary',
							// 	disabled: false,
							// 	method: (index, row) => {
							// 		this.delete(row)
							// 	}
							// }
						]
					}
				],
				loading: true,
				page: 1,
				limit: 10,
				total: 0
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
			this.getdeviceList();
			this.getProductModel();
		},
		methods: {
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
						this.searchList[3].options = list;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			batchManage() {
				this.dialogFormVisible = true;
				this.$nextTick(() => {
					this.$refs["ruleForm"].resetFields();
				})
			},
			userSet(){
				this.userInfo=!this.userInfo;
			},
			detail(row) {
				this.$router.push("/deviceDetail/" + row.identityId + "/" + row.productKey + "/2")
			},
			delete(row) {
				this.$confirm('确定要删除该设备?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_device_delete;
					this.$Axios.post(api, {
						identityId:row.identityId,
						productKey:row.productKey,
						}).then((res) => {
						if (res.success) {
							this.$message({
								message: "删除成功",
								type: 'success'
							});
							this.getdeviceList();
						} else {
							this.$message({
								message: res.msg,
								type: 'warning'
							});
						}
					})
				}).catch(() => {});
			},
			submitForm(formName) {
				if (formName == "searchParams") {
					this.page=1;
					this.limit=10;
					this.getdeviceList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = this.$Api.manage_device_batchUpdate;
							let data = {};
							if (this.userInfo) {
								let city=this.ruleForm.address;
								data={
									activateStatus: this.ruleForm.activateStatus,
									colUserInfo: this.ruleForm.colUserInfo,
									smsValidate: this.ruleForm.smsValidate,
									colDevAddress: this.ruleForm.colDevAddress,
									sncodeList:this.getSNcode(this.ruleForm.sncodeList),
									provinceCode:city[0],
									cityCode:city[1],
									areaCode:city[2],		
								};															
								delete this.ruleForm.address;							
							}else {
								data = {
									activateStatus: this.ruleForm.activateStatus,
									colUserInfo: this.ruleForm.colUserInfo,
									smsValidate: this.ruleForm.smsValidate,
									colDevAddress: this.ruleForm.colDevAddress,
									sncodeList:this.getSNcode(this.ruleForm.sncodeList)
								};
							}
							this.$Axios.post(api, {
								deviceAttr: JSON.stringify(data)
							}).then((res) => {							
								if (res.success) {
									this.$message({
										message: "操作成功",
										type: 'success'
									});
									this.dialogFormVisible = false;
									this.userInfo=false;
									this.getdeviceList();
								}else {
									this.$message({
										message: res.message,
										type: 'warning'
									});
								}
							})
						}
					})
				}
			},
			getAddress(row) {
				if (row.provinceCode == null || row.cityCode == null || row.areaCode == null) {
					return "--";
				} else if (citys.province_list[Number(row.provinceCode)] == undefined || citys.city_list[Number(row.cityCode)] ==
					undefined || citys.county_list[Number(row.areaCode)] == undefined) {
					return "--";
				} else if (row.devAddress == null) {
					return citys.province_list[Number(row.provinceCode)] + citys.city_list[Number(row.cityCode)] + citys.county_list[
						Number(row.areaCode)];
				} else {
					return citys.province_list[Number(row.provinceCode)] + citys.city_list[Number(row.cityCode)] + citys.county_list[
						Number(row.areaCode)] + row.devAddress;
				}
			},
			getSNcode(data){
				let list=[];
				list=data.split(" "); //字符分割 
				return list
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.page=1;
					this.limit=10;
					this.searchParams = {
						sncode: null,
						identityId: null,
						userPhone: null,
						productKey: null,
					}
					this.getdeviceList();
				} else {
					this.$refs[formName].resetFields();
					this.dialogFormVisible=false;
				}
			},
			handleClick() {
				this.$refs.readFile.dispatchEvent(new MouseEvent('click'));
			},
			readFiles(e) {
				let that = this;
				const selectedFile = e.target.files[0]
				const reader = new FileReader();
				reader.onload = function() {
					if (reader.result) {
						that.ruleForm.sncodeList = reader.result;
					}
				};
				reader.readAsText(selectedFile, 'GBK')
			},
			getdeviceList() {
				let api = this.$Api.manage_device_list;
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
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			}
		}
	}
</script>

<style lang="scss">
	.digitalManage {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
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

		.eidt {
			.el-dialog__body {
				max-height: 580px;
				overflow-y: auto;
			}

			.el-dialog__body::-webkit-scrollbar {
				width: 0;
			}

			.set {
				color: #1F9AD6;
				cursor: pointer;
			}

			.el-divider--horizontal {
				margin: 10px 0px;
			}

			.switch {
				.el-form-item__content {
					float: right;
					margin-right: 10px;
				}
                .describe{
					color: #1F9AD6;
					margin-right: 5px;
				}
			}
		}
	}
</style>
