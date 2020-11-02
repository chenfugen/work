<template>
	<el-card id="cooking">
		<div slot="header">烹饪页面</div>
		<div class="main clearfloat marginT20">
			<!-- 指示图 -->
			<div class="templateBox left">
				<img class="phoneImg" src="../../../../assets/img/TC501/cooking.png" alt />
			</div>
			<!-- 箭头块 -->
			<div class="iconBox left">
				<i class="el-icon-right iconRight" style="margin-top: 66px"></i>
				<i class="el-icon-right iconRight" style="margin-top: 270px"></i>
			</div>
			<!-- 配置块 -->
			<div class="configBox left">
				<!-- 图片编辑 -->
				<div>
					<p class="title">型号编辑：</p>
					<div class="clearfloat">
						<!-- 型号A -->
						<div class="left moduleA">
							<el-form label-width="80px">
								<!-- 名称 -->
								<el-form-item label="A型号">
									<el-input class="btnConfigInput" v-model="nameLeft"></el-input>
								</el-form-item>
								<!-- 上传 -->
								<el-form-item class="formItem" prop="productImg" label="产品图片">
									<el-upload
										ref="leftImg"
										class="pmImg-uploader"
										:show-file-list="false"
										:auto-upload="false"
										action="#"
										:limit="1"
										:on-change="
											(file, filesList) =>
												handleChoseFile(file, 'left')
										"
										accept=".png"
									>
										<img v-if="leftBase64" :src="leftBase64" class="pmImg" />
										<i v-else class="el-icon-plus pmImg-uploader-icon"></i>
									</el-upload>
									<div class="formTip">
										<div>
											1:1 .png格式； 像素：
											<span class="red">99*99</span>
										</div>
									</div>
								</el-form-item>
							</el-form>
						</div>
						<!-- 型号B -->
						<div class="left moduleB">
							<el-form label-width="80px">
								<!-- 名称 -->
								<el-form-item label="B型号">
									<el-input class="btnConfigInput" v-model="nameRight"></el-input>
								</el-form-item>
								<!-- 上传 -->
								<el-form-item class="formItem" prop="productImg" label="产品图片">
									<el-upload
										ref="rightImg"
										class="pmImg-uploader"
										:show-file-list="false"
										:auto-upload="false"
										action="#"
										:limit="1"
										:on-change="
											(file, filesList) =>
												handleChoseFile(file, 'right')
										"
										accept=".png"
									>
										<img v-if="rightBase64" :src="rightBase64" class="pmImg" />
										<i v-else class="el-icon-plus pmImg-uploader-icon"></i>
									</el-upload>
									<div class="formTip">
										<div>
											1:1 .png格式； 像素：
											<span class="red">99*99</span>
										</div>
									</div>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
				<!-- 按钮编辑 -->
				<div class="marginT20" v-for="(item, index) in customerConfig" :key="index">
					<div class="btnConfigHeader">
						<span class="marginR10">
							{{
							"按钮" + (index + 1)
							}}
						</span>

						<el-upload
							class="btnConfigUpload"
							:ref="'icon' + index"
							:show-file-list="false"
							:auto-upload="false"
							action="#"
							:limit="1"
							:on-change="
								(file, filesList) =>
									handleChoseIcon(file, index)
							"
							accept=".ico"
						>
							<el-button size="mini" type="primary">上传按钮ICON</el-button>
							<img :src="item.image" v-if="item.image" class="btnImage" />
						</el-upload>
					</div>
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
			</div>
		</div>
	</el-card>
</template>

<script>
import { Message } from "element-ui";
import Utils from "../../../../utils";
export default {
	name: "cooking",
	props: {
		productId: {
			type: String,
			default: () => {
				return "";
			},
		},
		cookingData: {
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
	data() {
		return {
			Utils,
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
			// 表单内容
			nameLeft: "",
			leftBase64: "",
			leftFile: "",
			nameRight: "",
			rightBase64: "",
			rightFile: "",
			customerConfig: [
				{
					name: "",
					type: "",
					image: "", // icon图片
					propertyId: "", // 属性ID
					secondImageId: "", // 页面Id
					pageType: "", // 页面类型
					linkUrl: "", // 外链
					menuId: "", // 菜谱ID
				},
				{
					name: "",
					type: "",
					image: "", // icon图片
					propertyId: "", // 属性ID
					secondImageId: "", // 页面Id
					pageType: "", // 页面类型
					linkUrl: "", // 外链
					menuId: "", // 菜谱ID
				},
				{
					name: "",
					type: "",
					image: "", // icon图片
					propertyId: "", // 属性ID
					secondImageId: "", // 页面Id
					pageType: "", // 页面类型
					linkUrl: "", // 外链
					menuId: "", // 菜谱ID
				},
			],
		};
	},
	watch: {
		cookingData: {
			deep: true,
			handler: function (val) {
				if (val.customerConfig) {
					this.customerConfig = Object.assign([], val.customerConfig);
				}
				if (val.imageLeft) {
					this.leftBase64 =
						this.$store.state.standard.fileLoad + val.imageLeft;
				}
				if (val.imageRight) {
					this.rightBase64 =
						this.$store.state.standard.fileLoad + val.imageRight;
				}
				this.nameLeft = val.nameLeft;
				this.nameRight = val.nameRight;
			},
		},
	},
	mounted() {},
	methods: {
		// 修改按钮指向页面时
		handleChangePageType: function (index, val) {
			for (let i in this.pages) {
				if (this.pages[i].id == val) {
					this.customerConfig[index].pageType = this.pages[i].type;
				}
			}
		},
		handleSubmit: function () {
			let form = {
				customerConfig: this.customerConfig,
				nameLeft: this.nameLeft,
				nameRight: this.nameRight,
				inner: this.cookingData.inner,
			};
			if (this.rightFile) {
				form.imageRight = this.rightFile;
			}
			if (this.leftFile) {
				form.imageLeft = this.leftFile;
			}
			return form;
		},
		handleChoseFile: function (file, flag) {
			let _this = this,
				reader = new FileReader(),
				image = new Image(),
				base64 = null;
			image.onload = function () {
				if (image.width != 99 || image.height != 99) {
					Message.error("图片尺寸错误");
					_this.$refs[flag + "Img"].clearFiles();
				} else {
					_this[flag + "Base64"] = base64;
					_this[flag + "File"] = file.raw;
					_this.$refs[flag + "Img"].clearFiles();
				}
			};
			reader.onload = function (e) {
				base64 = e.target.result;
				image.src = base64;
			};
			reader.readAsDataURL(file.raw);
		},
		handleChoseIcon: function (file, index) {
			let _this = this,
				reader = new FileReader(),
				image = new Image(),
				base64 = null;
			image.onload = function () {
				if (image.width > 192 || image.height > 192) {
					Message.error("icon尺寸过大");
					_this.$refs["icon" + index].clearFiles();
				} else {
					_this.customerConfig[index].image = base64;
					_this.$refs["icon" + index][0].clearFiles();
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
.moduleA,
.moduleB {
	width: 50%;
}
.pmImg-uploader {
	border: 2px dashed #d9d9d9;
	width: 178px;
	height: 178px;
}
.pmImg-uploader:hover {
	border-color: #409eff;
}
.pmImg-uploader .el-upload {
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.pmImg-uploader:hover {
	border-color: #409eff;
}
.pmImg-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
.pmImg {
	width: 178px;
	height: 178px;
	display: block;
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