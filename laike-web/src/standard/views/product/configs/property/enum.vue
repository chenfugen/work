<template>
	<div id="configEnum">
		<el-form
			ref="form"
			:rules="rules"
			:model="form"
			label-width="120px"
			inline
		>
			<!-- 数据长度 -->
			<el-form-item class="formItem" label="数据长度" prop="byteLen">
				<el-input v-model="form.byteLen" class="formInput" size="small">
					<template slot="append">字节</template>
				</el-input>
			</el-form-item>
			<!-- 枚举 -->
			<el-form-item class="formItem" label="枚举" prop="bounds">
				<div class="formEnumLine formEnumLabel clearfloat">
					<span class="formEnumInput left" style="margin-left: 28px">
						属性Key
					</span>
					<span class="formEnumInput left" style="margin-left: 20px">
						属性Value
					</span>
				</div>
				<!-- 枚举 -->
				<div
					class="formEnumLine"
					v-for="(item, index) in enumList"
					:key="index"
				>
					<el-button
						style="margin-right: 5px"
						circle
						icon="el-icon-plus"
						type="primary"
						size="mini"
						@click="handleAdd(index)"
					></el-button>
					<el-input
						class="formEnumInput"
						size="small"
						placeholder="如：0"
						v-model="enumList[index].name"
					></el-input>
					<span class="betweenInput">~</span>
					<el-input
						class="formEnumInput"
						size="small"
						placeholder="描述"
						v-model="enumList[index].value"
					></el-input>
					<el-button
						:disabled="enumList.length == 1"
						style="margin-left: 5px"
						circle
						icon="el-icon-minus"
						size="mini"
						@click="handleSub(index)"
					></el-button>
				</div>
			</el-form-item>
			<!-- 读写类型 -->
			<el-form-item class="formItem" label="读写类型" prop="rw">
				<el-radio-group v-model="form.rw">
					<el-radio :label="3">读写</el-radio>
					<el-radio :label="1">只读</el-radio>
				</el-radio-group>
			</el-form-item>
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
export default {
	name: "configEnum",
	data() {
		var checkByteLen = (rule, value, callback) => {
			if (Number(value) < 1 || Number(value) > 65535) {
				callback(new Error("数据长度范围为1-65535"));
			} else {
				callback();
			}
		};
		var checkBounds = (rule, value, callback) => {
			let flag = true;
			for (let i in this.enumList) {
				if (
					this.enumList[i].name == "" ||
					this.enumList[i].value == ""
				) {
					flag = false;
				}
			}
			if (flag) {
				callback();
			} else {
				callback(new Error("请补全枚举数据"));
			}
		};
		return {
			enumList: [
				{
					name: "",
					value: "",
				},
			],
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
				bounds: [
					{
						required: true,
						message: "请至少添加一组枚举类",
						trigger: "change",
					},
					{
						checkBounds: checkByteLen,
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
			},
			form: {
				byteLen: "",
				bounds: "",
				description: "",
				rw: "",
			},
		};
	},
	watch: {
		enumList: {
			deep: true,
			handler: function (val) {
				let res = "";
				val.forEach((item) => {
					if (item.name && item.value) {
						if (res.length > 1) {
							res =
								res +
								"," +
								'"' +
								item.name +
								'":"' +
								item.value +
								'"';
						} else {
							res = '"' + item.name + '":"' + item.value + '"';
						}
					}
				});
				this.form.bounds = res ? '{"item":{' + res + "}}" : "";
			},
		},
	},
	methods: {
		handleAdd: function (index) {
			let list = Object.assign([], this.enumList);
			list.splice(index, 0, {
				name: "",
				value: "",
			});
			this.$set(this, "enumList", list);
		},
		handleSub: function (index) {
			let list = Object.assign([], this.enumList);
			list.splice(index, 1);
			this.$set(this, "enumList", list);
		},
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
	vertical-align: top;
}
.formInputSmall {
	display: inline-block;
	width: 90px;
}
.betweenInput {
	display: inline-block;
	width: 20px;
	text-align: center;
	font-size: 20px;
}

.formEnumLine {
	width: 260px;
}
.formEnumInput {
	display: inline-block;
	width: 85px;
}
.formEnumLabel {
	text-align: center;
	font-size: 12px;
}
</style>