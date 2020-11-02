<template>
	<div class="addChild">
		<!-- 父菜谱信息 -->
		<el-card class="card">
			<div class="pageTitle" slot="header">菜谱子菜谱</div>
			<div class="clearfloat">
				<el-form inline label-width="120px" class="formLeft left">
					<el-form-item class="formI" label="产品类型"></el-form-item>
					<el-form-item class="formI" label="菜谱模板"></el-form-item>
					<el-form-item class="formI" label="菜谱ID"></el-form-item>
					<el-form-item class="formI" label="菜谱类型"></el-form-item>
					<el-form-item class="formI" label="菜谱名称"></el-form-item>
					<el-form-item class="formI" label="内置菜"></el-form-item>
					<el-form-item class="formI" label="美食家"></el-form-item>
					<el-form-item class="formI" label="推荐菜"></el-form-item>
					<el-form-item class="formI" label="食材分类"></el-form-item>
					<el-form-item class="formI" label="可预约"></el-form-item>
					<el-form-item class="formI" label="菜系"></el-form-item>
					<el-form-item class="block" label="口味">
						<el-select v-model="form.flavor" placeholder="请选择">
							<el-option
								v-for="item in flavors"
								:key="item.value"
								:label="item.text"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="block" label="份量">
						<el-select
							v-model="form.people"
							multiple
							filterable
							allow-create
							default-first-option
							placeholder="请选择文章标签"
						>
							<el-option
								v-for="item in peoples"
								:key="item"
								:label="item"
								:value="item"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
		<!-- 份量 -->
		<el-tabs
			class="tabs"
			v-model="activeTab"
			closable
			@tab-remove="handleRemoveTab"
			type="card"
		>
			<el-tab-pane
				v-for="item in form.people"
				:key="item"
				:label="item"
				:name="item"
			>
				<!-- 子菜谱 -->
				<el-card class="card">
					<el-form label-width="120px" class="left">
						<el-form-item label="烹饪时间">
							<el-input
								class="formInputShort"
								placeholder="请输入"
								v-model="form.hour"
							>
								<template slot="append">小时</template>
							</el-input>
							<el-input
								class="formInputShort marginL10"
								placeholder="请输入"
								v-model="form.min"
							>
								<template slot="append">分钟</template>
							</el-input>
						</el-form-item>
						<el-form-item label="步骤简介">
							<el-input
								class="textarea"
								type="textarea"
								rows="3"
							></el-input>
						</el-form-item>
					</el-form>
				</el-card>
				<!-- 材料 -->
				<el-card class="card">
					<el-button size="mini" type="primary">新增</el-button>
					<el-table class="marginT10" :data="foods" border>
						<el-table-column type="index"> </el-table-column>
						<el-table-column prop="date" label="食材名称">
						</el-table-column>
						<el-table-column prop="name" label="用量">
						</el-table-column>
						<el-table-column prop="address" label="计量">
						</el-table-column>
						<el-table-column prop="address" label="计量单位">
						</el-table-column>
						<el-table-column prop="address" label="使用方">
						</el-table-column>
						<el-table-column prop="address" label="操作">
							<template slot-scope="scope">
								<el-link
									type="primary"
									:disabled="scope.$index == 0"
									@click="handleMove(scope.row)"
								>
									上移
								</el-link>
								<el-link
									type="primary"
									class="marginL10"
									@click="handleMove(scope.row)"
								>
									删除
								</el-link>
								<el-link
									type="primary"
									class="marginL10"
									:disabled="scope.$index == foods.length"
									@click="handleMove(scope.row)"
								>
									下移
								</el-link>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
				<!-- 步骤 -->
				<step
					v-for="(item, index) in steps"
					:key="index"
					:idx="index"
					:last="index == steps.length - 1 ? true : false"
					class="marginT20"
				></step>
				<!-- 添加按钮 -->
				<el-card
					class="addBtn"
					shadow="hover"
					@click.native="handleAddStep"
				>
					<i class="el-icon-plus"></i>
				</el-card>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import step from "./menuStep";
export default {
	name: "addChild",
	data() {
		return {
			peoples: ["1人份", "2人份", "3人份", "4人份"],
			base64: "",
			activeTab: "1人份",
			foods: [{}],
			steps: [{}],
			form: {
				flavor: "",
				people: ["1人份"],
				hour: "",
				min: "",
			},
		};
	},
	components: {
		step,
	},
	computed: {
		flavors() {
			return this.$store.state.oldStore.flavors;
		},
	},
	watch: {
		form: {
			deep: true,
			handler: function (val) {
				if (val.people.length > 0) {
					this.activeTab = val.people[val.people.length - 1];
				}
			},
		},
	},
	mounted() {
		// let idx = 3,
		// 	fun = "up";
		// let i = fun == "fown" ? idx - 1 : idx;
		// var arr = ["1", "2", "3", "4", "5"];
		// arr[i] = arr.splice(arr[i], 1, arr[i])[0];
		// console.log(arr); //[1,2,4,3,5]
	},
	methods: {
		handleNext: function () {
			this.$router.push({
				path: "./",
			});
		},
		handleTabsEdit: function () {},
		flavorsLabel(val) {
			let list = this.$store.state.oldStore.flavors;
			for (let i in list) {
				if (list[i].value == val) {
					return list[i].text;
				}
			}
		},
		handleRemoveTab: function (name) {
			let list = Object.assign([], this.form.people);
			for (let i in list) {
				if (list[i] == name) {
					list.splice(i, 1);
				}
			}
			this.$set(this.form, "people", list);
		},
		handleMove: function (row) {},
		handleMoveStep: function (fun, idx) {
			let i = fun == "up" ? idx - 1 : idx;
			let list = Object.assign([], this.steps);
			list[idx] = list.splice(list[idx], 1, list[idx])[0];
			this.$set(this, "steps", list);
		},
		handleDeleteStep: function (idx) {
			let list = Object.assign([], this.steps);
			list.splice(idx, 1);
			this.$set(this, "steps", list);
		},
		handleAddStep: function () {
			let list = Object.assign([], this.steps);
			list.push({});
			this.$set(this, "steps", list);
		},
	},
};
</script>

<style>
.card {
	margin-top: 20px;
	padding: 0 10px;
}
.pageTitle {
	font-size: 20px;
	font-weight: 600;
}
.formLeft {
	width: 600px;
}
.formLeft .formI {
	width: 45%;
}
.tabs {
	background-color: #fff;
	margin-top: 20px;
	padding: 10px;
}
.formInputShort {
	width: 150px;
}
.textarea {
	width: 800px;
}
.addChild .addBtn {
	margin-top: 20px;
	margin-bottom: 20px;
	text-align: center;
	font-size: 30px;
	cursor: pointer;
	border: 2px dashed #d9d9d9;
}
.addChild .addBtn:hover {
	border-color: #409eff;
}
</style>