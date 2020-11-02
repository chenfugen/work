<template>
	<div class="form">
		<el-form
			:model="form"
			status-icon
			:rules="rules"
			ref="form"
			label-width="100px"
			class="demo-ruleForm"
		>
			<el-form-item
				v-for="item in config"
				:key="item.valName"
				:label="item.label"
				:prop="item.valName"
			>
				<el-tooltip
					effect="dark"
					:disabled="item.tips === 'none'"
					:content="item.tips"
					placement="top-start"
				>
					<!-- input -->
					<el-input
						class="formInput"
						v-if="item.type === 'input'"
						v-model.trim="form[item.valName]"
						:placeholder="item.plh"
						clearable
					></el-input>
					<!-- textarea -->
					<el-input
						v-if="item.type === 'textarea'"
						type="textarea"
						v-model.trim="form[item.valName]"
						:placeholder="item.plh"
						clearable
					></el-input>
					<!-- select -->
					<el-select
						class="formInput"
						v-if="item.type === 'select'"
						v-model.trim="form[item.valName]"
						:placeholder="item.plh"
					>
						<el-option
							v-for="(opt, index) in item.opts"
							:key="index"
							:label="opt.label"
							:value="opt.value"
						></el-option>
					</el-select>
				</el-tooltip>
			</el-form-item>
		</el-form>
	</div>
</template>
<!--endregion-->
<script>
export default {
	props: {
		config: {
			type: Array,
			default: () => {
				return [];
			},
		},
		rules: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	//组件
	components: {},
	// 数据
	data() {
		return {
			form: {},
		};
	},
	created() {
		this.config.forEach((item) => {
			this.form[item.valName] = "";
		});
	},
	computed: {},
	methods: {
		setFormData: function (form) {
			this.form = form;
		},
		handleSubmit: function () {
			let flag = false;
			this.$refs.form.validate((valid) => {
				if (valid) {
					flag = true;
				}
			});
			if (flag) {
				return this.form;
			} else {
				return false;
			}
		},
		handleResetForm: function () {
			this.$refs.form.resetFields();
		},
	},
};
</script>
<style scoped>
.formInput {
	width: 250px;
}
</style>
