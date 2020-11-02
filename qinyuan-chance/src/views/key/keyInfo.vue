<template>
<div id="keyList" class="clearfloat">
	<span>基本信息</span>
	<Divider />
	<Form :model="infoData" class="clearfloat" :label-width="120" inline>
		<FormItem label='产品名称:' style="margin-right:50px;">
			<span>{{dealNull(infoData.productName)}}</span>
		</FormItem>
		<FormItem label='ProductKey:' style="margin-right:50px;">
			<span>{{dealNull(infoData.productKey)}}</span>
		</FormItem>
		<FormItem label='ProductSecret:' style="margin-right:50px;">
			<span>{{dealNull(infoData.productSecret)}}</span>
		</FormItem>
		<FormItem label='秘钥总量:' style="margin-right:50px;">
			<span>{{dealNull(infoData.totalCount)}}</span>
		</FormItem>
	</Form>
	<span class="left">秘钥详情</span>
	<Upload class="right marginBottom" :headers='upLoadHeader' :action="upLoadURL" :before-upload='beforeUpload' :data='upLoadData' :accept='"xls"' :on-success='uploadSuccess' :on-error='uploadError'>
		<Button icon="ios-cloud-upload-outline" v-if='permission.upload' type='primary'>上传文件</Button>
	</Upload>
	<Button class="right marginBottom marginRight" v-if='permission.download' icon="ios-download-outline" @click='handleDownload'>下载模板</Button>
	<!-- <Button class="right marginBottom" type='primary' @click='goInput'>导入</Button> -->
	<Divider />
	<div class="table clearfloat marginTop">
		<Tabs :animated="false" :value='infoStatus' @on-click='handleCheckTab'>
			<TabPane label="剩余" :name='"0"'>
				<Table :loading='tableLoading' :columns="columns" :data="listData" border></Table>
				<Page :current='pageNum' :total="total" @on-change='handleFlip' :page-size='pageSize' @on-page-size-change='handleChangePageSize' size="small" :page-size-opts='[10,20,30,40]' class="right marginTop" show-total show-elevator show-sizer />
			</TabPane>
			<TabPane label="已使用" :name='"1"'>
				<Table :loading='tableLoading' :columns="columns" :data="listData" border></Table>
				<Page :current='pageNum' @on-change='handleFlip' :total="total" :page-size='pageSize' @on-page-size-change='handleChangePageSize' size="small" :page-size-opts='[10,20,30,40]' class="right marginTop" show-total show-elevator show-sizer />
			</TabPane>
		</Tabs>
	</div>
</div>
</template>
<script>
export default {
	name: 'keyList',
	data() {
		return {
			permission: {
				upload: false,
				download: false,
			},
			pageNum: 1,
			total: 0,
			pageSize: 1,
			id: '',
			infoStatus: '',
			productKey: '',
			upLoadURL: '',
			upLoadHeader: {},
			upLoadData: {
				productKey: '',
				productSecret: '',
			},
			tableLoading: false,
			infoData: {
				productName: '',
				productKey: '',
				productType: '',
			},
			listData: [],
			columns: [{
					title: 'DeviceName',
					key: 'deviceName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.deviceName)),
						]);
					}
				},
				{
					title: 'DeviceSecret',
					key: 'deviceSecret',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.deviceSecret)),
						]);
					}
				},
				{
					title: '导入时间',
					key: 'createTime',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.createTime)),
						]);
					}
				},
				{
					title: '状态',
					key: 'status',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', params.row.status == 1 ? '已使用' : params.row.status == 0 ? '未使用' : '--'),
						]);
					}
				},
				{
					title: '绑定MAC',
					key: 'mac',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.mac)),
						]);
					}
				},
				{
					title: '绑定SN',
					key: 'snCode',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.snCode)),
						]);
					}
				},
				{
					title: '绑定时间',
					key: 'date',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.date)),
						]);
					}
				},
				{
					title: '检测状态',
					key: 'date',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.date)),
						]);
					}
				},
				{
					title: '检测人员',
					key: 'date',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', this.dealNull(params.row.date)),
						]);
					}
				}
			],
		}
	},
	mounted() {
		if (this.$route.query.id) {
			this.id = this.$route.query.id
			this.infoStatus = this.$route.query.status
			this.productKey = this.$route.query.productKey
			this.productSecret = this.$route.query.productSecret
			this.getPermissionList()
			this.getInfoData()
			this.getListData()
		} else {
			this.$router.push({
				path: '/key/keyList',
				name: 'keyList',
			});
		}
		this.upLoadURL = this.$AxConfig.baseURL + this.$api.manage_triples_import
		this.pageNum = 1
		this.pageSize = 10
		this.upLoadData = {
			productKey: this.productKey,
			productSecret: this.productSecret,
		}
		this.upLoadHeader = {
			token: sessionStorage.getItem('token')
		}
	},
	methods: {
		getListData() {
			this.tableLoading = true
			let api = this.$api.manage_triples_getTriplesList
			let para = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				status: this.infoStatus,
				productKey: this.productKey,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.listData = res.data.data
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		getInfoData() {
			let api = this.$api.manage_triplesConfig_getTriplesConfigInfo
			let para = {
				id: this.id
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.infoData = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		handleFlip(pageNum) {
			this.pageNum = pageNum
			this.getListData()
		},
		handleCheckTab(name) {
			this.pageNum = 1
			this.infoStatus = name
			this.getListData()
		},
		handleChangePageSize() {

		},
		handleDownload() {
			window.open(this.$AxConfig.baseURL + this.$api.manage_triples_downloadModel)
		},
		beforeUpload(file) {
			let type = (file.name).substring((file.name).lastIndexOf('.'), (file.name).length);
			return true
		},
		uploadSuccess(response, file, fileList) { // 成功回调
			if (response.success) {
				this.$router.push({
					path: '/key/keyInput',
					name: 'keyInput',
					query: {
						id: this.id,
						status: this.infoStatus,
					}
				});
			} else {
				this.$Message.error(response.message)
			}

		},
		uploadError(error, file, fileList) { // 错误回调
			this.$Message.error('上传文件失败')
		},
		dealNull(data) {
			if (data === '' || data === null) {
				return '--'
			} else {
				return data
			}
		},
		getPermissionList() {
			let menu = JSON.parse(sessionStorage.getItem('menu'))
			for (let i in menu) {
				if (menu[i].name == '秘钥管理') {
					let menuC = menu[i].children[0].children
					for (let y in menuC) {
						if (menuC[y].name == '上传文件') {
							this.permission.upload = menuC[y].checked
						}
						if (menuC[y].name == '下载模板') {
							this.permission.download = menuC[y].checked
						}
					}
				}
			}
		}
	}
}
</script>
<style scoped>
.actBox {
	margin-bottom: 20px;
}
</style>
