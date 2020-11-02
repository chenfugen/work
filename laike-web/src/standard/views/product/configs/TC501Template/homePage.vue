<template>
	<div id="TC501Home">
		<el-tabs v-model="activeTab">
			<el-tab-pane label="详情页面" name="info">
				<info1 ref="info1" :productId="productId" :infoData="infoData"></info1>
				<info2
					ref="info2"
					:productId="productId"
					:infoData="infoData"
					class="marginT20"
					:pages="pages"
					:propertes="propertes"
				></info2>
				<info3
					ref="info3"
					:productId="productId"
					:infoData="infoData"
					class="marginT20"
					:pages="pages"
					:propertes="propertes"
				></info3>
				<div class="clearfloat">
					<el-button type="primary" class="saveBtn right" @click="handleSubmitInfo">保存</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane label="烹饪页面" name="cooking">
				<cooking
					ref="cooking"
					:productId="productId"
					:cookingData="cookingData"
					:pages="pages"
					:propertes="propertes"
				></cooking>
				<div class="clearfloat">
					<el-button type="primary" class="saveBtn right" @click="handleSubmitCooking">保存</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane label="烹饪状态" name="cookStatus">
				<cookStatus1
					ref="cookStatus1"
					:productId="productId"
					:statusData="statusData"
					:pages="pages"
					:propertes="propertes"
				></cookStatus1>
				<cookStatus2
					ref="cookStatus2"
					:productId="productId"
					:statusData="statusData"
					:pages="pages"
					:propertes="propertes"
					class="marginT20"
				></cookStatus2>
				<div class="clearfloat">
					<el-button type="primary" class="saveBtn right" @click="handleSubmitCookStatus">保存</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane label="菜谱详情" name="menuInfo">
				<menuInfo
					ref="menuInfo"
					:productId="productId"
					:menuInfo="menuInfo"
					:pages="pages"
					:propertes="propertes"
				></menuInfo>
				<div class="clearfloat">
					<el-button type="primary" class="saveBtn right" @click="handleSubmitMenuInfo">保存</el-button>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import info1 from "./info1";
import info2 from "./info2";
import info3 from "./info3";
import cooking from "./cooking";
import cookStatus1 from "./cookStatus1";
import cookStatus2 from "./cookStatus2";
import menuInfo from "./menuInfo";
export default {
	name: "TC501Home",
	props: {
		productId: {
			type: String,
			default: () => {
				return "";
			},
		},
		templateId: {
			default: () => {
				return "";
			},
		},
	},
	components: {
		info1,
		info2,
		info3,
		cooking,
		cookStatus1,
		cookStatus2,
		menuInfo,
	},
	data() {
		return {
			pages: [],
			propertes: [],
			infoData: {}, // 详情页数据
			cookingData: {}, // 烹饪页面数据
			statusData: {}, // 烹饪状态数据
			menuInfo: {}, // 菜谱详情数据
			activeTab: "info",
		};
	},
	mounted() {
		this.handleGetPages();
		this.getPropertes();
		this.getInfoPage();
		this.getSecondPage(10); // 烹饪页面
		this.getSecondPage(11); // 烹饪状态
		this.getSecondPage(12); // 菜谱详情
	},
	methods: {
		// 获取次级页面列表
		handleGetPages: function () {
			this.$http.productSecondaryPages(this.productId).then((res) => {
				if (res.data.success) {
					this.pages = res.data.data;
				}
			});
		},
		// 获取所有属性列表
		getPropertes: function () {
			this.$http
				.productModelFuncListALL({ productId: this.productId })
				.then((res) => {
					if (res.data.success) {
						this.propertes = res.data.data;
					}
				});
		},
		// 获取详情页面详情
		getInfoPage: function () {
			this.$http.appTempInfoPageDetail(this.productId).then((res) => {
				if (res.data.success && res.data.data) {
					this.infoData = res.data.data;
				}
			});
		},
		// 获取次级页面详情
		getSecondPage: function (type) {
			let para = {
				type: type,
				productId: this.productId,
			};
			this.$http.secondPageInfo(para).then((res) => {
				if (res.data.success) {
					if (type == 10) {
						this.cookingData = res.data.data;
					} else if (type == 11) {
						this.statusData = res.data.data;
					} else {
						this.menuInfo = res.data.data;
					}
				}
			});
		},
		// 准备提交详情页面
		handleSubmitInfo: function () {
			let info1 = this.$refs.info1.handleSubmit(),
				info2 = this.$refs.info2.handleSubmit(),
				info3 = this.$refs.info3.handleSubmit();
			let form = {
					productId: this.productId,
					templateTypeId: this.templateId,
					...info2,
					...info3,
				},
				uplpadList = [],
				oldFileNames = "",
				formData = new FormData();
			// 若含有图片文件，存入表单
			if (info1.bgFile) {
				uplpadList.push("outerImageFilename");
				formData.append("files", info1.bgFile);
				// 若有旧文件，记录
				if (this.infoData.outerImageFilename) {
					oldFileNames = this.infoData.outerImageFilename + ",";
				}
			} else {
				form.outerImageFilename = this.infoData.outerImageFilename;
			}
			// 若含有图片文件，存入表单
			if (info1.productFile) {
				uplpadList.push("innerImageFilename");
				formData.append("files", info1.productFile);
				// 若有旧文件，记录
				if (this.infoData.innerImageFilename) {
					oldFileNames =
						oldFileNames + this.infoData.innerImageFilename;
				}
			} else {
				form.innerImageFilename = this.infoData.innerImageFilename;
			}
			if (uplpadList.length > 0) {
				formData.append("oldFileNames", oldFileNames);
				this.$http.uploadFiles(formData).then((res) => {
					if (res.data.success) {
						for (let i in uplpadList) {
							form[uplpadList[i]] = res.data.data[i];
						}
						this.submitInfoForm(form);
					}
				});
			} else {
				this.submitInfoForm(form);
			}
		},
		// 提交详情页面表单
		submitInfoForm: function (form) {
			if (this.infoData.id) {
				form.id = this.infoData.id;
			}
			let ajax = this.infoData.id
				? this.$http.appTempInfoPageEdit
				: this.$http.appTempInfoPageAdd;
			ajax(form).then((res) => {
				if (res.data.success) {
					this.getInfoPage();
				}
			});
		},
		// 准备提交烹饪界面
		handleSubmitCooking: function () {
			let form = this.$refs.cooking.handleSubmit();
			form.id = this.cookingData.id;
			form.inner = this.cookingData.inner;
			form.templateTypeId = this.templateId;
			form.productId = this.productId;
			form.type = 10;
			let uplpadList = [],
				oldFileNames = "",
				formData = new FormData();
			if (form.imageRight) {
				formData.append("files", form.imageRight);
				uplpadList.push("imageRight");
				if (cookingData.imageRight) {
					oldFileNames = cookingData.imageRight + ",";
				}
			} else {
				form.imageRight = this.cookingData.imageRight;
			}
			if (form.imageLeft) {
				formData.append("files", form.imageLeft);
				uplpadList.push("imageLeft");
				if (cookingData.imageLeft) {
					oldFileNames = oldFileNames + cookingData.imageLeft;
				}
			} else {
				form.imageLeft = this.cookingData.imageLeft;
			}
			if (uplpadList.length > 0) {
				formData.append("oldFileNames", oldFileNames);
				this.$http.uploadFiles(formData).then((res) => {
					if (res.data.success) {
						for (let i in uplpadList) {
							form[uplpadList[i]] = res.data.data[i];
						}
						this.submitSecondForm(form, () => {
							this.getSecondPage(11);
						});
					}
				});
			} else {
				this.submitSecondForm(form);
			}
		},
		// 准备提交烹饪状态
		handleSubmitCookStatus: function () {
			let cookStatus1 = this.$refs.cookStatus1.handleSubmit(),
				cookStatus2 = this.$refs.cookStatus2.handleSubmit(),
				form = {
					id: this.statusData.id,
					templateTypeId: this.templateId,
					productId: this.productId,
					type: 11,
					inner: this.statusData.inner,
					...cookStatus1,
					...cookStatus2,
				};
			let uplpadList = [],
				oldFileNames = "",
				formData = new FormData();
			// productImage
			if (form.productImage) {
				formData.append("files", form.productImage);
				uplpadList.push("productImage");
				if (this.statusData.productImage) {
					oldFileNames = this.statusData.productImage + ",";
				}
			} else {
				form.productImage = this.statusData.productImage;
			}
			// oneImageWorkingRight
			if (form.oneImageWorkingRight) {
				formData.append("files", form.oneImageWorkingRight);
				uplpadList.push("oneImageWorkingRight");
				if (this.statusData.oneImageWorkingRight) {
					oldFileNames =
						oldFileNames +
						this.statusData.oneImageWorkingRight +
						",";
				}
			} else {
				form.oneImageWorkingRight = this.statusData.oneImageWorkingRight;
			}
			// twoImageWorkingRight
			if (form.twoImageWorkingRight) {
				formData.append("files", form.twoImageWorkingRight);
				uplpadList.push("twoImageWorkingRight");
				if (this.statusData.twoImageWorkingRight) {
					oldFileNames =
						oldFileNames +
						this.statusData.twoImageWorkingRight +
						",";
				}
			} else {
				form.twoImageWorkingRight = this.statusData.twoImageWorkingRight;
			}
			if (uplpadList.length > 0) {
				formData.append("oldFileNames", oldFileNames);
				this.$http.uploadFiles(formData).then((res) => {
					if (res.data.success) {
						for (let i in uplpadList) {
							form[uplpadList[i]] = res.data.data[i];
						}
						this.submitSecondForm(form, () => {
							this.getSecondPage(11);
						});
					}
				});
			} else {
				this.submitSecondForm(form);
			}
		},
		// 准备提交菜谱详情
		handleSubmitMenuInfo: function () {
			let form = this.$refs.menuInfo.handleSubmit();
			form.id = this.menuInfo.id;
			form.templateTypeId = this.templateId;
			form.productId = this.productId;
			form.type = 12;
			form.inner = this.menuInfo.inner;
			this.submitSecondForm(form, () => {
				this.getSecondPage(12);
			});
		},
		// 提交次级 页面表单（烹饪界面，烹饪详情，菜谱详情）
		submitSecondForm: function (form, callback) {
			this.$http.secondPageEdit(form).then((res) => {
				if (res.data.success) {
					callback();
				}
			});
		},
	},
};
</script>

<style scoped>
.saveBtn {
	width: 100%;
	height: 50px;
	margin-top: 20px;
}
</style>