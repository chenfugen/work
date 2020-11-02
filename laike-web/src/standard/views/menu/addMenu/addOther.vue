<template>
	<div class="addOther">
		<!-- 父菜谱信息 -->
		<el-card class="card">
			<div class="pageTitle" slot="header">创建菜谱</div>
			<el-form inline label-width="120px">
				<el-form-item class="formI" label="产品类型"></el-form-item>
				<el-form-item class="formI" label="菜谱模板"></el-form-item>
				<el-form-item class="formI" label="内置菜">是</el-form-item>
				<el-form-item class="formI" label="菜谱类型">
					常规菜谱
				</el-form-item>
				<!-- 菜谱图片 -->
				<el-form-item class="block" label="菜谱列表图片">
					<el-upload
						ref="menuImg"
						class="menuImg-uploader"
						:auto-upload="false"
						action="/lexy/api/common/saveMenuImage"
						:limit="1"
						:show-file-list="false"
						:on-change="
							(file, filesList) => handleChoseFile(file, 'active')
						"
						accept=".jpg"
						style="width: 400px; height: 200px"
					>
						<img
							v-if="base64"
							:src="base64"
							class="menuImgAppImage"
						/>
						<div class="menuImg-add">单击上传</div>
					</el-upload>
				</el-form-item>
				<!--  推荐菜-->
				<el-form-item class="formI" label="推荐菜">
					<el-select v-model="form.recommend">
						<el-option :value="true" label="是"></el-option>
						<el-option :value="false" label="否"></el-option>
					</el-select>
				</el-form-item>
				<!--  预约-->
				<el-form-item class="formI" label="预约">
					<el-select v-model="form.subscribe">
						<el-option :value="0" label="不涉及"></el-option>
						<el-option :value="1" label="是"></el-option>
						<el-option :value="2" label="否"></el-option>
					</el-select>
				</el-form-item>
				<!-- 时间设置 -->
				<el-form-item class="formI" label="时间设置">
					<el-select v-model="form.timeSet">
						<el-option :value="0" label="不涉及"></el-option>
						<el-option :value="1" label="APP可更改时间"></el-option>
						<el-option
							:value="2"
							label="APP不可更改时间"
						></el-option>
					</el-select>
				</el-form-item>
				<!-- 保温 -->
				<el-form-item class="formI" label="保温">
					<el-select v-model="form.keepWarm">
						<el-option :value="0" label="不涉及"></el-option>
						<el-option :value="1" label="结束不保温"></el-option>
						<el-option
							:value="2"
							label="结束时进入保温"
						></el-option>
					</el-select>
				</el-form-item>
				<!-- 美食家 -->
				<el-form-item class="formI" label="美食家">
					<el-select v-model="form.cuisines">
						<el-option
							v-for="item in cuisines"
							:key="item.value"
							:value="item.value"
							:label="item.text"
						></el-option>
					</el-select>
				</el-form-item>
				<!-- 份量 -->
				<el-form-item class="formI" label="份量">
					<el-tooltip
						effect="dark"
						content="如不需要份量，则不需要填写"
						placement="top-start"
					>
						<el-input v-model="form.peoples"> </el-input>
					</el-tooltip>
				</el-form-item>
				<!-- 食材分类 -->
				<el-form-item class="formI" label="食材分类">
					<el-select v-model="form.categorys">
						<el-option
							v-for="item in categorys"
							:key="item.value"
							:value="item.value"
							:label="item.text"
						></el-option>
					</el-select>
				</el-form-item>
				<!-- 烹饪耗时 -->
				<el-form-item class="formI" label="烹饪耗时">
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
				<!-- 菜系 -->
				<el-form-item class="formI" label="菜系">
					<el-select v-model="form.cuisine"> </el-select>
				</el-form-item>
				<!-- 关键字 -->
				<el-form-item class="formI" label="关键字">
					<el-tooltip
						effect="dark"
						content="App搜索时的关键字(最多32字，以逗号分隔)"
						placement="top-start"
					>
						<el-input class="longInput" v-model="form.peoples">
						</el-input>
					</el-tooltip>
				</el-form-item>
				<!-- 口味 -->
				<el-form-item class="formI" label="口味">
					<el-select v-model="form.cuisines">
						<el-option
							v-for="item in cuisines"
							:key="item.value"
							:value="item.value"
							:label="item.text"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- 材料 -->
		<el-card class="card">
			<div slot="header">需要食材</div>
			<el-button size="mini" type="primary">新增</el-button>
			<el-table class="marginT10" :data="foods" border>
				<el-table-column type="index"> </el-table-column>
				<el-table-column prop="date" label="食材名称">
				</el-table-column>
				<el-table-column prop="name" label="用量"> </el-table-column>
				<el-table-column prop="address" label="计量"> </el-table-column>
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
		<!-- 份量 -->
		<el-tabs class="tabs" v-model="activeTab">
			<el-tab-pane label="步骤描述" name="step">
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
			<el-tab-pane label="参数设置" name="propSet"> </el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import step from "./otherStep";
export default {
	name: "addOther",
	data() {
		return {
			peoples: ["1人份", "2人份", "3人份", "4人份"],
			base64: "",
			activeTab: "step",
			foods: [{}],
			steps: [{}],
			form: {
				recommend: false, // 推荐
				subscribe: 0, // 预约
				timeSet: 0, // 时间设置
				keepWarm: 0, // 保温
				peoples: "", // 份量
				categorys: "", // 食材分类
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
		cuisines() {
			return this.$store.state.oldStore.cuisines;
		},
		categorys() {
			return this.$store.state.oldStore.categorys;
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
	mounted() {},
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
.formI {
	width: 45%;
}
.tabs {
	background-color: #fff;
	margin-top: 20px;
	padding: 10px;
	border-radius: 5px;
}
.formInputShort {
	width: 45%;
}
.textarea {
	width: 800px;
}
.addOther .addBtn {
	margin-top: 20px;
	margin-bottom: 20px;
	text-align: center;
	font-size: 30px;
	cursor: pointer;
	border: 2px dashed #d9d9d9;
}
.addOther .addBtn:hover {
	border-color: #409eff;
}
.addOther .menuImg-uploader {
	display: block;
	margin-bottom: 6px;
}
.addOther .menuImgImage {
	width: 400px;
	height: 200px;
}
.addOther .menuImgAppImage {
	width: 400px;
	height: 200px;
}
.addOther .menuImg-uploader .el-upload {
	float: left;
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	height: 100%;
	width: 100%;
}
.addOther .menuImg-uploader .el-upload:hover {
	border-color: #409eff;
}
.addOther .menuImg-add {
	color: #8c939d;
	font-size: 22px;
	width: 400px;
	height: 200px;
	line-height: 200px;
	text-align: center;
}
.addOther .imgTip {
	font-size: 14px;
	color: #bbb;
	text-align: center;
}
.addOther .longInput {
	width: 300px;
}
</style>