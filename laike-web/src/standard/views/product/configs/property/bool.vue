<template>
	<div id="configBool">
		<el-form
			ref="form"
			:rules="rules"
			:model="form"
			label-width="120px"
			inline
		>
			<!-- 数据长度 -->
			<el-form-item class="formItem" label="数据长度" prop="byteLen">
				1字节
			</el-form-item>
			<!-- 取值范围 -->
			<el-form-item class="formItem" label="取值范围" prop="bounds">
				<div class="formInput">
					<span class="formInputSpan">1</span>
					<span class="betweenInput">~</span>
					<el-input
						class="formInputSmall"
						size="small"
						placeholder="如 开"
						v-model="form.bounds.trueValue"
					></el-input>
				</div>
				<div class="formInput">
					<span class="formInputSpan">0</span>
					<span class="betweenInput">~</span>
					<el-input
						class="formInputSmall"
						size="small"
						placeholder="如 关闭"
						v-model="form.bounds.falseValue"
					></el-input>
				</div>
			</el-form-item>
			<!-- 读写类型 -->
			<el-form-item class="formItem" label="读写类型" prop="rw">
				<el-radio-group v-model="form.rw">
					<el-radio :label="3">读写</el-radio>
					<el-radio :label="1">只读</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 描述 -->
			<el-form-item class="formItem" label="描述">
				<el-input
					placeholder="请输入"
					type="textarea"
					class="formInput"
					size="small"
				></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
const units = require("../../../../assets/static").units;
export default {
	name: "configBool",
	data() {
		return {
			units,
			rules: {
				byteLen: [
					{
						required: true,
						message: "请填写数据长度",
						trigger: "change",
					},
				],
				bounds: [
					{
						required: true,
						message: "请填写取值范围",
						trigger: "change",
					},
				],
				rw: [
					{
						required: true,
						message: "请选择读写类型",
						trigger: "change",
					},
				],
			},
			form: {
				byteLen: "1",
				bounds: {
					falseValue: "",
					trueValue: "",
				},
				rw: "",
			},
		};
	},
	methods: {
		handleSubmit: function () {
			if (!this.form.bounds.trueValue || !this.form.bounds.falseValue) {
				this.$message.error("请填写完整取值范围");
				return false;
			}
			let result;
			this.$refs.form.validate((valid) => {
				if (valid) {
					result = Object.assign({}, this.form);
					result.bounds = JSON.stringify(result.bounds);
				} else {
					result = false;
				}
			});
			return result;
		},
	},
};
</script>

<style scoped>
.formInput {
	width: 200px;
}
.formItem {
	width: 45%;
}
.formInputSmall {
	width: 130px;
}
.betweenInput {
	display: inline-block;
	width: 30px;
	text-align: center;
	font-size: 20px;
}
.formInputSpan {
	display: inline-block;
	text-align: center;
	width: 40px;
}
</style>