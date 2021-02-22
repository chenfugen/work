<template>
<div class="customers">
	<Card>
		<Form ref='form' :model="form" label-position="right" :rules="addRule" inline :label-width="100">
			<FormItem label="客户姓名：" class='marginLeft' prop='name'>
				<Input class="input" v-model="form.name"></Input>
			</FormItem>
			<FormItem label="联系方式：" class='marginLeft' prop='phone'>
				<Input class="input" v-model="form.phone"></Input>
			</FormItem>
			<FormItem label="客户ID：" class='marginLeft' prop='customerId'>
				<Input class="input" v-model="form.customerId"></Input>
			</FormItem>
			<FormItem label="拥有产品：" class='marginLeft' prop='productKey'>
				<Select class="select" v-model="form.productKey" multiple clearable>
					<Option v-for='(item,index) in productList' :key='index' :value='item.productKey' :label='item.productName'></Option>
				</Select>
			</FormItem>
			<FormItem label="wxAppId：" class='marginLeft' prop='wxAppId'>
				<Input class="input" v-model="form.wxAppId"></Input>
			</FormItem>
			<FormItem label="wxSecret：" class='marginLeft' prop='wxSecret'>
				<Input class="input" v-model="form.wxSecret"></Input>
			</FormItem>
			<FormItem label="wxToken：" class='marginLeft' prop='wxToken'>
				<Input class="input" v-model="form.wxToken"></Input>
			</FormItem>
			<FormItem label="wxAesKey：" class='marginLeft' prop='wxAesKey'>
				<Input class="input" v-model="form.wxAesKey"></Input>
			</FormItem>
			<FormItem label="wxTemplete：" class='marginLeft' prop='wxTemplete'>
				<Input class="input" v-model="form.wxTemplete"></Input>
			</FormItem>
		</Form>
		<Button @click='handleAdd' type='primary'>新增</Button>
		<Button class="marginLeft" @click='handleReset' type='primary'>重制</Button>
	</Card>
	<!-- 详情表单 -->
</div>
</template>
<script>
import searchForm from '@/components/searchForm.vue'
import tableComponent from '@/components/tableComponent.vue'
export default {
	name: 'customers',
	data() {
		return {
			addUrl: '',
			form: {
				name: '',
				phone: '',
				customerId: '',
				productKey: '',
				wxAppId: '',
				wxSecret: '',
				wxToken: '',
				wxAesKey: '',
				wxTemplete: '',
			},
			productList: this.$store.state.common.productList,
			addFormConf: [{
					type: 'input',
					valName: '',
					label: '客户名称：',
					plh: '请输入客户名称'
				},
				{
					type: 'input',
					valName: '',
					label: '联系方式：',
					plh: '请输入联系方式'
				},
				{
					type: 'input',
					valName: '',
					label: '客户Id：',
					plh: '请输入客户Id'
				},
				{
					plh: 'productKey',
					valName: '',
					type: 'select',
					labelName: 'productName',
					valueName: 'productKey',
					keyName: 'key',
					selectList: [],
				},
				{
					type: 'input',
					valName: '',
					label: 'wxAppId：',
					plh: '请输入wxAppId'
				},
				{
					type: 'input',
					valName: '',
					label: 'wxSecret：',
					plh: '请输入wxSecret'
				},
				{
					type: 'input',
					valName: 'wxToken',
					label: '',
					plh: '请输入wxToken'
				},
				{
					type: 'input',
					valName: '',
					label: 'wxAesKey：',
					plh: '请输入wxAesKey'
				},
				{
					type: 'input',
					valName: '',
					label: 'wxTemplete：',
					plh: '请输入wxTemplete'
				},
			],
			addRule: {
				name: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
				phone: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
				customerId: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
				productKey: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
				wxAppId: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
				wxSecret: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
				wxToken: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
				wxAesKey: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
				wxTemplete: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
			},
		}
	},
	created() {
		this.$store.dispatch('getCustomer')
	},
	mounted() {},
	components: {
		searchForm,
		tableComponent
	},
	methods: {
		// 设备详情
		handleReset() {},
		// 新增
		handleAdd() {
			this.form.productKey = JSON.stringify(this.form.productKey)
			let api = this.$api.manage_customer_create
			this.$Ax.post(api, this.form).then(res => {
				if (res.success) {
					this.$Message.success('创建成功')
				} else {
					this.$Message.success(res.message)
				}
				this.$store.dispatch('getCustomer')
				this.handleReset()
			}).catch(err => {
				console.log(err);
			})
		},
		// 清空表单
		handleReset() {
			this.$refs.form.resetFields();
		},
		// 处理时间显示形式
		dealTime(date) {
			return this.$Utils.dealTime(date)
		},
		// 处理空数据
		dealNullData(data) {
			return this.$Utils.dealNullData(data)
		},
	}
}
</script>

<style scoped>
.input {
	width: 200px;
}

.select {
	width: 280px;
}
</style>
