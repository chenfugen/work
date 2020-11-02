<template>
	<el-card id="info3">
		<div slot="header">详情页面 3/3</div>
		<div class="main clearfloat marginT20">
			<div class="templateBox left">
				<img class="phoneImg" src="../../../../assets/img/TC501/info3.jpeg" alt />
			</div>
			<!-- 箭头块 -->
			<div class="iconBox left">
				<i class="el-icon-right iconRight" style="margin-top: 66px"></i>
				<i class="el-icon-right iconRight" style="margin-top: 270px"></i>
			</div>
			<!-- 配置块 -->
			<div class="configBox left">
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
						<div class="btnConfigBody marginT10 clearfloat">
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
import Utils from "../../../../utils";

export default {
	name: "info3",
	props: {
		productId: {
			type: String,
			default: () => {
				return {};
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
				if (val.funcAreaBList && val.funcAreaBList.length > 0) {
					this.btns = Object.assign([], val.funcAreaBList);
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
	methods: {
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
				funcAreaBList: this.btns,
			};
		},
		// 选择图片
		handleChoseFile: function (file, index) {
			let _this = this,
				reader = new FileReader(),
				image = new Image(),
				base64 = null,
				list = Object.assign([], this.btns);
			image.onload = function () {
				if (image.width != 192 || image.height != 192) {
					Message.error("图片尺寸错误");
					_this.$refs["btns" + index][0].clearFiles();
				} else {
					list[index].activeImage = base64;
					_this.$set(this, "btns", list);
					_this.$refs["btns" + index][0].clearFiles();
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
.btnConfigLong {
	width: calc(100% - 320px);
}
.btnImage {
	margin-left: 10px;
	vertical-align: bottom;
	width: 28px;
	height: 28px;
}
.longInput {
	width: 250px;
}
</style>