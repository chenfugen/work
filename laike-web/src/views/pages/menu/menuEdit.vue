<template>
	<div id="menuAddNew">
		<el-form
			:model="ruleForm"
			:rules="rules"
			ref="ruleForm"
			label-width="110px"
			class="demo-ruleForm"
			size="small"
		>
			<div class="basic" v-if="$route.name!='编辑菜谱'">
				<p class="menuAdd-title">步骤</p>
				<el-steps :active="0" finish-status="success" style="width:55%;margin:10px auto;">
					<el-step title="主菜谱"></el-step>
					<el-step title="子菜谱"></el-step>
				</el-steps>
			</div>
			<div class="basic">
				<p class="menuAdd-title">
					基本信息
					<el-checkbox style="margin-left:24px" v-model.trim="ruleForm.recommend">设为推荐菜</el-checkbox>
					<el-checkbox style="margin-left:24px" v-model.trim="ruleForm.buildIn">内置菜</el-checkbox>
				</p>
				<div class="basic-box">
					<div class="basic-left" style="width:350px;float: left;">
						<el-form-item label="产品型号:" prop="deviceModel" ref="deviceModel">
							<el-select
								:disabled="$route.name=='编辑菜谱'"
								v-model.trim="ruleForm.deviceModel"
								placeholder="请选择产品型号"
								@change="deviceChang"
							>
								<el-option
									v-for="(i,x) in $store.state.oldStore.deviceModels"
									v-show="i!='CF5'"
									:key="x"
									:label="i"
									:value="i"
								></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="菜谱ID:" prop="menuId" ref="menuId">
							<el-input
								type="number"
								@blur="idBlur"
								:onblur="ruleForm.menuId == '0000'?ruleForm.menuId='0001':(idQ==3&&ruleForm.menuId == '000'?ruleForm.menuId='001':'')"
								:onch="ruleForm.menuId.length>=idQ?ruleForm.menuId=ruleForm.menuId.slice(0,idQ):''"
								οnkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
								v-model.trim="ruleForm.menuId"
								style="width:120px"
							></el-input>
						</el-form-item>
						<el-form-item label="菜谱名称:" prop="name" ref="name">
							<el-input v-model.trim="ruleForm.name" :maxlength="isChinese?8:16"></el-input>
						</el-form-item>

						<el-form-item :label="ruleForm.deviceModel=='CF5'?'智膳宝':'美食家'" prop="cuisine" ref="cuisine">
							<el-select v-model.trim="ruleForm.cuisineV2" placeholder="请选择美食家" multiple>
								<el-option
									v-for="(i,x) in $store.state.oldStore.cuisines"
									:key="x"
									:label="i.text"
									:value="i.value"
								></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="食材分类:" prop="categoryV2" ref="categoryV2">
							<el-select v-model.trim="ruleForm.categoryV2" placeholder="请选择食材分类" multiple value-key="id">
								<el-option
									v-for="(i,x) in $store.state.oldStore.categorys"
									:key="x"
									:label="i.text"
									:value="i.value"
								></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="特色分类:" prop="style" ref="style">
							<el-select v-model.trim="ruleForm.style" placeholder="请选择特色分类" multiple>
								<el-option
									v-for="(i,x) in $store.state.oldStore.styles"
									:key="x"
									:label="i.text"
									:value="i.value"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="关键字:" prop="keyWord" ref="keyWord">
							<el-input
								type="textarea"
								rows="3"
								v-model.trim="ruleForm.keyWord"
								show-word-limit
								maxlength="20"
								placeholder="App搜索时的关键字，关键字之间用逗号分隔"
							></el-input>
						</el-form-item>
					</div>

					<!-- imageName 256 * 393-->
					<div
						class="basic-right"
						style="width:256px;height:495px;float:right;position: relative;margin-left: 20px"
					>
						<i @click="delImg('image')" title="删除图片" v-if="imageFile" class="iconwrong delImg"></i>
						<el-upload
							ref="image"
							:headers="upLoadHeaders"
							class="avatar-uploader"
							:auto-upload="false"
							:data="imageUpLoadData"
							:limit="1"
							action="/lexy/api/common/saveMenuImage"
							:show-file-list="false"
							:on-change="(file, filesList) => handleChoseFile(file, filesList,'image')"
							accept=".jpg"
							style="width: 256px;height: 393px;"
						>
							<img v-if="imageFile" :src="imageFile" class="avatarImage" />
							<div class="userAdvert-add">单击上传</div>
						</el-upload>
						<span style="font-size: 14px;width:100%;float: left;">
							<font style="font-size: 14px;color:#cccccc;">支持扩展名：.jpg,图片比例：256:393,图片大小建议小于50KB</font>
						</span>
					</div>

					<!-- appImageName 256 * 393-->
					<div class="basic-right" style="width:393px;height:495px;float:right;position: relative;">
						<i @click="delImg('appImage')" title="删除图片" v-if="appImageFile" class="iconwrong delImg"></i>
						<el-upload
							ref="appImage"
							:headers="upLoadHeaders"
							class="avatar-uploader"
							:auto-upload="false"
							:data="appImageUpLoadData"
							action="/lexy/api/common/saveMenuImage"
							:limit="1"
							:show-file-list="false"
							:on-change="(file, filesList) => handleChoseFile(file, filesList,'appImage')"
							accept=".jpg"
							style="width: 393px;height: 393px;"
						>
							<img v-if="appImageFile" :src="appImageFile" class="avatarAppImage" />
							<div class="userAdvert-add2">单击上传</div>
						</el-upload>
						<span style="font-size: 14px;width:100%;float: left;">
							<font style="font-size: 14px;color:#cccccc;">支持扩展名：.jpg,图片比例：750:750,图片大小建议小于50KB</font>
						</span>
					</div>
					<div class="basic-footer" style="width:100%;float:left">
						<el-form-item label="菜谱要点:" prop="content" ref="content">
							<el-input type="textarea" rows="3" v-model.trim="ruleForm.content" placeholder="菜谱要点"></el-input>
						</el-form-item>
						<el-form-item label="营养价值:" prop="foodValue" ref="foodValue">
							<el-input type="textarea" rows="3" v-model.trim="ruleForm.foodValue" placeholder="营养价值"></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<p style="text-align: center;">
			<el-button @click="resetForm('ruleForm')">取消</el-button>
			<el-button type="danger" @click="handleBeforeSubmit('ruleForm')">完成</el-button>
		</p>
	</div>
</template>

<script>
import { Message } from "element-ui";
export default {
	computed: {
		isShortcut() {
			// 判断内置
			if (
				(this.ruleForm.menuId == "9001" ||
					this.ruleForm.menuId == "9002" ||
					this.ruleForm.menuId == "9003" ||
					this.ruleForm.menuId == "9004" ||
					this.ruleForm.menuId == "9005" ||
					this.ruleForm.menuId == "9006" ||
					this.ruleForm.menuId == "9007" ||
					this.ruleForm.menuId == "9008" ||
					this.ruleForm.menuId == "9009") &&
				(this.ruleForm.deviceModel == "A4" ||
					this.ruleForm.deviceModel == "CF3")
			) {
				return true;
			} else {
				return false;
			}
		},
		idQ() {
			if (
				this.ruleForm.deviceModel.indexOf("CF8") != -1 ||
				this.ruleForm.deviceModel.indexOf("CF7") != -1 ||
				this.ruleForm.deviceModel.indexOf("CF6") != -1
			) {
				return 4;
			} else {
				return 3;
			}
		},
		isChinese() {
			var ret = false;
			for (var i = 0; i < this.ruleForm.name.length && !ret; i++) {
				//遍历每一个文本字符
				ret = this.ruleForm.name.charCodeAt(i) >= 10000; //判断文本字符的unicode值
			}
			return ret;
		},
	},
	watch: {
		idQ() {
			if (this.ruleForm.menuId.length < this.idQ) {
				for (var i = this.ruleForm.menuId.length; i < this.idQ; i++) {
					this.ruleForm.menuId = "0" + this.ruleForm.menuId;
				}
			}
		},
		ruleForm: {
			handler(val, oldVal) {
				//如果提交菜谱停止执行
				if (!this.$store.state.oldStore.riving) {
					return false;
				}
			},
			deep: true,
		},
	},
	data() {
		// 表单校验
		var threeOrone = (rule, value, callback) => {
			if (
				this.ruleForm.cuisineV2.length > 0 ||
				this.ruleForm.style.length > 0
			) {
				callback();
			} else {
				if (this.ruleForm.deviceModel == "CF5") {
					callback(new Error("智膳宝,食材分类中至少选择一项!"));
				} else {
					callback(new Error("美食家或特色分类中至少选择一项!"));
				}
			}
		};
		// 表单校验
		var category = (rule, value, callback) => {
			if (this.ruleForm.categoryV2.length > 0) {
				callback();
			} else {
				callback(new Error("请选择食材分类!"));
			}
		};
		return {
			fileList: [],
			ruleForm: {
				menuId: "000", //菜谱ID
				id: "", // 菜谱ID
				recommend: false, //是否设为推荐菜
				buildIn: false, //是否是内置菜
				language: 0, //语言
				appointment: false, //是否可预约
				deviceModel: "", //产品类型
				deviceType: "智能烹饪机", //产品类型
				name: "", //菜谱名称
				cuisineV2: [], //美食家
				style: [], //特色分类
				categoryV2: [], //食材分类
				people: "", //份量
				keyWord: "", //关键字
				imageName: "", //成品图片
				appImageName: "", //APP图片
				content: "", //菜谱要点
				foodValue: "", //营养价值
				// stepDescribe: '',//步骤简介
			},
			rules: {
				deviceModel: [
					{
						required: true,
						message: "请选择产品型号",
						trigger: "change",
					},
				],
				menuId: [
					{
						required: true,
						message: "请输入菜谱ID",
						trigger: "blur",
					},
				],
				name: [
					{
						required: true,
						message: "请输入菜谱名称",
						trigger: "blur",
					},
				],
				style: [{ validator: threeOrone, trigger: "blur" }],
				cuisine: [{ validator: threeOrone, trigger: "blur" }],
				flavor: [{ validator: threeOrone, trigger: "blur" }],
				categoryV2: [
					{
						required: true,
						message: "请选择食材分类",
						trigger: "change",
					},
					{ validator: category, trigger: "blur" },
				],
				keyWord: [
					{
						required: true,
						message: "请输入关键字",
						trigger: "blur",
					},
				],
			},
			// —————————————————————— 上传文件 ——————————————————————
			upLoadHeaders: {
				token: localStorage.getItem("token"),
				"Content-Type": "multipart/form-data",
			},
			// image缩略图
			imageFile: null,
			// image上传带参
			imageUpLoadData: {
				type: null,
				shape: 1,
				buildIn: null,
				file: null,
			},
			// appImage缩略图
			appImageFile: null,
			// appImage上传带参
			appImageUpLoadData: {
				type: null,
				shape: 2,
				buildIn: null,
				file: null,
			},
			imageOldName: "",
			appImageOldName: "",
			imageUpData: 0, // 0 无编辑 1 删除 2 替换
			appImageUpData: 0, // 0 无编辑 1 删除 2 替换
		};
	},
	mounted() {
		history.pushState(null, null, document.URL);
		window.addEventListener("popstate", function () {
			history.pushState(null, null, document.URL);
		});
		this.$http.selectMenuModel({ classify: 1 }).then((res) => {
			if (res.data.success) {
				this.$store.commit("add_menuModel", res.data.datas);
			}
		});
		if (this.$route.name == "编辑菜谱" && !this.$route.params.id) {
			this.$router.push({ path: "/menu/list" });
		}
		if (this.$route.name == "编辑菜谱") {
			this.$http.parentMenu({ id: this.$route.params.id }).then((res) => {
				if (res.data.success) {
					let obj = res.data.data;
					this.ruleForm = obj;
					if (obj.imageName) {
						this.imageFile =
							this.$store.state.oldStore.imgSrc +
							obj.imageName +
							"&token=" +
							this.$store.state.oldStore.token;
					}
					if (obj.appImageName) {
						this.appImageFile =
							this.$store.state.oldStore.imgSrc +
							obj.appImageName +
							"&token=" +
							this.$store.state.oldStore.token;
					}

					this.imageOldName = obj.imageName;
					this.appImageOldName = obj.appImageName;
				}
			});
		}
	},
	methods: {
		//replace替换原路由，作用是避免回退死循环
		goBack() {
			this.$router.replace({ path: "/menu/add" });
		},
		// 提交表单前校验
		handleBeforeSubmit(formName) {
			var motorStatusTrue = true;
			this.$refs[formName].validate((valid, object) => {
				this.$store.commit("chg_riving", false);
				if (valid || this.isShortcut) {
					this.$showLoading();
					let arr = ["image", "appImage"];
					for (let i in arr) {
						this[arr[i] + "UpLoadData"].type =
							this.ruleForm.deviceModel == "CF8" ? 2 : 1;
						this[arr[i] + "UpLoadData"].buildIn = this.isShortcut;
					}
					this.handleJudgeUpload("image");
				} else {
					// 页面滚动至表单异常处
					for (let i in object) {
						let dom = this.$refs[i];
						if (
							Object.prototype.toString.call(dom) !==
							"[object Object]"
						) {
							//这里是针对遍历的情况（多个输入框），取值为数组
							dom = dom[0];
						} //第一种方法（包含动画效果）
						dom.$el.scrollIntoView({
							//滚动到指定节点
							block: "center", //值有start,center,end，nearest，当前显示在视图区域中间
							behavior: "smooth", //值有auto、instant,smooth，缓动动画（当前是慢速的）
						}); //第二种方法
						//window.scrollTo(0,diff- 276) //同上
						break; //因为我们只需要检测一项,所以就可以跳出循环了
					}
				}
			});
		},
		// 判断是否需要上传图片
		handleJudgeUpload: function (name) {
			switch (name) {
				case "form":
					if (
						this.ruleForm.imageName != this.imageOldName ||
						this.ruleForm.appImageName != this.appImageOldName
					) {
						this.handleDeleteOldImg();
					} else {
						let data = Object.assign({}, this.ruleForm);
						this.handleSubmit(data);
					}
					break;
				default:
					this.$hideLoading();
					if (this[name + "UpData"] == 2) {
						let form = new FormData();
						for (let i in this[name + "UpLoadData"]) {
							form.append(i, this[name + "UpLoadData"][i]);
						}
						this.$http.menuImgUp(form).then((res) => {
							if (res.data.success) {
								this.ruleForm[name + "Name"] =
									res.data.fileName;
								if (name === "image") {
									this.handleJudgeUpload("appImage");
								} else {
									this.handleJudgeUpload("form");
								}
							} else {
								this.handleDeleteImg();
							}
						});
					} else {
						if (name == "image") {
							this.handleJudgeUpload("appImage");
						} else {
							this.handleJudgeUpload("form");
						}
					}
					break;
			}
		},
		// 提交表单
		handleSubmit: function (form) {
			this.$http.updataParentMenu(form).then((res) => {
				this.$hideLoading();
				if (res.data.success) {
					this.$store.commit("chg_riving", false);
					this.$router.push({
						name: "菜谱清单",
					});
				} else {
					this.handleDeleteImg();
				}
			});
		},
		// 重制表单
		resetForm(formName) {
			// this.$refs[formName].resetFields();
			this.$router.push({ path: "/menu/list" });
		},
		// 修改设备时
		deviceChang() {
			this.ruleForm.cuisineV2 = [];
			this.ruleForm.categoryV2 = [];
			this.ruleForm.style = [];
		},
		// 添加食材
		foodAdd() {
			this.ruleForm.seasonings.push({
				name: "", //食材名称
				value: "", //食材用量
				note: "", //使用方法
				order: this.ruleForm.seasonings.length,
			});
		},
		// 菜谱ID
		idBlur() {
			if (this.ruleForm.menuId.length < this.idQ) {
				for (var i = this.ruleForm.menuId.length; i < this.idQ; i++) {
					this.ruleForm.menuId = "0" + this.ruleForm.menuId;
				}
			}
		},
		// 当选择照片时
		handleChoseFile: function (file, fileList, name) {
			let _this = this,
				reader = new FileReader(),
				image = new Image(),
				size = name == "image" ? [256, 393] : [750, 750],
				base64 = null;
			//将图片转base64赋值给src
			image.onload = function () {
				var width = image.width;
				var height = image.height;
				if (image.width != size[0] || image.height != size[1]) {
					Message.error("图片尺寸错误");
					_this.$refs[name].clearFiles();
				} else {
					_this[name + "UpData"] = 2;
					_this[name + "File"] = base64;
					_this[name + "UpLoadData"].file = file.raw;
				}
			};
			reader.onload = function (e) {
				_this.$refs[name].clearFiles();
				base64 = e.target.result;
				image.src = base64;
			};
			reader.readAsDataURL(file.raw);
		},
		// 删除食材
		foodDel(index) {
			this.ruleForm.seasonings.splice(index, 1);
		},
		//删除图片
		delImg(name) {
			this[name + "UpData"] = 1;
			this[name + "File"] = null;
			this.$refs[name].clearFiles();
			this.ruleForm[name + "Name"] = null;
		},
		// 创建失败时删除本次上传的图片
		handleDeleteImg: function () {
			let name = "";
			if (this.ruleForm.imageName) {
				name = this.ruleForm.imageName;
			}
			if (this.ruleForm.appImageName) {
				name = name + "," + this.ruleForm.appImageName;
			}
			if (name) {
				this.$http.deleteFile(name);
			}
		},
		// 删除原先的图片
		handleDeleteOldImg: function () {
			let data = Object.assign({}, this.ruleForm),
				name = "";
			if (this.imageOldName != data.imageName) {
				name = this.imageOldName;
			}
			if (this.appImageOldName != data.appImageName) {
				name = name + "," + this.appImageOldName;
			}
			this.$http.deleteFile(name);
			this.handleSubmit(data);
		},
	},
	destroyed() {
		window.removeEventListener("popstate", this.goBack, false);
	},
};
</script>

<style lang="less">
@import "./style/menuAdd.less";
</style>
