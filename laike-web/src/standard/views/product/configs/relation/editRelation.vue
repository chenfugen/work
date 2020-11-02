<template>
	<div class="editRelation clearfloat">
		<div>
			<!-- 自变量 -->
			<div class="left radBox">
				<div v-for="(raItem,raIdx) in radmDef" :key="raIdx">
					<!-- enum || bool-->
					<el-select size="small" v-if="radmArg.type == 5" v-model="raItem.value">
						<el-option
							v-for="raEnum in raEnumList"
							:key="raEnum.value"
							:value="raEnum.value"
							:label="raEnum.label"
						></el-option>
					</el-select>
					<!-- int || float -->
					<div v-if="radmArg.type == 1 || radmArg.type == 2">
						<el-input size="small" class="numInput" v-model="raItem.min" type="number" placeholder="最小值"></el-input>
						<div class="numCenter">~</div>
						<el-input size="small" class="numInput" v-model="raItem.max" type="number" placeholder="最大值"></el-input>
					</div>
				</div>
			</div>
			<!-- 因变量 -->
			<div class="right depBox">
				<div v-for="(deItem,deIdx) in depDef" :key="'de'+deIdx">
					<!-- enum || bool -->
					<el-select size="small" v-if="depdArg.type == 5 || depdArg.type == 6" v-model="deItem.value">
						<el-option
							v-for="deEnum in deEnumList"
							:key="deEnum.value"
							:value="deEnum.value"
							:label="deEnum.label"
						></el-option>
					</el-select>
					<!-- int || float -->
					<div v-if="depdArg.type == 1">
						<el-input size="small" class="numInput" v-model="deItem.min" type="number" placeholder="最小值"></el-input>
						<div class="numCenter">~</div>
						<el-input size="small" class="numInput" v-model="deItem.max" type="number" placeholder="最大值"></el-input>
					</div>
				</div>
			</div>
		</div>
		<div>
			<el-link
				:underline="false"
				type="primary"
				v-if="radmArg.type && depdArg.type"
				@click="handleAddRelation"
			>添加关系</el-link>
		</div>
	</div>
</template>

<script>
export default {
	name: "editRelation",
	props: {
		radmArg: {
			// 自变量
			type: Object,
			default: () => {
				return {};
			},
		},
		depdArg: {
			// 因变量
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	data() {
		return {
			raEnumList: [],
			deEnumList: [],
			// 枚举
			radmDef: [
				{
					value: "",
					max: "",
					min: "",
				},
			],
			depDef: [
				{
					value: "",
					max: "",
					min: "",
				},
			],
		};
	},
	watch: {
		radmArg: {
			deep: true,
			handler(val) {
				this.handleResetRelation();
				this.getEnumList("ra", val);
			},
		},
		depdArg: {
			deep: true,
			handler(val) {
				this.handleResetRelation();
				this.getEnumList("de", val);
			},
		},
	},
	created() {
		this.getEnumList("de", this.depdArg);
		this.getEnumList("ra", this.radmArg);
	},
	methods: {
		assignFunc: function (func) {
			let obj = JSON.parse(func),
				raList = [],
				deList = [];
			// 自变量
			for (let i in obj.radmDef.range) {
				if (obj.radmDef.type == 1 || obj.radmDef.type == 2) {
					raList.push({
						value: "",
						max: obj.radmDef.range[i].max,
						min: obj.radmDef.range[i].min,
					});
				} else {
					raList.push({
						value: obj.radmDef.range[i].key,
						max: "",
						min: "",
					});
				}
			}
			// 因变量
			for (let i in obj.depDef.range) {
				if (obj.depDef.type == 1 || obj.depDef.type == 2) {
					deList.push({
						value: "",
						max: obj.depDef.range[i].max,
						min: obj.depDef.range[i].min,
					});
				} else {
					deList.push({
						value: obj.depDef.range[i].key,
						max: "",
						min: "",
					});
				}
			}
			this.depDef = deList;
			this.radmDef = raList;
		},
		handleAddRelation: function () {
			let raList = Object.assign([], this.radmDef),
				deList = Object.assign([], this.depDef);
			raList.push({
				value: "",
				max: "",
				min: "",
			});
			deList.push({
				value: "",
				max: "",
				min: "",
			});
			this.radmDef = raList;
			this.depDef = deList;
		},
		handleResetRelation: function () {
			let radmDef = [
					{
						value: "",
						max: "",
						min: "",
					},
				],
				depDef = [
					{
						value: "",
						max: "",
						min: "",
					},
				];
			this.radmDef = radmDef;
			this.depDef = depDef;
		},
		submitForm: function () {
			let raList = [],
				deList = [],
				value = "";
			// 自变量
			if (this.radmArg.type == 1 || this.radmArg.type == 2) {
				for (let i in this.radmDef) {
					raList.push({
						min: this.radmDef[i].min,
						max: this.radmDef[i].max,
						includeMin: true,
						includeMax: true,
					});
				}
			} else if (this.radmArg.type == 5 || this.radmArg.type == 6) {
				for (let i in this.radmDef) {
					for (let x in this.raEnumList) {
						if (this.raEnumList[x].value == this.radmDef[i].value) {
							value = this.raEnumList[x].label;
						}
					}
					raList.push({
						key: this.radmDef[i].value,
						value: value,
					});
				}
			}
			// 因变量
			if (this.depdArg.type == 1 || this.depdArg.type == 2) {
				for (let i in this.depDef) {
					deList.push({
						min: this.depDef[i].min,
						max: this.depDef[i].max,
						includeMin: true,
						includeMax: true,
					});
				}
			} else if (this.depdArg.type == 5 || this.depdArg.type == 6) {
				for (let i in this.depDef) {
					for (let x in this.deEnumList) {
						if (this.deEnumList[x].value == this.depDef[i].value) {
							value = this.deEnumList[x].label;
						}
					}
					deList.push({
						key: this.depDef[i].value,
						value: value,
					});
				}
			}
			return {
				radmDef: {
					type: this.radmArg.type,
					range: raList,
				},
				depDef: {
					type: this.depdArg.type,
					range: deList,
				},
			};
		},
		resetFields: function () {
			this.raEnumList = [];
			this.deEnumList = [];
			this.radmDef = [
				{
					value: "",
					max: "",
					min: "",
				},
			];
			this.depDef = [
				{
					value: "",
					max: "",
					min: "",
				},
			];
		},
		getEnumList: function (flag, val) {
			if ((val.type == 5 || val.type == 6) && val.bounds) {
				let obj = JSON.parse(val.bounds).items,
					list = [];
				for (let i in obj) {
					list.push({
						value: i,
						label: obj[i],
					});
				}
				this[flag + "EnumList"] = list;
			}
		},
	},
};
</script>

<style scoped>
.editRelation {
	width: calc(95%);
	min-height: 40px;
}
.radBox,
.depBox {
	width: 50%;
	min-height: 40px;
	text-align: center;
}
.numInput {
	display: inline-block;
	width: calc(40%);
}
.numCenter {
	display: inline-block;
	width: calc(10%);
}
.addBtn {
	display: block;
}
</style>