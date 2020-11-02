<template>
	<div class="customer">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="searchBox">
			<img class="searchBg" src="../../assets/image/customer_service_pic_search_top_bg.png" alt="搜索">
			<p class="title">搜索</p>
			<div class="searchForm">
				<el-input class="searchInput" placeholder="请输入设备SN码/MAC地址/滤芯数码/用户手机号码" v-model.trim="itemIdentifyId"
				 @keyup.enter.native="search"></el-input>
				<el-button class="searchButton" size="medium" type="primary" @click="search">搜 索</el-button>
			</div>
		</div>
		<div class="searchContent">
			<model-bar title="搜索结果"></model-bar>
			<el-button v-if="searchResult==2" class="reset" size="medium" type="primary" @click="addResetNum">增加复位次数</el-button>
			<div class="scanResult">
				<div class="scanBox" v-if="searchResult==0">
					<img src="../../assets/image/blank_no_data.png" alt="扫描结果">
					<p class="scanHint">暂无数据，请输入查询</p>
				</div>
				<div v-else>
					<div class="resultTable" v-if="searchResult==1">
						<search :searchList="userSearchList" :searchParams="userSearchParams" formName="userSearch" @resetForm="resetForm"
						 @submitForm="submitForm"></search>
						<table-page :tableDable="userDate" emptyText="暂无数据，请输入信息查询" :columns="userColumns"></table-page>
					</div>
					<div class="resultTable" v-else-if="searchResult==2">
						<table-page :tableDable="codeDate" :columns="codeColumns"></table-page>
					</div>
					<div class="resultTable" v-else>
						<search :searchList="deviceSearchList" :searchParams="deviceSearchParams" formName="deviceSearch" @resetForm="resetForm"
						 @submitForm="submitForm"></search>
						<table-page :tableDable="deviceDate" :columns="deviceColumns"></table-page>
						<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getDeviceList" />
					</div>
				</div>
			</div>
		</div>
		<!-- 数码下发复位 -->
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogFilterVisible">
			<el-form :model="filterForm" status-icon :rules="filterrules" ref="filterForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="滤芯数码">
					<span>{{filterForm.filterCode}}</span>
				</el-form-item>
				<el-form-item label="滤芯型号">
					<span v-if="filterForm.erpCode==null">万能产品</span>
					<span v-else>{{filterForm.erpName}}</span>
				</el-form-item>
				<el-form-item label="设备信息" prop="mac">
					<el-input v-model.trim="filterForm.mac" placeholder="请输入复位设备SN/MAC" autocomplete="off" @blur="searchDevice"></el-input>
				</el-form-item>
				<el-form-item label="用户手机" prop="userPhone">
					<el-input v-model.number="filterForm.userPhone" placeholder="请输入用户手机" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="复位型号" prop="deviceFilterId">
					<el-select class="select" v-model="filterForm.deviceFilterId"   value-key="attrIndex" clearable filterable placeholder="请选择复位的产品型号"  :disabled="filterForm.mac==null">
						<el-option v-for="(item,index) in filters" :key="item.attrIndex" :label="item.identifier+'('+item.erpName+')'" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('filterForm')">确认</el-button>
					<el-button @click="resetForm('filterForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 设备下发复位 -->
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogDeviceVisible">
			<el-form :model="deviceForm" status-icon :rules="devicerules" ref="deviceForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="设备SN">
					<span>{{deviceForm.sncode}}</span>
				</el-form-item>
				<el-form-item label="产品型号">
					<span>{{deviceForm.productModel}}</span>
				</el-form-item>
<!-- 				<el-form-item label="用户姓名" prop="userName">
					<el-input v-model.trim="deviceForm.userName" placeholder="请输入用户姓名" autocomplete="off" clearable></el-input>
				</el-form-item> -->
				<el-form-item label="用户手机" prop="userPhone">
					<el-input v-model.number="deviceForm.userPhone" placeholder="请输入用户手机" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('deviceForm')">确认</el-button>
					<el-button @click="resetForm('deviceForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 用户下激活次数 -->
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogUserVisible">
			<el-form :model="userForm" status-icon :rules="userrules" ref="userForm"  class="demo-ruleForm">
				<p class="center">用户{{userForm.phone}}的当前激活次数为：<strong>{{userForm.activationNumber+"/"+userForm.activationTotalCount}}</strong></p>
				<p class="center">是否确定为用户<strong>增加1次</strong>激活次数</p>
				<el-form-item style="text-align: center;">
					<el-button type="primary" @click="submitForm('userForm')">确认</el-button>
					<el-button @click="resetForm('userForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 增加复位次数 -->
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogResetVisible">
			<el-form :model="addForm" status-icon :rules="addrules" ref="addForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="滤芯数码">
					<span>{{addForm.filterCode}}</span>
				</el-form-item>
				<el-form-item label="滤芯型号" >
					<span v-if="addForm.erpCode==null">万能产品</span>
					<span v-else>{{addForm.erpName}}</span>
				</el-form-item>
				<el-form-item label="增加次数" prop="addNumber">
					<span>{{addForm.addNumber}}</span>
				</el-form-item>
				<el-form-item label="用户手机" prop="userPhone">
					<el-input v-model.number="addForm.userPhone" placeholder="请输入用户手机" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('addForm')">确认</el-button>
					<el-button @click="resetForm('addForm')">取消</el-button>
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
			let checkPhoneRule = (rule, value, callback) => {
				const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
				if (value) {		
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
				}else{
					callback()
				}			
			}
			let checkNumber = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('请输入可激活次数'))
				}
				if (!Number.isInteger(+value)) {
					callback(new Error('请输入数字值'))
				} else {
					if (value > 0) {
						callback()
					} else {
						callback(new Error('不能为负数或0'))
					}
				}
			}
			let checkNum = (rule, value, callback) => {	
				if (!value) {
					return callback(new Error('请输入可激活次数'))
				}
				setTimeout(() => {
					if (!Number.isInteger(+value)) {
						callback(new Error('请输入整数'))
					}else if(value < 1) {
					   callback(new Error('最小可激活次数为1'))
					} else {
						callback()
					}
				}, 100)
			}
			return {
				navigation: [{
					name: "客户服务",
					path: ""
				}],
				isShowActiveButton:false,
				editId: "",
				itemIdentifyId: "",
				activeName: "",
				devices: "",
				dialogFilterVisible: false,
				dialogResetVisible: false,
				dialogDeviceVisible: false,
				dialogUserVisible: false,
				tableDable: [],
				filters: [],
				erpList: [],
				filterMessage:undefined,
				filterForm: {
					filterCode: "",
					identityId: null,
					productKey: null,
					deviceFilterId:null,
					userPhone: null,
					sncode: null,
					userName: null,
					taskId: null,
					erpCode:null,
					erpName:null
				},
				addForm: {
					filterCode: "",
					addNumber: 1,
					identityId: "",
					userPhone: null,
					erpCode:null,
					erpName:null
				},
				deviceForm: {
					sncode: "",
					productModel: "",
					userPhone: null,
					userName: null,
				},
				userForm: {
					phone: null,
					activationNumber: 0,
					activationTotalCount: 0,
					count: 1,
				},
				devicerules: {
					userPhone: [{
						required: true,
						validator: checkPhone,
						trigger: 'blur'
					}],
					userName: [{
						required: false,
						message: '请输入用户姓名',
						trigger: 'blur'
					}],
				},
				filterrules: {
					erpCode:[{
						required: false,
						message: '请选择对应的滤芯型号',
						trigger: 'change'
					}],
					mac: [{
						required: true,
						message: '请输入设备信息',
						trigger: 'blur'
					}],
					userPhone: [{
						required: false,
						validator: checkPhoneRule,
						trigger: 'blur'
					}],
					deviceFilterId: [{
						required: true,
						message: '请选择对应的产品滤芯',
						trigger: 'change'
					}],
				},
				addrules: {
					erpCode:[{
						required: false,
						message: '请选择对应的滤芯型号',
						trigger: 'change'
					}],
					userPhone: [{
						required: true,
						validator: checkPhone,
						trigger: 'blur'
					}],
					addNumber: [{
						required: false,
						validator: checkNumber,
						trigger: 'blur'
					}]
				},
				userrules: {
					count: [{
						required: false,
						validator: checkNum,
						trigger: 'blur'
					}]
				},
				searchResult: 0, // 1、手机号码，2、滤芯数码，3、SN码 ，4、MAC地址
				userSearchList: [{
					label: "用户名称",
					prop: "userName",
					type: 'input',
				}, {
					label: "电话号码",
					prop: "phone",
					type: 'input',
				}],
				deviceSearchList: [{
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
						label: "产品型号",
						prop: "productKey",
						type: 'select',
						filterable: true,
						options: []
					}
				],
				userSearchParams: {
					phone: null,
					userName: null
				},
				deviceSearchParams: {
					sncode: null,
					identityId: null,
					userPhone: null,
					productKey: null,
				},
				userColumns: [{
						prop: 'name',
						label: '用户名称',
						align: 'left',
					}, {
						prop: 'phone',
						label: '用户号码',
						align: 'left',
					},
					{
						prop: ' activationNumber',
						label: '激活设备数量',
						align: 'left',
						render: (h, params) => {
							return h('span', (params.row.activationNumber == null ? 0 : params.row.activationNumber) + "/" + (params.row.activationTotalCount ==
								null ? "0" : params.row.activationTotalCount))
						}
					},
					{
						label: '操作',
						align: 'left',
						render: (h, params) => {
							return h('div', [
								h('el-link', {
									props: {
										type: 'primary',
									},
									on: {
										click: () => {
											this.edit(params.row)
										}
									}
								}, '增加可激活设备数量'),
								h('span', {
									style: {
										display: "inline-block",
										width: "1px",
										height: "10px",
										margin: "0px 5px",
										background: "#E8E8E8",
									}
								}),
								h('el-link', {
									props: {
										type: 'primary',
									},
									on: {
										click: () => {
											this.deviceList(params.row)
										}
									}
								}, '设备列表'),
							]);
						}
					}
				],
				deviceColumns: [{
						prop: 'sncode',
						label: '设备SN',
						align: 'left',
						width: 200
					},
					{
						prop: 'identityId',
						label: '设备MAC',
						align: 'left',
					},
					{
						prop: 'productModel',
						label: '产品型号',
						align: 'left',
					},
					{
						prop: 'userPhone',
						label: '激活用户',
						align: 'left',
					},
					{
						prop: 'userName',
						label: '用户名称',
						align: 'left',
					},
					{
						prop: 'activateStatus',
						label: '设备状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									size: 'mini',
									type: params.row.activateStatus ? 'primary' : 'info'

								} // 组件的props
							}, params.row.activateStatus ? '已激活' : '未激活')
						}
					},
					{
						label: '操作',
						width: 250,
						align: 'left',
						render: (h, params) => {
							return h('div', [
								h('el-link', {
									props: {
										type: 'primary',
									},
									on: {
										click: () => {
											this.activateLog(params.row)
										}
									}
								}, '激活记录'),
								h('span', {
									style: {
										display: params.row.activateStatus ? "none" : "inline-block",
										width: "1px",
										height: "10px",
										margin: "0px 5px",
										background: "#E8E8E8",
									}
								}),
								h('el-link', {
									props: {
										type: 'primary',
									},
									style: {
										display: params.row.activateStatus ? "none" : "inline-block",
									},
									on: {
										click: () => {
											this.reset(params.row)
										}
									}
								}, '下发激活码'),
								h('span', {
									style: {
										display: this.isShowActiveButton && !params.row.activateStatus ? "inline-block":"none",
										width: "1px",
										height: "10px",
										margin: "0px 5px",
										background: "#E8E8E8",
									}
								}),
								h('el-link', {
									props: {
										type: 'primary',
									},
									style: {
										display:this.isShowActiveButton && !params.row.activateStatus ? "inline-block":"none",
									},
									on: {
										click: () => {
											this.end(params.row)
										}
									}
								}, params.row.activateStatus? '设为未激活' : '设为已激活'),
							]);
						},
					}
				],
				codeColumns: [{
						prop: 'encrNumber',
						label: '滤芯数码',
						align: 'left',
					}, {
						prop: 'erpProductName',
						label: '滤芯型号',
						align: 'left',
						render: (h, params) => {
							return h('span', params.row.allPower ? "万能产品" : params.row.erpProductName == null ? "万能产品" : params.row.erpProductName)
						}
					},
					{
						prop: 'status',
						label: '状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									size: 'mini',
									effect: 'dark',
									type: params.row.available ? 'success' : 'danger'
								} // 组件的props
							}, params.row.available ? '可使用' : '该滤芯已使用')
						}
					},
					{
						label: '操作',
						align: 'left',
						render: (h, params) => {
							return h('div', [
								h('el-link', {
									props: {
										type: 'primary',
									},
									on: {
										click: () => {
											this.searchLog(params.row)
										}
									}
								}, '复位记录'),
								h('span', {
									style: {
										display: params.row.available ? "inline-block" : "none",
										width: "1px",
										height: "10px",
										margin: "0px 5px",
										background: "#E8E8E8",
									}
								}),
								h('el-link', {
									props: {
										type: 'primary',
									},
									style: {
										display: params.row.available ? "inline-block" : "none",
									},
									on: {
										click: () => {
											this.filetrReset(params.row)
										}
									}
								}, '下发复位码'),
							]);
						}
					}
				],
				page: 1,
				limit: 10,
				total: 0,
				userDate: [],
				deviceDate: [],
				codeDate: []
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
			this.getERPlist();
			this.getProductKey();
			if (this.$cookies.get("itemIdentifyId") !== null) {
				this.itemIdentifyId = this.$cookies.get("itemIdentifyId");
				this.search();
				this.$cookies.remove("itemIdentifyId");
			}
			if (localStorage.getItem("isShowActiveButton")) {
				this.isShowActiveButton=localStorage.getItem("isShowActiveButton")
			}
		},
		methods: {
			getProductKey() {
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
						this.deviceSearchList[3].options = list;
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			getProductModel(pk) {
				let api = this.$Api.manage_productSet_filters;
				this.$Axios.get(api, {
					params: {
						productKey: pk,
					}
				}).then((res) => {
					if (res.success) {
						let arr=[];
						let key=0;
					    for(let i in res.data){						
							for(let j in res.data[i].erpNames){
                              arr.push({
								  attrIndex:key++,
								  identifier:res.data[i].identifier,
								  erpName:res.data[i].erpNames[j],
								  erpCode:res.data[i].erpItemCodes[j],
							  })
							}
						}
						this.filters=arr;
						 this.$forceUpdate();
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			submitForm(formName) {
				if (formName == "userSearch") {
					this.page = 1;
					this.limit = 10;
					if(this.userSearchParams.phone){
						this.getUserList();
					}else{
						this.userDate=[]
					}		
				} else if (formName == "deviceSearch") {
					this.getDeviceList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api = "";
							let data = {};
							if (this.activeName == "增加可激活设备数量") {
								api = this.$Api.manage_customer_updateUserActivationNumber;
								data = {
									userId: this.editId,
									count: this.userForm.count+1
								}
							} else if (this.activeName == "下发激活码") {
								api = this.$Api.manage_customer_sendDeviceActiveCode;
								data = {
									productKey: this.deviceForm.productKey,
									identityId: this.deviceForm.identityId,
									userPhone: this.deviceForm.userPhone,
									userName: this.deviceForm.userName,
									sncode: this.deviceForm.sncode,
									erpName: this.deviceForm.erpName,
									erpCode: this.deviceForm.erpCode,
								}
							}
							if (this.activeName == "增加复位次数") {
								api = this.$Api.manage_customer_addFilterNumber;
								data = {
									productKey: this.addForm.productKey,
									identityId: this.addForm.identityId,
									addNumber: this.addForm.addNumber,
									filterCode: this.addForm.filterCode,
									userPhone: this.addForm.userPhone,
									erpCode: this.addForm.erpCode==null?"universal":this.addForm.erpCode,
									erpName: this.addForm.erpName==null?"万能产品":this.addForm.erpName,
								}
							}
							if (this.activeName == "下发复位码") {
								api = this.$Api.manage_customer_sendFilterActiveCode;
								data = {
									filterCode: this.filterForm.filterCode,
									identityId: this.devices.identityId,
									productKey: this.devices.productKey,
									deviceFilterId:this.filterForm.deviceFilterId.identifier,
									sncode: this.devices.sncode,
									userPhone: this.filterForm.userPhone,
									userName: this.devices.userName,
									taskId: this.filterForm.taskId,
									erpCode:this.filterForm.deviceFilterId.erpCode,
									erpName:this.filterForm.deviceFilterId.erpName,
								}
								if(this.filterForm.erpCode!=="universal" && this.filterForm.erpCode!==null){								
								if(data.erpCode!=this.filterForm.erpCode){
									this.$message({
										message: "滤芯型号与复位型号不符",
										type: 'error'
									});
									return false;
								}	
								}								
							}
							this.$Axios.post(api, data).then((res) => {
								if (res.success) {
									if (formName == "userForm") {
										this.$message({
											message: "操作成功",
											type: 'success'
										});
										this.dialogUserVisible = false;
										this.getUserList();
									} else if (formName == "deviceForm") {
										this.dialogDeviceVisible = false;
										this.$confirm('<p style="font-size:25px;font-weight: bold">'+res.data.activeCode+'</p>', '激活8位码', {
											confirmButtonText: '确定',
											showCancelButton: false,
											type: 'success',
											center: true,
											 dangerouslyUseHTMLString: true 
										}).then(() => {
											this.getDeviceList();
										})
									} else if (formName == "filterForm") {
										this.dialogFilterVisible = false;
										this.$confirm('<p style="font-size:25px;font-weight: bold">'+res.data.activeCode+'</p>', '复位8位码', {
											confirmButtonText: '确定',
											showCancelButton: false,
											type: 'success',
											center: true,
											 dangerouslyUseHTMLString: true 
										}).then(() => {})
									} else if (formName == "addForm") {
										this.$message({
											message: "增加成功",
											type: 'success'
										});
										this.dialogResetVisible = false;
										this.getFilterList(this.itemIdentifyId);
									}
								} else {
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
			resetForm(formName) {
				if (formName == "userSearch") {
					this.userSearchParams = {
						userName: null,
						phone: null,
					}
					this.userDate=[];
				} else if (formName == "deviceSearch") {
					let length = this.itemIdentifyId.length;
					this.deviceSearchParams = {
						userPhone: null,
						productKey: null,
					}
					// 1、手机号码，2、滤芯数码，3、SN码 ，4、MAC地址
					this.searchResult = length == 11 ? 1 : (length == 24 ? 2 : (length == 20 ? 3 : length == 12 || length == 15 ? 4 :
						0));
					if (this.searchResult == 3) {
						this.deviceSearchParams.identityId = null;
						this.deviceSearchParams.sncode = this.itemIdentifyId;
					} else if (this.searchResult == 4) {
						this.deviceSearchParams.sncode = null;
						this.deviceSearchParams.identityId = this.itemIdentifyId;
					}					
					this.getDeviceList();
				} else {
					this.$refs[formName].resetFields();
					this.dialogFilterVisible = false;
					this.dialogResetVisible = false;
					this.dialogDeviceVisible = false;
					this.dialogUserVisible = false;
				}
			},
			search() {
				let length = this.itemIdentifyId.length;
				// 1、手机号码，2、滤芯数码，3、SN码 ，4、MAC地址
				this.searchResult = length == 11 ? 1 : (length == 24 ? 2 : (length == 20 ? 3 : length == 12 || length == 15 ? 4 : 0));
				if (this.searchResult == 1) {
					this.userSearchParams.phone = this.itemIdentifyId;
					this.getUserList();
				} else if (this.searchResult == 2) {
					this.getFilterList(this.itemIdentifyId);
				} else if (this.searchResult == 3) {
					this.deviceSearchParams.identityId = null;
					this.deviceSearchParams.sncode = this.itemIdentifyId;
					this.getDeviceList();
				} else if (this.searchResult == 4) {
					this.deviceSearchParams.sncode = null;
					this.deviceSearchParams.identityId = this.itemIdentifyId;
					this.getDeviceList();
				} else {
					this.$message.error('请输入正确的内容');
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
			searchDevice() {
				if (this.filterForm.mac) {
					let length = this.filterForm.mac.length;
					// 1、手机号码，2、滤芯数码，3、SN码 ，4、MAC地址
					let searchResult = length == 11 ? 1 : (length == 24 ? 2 : (length == 20 ? 3 : length == 12 || length == 15 ? 4 : 0));
					if (searchResult == 3) {
						this.getFilters(null, this.filterForm.mac)
					} else if (searchResult == 4) {
						this.getFilters(this.filterForm.mac, null)
					} else {
						this.filterForm.mac = null;
						this.$message.error('请输入正确的设备SN或MAC');
					}
				}
			},
			getFilters(identityId, sncode) {
				let api = this.$Api.manage_customer_getDeviceList;
				let data = {
					pageNum: 1,
					pageSize: 10,
					identityId: identityId,
					sncode: sncode
				}
				this.$Axios.get(api, {
					params: data
				}).then((res) => {
					if (res.success) {
						this.devices = res.data[0];
						this.getProductModel(res.data[0].productKey)
					} else {
						this.$message({
							message: res.msg,
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
							this.userDate = res.data;
						} else if (this.searchResult == 2) {
							this.codeDate = res.data;
						}else{
							this.deviceDate = res.data;
						}
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
						this.userDate=[];
						this.codeDate=[];
						this.deviceDate=[];
					}
				}).catch((res) => {});
			},
			getUserList() {
				let api = this.$Api.manage_customer_getUserList;
				let data = {
					pageNum: this.page,
					pageSize: this.limit,
					...this.userSearchParams
				}
				this.request(api, data)
			},
			getDeviceList() {
				let api = this.$Api.manage_customer_getSnDeviceList;
				let data = {
					pageNum: this.page,
					pageSize: this.limit,
					...this.deviceSearchParams
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
			edit(row) {
				this.activeName = "增加可激活设备数量";
				this.userForm = {
					phone: row.phone,
					activationNumber: row.activationNumber == null ? 0 : row.activationNumber,
					activationTotalCount: row.activationTotalCount == null ? 0 : row.activationTotalCount,
					count: row.activationTotalCount == null ? 0 : row.activationTotalCount,
				}
				this.editId = row.id;
				this.dialogUserVisible = true;
			},
			deviceList(row) {
				this.$cookies.set("itemIdentifyId", this.itemIdentifyId);
				this.$router.push("/devices");
				this.$cookies.set("userId", row.id);
			},
			searchLog(row) {
				this.$cookies.set("itemIdentifyId", this.itemIdentifyId);
				this.$router.push("/resetLog/" + row.encrNumber);
			},
			activateLog(row) {
				this.$cookies.set("itemIdentifyId", this.itemIdentifyId);
				this.$router.push("/activateLog/" + (row.sncode==""?"null":row.sncode) + "/" + row.identityId);
			},
			end(row) {
				let activeName = row.activateStatus ? "未激活" : "激活";
				this.$confirm('你确定要将该设备设置为' + activeName + '状态?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let api = this.$Api.manage_customer_updateDeviceActiveStatus;
					this.$Axios.post(api, {
						productKey: row.productKey,
						identityId: row.identityId,
						activeStatus: row.activateStatus ? 0 : 1,
					}).then((res) => {
						if (res.success) {
							this.$message({
								message: "操作成功",
								type: 'success'
							});
							this.getDeviceList();
						} else {
							this.$message({
								message: res.msg,
								type: 'warning'
							});
						}
					})
				}).catch(() => {});
			},
			reset(row) {
				this.activeName = "下发激活码";
				this.dialogDeviceVisible = true;
				this.deviceForm = {
					productKey: row.productKey,
					sncode: row.sncode,
					productModel: row.productModel,
					userPhone: row.userPhone,				
					userName: row.userName,
					identityId: row.identityId
				}
			},
			filetrReset(row) {
				this.activeName = "下发复位码";			
				this.filterForm = {
					filterCode: row.encrNumber,
					identityId: null,
					productKey: null,
					erpCode: row.erpItemCode,
					erpName:row.erpProductName,
					deviceFilterId: {},
					userPhone: null,
					sncode: null,
					userName: null,
					taskId: row.orderId,
				}
				this.dialogFilterVisible = true;
			},
			addResetNum() {
				if(this.codeDate[0].status==100){
					this.$message({
						message: "该数码为待生产状态,暂时无法增加复位次数",
						type: 'warning'
					});
					return false;
				}
				this.$confirm('确定要给该数码增加复位次数吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(() => {
					this.activeName = "增加复位次数";
					this.addForm = {
						filterCode: this.codeDate[0].encrNumber,
						addNumber: 1,
						productKey: this.codeDate[0].productKey == null ? "万能产品" : this.codeDate[0].productKey,
						identityId: this.codeDate[0].deviceIdentity,
						userPhone: null,
						erpCode: this.codeDate[0].erpItemCode,
						erpName: this.codeDate[0].erpProductName,
					}
					this.dialogResetVisible = true;
				}).catch(() => {});
			}
		}
	}
</script>

<style lang="scss">
	.customer {
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
        .center{
			text-align: center;
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
