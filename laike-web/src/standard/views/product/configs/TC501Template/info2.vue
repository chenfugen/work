<template>
	<el-card id="info2">
		<div slot="header">详情页面 2/3</div>
		<div class="main clearfloat marginT20">
			<div class="templateBox left">
				<img class="phoneImg" src="../../../../assets/img/TC501/info2.png" alt />
			</div>
			<!-- 箭头块 -->
			<div class="iconBox left">
				<i class="el-icon-right iconRight" style="margin-top: 66px"></i>
				<i class="el-icon-right iconRight" style="margin-top: 270px"></i>
			</div>
			<!-- 配置块 -->
			<div class="configBox left">
				<p class="title">按钮设计</p>
				<!-- ICON列表 -->
				<div class="iconConfigList">
					<p class="title" style="margin-top: 15px">工作状态ICON上传(图片尺寸限制192*192)</p>
					<!-- 上传列表 -->
					<div class="btnConfigItem marginT10 clearfloat" v-for="(item, index) in icons" :key="index">
						<!-- 选择模式 -->
						<el-select v-model="item.state">
							<el-option
								v-for="model in workingStates"
								:key="model.value"
								:value="model.value"
								:label="model.label"
							></el-option>
						</el-select>
						<!-- 删除 -->
						<el-button
							style="margin-top: 6px; margin-left: 10px"
							class="right"
							size="mini"
							icon="el-icon-delete"
							type="danger"
							@click="handleDeleteIcon(index)"
							circle
						></el-button>
						<!-- icon上传 -->
						<el-upload
							:ref="'icons' + index"
							:show-file-list="false"
							:auto-upload="false"
							action="#"
							v-if="item.value != 0"
							class="right"
							accept=".ico"
							:limit="1"
							:on-change="
								(file, filesList) =>
									handleChoseFile(file, index, 'icons')
							"
						>
							<el-button style="margin-top: 6px; margin-left: 10px" size="mini" type="primary">上传按钮ICON</el-button>
						</el-upload>
						<!-- 缩略图 -->
						<img class="iconImg" v-if="item.image" :src="item.image" alt />
					</div>
					<el-button
						style="margin-top: 6px"
						size="mini"
						icon="el-icon-plus"
						type="primary"
						@click="handleAddIcon"
					>添加状态ICON</el-button>
				</div>
				<!-- 按钮列表 -->
				<div class="btnConfigList">
					<div class="btnConfigItem marginT10" v-for="(item, index) in btns" :key="index">
						<!-- 操作 -->
						<div class="btnConfigHeader">
							<span class="marginR10">{{ "按钮" + (index + 1) }}</span>
							<el-upload
								:ref="'btns' + index"
								:show-file-list="false"
								:auto-upload="false"
								action="#"
								v-if="item.value != 0"
								class="btnConfigUpload"
								accept=".ico"
								:limit="1"
								:on-change="
									(file, filesList) =>
										handleChoseFile(file, index, 'btns')
								"
							>
								<el-button size="mini" type="primary">上传按钮ICON</el-button>
							</el-upload>
							<img :src="item.activeImage" v-if="item.activeImage" class="btnImage" />
							<el-button
								class="right"
								size="mini"
								type="danger"
								icon="el-icon-delete"
								@click="handleDeleteBtn(index)"
							></el-button>
						</div>
						<!-- 配置 -->
						<div class="marginT10 clearfloat">
							<!-- 名称 -->
							<el-input size="small" class="btnConfigInput left" v-model="item.name"></el-input>
							<!-- 类型 -->
							<el-select v-model="item.type" size="small" class="btnConfigInput left marginL10">
								<el-option
									v-for="type in btnTypes"
									:key="type.value"
									:value="type.value"
									:label="type.label"
								></el-option>
							</el-select>
							<!-- 页面 type == 2 -->
							<el-select
								v-model="item.secondImageId"
								v-if="item.type == 2"
								size="small"
								class="btnConfigInput left marginL10"
								@change="
									(val) => {
										handleChangePageType(index, val);
									}
								"
							>
								<el-option
									v-for="page in pages"
									:key="page.id"
									:value="page.id"
									:label="Utils.escapePageName(page.type)"
								></el-option>
							</el-select>
							<!-- 属性 type == 1 -->
							<el-select
								v-model="item.propertyId"
								v-if="item.type == 1"
								size="small"
								class="btnConfigInput left marginL10"
							>
								<el-option
									v-for="type in propertes"
									:key="type.id"
									:value="type.id"
									:label="type.propertyName"
								></el-option>
							</el-select>
							<!-- 外链 type == 3 -->
							<el-input
								size="small"
								class="longInput left marginL10"
								v-model="item.linkUrl"
								v-if="item.type == 3"
							></el-input>
							<!-- 菜谱 type == 2 -->
							<el-select
								v-model="item.menuId"
								v-if="item.type == 2 && item.pageType == 12"
								size="small"
								class="longInput left marginL10"
							></el-select>
						</div>
					</div>
					<el-button class="block marginT20" size="mini" type="primary" @click="handleAddBtn">新增按钮</el-button>
				</div>
			</div>
		</div>
	</el-card>
</template>

<script>
import { Message } from "element-ui";
import Utils from "../../../../utils";
export default {
	name: "info2",
	props: {
		productId: {
			type: String,
			default: () => {
				return "";
			},
		},
		infoData: {
			type: Object,
			default: () => {
				return {};
			},
		},
		pages: {
			type: Array,
			default: () => {
				return [];
			},
		},
		propertes: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},
	watch: {
		infoData: {
			deep: true,
			handler(val) {
				if (val.workingState && val.workingState.length > 0) {
					this.icons = Object.assign([], val.workingState);
				}
				if (val.funcAreaAList && val.funcAreaAList.length > 0) {
					this.btns = Object.assign([], val.funcAreaAList);
				}
			},
		},
	},
	data() {
		return {
			Utils,
			btns: [
				{
					name: "",
					type: "",
					propertyId: "", // 属性ID
					activeImage: "", // icon图片
					secondImageId: "", // 页面Id
					pageType: "", // 页面类型
					linkUrl: "", // 外链
					menuId: "", // 菜谱ID
				},
			],
			icons: [
				{
					state: "",
					image: "",
				},
			],
			workingStates: [],
			statusList: [],
			btnTypes: [
				{
					value: 1,
					label: "属性",
				},
				{
					value: 2,
					label: "页面",
				},
				{
					value: 3,
					label: "外链",
				},
			],
		};
	},
	mounted() {
		this.getWorkStates();
	},
	methods: {
		// 获取工作模式
		getWorkStates: function () {
			this.$http.productWorkModels(this.productId).then((res) => {
				if (res.data.success) {
					let bounds = JSON.parse(res.data.data.bounds).items;
					for (let i in bounds) {
						this.workingStates.push({
							value: Number(i),
							label: bounds[i],
						});
					}
				}
			});
		},
		// 添加ICON
		handleAddIcon: function () {
			let list = Object.assign([], this.icons);
			list.push({
				state: "",
				image: "",
			});
			this.$set(this, "icons", list);
		},
		// 删除ICON
		handleDeleteIcon: function (index) {
			let list = Object.assign([], this.icons);
			list.splice(index, 1);
			this.$set(this, "icons", list);
		},
		// 删除Btn
		handleDeleteBtn: function (index) {
			let list = Object.assign([], this.btns);
			list.splice(index, 1);
			this.$set(this, "btns", list);
		},
		// 添加Btn
		handleAddBtn: function () {
			this.btns.push({
				name: "",
				type: "",
				propertyId: "", // 属性ID
				activeImage: "", // icon图片
				secondImageId: "", // 页面Id
				pageType: "", // 页面类型
				linkUrl: "", // 外链
				menuId: "", // 菜谱ID
			});
		},
		// 修改按钮指向页面时
		handleChangePageType: function (index, val) {
			for (let i in this.pages) {
				if (this.pages[i].id == val) {
					this.btns[index].pageType = this.pages[i].type;
				}
			}
		},
		// 提交表单
		handleSubmit: function () {
			return {
				workingState: this.icons,
				funcAreaAList: this.btns,
			};
		},
		// 选择图片
		handleChoseFile: function (file, index, name) {
			let _this = this,
				reader = new FileReader(),
				image = new Image(),
				base64 = null,
				list = Object.assign([], this[name]);
			image.onload = function () {
				if (image.width != 192 || image.height != 192) {
					Message.error("图片尺寸错误");
					_this.$refs[name + index][0].clearFiles();
				} else {
					if (name == "btns") {
						list[index].activeImage = base64;
					} else {
						list[index].image = base64;
					}
					if (name == "btns") {
						_this.$set(this, "btns", list);
					} else {
						_this.$set(this, "icons", list);
					}
					_this.$refs[name + index][0].clearFiles();
				}
			};
			reader.onload = function (e) {
				base64 = e.target.result;
				image.src = base64;
			};
			reader.readAsDataURL(file.raw);
		},
	},
};
</script>

<style scoped>
.templateBox {
	width: 280px;
}
.iconRight {
	display: block;
	font-size: 28px;
}

.title {
	font-weight: 500;
	font-size: 14px;
}
.phoneImg {
	width: 280px;
	height: 500px;
}
.configBox {
	border: 1px solid #ccc;
	width: calc(100% - 350px);
	border-radius: 5px;
	padding: 20px;
	min-height: 478px;
}
.btnConfigList {
	margin-top: 50px;
}
.btnConfigHeader {
	max-height: 40px;
	vertical-align: bottom;
	font-size: 14px;
}
.btnConfigUpload {
	display: inline-block;
	vertical-align: bottom;
}
.btnConfigInput {
	width: 150px;
}

.longInput {
	width: 250px;
}
.iconImg {
	float: right;
	width: 40px;
	height: 40px;
}
.btnImage {
	margin-left: 10px;
	vertical-align: bottom;
	width: 28px;
	height: 28px;
}
</style>