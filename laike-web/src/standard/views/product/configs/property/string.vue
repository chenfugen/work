<template>
	<div id="configStr">
		<el-form
			ref="form"
			:rules="rules"
			:model="form"
			label-width="120px"
			inline
		>
			<!-- 数据长度 -->
			<el-form-item class="formItem" label="数据长度" prop="byteLen">
				<el-input
					type="number"
					class="formInput"
					size="small"
					placeholder="1~65535"
					max="65535"
					v-model="form.byteLen"
				>
					<template slot="append">字节</template>
				</el-input>
			</el-form-item>
			<!-- 读写类型 -->
			<el-form-item class="formItem" label="读写类型" prop="rw">
				<el-radio-group v-model="form.rw">
					<el-radio :label="3">读写</el-radio>
					<el-radio :label="1">只读</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 读写类型 -->
			<el-form-item class="formItem" label="编码方式" prop="charcodec">
				<el-select v-model="form.charcodec">
					<el-radio value="UTF-8" label="UTF-8"></el-radio>
					<el-radio value="GBK" label="GBK"></el-radio>
				</el-select>
			</el-form-item>
			<!-- 描述 -->
			<el-form-item class="formItem" label="描述" prop="description">
				<el-input
					v-model="form.description"
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
export default {
	name: "configStr",
	data() {
		var checkByteLen = (rule, value, callback) => {
			if (Number(value) < 1 || Number(value) > 65535) {
				callback(new Error("数据长度范围为1-65535"));
			} else {
				callback();
			}
		};
		return {
			rules: {
				byteLen: [
					{
						required: true,
						message: "请填写数据长度",
						trigger: "change",
					},
					{
						validator: checkByteLen,
						trigger: "blur",
					},
				],
				rw: [
					{
						required: true,
						message: "请选择读写类型",
						trigger: "change",
					},
				],
				charcodec: [
					{
						required: true,
						message: "请选择编码类型",
						trigger: "change",
					},
				],
			},
			form: {
				byteLen: "",
				description: "",
				rw: "",
				charcodec: "",
			},
		};
	},
	methods: {
		handleSubmit: function () {
			let result;
			this.$refs.form.validate((valid) => {
				if (valid) {
					result = this.form;
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
	width: 70px;
}
.betweenInput {
	display: inline-block;
	width: 60px;
	text-align: center;
	font-size: 20px;
}
</style>