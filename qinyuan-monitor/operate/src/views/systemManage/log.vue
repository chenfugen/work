<template>
	<div class="factoryManage">
		<breadcrumb :menu="navigation"></breadcrumb>
		<div class="content">
			<model-bar title="日志记录"></model-bar>
			<search :searchList="searchList" :searchParams="searchParams" formName="searchParams" @resetForm="resetForm"
			 @submitForm="submitForm"></search>
			<table-page :loading="loading" :page="page" :limit="limit" :tableDable="tableDable" :columns="columns"></table-page>
			<pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getLogList" />
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
						name: "系统管理",
						path: ""
					},
					{
						name: "系统日志",
						path: ""
					}
				],
				loading: true,
				searchList: [{
						label: "操作",
						prop: "methodName",
						type: 'input',
					},
					{
						label: "操作人",
						prop: "accountName",
						type: 'input',
					},
					{
						label: "",
						prop: "sendTime",
						type: 'daterange',
					}
				],
				searchParams: {
					methodName: null,
					accountName: null,
					sendTime:null,
					start: null,
					end: null,
				},
				tableDable: [],
				columns: [{
						prop: 'methodName',
						label: '操作',
						align: 'left',
					},
					{
						prop: 'accountName',
						label: '操作人',
						align: 'left',
					},
					{
						prop: 'content',
						label: '操作内容',
						align: 'left',
					}, {
						prop: 'createTime',
						label: '创建时间',
						align: 'left',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.createTime))
						}
					}
				],
				total:0, //数据总条数
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
			this.getLogList()
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
				if (formName == "searchParams") {
					if(this.searchParams.sendTime){
						this.searchParams.start=this.searchParams.sendTime[0];
						this.searchParams.end=this.searchParams.sendTime[1];
						//delete this.searchParams.sendTime; 
					}else{
						this.searchParams.start = null;
						this.searchParams.end = null;
					}	
						this.page=1;
						this.limit=10;
					this.getLogList();
				} else {
					this.$refs[formName].validate((valid) => {
						if (valid) {

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
						methodName: null,
						accountName: null,
						sendTime:null,
						start: null,
						end: null,
					}
					this.page=1;
					this.limit=10;
					this.getLogList()
				} else {
					this.$refs[formName].resetFields();
				}
			},
			getLogList() {
				let api = this.$Api.manage_log_list;
				this.$Axios.get(api, {
					params: {
						pageNum: this.page,
						pageSize: this.limit,
						...this.searchParams
					}
				}).then((res) => {
					this.loading = false;
					if (res.success) {
						this.tableDable = res.data.data;
						this.total = res.data.count;
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
	.factoryManage {
		.content {
			margin-top: 15px;
			padding: 5px 20px;
			background: white;
			box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
		}
	}
</style>
