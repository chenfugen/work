<template>
<div id="keyList" class="clearfloat">
	<Button class="right marginBottom" type='primary' @click='submit'>保存</Button>
	<Button class="right marginBottom marginRight" @click='goInfo'>取消</Button>
	<Divider />
	<Form class="clearfloat" :label-width="120" inline>
		<FormItem label='产品类型：' style="width:250px">
			<span>{{productInfo.productType}}</span>
		</FormItem>
		<FormItem label='产品名称：' style="width:250px">
			<span>{{productInfo.productName}}</span>
		</FormItem>
		<FormItem label='ProductKey：' style="width:250px">
			<span>{{productInfo.productKey}}</span>
		</FormItem>
		<FormItem label='ProductSecret：'>
			<span>{{productInfo.productSecret}}</span>
		</FormItem>
	</Form>
	<span class="left">秘钥列表</span>
	<span class="right" style="color: red;">{{inputMessage}}</span>
	<Divider />
	<div class="table clearfloat marginTop">
		<Table ref="table" :loading='tableLoading' :columns="columns" :data="listData" border></Table>
		<Button class="left marginTop" type='error' @click='handleBatchDelete'>批量删除</Button>
		<Page :current='pageNum' @on-change='filp' :total="total" :page-size='pageSize' @on-page-size-change='handleChangePageSize' size="small" :page-size-opts='[10,20,30,40]' class="right marginTop" show-total show-elevator show-sizer />
	</div>
</div>
</template>
<script>
export default {
	name: 'keyList',
	data() {
		return {
			id: '',
			inputMessage: '',
			pageNum: 1,
			total: 0,
			pageSize: 1,
			tableLoading: false,
			productInfo: {
				productType: '',
				productKey: '',
				productName: '',
				productSecret: '',
			},
			productList: [],
			listData: [],
			columns: [{
					type: 'selection',
					width: 60,
					align: 'center',
				},
				{
					title: 'ProductKey',
					key: 'productKey',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', (params.row.productKey == '' || params.row.productKey == null) ? '--' : params.row.productKey),
						]);
					}
				},
				{
					title: 'ProductSecret',
					key: 'productSecret',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', (params.row.productSecret == '' || params.row.productSecret == null) ? '--' : params.row.productSecret),
						]);
					}
				},
				{
					title: 'DeviceName',
					key: 'deviceName',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', (params.row.deviceName == '' || params.row.deviceName == null) ? '--' : params.row.deviceName),
						]);
					}
				},
				{
					title: 'DeviceSecret',
					key: 'deviceSecret',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', (params.row.deviceSecret == '' || params.row.deviceSecret == null) ? '--' : params.row.deviceSecret),
						]);
					}
				},
				{
					title: '状态',
					key: 'status',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('span', params.row.status == 0 ? '不合格' : '合格'),
						]);
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								on: {
									click: () => {
										this.handleDelete(params.row)
									}
								}
							}, '删除')
						]);
					}
				}
			],
		}
	},
	mounted() {
		this.id = this.$route.query.id
		this.infoStatus = this.$route.query.status
		this.$Message.success('预导入完成。')
		this.getListData()
		this.getInfoData()
	},
	methods: {
		getListData() {
			this.tableLoading = true
			let api = this.$api.manage_triples_getTriplesPreList
			let para = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.listData = res.data.data
				this.inputMessage = res.data.message
				this.total = res.data.total
				this.tableLoading = false
			}).catch(err => {
				console.log(err);
			})
		},
		filp(pageNum) {
			this.pageNum = pageNum
			this.getListData()
		},
		goInfo() {
			this.$router.push({
				path: '/key/keyInfo',
				name: 'keyInfo',
				query: {
					id: this.id,
					status: this.infoStatus,
					productKey: this.productInfo.productKey,
					productSecret: this.productInfo.productSecret,
				}
			});
		},
		getInfoData() {
			let api = this.$api.manage_triplesConfig_getTriplesConfigInfo
			let para = {
				id: this.id
			}
			this.$Ax.get(api, {
				params: para
			}).then(res => {
				this.productInfo = res.data.data
			}).catch(err => {
				console.log(err);
			})
		},
		handleChangePageSize() {},
		handleDelete(row) {
			let api = this.$api.manage_triples_deleteFirmwareTriplesPre
			let para = {
				id: row.id
			}
			this.$Modal.confirm({
				title: '警告',
				content: '<p>确认删除该密钥？</p>',
				onOk: () => {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success('删除成功。');
							this.getListData()
						} else {
							this.$Message.error(res.data.data);
						}
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消删除。');
				}
			});
		},
		handleBatchDelete() { // 批量删除
			let arr = this.$refs['table'].getSelection()
			let api = this.$api.manage_triples_deleteFirmwareTriplesPre
			let idList = ''
			for (let i in arr) {
				idList = idList + arr[i].id + ','
			}
			let para = {
				id: idList
			}
			this.$Modal.confirm({
				title: '警告',
				content: '<p>确认删除已选择的秘钥？</p>',
				onOk: () => {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success('删除成功。');
							this.getListData()
						}
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消删除。');
				}
			});
		},
		submit() {
			let api = this.$api.manage_triples_addFirmwareTriplesBatch
			let para = {
				productKey: this.productInfo.productKey,
				productSecret: this.productInfo.productSecret
			}
			this.$Modal.confirm({
				title: '提示',
				content: '<p>确认保存本次导入数据？</p>',
				onOk: () => {
					this.$Ax.post(api, para).then(res => {
						if (res.data.success) {
							this.$Message.success('保存成功。');
							this.goInfo()
						}
					}).catch(err => {
						console.log(err);
					})
				},
				onCancel: () => {
					this.$Message.success('已取消保存。');
				}
			});
		},
	}
}
</script>
<style scoped>
.actBox {
	margin-bottom: 20px;
}
</style>
