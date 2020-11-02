<template>
	<div class="digitalManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="设备信息"></model-bar>
			<el-button v-if="source==2" size="small" class="edit" type="primary" @click="edit">编辑</el-button>
			<table-page :loading="loading" :tableDable="deviceDetail" :columns="deviceColumns"></table-page>
		</div>
		<div class="content">
			<model-bar title="用户信息"></model-bar>
			<table-page :tableDable="userInfo" :columns="userColumns"></table-page>
		</div>
		<div v-if="source==2" class="content">
			<model-bar title="权限管理"></model-bar>
			<table-page :tableDable="deviceDetail" :columns="limitColumns"></table-page>
		</div>
		<div class="content">
			<model-bar title="滤芯列表"></model-bar>
			<table-page :tableDable="numberCodeList" :columns="filterColumns"></table-page>
		</div>
		<el-dialog :title="activeName" width="30%"   class="eidt" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<div class="switch">
					<el-form-item label="激活状态" prop="activateStatus">
						<el-switch  :width='75' active-text="激活"  inactive-text="未激活"  v-model="ruleForm.activateStatus"></el-switch>
					</el-form-item>
					<el-divider></el-divider>
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
				</div>
				<el-divider></el-divider>
				<el-form-item label="用户姓名" prop="userName">
					<el-input v-model.trim="ruleForm.userName" placeholder="请输入用户姓名" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="用户性别" prop="userGender">
					<el-select class="select" v-model="ruleForm.userGender" placeholder="请选择用户性别">
						<el-option label="男" value="1"></el-option>
						<el-option label="女" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系方式" prop="userPhone">
					<el-input v-model.trim="ruleForm.userPhone" placeholder="请输入联系方式" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="省市区" prop="address">
					<el-cascader v-model="ruleForm.address" clearable  :options="addressList"></el-cascader>				
				</el-form-item>
				<el-form-item label="详细地址" prop="devAddress">
					<el-input v-model.trim="ruleForm.devAddress" placeholder="请输入设备地址" autocomplete="off" clearable></el-input>
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
						name: this.source == 1 ? "设备列表" : "设备配置",
						path: this.source == 1 ? "/deviceList" : "/deviceManage"
					},
					{
						name: "设备详情",
						path: ""
					}
				],
				source: this.$route.params.source,
				addressList:addressList,
				deviceDetail: [],
				userInfo: [],
				numberCodeList:[],
				activeName: "编辑",
				dialogFormVisible: false,
				ruleForm: {
					activateStatus: false,
					colUserInfo: false,
					smsValidate: false,
					colDevAddress: false,
					userPhone: null,
					devAddress: null,
					userGender: null,
					userName: null,
					address: [],
				},
				rules: {
					activateStatus: [{
						required: false,
						message: '请选择激活状态',
						trigger: 'change'
					}],
					userPhone: [{
						required: true,
						validator: checkPhone,
						trigger: 'blur'
					}],
					userGender: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					userName: [{
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
						message: '请输入详细地址',
						trigger: 'blur'
					}]
				},
				deviceColumns: [{
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
						prop: 'activateDate',
						label: '激活日期',
						align: 'left',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.activateDate))
						}
					},
					{
						prop: '',
						label: '设备地址',
						align: 'left',
						render: (h, params) => {
							return h('span', this.getAddress(params.row, params.row.provinceCode, params.row.cityCode, params.row.areaCode))
						}
					},
					{
						prop: '',
						label: '默认地址',
						align: 'left',
						render: (h, params) => {
							return h('span', this.getAddress(params.row, params.row.provinceCodeAuto, params.row.cityCodeAuto, params.row.areaCodeAuto))
						}
					}
				],
				userColumns: [{
						prop: 'name',
						label: '用户姓名',
						align: 'left',
					},
					{
						prop: 'gender',
						label: '用户性别',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.gender == undefined ? "--" : params.row.gender == 1 ? "男" : "女")
						}
					},
					{
						prop: 'phone',
						label: '手机号码',
						align: 'left',

					},
					{
						prop: '',
						label: '用户地址',
						align: 'left',
						render: (h, params) => {
							return h('span', this.getAddress(params.row, params.row.provinceCode, params.row.cityCode, params.row.areaCode))
						}
					}
				],
				limitColumns: [{
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
						prop: 'devAddress',
						label: '设备地址',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.colDevAddress ? "收集" : "不收集")
						}
					}
				],
				filterColumns: [{
						prop: 'encrNumber',
						label: '滤芯数码',
						align: 'left',				
					},
					{
						prop: '',
						label: '滤芯型号',
						align: 'left',	
						render: (h, params) => {
							return h('span',params.row.erpProductName==null?"万能产品":params.row.erpProductName)
						}				
					},
					{
						prop: 'activeTime',
						label: '激活时间',
						align: 'left',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.activeTime))
						}
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
			this.getDeviceDetail();
		},
		methods: {
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
			getAddress(row, provinceCode, cityCode, areaCode) {
				if (provinceCode == null || cityCode == null || areaCode == null) {
					return "--";
				} else if (citys.province_list[Number(provinceCode)] == undefined || citys.city_list[Number(cityCode)] ==
					undefined || citys.county_list[Number(areaCode)] == undefined) {
					return "--";
				} else if (row.devAddress == null) {
					return citys.province_list[Number(provinceCode)] + citys.city_list[Number(cityCode)] + citys.county_list[
						Number(areaCode)];
				} else {
					return citys.province_list[Number(provinceCode)] + citys.city_list[Number(cityCode)] + citys.county_list[
						Number(areaCode)] + row.devAddress;
				}
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let api = this.$Api.manage_device_update;
						let city=this.ruleForm.address;
						this.ruleForm.provinceCode=city[0];
						this.ruleForm.cityCode=city[1];
						this.ruleForm.areaCode=city[2];
						delete this.ruleForm.address;
						this.$Axios.post(api,{
							deviceAttr: JSON.stringify(this.ruleForm)
						}).then((res) => {
							if (res.success) {
								this.$message({
									message: "操作成功",
									type: 'success'
								});
								this.dialogFormVisible = false;
								this.getDeviceDetail();
							} else {
								this.$message({
									message: res.msg,
									type: 'warning'
								});
							}
						})
					}
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.dialogFormVisible = false;
			},
			edit() {
				this.ruleForm = {
					activateStatus: this.deviceDetail[0].activateStatus,
					colUserInfo: this.deviceDetail[0].colUserInfo,
					smsValidate: this.deviceDetail[0].smsValidate,
					colDevAddress: this.deviceDetail[0].colDevAddress,
					userPhone: this.userInfo[0].phone,
					devAddress: this.deviceDetail[0].devAddress,
					userGender: this.userInfo[0].gender,
					userName: this.userInfo[0].name,
					sncode: this.deviceDetail[0].sncode,
					identityId: this.$route.params.id,
					productKey: this.deviceDetail[0].productKey,
					address: [this.deviceDetail[0].provinceCode,this.deviceDetail[0].cityCode,this.deviceDetail[0].areaCode]
				};
				this.dialogFormVisible = true;
			},
			getDeviceDetail() {
				let api = this.$Api.manage_device_detail;
				this.$Axios.get(api, {
					params: {
						identityId: this.$route.params.id,
						productKey: this.$route.params.productKey,
					}
				}).then((res) => {
					this.loading = false;
					if (res.success) {
						this.deviceDetail = [];
						this.userInfo = [];
						this.deviceDetail.push(res.data.deviceDetail);
						this.userInfo.push(res.data.userInfo == null ? {} : res.data.userInfo);
						this.numberCodeList=res.data.numberCodeList;
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
			position: relative;
            
			.edit {
				position: absolute;
				top: 15px;
				right: 20px;
			}
		}
		.switch {					
		    .describe{
				color: #1F9AD6;
				margin-right: 5px;
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
</style>
