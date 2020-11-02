<template>
	<div id="menuType">
		<!-- 搜索栏 -->
		<div class="clearfloat">
			<TableSearch
				class="tableSearch"
				:tableData="tableData"
				:tableSearch="tableSearch"
				:exportHead="tableHeader.data"
			></TableSearch>
		</div>
		<!-- 表格 -->
		<comTable ref="table" :tableData="tableData" :tableHeader="tableHeader"></comTable>
		<!-- 编辑/增加弹窗 -->
		<el-dialog
			:close-on-click-modal="false"
			:title="boxTit"
			:visible.sync="addBox"
			width="600px"
			id="addAdvert"
			@close="close"
		>
			<el-form
				:model="ruleForm"
				:rules="ruless"
				ref="ruleForm"
				label-width="150px"
				class="demo-ruleForm"
			>
				<div style="width:500px">
					<!-- 产品类型 -->
					<el-form-item label="产品类型" prop="classify">
						<el-select
							size="small"
							v-model.trim="ruleForm.classify"
							:disabled="boxTit=='编辑配置'"
							placeholder="请选择产品类型"
						>
							<el-option label="智能烹饪机" :value="1"></el-option>
						</el-select>
					</el-form-item>
					<!-- 归属 -->
					<el-form-item label="归属" prop="type">
						<el-select
							size="small"
							v-model.trim="ruleForm.type"
							:disabled="boxTit=='编辑配置'"
							placeholder="请选择分类归属"
							@change="handleChangeType()"
						>
							<el-option label="美食家" :value="1"></el-option>
							<el-option label="食材分类" :value="2"></el-option>
							<el-option label="特色分类" :value="3"></el-option>
							<el-option label="口味" :value="4"></el-option>
						</el-select>
					</el-form-item>
					<!-- 分类名称 -->
					<el-form-item label="分类名称" prop="name">
						<el-input size="small" placeholder="请输入分类名称" v-model.trim="ruleForm.name" maxlength="64"></el-input>
					</el-form-item>
					<!-- 颜色 -->
					<el-form-item v-if="ruleForm.type===4" label="颜色" prop="color">
						<el-radio-group v-model="ruleForm.color">
							<el-radio
								v-for="(item, index) in colorList"
								:key="index"
								style="margin-bottom: 15px;"
								:label="item.label"
							>
								<font
									:style="{'background':item.rgba,'color':item.color,'border-radius': '6px','padding':'4px 8px'}"
								>{{item.font}}</font>
							</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<div>
					<!-- 图片上传 -->
					<el-form-item label="图片" prop="imageName" class="imgReoo">
						<el-upload
							ref="image"
							:http-request="function(){}"
							class="avatar-uploader"
							:on-change="(file, filesList) => imgPreview1(file,'image')"
							action="https://jsonplaceholder.typicode.com/posts/"
							:show-file-list="false"
							accept=".jpg"
						>
							<img v-if="imageUrl" :src="image" class="avatar" />
							<div class="userAdvert-add" v-if="!imageUrl">单击上传</div>
						</el-upload>
					</el-form-item>
					<span class="imgTips">支持扩展名：.jpg,尺寸比例：168*168（1:1）</span>
					<span class="imgTips">用于设备或APP端界面展示</span>
					<!-- icon上传 -->
					<el-form-item
						label="icon"
						prop="icon"
						class="imgReoo"
						v-if="ruleForm.type==2"
						style="line-height:0 !important"
					>
						<el-upload
							ref="image1"
							:http-request="function(){}"
							class="avatar-uploader"
							:on-change="(file, filesList) => imgPreview1(file,'image1')"
							action="https://jsonplaceholder.typicode.com/posts/"
							:show-file-list="false"
							accept=".png"
						>
							<img v-if="imageUrl1" :src="image1" class="avatar" />
							<div class="userAdvert-add" v-if="!imageUrl1">单击上传</div>
						</el-upload>
					</el-form-item>
					<span v-if="ruleForm.type==2" class="imgTips">支持扩展名：.png,尺寸比例：40*40（1:1）</span>
					<span v-if="ruleForm.type==2" class="imgTips">用于设备或APP端界面展示</span>
					<!-- iconColor上传 -->
					<el-form-item
						label="iconColor"
						prop="iconColor"
						class="imgReoo"
						v-if="ruleForm.type==2"
						style="line-height:0 !important"
					>
						<el-upload
							ref="image2"
							:http-request="function(){}"
							class="avatar-uploader"
							:on-change="(file, filesList) => imgPreview1(file,'image2')"
							action="https://jsonplaceholder.typicode.com/posts/"
							:show-file-list="false"
							accept=".png"
						>
							<img v-if="imageUrl2" :src="image2" class="avatar" />
							<div class="userAdvert-add" v-if="!imageUrl2">单击上传</div>
						</el-upload>
					</el-form-item>
					<span v-if="ruleForm.type==2" class="imgTips">支持扩展名：.png,尺寸比例：40*40（1:1）</span>
					<span v-if="ruleForm.type==2" class="imgTips">用于设备或APP端界面展示</span>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addBox = false">取 消</el-button>
				<el-button type="danger" @click="submitForm('ruleForm')">保 存</el-button>
			</div>
		</el-dialog>
		<!-- 排序弹窗 -->
		<el-dialog
			:close-on-click-modal="false"
			title="排序"
			:visible.sync="sortDialog"
			width="50%"
			id="sortDialog"
			@close="sortDialog = false"
		>
			<div style="margin-bottom: 20px">
				<el-select v-model="sortFilterForm.type" placeholder="归属" @change="handleSort">
					<el-option label="美食家" value="1"></el-option>
					<el-option label="食材分类" value="2"></el-option>
					<el-option label="特色分类" value="3"></el-option>
					<el-option label="口味" value="4"></el-option>
				</el-select>
				<el-select
					style="margin-left: 20px"
					v-model="sortFilterForm.classify"
					placeholder="产品类别"
					@change="handleSort"
				>
					<el-option label="智能烹饪机" value="1"></el-option>
				</el-select>
			</div>
			<div class="sortBox">
				<div
					class="sortItem clearfloat"
					v-for="item in sortList"
					:key="item.id"
					v-dragging="{ list: sortList, item: item, group: 'sortResult' }"
				>
					<img
						class="sortImg"
						:src="$store.state.oldStore.imgSrc+item.imageName+'&token='+$store.state.oldStore.token"
					/>
					<span class="sortName">{{item.name}}</span>
					<span class="sortName">{{item.type==1?'美食家':item.type==2?'食材分类':item.type==3?'特色分类':"口味"}}</span>
					<span class="sortName">{{item.classify == 1?'智能烹饪机':'--'}}</span>
					<i class="el-icon-more right" style="font-size: 25px;margin-top: 15px"></i>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleCancelSort">取 消</el-button>
				<el-button type="danger" @click="handleSubmitSort">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
const UTILS = require("@/libs/utils");
import { Form, Message } from "element-ui";
export default {
	data() {
		return {
			addBox: false,
			boxTit: "新增配置",
			image: "", //图片地址
			imageUrl: false, //储存即将上传的文件
			fileName: "", //储存即将上传的文件名
			image1: "", //icon地址
			imageUrl1: false, //储存即将上传的icon
			fileName1: "", //储存即将上传的icon名
			image2: "", //icon地址
			imageUrl2: false, //储存即将上传的icon
			fileName2: "", //储存即将上传的icon名
			oldFileName: "", //删除图片的名称
			oldFileName1: "", //删除icon的名称
			oldFileName2: "", //删除icon的名称
			ruleForm: {
				classify: 1,
				type: "",
				name: "",
				imageName: "",
				icon: "",
				iconColor: "",
				color: 0,
			},
			ruless: {
				classify: [{ required: true, message: "", trigger: "change" }],
				name: [
					{
						required: true,
						message: "请输入类型名称",
						trigger: "blur",
					},
					{
						pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
						message: "不能输入特殊字符！",
						trigger: "blur",
					},
				],
				imageName: [
					{ required: true, message: "请上传图片", trigger: "blur" },
				],
				icon: [
					{ required: true, message: "请上传icon", trigger: "blur" },
				],
				iconColor: [
					{ required: true, message: "请上传icon", trigger: "blur" },
				],
				type: [
					{
						required: true,
						message: "请选择类型归属",
						trigger: "change",
					},
				],
			},
			tableSearch: {
				isExport: false,
				exportName: "配置列表",
				btn: [
					{
						name: "新建配置",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf(
								"k31"
							) != -1
								? this.handleAdd
								: 0,
					},
					{
						name: "排序",
						clickInfo: this.handleSort,
					},
				],
				noSearch: true,
				funClick: this.getMenuModels,
				cleanClick: this.cleanClick,
				input: [],
				selectArry: [], //表格选中数据集合
			},
			tableHeader: {
				sortMethod: function () {},
				tableStatus: false,
				filters: this.filters,
				tableHeight: "calc(100% - 86px)",
				comHeight: "calc(100% - 10px)",
				handleSelectionChange: 0, //选中表格数据方法
				isSelection: [false, "55"], //是否显示序列号
				oper: {
					//操作栏
					label: "操作",
					prop: "oper",
					minWidth: "90",
					fixed: "right",
					oper: [
						{ name: "编辑", clickFun: this.handleEdit },
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf(
									"k30"
								) != -1
									? this.deleteRow
									: 0,
						},
					],
				},
				data: [
					//表格头数据绑定
					{ label: "", prop: "icon", minWidth: "80", fixed: true },
					{
						label: "分类名称",
						prop: "name",
						minWidth: "120",
						fixed: true,
						name: "点击动作",
					},
					{
						label: "归属",
						prop: "type",
						minWidth: "120",
						fixed: false,
						filters: [
							{ text: "美食家", value: 1 },
							{ text: "食材分类", value: 2 },
							{ text: "特色分类", value: 3 },
							{ text: "口味", value: 4 },
						],
						filterList: [],
					},
					{
						label: "产品类别",
						prop: "classify",
						minWidth: "120",
						fixed: false,
						filters: [{ text: "智能烹饪机", value: 1 }],
						filterList: [],
					},
					{
						label: "创建时间",
						prop: "createTime",
						minWidth: "156",
						fixed: false,
					},
					{
						label: "更新时间",
						prop: "updateTime",
						minWidth: "156",
						fixed: false,
					},
				],
				pagination: {
					currentPage: 1, // 当前页码
					total: 0, //总页数
					pageSize: 20, //每页数据条数
					pageSizes: [20, 50, 100, 200], //每页数据条数集合
					handleSizeChange: this.handleSizeChange, //切换每页多少条
					handleCurrentChange: this.handleCurrentChange, //切换当前页码
				},
			},
			tableData: [],
			menuModels: {
				classify: "", //类型 1：厨师机，2：黄小厨/套餐机
				type: "", //归属 1：美食家，2：食材分类，3：特色分类
				name: "", //型号名称
				pageNumber: 1, //分页页数
				pageSize: 20, //分页每页数量
			},
			// 排序
			sortDialog: false,
			sortFilterForm: {
				classify: "1",
				sort: true,
				type: "1",
				pageNumber: 0, //分页页数
				pageSize: 0, //分页每页数量
			},
			sortList: [],
			sortResult: [],
		};
	},
	computed: {
		colorList() {
			return this.$staticData.menuTypeColorList;
		},
	},
	mounted() {
		this.getMenuModels();
	},
	methods: {
		// 校验/处理 表单
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.imageUrl) {
						//上传新图片或编辑未改变图片
						if (
							this.imageUrl === true &&
							this.imageUrl1 === true &&
							this.imageUrl2 === true
						) {
							//编辑未改变图片
							this.subModel();
						} else {
							let uploadMark = [];
							//上传新图片或者编辑改变图片
							this.$showLoading();
							let old =
								this.oldFileName &&
								this.fileName != "" &&
								this.oldFileName != this.fileName;
							// 上传多张
							if (this.ruleForm.type == 2) {
								let old1 =
										this.oldFileName1 &&
										this.fileName1 != "" &&
										this.oldFileName1 != this.fileName1,
									old2 =
										this.oldFileName2 &&
										this.fileName2 != "" &&
										this.oldFileName2 != this.fileName2;
								let oldFileNames = "",
									oldFileList = [
										{ x: old, v: this.oldFileName },
										{ x: old1, v: this.oldFileName1 },
										{ x: old2, v: this.oldFileName2 },
									];
								oldFileList.forEach((i, x) => {
									if (i.x) {
										if (oldFileNames) {
											oldFileNames =
												oldFileNames + "#" + i.v;
										} else {
											oldFileNames = i.v;
										}
									}
								});
								if (this.imageUrl && this.imageUrl != true) {
									uploadMark.push({
										key: "imageName",
										file: this.imageUrl,
									});
								}
								if (this.imageUrl1 && this.imageUrl1 != true) {
									uploadMark.push({
										key: "icon",
										file: this.imageUrl1,
									});
								}
								if (this.imageUrl2 && this.imageUrl2 != true) {
									uploadMark.push({
										key: "iconColor",
										file: this.imageUrl2,
									});
								}
							}
							// 只上传一张
							else {
								if (!old) {
									this.oldFileName = "";
								}
								uploadMark.push({
									key: "imageName",
									file: this.imageUrl,
								});
							}
							this.handleUpLoad(uploadMark, 0, []);
						}
					} else {
						this.subModel();
					}
				} else {
					return false;
				}
			});
		},
		// 上传文件
		handleUpLoad: function (uploadMark, index, nameList, oldFileNames) {
			let form = new FormData(),
				list = nameList;
			form.append("file", uploadMark[index].file);
			this.$http.menuTypeImgUp(form).then((res) => {
				if (res.data.success) {
					list.push(res.data.fileName);
					if (index == uploadMark.length - 1) {
						this.subModel(nameList, uploadMark);
					} else {
						this.handleUpLoad(
							uploadMark,
							Number(index) + 1,
							list,
							oldFileNames
						);
					}
				}
			});
		},
		// 提交表单
		subModel(nameList, uploadMark, oldFileNames) {
			let ajax =
				this.boxTit == "新增配置"
					? this.$http.menuModel
					: this.$http.updataMenuModel;
			let obj = Object.assign({}, this.ruleForm);
			if (nameList) {
				for (let i in uploadMark) {
					obj[uploadMark[i].key] = nameList[i];
				}
			}
			if (obj.type != 2) {
				delete obj.icon;
				delete obj.iconColor;
			}
			ajax(obj).then((res) => {
				this.addBox = false;
				if (res.data.success) {
					if (oldFileNames) {
						this.$http.deleteFile(oldFileNames).then(() => {});
					}
					this.$http.selectMenuModel({ classify: 1 }).then((res) => {
						if (res.data.success) {
							this.$store.commit("add_menuModel", res.data.datas);
						}
						this.getMenuModels();
						this.$hideLoading();
					});
				} else {
					this.$hideLoading();
				}
			});
		},
		// 删除
		deleteRow(index, row) {
			this.$confirm(
				"确认删除此分类名称吗?",
				"提示",
				this.$filters.confirm()
			)
				.then(() => {
					this.$http.deleteMenuModel(row.id).then((res) => {
						if (res.data.success) {
							this.getMenuModels();
						}
					});
				})
				.catch(() => {});
		},
		// 获取菜谱类型
		getMenuModels() {
			this.$refs.table.handleShowImg(false);
			this.$http.menuModels(this.menuModels).then((res) => {
				if (res.data.success) {
					this.tableData = res.data.rows;
					this.$refs.table.handleShowImg(true);
					this.tableHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.tableHeader.pagination.currentPage = this.menuModels.pageNumber = 1;
						this.getMenuModels();
					}
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					});
				} else {
					this.$refs.table.handleShowImg(true);
				}
			});
		},
		// 修改页大小
		handleSizeChange(val) {
			this.tableHeader.pagination.pageSize = this.menuModels.pageSize = val;
			this.getMenuModels();
		},
		// 修改页码
		handleCurrentChange(val) {
			this.tableHeader.pagination.currentPage = this.menuModels.pageNumber = val;
			this.getMenuModels();
		},
		// 清空搜索项
		cleanClick() {
			this.tableHeader.pagination.currentPage = 1;
			this.getMenuModels();
		},
		// 添加
		handleAdd() {
			this.image = "";
			this.image1 = "";
			this.image2 = "";
			this.oldFileName = "";
			this.oldFileName1 = "";
			this.oldFileName2 = "";
			(this.boxTit = "新增配置"), (this.addBox = true);
		},
		// 编辑
		handleEdit(index, row) {
			this.imageUrl = true;
			this.imageUrl1 = true;
			this.imageUrl2 = true;
			(this.boxTit = "编辑配置"), (this.addBox = true);
			this.$nextTick(() => {
				this.ruleForm.classify = row.classify;
				this.ruleForm.type = row.type;
				this.ruleForm.id = row.id;
				this.ruleForm.color = row.color;
				this.ruleForm.name = row.name;
				this.image =
					this.$store.state.oldStore.imgSrc +
					row.imageName +
					"&token=" +
					this.$store.state.oldStore.token;
				this.ruleForm.imageName = row.imageName;
				this.oldFileName = row.imageName;
				if (row.type == 2) {
					this.image1 =
						this.$store.state.oldStore.imgSrc +
						row.icon +
						"&token=" +
						this.$store.state.oldStore.token;
					this.ruleForm.icon = row.icon;
					this.oldFileName1 = row.icon;
					this.image2 =
						this.$store.state.oldStore.imgSrc +
						row.iconColor +
						"&token=" +
						this.$store.state.oldStore.token;
					this.ruleForm.iconColor = row.iconColor;
					this.oldFileName2 = row.iconColor;
				}
			});
		},
		// 处理图片
		imgPreview1(file, src) {
			let _this = this,
				fileData = file.raw,
				ruleKey =
					src == "image"
						? "imageName"
						: src == "image1"
						? "icon"
						: "iconColor",
				fileKey =
					src == "image"
						? "fileName"
						: src == "image1"
						? "fileName1"
						: "fileName2",
				imageKey =
					src == "image"
						? "imageUrl"
						: src == "image1"
						? "imageUrl1"
						: "imageUrl2",
				reader = new FileReader(),
				imageReader = new Image(),
				fileName = file.raw.name,
				base64 = null,
				size = src == "image" ? [168, 168] : [40, 40];
			imageReader.onload = function () {
				if (
					imageReader.width != size[0] ||
					imageReader.height != size[1]
				) {
					Message.error("图片尺寸错误");
					_this.$refs[src].clearFiles();
				} else {
					_this[src] = base64; //储存即将上传的文件
					_this[imageKey] = fileData; //储存即将上传的文件
					_this[fileKey] = fileName; //储存即将上传的文件
					_this.ruleForm[ruleKey] = fileName; //储存即将上传的文件
				}
			};
			reader.onload = function (e) {
				base64 = e.target.result;
				imageReader.src = base64;
			};
			reader.readAsDataURL(fileData);
		},
		//筛选列
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			this.menuModels[name] =
				filters[name][0] != undefined ? filters[name][0] : "";
			this.getMenuModels();
		},
		// 当归属修改时间
		handleChangeType: function (res) {
			if (this.ruleForm.type === 4) {
				if (this.ruless.type) {
					delete this.ruless.type;
				} else {
					this.ruless.type = [
						{
							required: true,
							message: "请选择类型归属",
							trigger: "change",
						},
					];
				}
			}
		},
		// 窗口排序
		handleSort: function () {
			let name = [];
			this.$http.menuModels(this.sortFilterForm).then((res) => {
				if (res.data.success) {
					this.sortList = res.data.rows;
					this.$dragging.$on("dragend", (res) => {
						console.log(res);
					});
					this.sortDialog = true;
				}
			});
		},
		// 取消排序
		handleCancelSort: function () {
			this.sortDialog = false;
			this.sortResult = [];
			this.sortFilterForm = {
				classify: "1",
				type: "1",
				sort: true,
				pageNumber: 0, //分页页数
				pageSize: 0, //分页每页数量
			};
		},
		// 提交排序
		handleSubmitSort: function () {
			let ids = [],
				names = [],
				form = new FormData();
			for (let i in this.sortList) {
				names.push(this.sortList[i].name);
				ids.push(this.sortList[i].id);
			}
			form.append("classify", Number(this.sortFilterForm.classify));
			form.append("type", Number(this.sortFilterForm.type));
			form.append("ids", ids);
			this.$http.sortMenuType(form).then((res) => {
				if (res.data.success) {
					this.handleCancelSort();
				}
				this.getMenuModels();
			});
		},
		// 关闭弹窗
		close() {
			this.$refs.ruleForm.resetFields();
			this.ruleForm.imageName = "";
			this.ruleForm.classify = 1;
			this.ruleForm.type = "";
			this.ruleForm.color = 0;
			this.ruleForm.name = "";
			this.image = "";
			this.image1 = "";
			this.image2 = "";
			this.imageUrl = false; //储存即将上传的文件
			this.imageUrl1 = false; //储存即将上传的文件
			this.imageUrl2 = false; //储存即将上传的文件
			this.fileName = ""; //储存即将上传的文件名
			this.fileName1 = ""; //储存即将上传的文件名
			this.fileName2 = ""; //储存即将上传的文件名
		},
	},
};
</script>

<style lang="less">
#menuType {
	width: 100%;
	height: 100%;
	float: left;
	background: #fff;
	padding-top: 24px;
	box-sizing: border-box;
	-webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	border-radius: 4px;

	.tableSearch {
		display: inline-block;
		width: 50%;
	}
	.sortBox {
		height: 600px;
		overflow: auto;
	}
	.sortItem {
		height: 50px;
		line-height: 50px;
		padding-top: 10px;
		padding-bottom: 10px;
		line-height: 50px;
		border-bottom: 1px solid #ccc;
		width: 95%;
	}
	.sortImg {
		width: 50px;
		height: 50px;
	}
	.sortName {
		display: inline-block;
		height: 100%;
		vertical-align: top;
		margin-left: 50px;
		width: 100px;
		text-align: center;
		font-size: 16px;
	}
	.imgReoo .el-form-item__error {
		top: 160px;
	}
	.el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		overflow: hidden;
	}
	.avatar-uploader {
		width: 160px;
		text-align: center;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}
	.userAdvert-add {
		font-size: 22px;
		color: #8c939d;
		height: 160px;
		width: 160px;
		line-height: 160px;
		text-align: center;
	}
	.avatar {
		height: 160px;
		width: 160px;
		display: block;
	}
	.seeAdvert-box {
		width: 100%;
		height: 200px;
		p {
			width: 350px;
			margin: 12px 0;
			float: left;
			clear: left;
			font {
				width: 80px;
				display: block;
				text-align: right;
				float: left;
			}
		}
		img {
			position: absolute;
			right: 20px;
			top: 67px;
			height: 200px;
			width: 150px;
		}
	}
	.imgTips {
		color: #cccccc;
		display: block;
		margin: -20px 0 20px 148px;
	}
}
</style>
