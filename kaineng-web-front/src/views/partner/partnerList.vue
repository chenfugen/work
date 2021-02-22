<template>
	<div class="agencyList">
		<Button @click='handleAcquire' type='primary' class="acquire">同步</Button>
		<searchForm ref='searchForm' @handleSearch='getTableData()' :configList='configList'></searchForm>
		<tableComponent v-if='showTable' class="productTable" ref='tableComponent' :columns='columns'></tableComponent>
		<!-- 同步 -->
		<Modal v-model="dialogAdd" title="委托商同步" class-name="detailModal" :mask-closable="false" :width="500" :footer-hide="true"
		 @on-cancel="cancel">
			<Form ref="formAddPartner" :model="formAddPartner" :rules="ruleformPartner" :label-width="100">
				<FormItem label="委托商编号" prop="partnerId">
					<Input v-model="formAddPartner.partnerId" placeholder="请输入正确的委托商编码（ERP中的客户编号）" />
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formAddPartner')">确认</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
	</div>
</template>

<script>
	import searchForm from '@/components/searchForm.vue'
	import tableComponent from '@/components/tableComponent.vue'
	export default {
		data() {
			return {
				dialogAdd: false,
				showTable: false,
				formAddPartner: {
					partnerId: ""
				},
				ruleformPartner: {
					partnerId: [{
						required: true,
						message: '请输入正确的委托商编码',
						trigger: 'blur'
					}],
				},
				configList: [{ // 筛选框配置
						plh: '委托商编号',
						valName: 'partnerId',
						type: 'input'
					}, {
						plh: '委托商名称',
						valName: 'partnerName',
						type: 'input'
					},
					{
						plh: '委托商等级',
						valName: 'level',
						type: 'select',
						labelName: 'label',
						valueName: 'value',
						keyName: 'value',
						selectList: [{
								label: "特别重要",
								value: 1,
							}, {
								label: "重要",
								value: 2,
							},
							{
								label: "一般",
								value: 3,
							}
						],
					},
					{
						plh: '是否到期',
						valName: 'expire',
						type: 'select',
						labelName: 'label',
						valueName: 'value',
						keyName: 'value',
						selectList: [{
								label: "到期",
								value: 1,
							}, {
								label: "未到期",
								value: 0,
							}
						],
					},				
				],
				columns: [{ // 表格配置
						type: 'index',
						title: '序号',
						width: 60,
						align: 'center'
					},
					{
						title: '委托商编号',
						align: 'center',
						key: 'partnerId',
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.partnerId))
							]);
						}
					},
					{
						title: '委托商名称',
						align: 'center',
						key: 'partnerName',
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.partnerName))
							]);
						}
					},
					{
						title: '联系方式',
						align: 'center',
						key: 'userContact',
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.userContact))
							]);
						}
					},
					{
						title: '委托商等级',
						align: 'center',
						key: 'level',
						render: (h, params) => {
							return h('div', [
								h('div', params.row.level == 1 ? "特别重要" : params.row.level == 2 ? "重要" : "一般")
							]);
						}
					},
					{
						title: '同步时间',
						align: 'center',
						key: 'syncTime',
						width: 150,
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.syncTime))
							]);
						}
					},
					{
						title: '到期时间',
						align: 'center',
						key: 'expireTime',
						width: 150,
						render: (h, params) => {
							return h('div', [
								h('div', this.dealNullData(params.row.expireTime))
							]);
						}
					},				
					{
						title: '操作',
						key: 'action',
						width: 200,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.getInfo(params.row)
										}
									}
								}, '查看'),
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.handleEdit(params.row)
										}
									}
								}, '配置'),
							]);
						}
					}
				],

			}
		},
		components: {
			searchForm,
			tableComponent,
		},
		mounted() {
			this.showTable = true
			this.$nextTick(() => {
				this.getTableData()
			})
		},
		methods: {
			// 处理空数据
			dealNullData(data) {
				return this.$Utils.dealNullData(data)
			},
			// 获取表格数据
			getTableData() {
				let para = this.$refs.searchForm.handleSubmit()
				this.$refs.tableComponent.getData(this.$api.manage_businessPartner_list, para, true)
			},
			//同步
			handleAcquire() {
				this.dialogAdd = true;
				this.formAddPartner.partnerId = null;
			},
			// 关闭弹出层
			cancel() {
				this.dialogAdd = false;
			},
			handleSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let api = this.$api.manage_businessPartner_searchPartner;
						//let api = ;				
						this.$Ax.get(api, {
							params: this.formAddPartner
						}).then(res => {
							if (res.success) {
								if (res.data == "委托商已存在") {
									this.$Modal.confirm({
										title: '提示',
										content: res.data,
										okText: "更新",
										onOk: () => {
											this.$Ax.post(this.$api.manage_businessPartner_partner, this.formAddPartner).then(res => {
												if (res.success) {
													this.dialogAdd = false;
													this.$Message.success("更新成功")
													this.getTableData()
													this.$store.dispatch('getPartnerList')
												}
											})				
										},
										onCancel: () => {
											this.dialogAdd = false;
										}
									})
								}else{
									this.$Ax.post(this.$api.manage_businessPartner_partner, this.formAddPartner).then(res => {
										if (res.success) {
											this.dialogAdd = false;
											this.$Message.success("同步成功")
											this.getTableData()
											this.$store.dispatch('getPartnerList')
										}
									})		
								}
							}else{
								this.$Message.error(res.message)
							}
						})
					}
				})
			},
			getInfo(row) {
				this.$router.push("/partnerDetail?partnerId=" + this.$BASE.Encrypt(row.partnerId))
			},
			handleEdit(row) {
				this.$router.push("/partnerSet?partnerId=" +this.$BASE.Encrypt(row.partnerId))
				sessionStorage.setItem("partnerName", row.partnerName)
			}
		}
	}
</script>

<style lang="less">
	.agencyList {
		padding: 20px 15px;
		background-color: #fff;
		border-radius: 4px;
		position: relative;

		.acquire {
			position: absolute;
			right: 15px;
			top: 20px;
		}
	}
</style>
