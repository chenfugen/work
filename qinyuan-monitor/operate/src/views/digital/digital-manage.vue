<template>
	<div class="digitalManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="发送任务"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm" isAdd buttonName="批量编辑" @add="send"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getNumberList" />
		</div>
		<el-dialog :title="activeName" width="30%" :visible.sync="dialogShowVisible">
			<el-form :model="sendForm" status-icon :rules="sendRules" ref="sendForm" label-width="120px" class="demo-ruleForm">
				<el-form-item label="所属产品(滤芯)" prop="erpCode">
					<el-select class="select" v-model="sendForm.erpCode" placeholder="请选择滤芯型号" @change="selectedFile">
						<el-option  label="万能产品" value="universal/万能产品"  ></el-option>
						<el-option v-for="(item,index) in filters" :key="index" :label="item.itemName+'('+item.itemCode+')'" :value="item.itemCode+'/'+item.itemName"  ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="当前状态" prop="status">
					<el-select class="select" v-model="sendForm.status" placeholder="请选择当前状态">
						<el-option label="待生产" :value="100">待生产</el-option>
						<el-option label="已生产" :value="200">已生产</el-option>
						<el-option label="已激活" :value="300">已激活</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="剩余使用次数" prop="availableNum" v-show="sendForm.erpCode=='universal/万能产品'">
					<el-input placeholder="请输入剩余使用次数" min="1" type="number" v-model="sendForm.availableNum"></el-input>
				</el-form-item>
				<el-form-item label="操作数码:" v-if="show">
					<span>{{sendForm.filterCodes}}</span>
				</el-form-item>
				<el-form-item v-else prop="filterCodes">
					<el-input type="textarea" :autosize="{ minRows:5, maxRows: 6}" maxlength="1000" show-word-limit v-model="sendForm.filterCodes"
					 placeholder="请输入需要进行操作的数码,以空格进行区分"></el-input>
					<div class="readFile">
						<el-button size="mini" type="primary" @click="handleClick">文件导入</el-button>
						<input type="file" style="opacity: 0;width: 0px;" ref="readFile" @change="readFiles" />
					</div>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('sendForm')">确认</el-button>
					<el-button @click="resetForm('sendForm')">取消</el-button>
				</el-form-item><strong></strong>
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
			let checkNum = (rule, value, callback) => {		
				if (!value) {
					return callback(new Error('请输入可使用次数'))
				}
				setTimeout(() => {
					if (!Number.isInteger(+value)) {
						callback(new Error('请输入整数'))
					} else {
						callback()
					}
				}, 100)
			}
			return {
				navigation: [{
						name: "数码管理",
						path: ""
					},
					{
						name: "数码配置",
						path: ""
					}
				],
				activeName: "",
				dialogShowVisible: false,
				show: false,
				filters: [],
				sendForm: {
					erpCode: null,
					status: null,
					availableNum: null,
					filterCodes: null,
					erpName: null,
				},
				sendRules: {
					erpCode: [{
						required: true,
						message: '请选择所属滤芯',
						trigger: 'change'
					}],
					status: [{
						required: true,
						message: '请修改当前状态',
						trigger: 'change',
					}],
					availableNum: [{
						required: true,
						validator: checkNum,
						trigger: 'blur'
					}],
					filterCodes: [{
						required: true,
						message: '请输入要操作的数码',
						trigger: 'blur'
					}],
				},
				searchList: [{
						label: "滤芯型号",
						prop: "erpCode",
						type: 'select',
						filterable: true,
						options: []
					},
					{
						label: "当前状态",
						prop: "status",
						type: 'select',
						options: [{
								label: "待生产",
								value: 100
							},
							{
								label: "已生产",
								value: 200
							}, {
								label: "已激活",
								value: 300
							}
						]
					},
					{
						label: "已使用次数",
						prop: "usedCount",
						type: 'input',
						typeMethod: 'number',
						min:0,
					},
					{
						label: "总使用次数",
						prop: "repeatCount",
						type: 'input',					
						typeMethod: 'number',					
						min:0,
					},
					{
						label: "剩余使用次数",
						prop: "remainCount",
						type: 'select',					
						options: [{
								label: "是",
								value: true
							},
							{
								label: "否",
								value: false
							}
						]
					},
					{
						label: "数码编号",
						prop: "filterCode",
						type: 'input',						
					}
				],
				searchParams: {
					filterCode: null,
					status: null,
					usedCount: null,
					repeatCount: null,
					erpCode: null,
				},
				tableDable: [],
				columns: [{
						prop: 'encrNumber',
						label: '数码编号',
						align: 'left',
						width: 230
					},
					{
						prop: '',
						label: '滤芯型号',
						align: 'left',
						width: 220,
						render: (h, params) => {
							return h('span',params.row.erpProductName==null || params.row.erpProductName=="万能产品"?"万能产品":params.row.erpProductName+"("+params.row.erpItemCode+")")
						}
					},
					{
						prop: 'deviceIdentity',
						label: '所属设备',
						align: 'left',
						width: 150
					},
					{
						prop: 'repeatCount',
						label: '总使用次数',
						align: 'left',
						width: 100,
						render: (h, params) => {
							return h('span',params.row.repeatCount)
						}
					},
					{
						prop: 'usedCount',
						label: '已使用次数',
						align: 'left',
						width: 100,
						render: (h, params) => {
							return h('span',params.row.usedCount)
						}
					},
					{
						prop: 'remainCount',
						label: '剩余次数',
						align: 'left',
						width: 100,
						render: (h, params) => {
							return h('span',params.row.remainCount)
						}
					},
					{
						prop: 'status',
						label: '当前状态',
						align: 'left',
						render: (h, params) => {
							return h('el-tag', {
								props: {
									effect: "dark",
									size: 'mini',
									type: params.row.status === 100 ? 'info' : params.row.status === 200 ? 'primary' : 'success'
								} // 组件的props
							}, params.row.status === 100 ? '待生产' : params.row.status === 200 ? '已生产' : '已激活')
						}
					},
					{
						prop: 'updateTime',
						label: '更新日期',
						sortable: true,
						align: 'left',
						width: 160,
						render: (h, params) => {
							return h('span', this.formatDate(params.row.updateTime))
						}
					},
					{
						label: '操作',
						width: 200,
						align: 'center',
						fixed: "right",
						operates: [{
							label: '编辑',
							type: 'primary',
							disabled: false,
							method: (index, row) => {
								this.edit(row)
							}
						}]
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
			this.getNumberList();
			this.getERPlist();
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
			getERPlist() {
				let api = this.$Api.manage_getErpCodeList;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						this.filters = res.data;
						let list = [];
						for (let i in res.data) {
							list[i] = {
								label: res.data[i].itemName+"("+res.data[i].itemCode+")",
								value: res.data[i].itemCode,
							}
						}
						list.unshift({
							label:'万能产品',
							value:'universal',
						})
						this.searchList[0].options = list;
					}else{
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				})
			},
			send() {
				this.show = false;
				this.dialogShowVisible = true;
				this.activeName="批量编辑";
				this.sendForm={
					erpCode:null,
					status:null,
					availableNum:null,
					filterCodes:null
				};
			},
			submitForm(formName) {
				if (formName == "searchParams") {
					this.page=1;
					this.limit=10;
					this.getNumberList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let api =this.$Api.manage_number_addFilterNumberBatch;
							let data = {};
							this.sendForm.erpName=this.sendForm.erpCode.split("/")[1];
							this.sendForm.erpCode=this.sendForm.erpCode.split("/")[0];
							if (this.activeName == "批量编辑") {
								this.sendForm.filterCodes=(this.getSNcode(this.sendForm.filterCodes)).toString();					
							} else {
								this.sendForm.filterCodes= new Array(this.sendForm.filterCodes).toString();
							}
							data=this.sendForm;
							this.$Axios.post(api,data).then((res) => {
								if (res.success) {
									this.$message({
										message: "操作成功",
										type: 'success'
									});
									this.dialogShowVisible = false;
									this.getNumberList();
								} else {
									this.$message({
										message: res.msg,
										type: 'warning'
									});
								}
							})
						}
					});
				}
			},
			resetForm(formName) {
				if (formName == "searchParams") {
					this.page=1;
					this.limit=10;
					this.searchParams = {
						filterCode: null,
						status: null,
						usedCount: null,
						repeatCount: null,
						erpCode: null,
					}
					this.getNumberList();
				} else {					
					this.$refs[formName].resetFields();
					this.dialogShowVisible=false;
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
						that.sendForm.filterCodes = reader.result;
					}
				};
				reader.readAsText(selectedFile, 'GBK')
			},
			selectedFile() {
				if(this.sendForm.erpCode!='universal/万能产品'){
					this.sendForm.availableNum=1
				}
			},
			edit(row) {
				this.dialogShowVisible = true;
				this.activeName="编辑";
				this.show = true;
				this.sendForm={
					erpCode: row.erpItemCode==null || row.erpItemCode=="universal"?"universal/万能产品":row.erpItemCode+"/"+row.erpProductName,
					status: row.status,
					availableNum:row.remainCount,
					filterCodes:row.encrNumber,
				};
			},
			getSNcode(data){
				let list=[];
				list=data.split(" "); //字符分割 
				return list
			},
			getNumberList() {
				let api = this.$Api.manage_number_getNumberList;
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

			.readFile {
				input {
					opacity: 0;
				}
			}
		}
	}
</style>
