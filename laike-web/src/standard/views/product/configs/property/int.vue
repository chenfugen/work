<template>
	<div id="configInt">
		<el-form
			ref="form"
			:rules="rules"
			:model="form"
			label-width="120px"
			inline
		>
			<!-- 数据长度 -->
			<el-form-item class="formItem" label="数据长度" prop="byteLen">
				<el-tooltip
					effect="dark"
					content="最大16"
					placement="top-start"
				>
					<el-input
						type="number"
						class="formInput"
						size="small"
						v-model="form.byteLen"
						placeholder="最大16"
						max="16"
					>
						<template slot="append">字节</template>
					</el-input>
				</el-tooltip>
			</el-form-item>
			<!-- 取值范围 -->
			<el-form-item class="formItem" label="取值范围" prop="bounds">
				<div class="formInput">
					<el-input
						type="number"
						@input="handleBounds"
						v-model="min"
						class="formInputSmall"
						size="small"
						placeholder="最小值"
					></el-input>
					<span class="betweenInput">~</span>
					<el-input
						type="number"
						v-model="max"
						@input="handleBounds"
						class="formInputSmall"
						size="small"
						placeholder="最大值"
					></el-input>
				</div>
			</el-form-item>
			<!-- 步长 -->
			<el-form-item class="formItem" label="步长" prop="step">
				<el-tooltip
					effect="dark"
					content="指在取值范围内进行变化的值之间的间隔是多少距离，tc501的时间调节是按5分钟为间隔，上报是以1分钟为间隔"
					placement="top-start"
				>
					<el-input
						v-model="form.step"
						class="formInput"
						size="small"
						placeholder="步长值,默认1"
					></el-input>
				</el-tooltip>
			</el-form-item>
			<!-- 倍数 -->
			<el-form-item class="formItem" label="倍数" prop="multiple">
				<el-tooltip
					effect="dark"
					content="如:10，则设备上报的数据解析除以这个倍数，下发给设备则需要乘以这个倍数；整数类型默认为1，小数类型根据小数位进行"
					placement="top-start"
				>
					<el-input
						v-model="form.multiple"
						class="formInput"
						size="small"
						placeholder="倍数关系,如:10，则上报的数据除以这个倍数"
					></el-input>
				</el-tooltip>
			</el-form-item>
			<!-- 单位 -->
			<el-form-item class="formItem" label="单位" prop="unit">
				<el-tooltip
					effect="dark"
					content="单位预设，中英文区分"
					placement="top-start"
				>
					<el-select
						class="formInput"
						placeholder="请选择"
						v-model="form.unit"
					>
						<el-option
							v-for="item in units"
							:key="item.value"
							:value="item.value"
							:label="item.label"
						></el-option>
					</el-select>
				</el-tooltip>
			</el-form-item>
			<!-- 读写类型 -->
			<el-form-item class="formItem" label="读写类型" prop="rw">
				<el-radio-group v-model="form.rw">
					<el-radio :label="3">读写</el-radio>
					<el-radio :label="1">只读</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item class="formItem" label="描述" prop="description">
				<el-input
					v-model="form.description"
					maxlength="256"
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
	name: "configInt",
	data() {
		const checkByteLen = (rule, value, callback) => {
			if (value < 1 || value > 16) {
				callback(new Error("数据长度范围在1-16"));
			} else {
				callback();
			}
		};
		return {
			units,
			max: "",
			min: "",
			form: {
				byteLen: "", // 数据长度
				bounds: "", // 取值范围
				step: 1, // 步长
				multiple: "", // 倍数
				unit: "", // 单位
				rw: "", // 读写类型
				description: "", // 描述
			},
			rules: {
				byteLen: [
					{
						required: true,
						message: "请填写数据长度",
						trigger: "change",
					},
					{ validator: checkByteLen, trigger: "blur" },
				],
				bounds: [
					{
						required: true,
						message: "请填写完整取值范围",
						trigger: "change",
					},
				],
				step: [
					{
						required: true,
						message: "请填写步长",
						trigger: "change",
					},
				],
				multiple: [
					{
						required: true,
						message: "请填写倍数",
						trigger: "change",
					},
				],
				unit: [
					{
						required: true,
						message: "请填写单位",
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
		};
	},
	methods: {
		assignForm: function (form) {
			for (let i in this.form) {
				this.form[i] = form[i];
			}
			console.log(form);
			this.max = form.bounds ? JSON.parse(form.bounds).max : "";
			this.min = form.bounds ? JSON.parse(form.bounds).min : "";
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
		handleBounds: function (val, type) {
			if (this.max && this.min && this.max > this.min) {
				this.form.bounds = JSON.stringify({
					min: this.min,
					max: this.max,
				});
			}
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