<template>
	<div id="productTypoe">
		<comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>
		<el-dialog
			top="5vh"
			:close-on-click-modal="false"
			title="配置"
			:visible.sync="addBox"
			width="700px"
			id="addAdvert"
			@closed="close"
			v-loading="loading"
			:element-loading-text="uploadNum==100?'文件上传完成，数据加载中':'文件上传中:'+uploadNum+'%'"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
		>
			<el-form
				:model="ruleForm"
				:rules="users"
				ref="ruleForm"
				label-width="100px"
				class="demo-ruleForm"
			>
				<div style="width:350px;height:245px;float:left">
					<el-form-item label="产品类型：">{{ruleForm.type}}</el-form-item>
					<el-form-item label="产品型号：">{{ruleForm.model}}</el-form-item>
					<el-form-item label="key：">{{ruleForm.key}}</el-form-item>
					<!-- <el-form-item label="故障对策：" prop="faultUrl">
                        <el-input type="textarea" size="small" rows="2" placeholder="故障对策" v-model.trim="ruleForm.faultUrl"></el-input>
					</el-form-item>-->
					<el-form-item label="备注：">
						<el-input type="textarea" size="small" rows="2" placeholder="备注" v-model.trim="ruleForm.note"></el-input>
					</el-form-item>
				</div>
				<div style="width:276px;height:230px;float:right">
					<el-upload
						action="https://jsonplaceholder.typicode.com/posts/"
						:show-file-list="false"
						accept=".jpg, .png"
						:http-request="function(){}"
						class="avatar-uploader"
						:on-change="imgPreview"
					>
						<img v-if="ruleForm.imageName" :src="ruleForm.imageName" class="avatar" />
						<div class="userAdvert-add" v-if="ruleForm.imageName.length==0">单击上传</div>
					</el-upload>
					<el-form-item label="机型图片" prop="imageName" style="margin:0 0 0 80px" class="imgReoo"></el-form-item>
					<!-- eslint-disable-next-line -->
					<span style="color:#cccccc">支持扩展名：.jpg,.png,图片比例：4:3,图片大小：<=xxMB</span>
				</div>
				<div class="tutorials">
					<p class="tut-title">使用说明</p>
					<el-form-item label="标题：" prop="useTitle">
						<el-input placeholder="标题" size="small" v-model.trim="ruleForm.useTitle"></el-input>
					</el-form-item>
					<el-form-item label="网址链接：" prop="useUrl">
						<el-input placeholder="使用教程网址链接" size="small" v-model.trim="ruleForm.useUrl"></el-input>
					</el-form-item>
				</div>
				<!-- 视频教程 -->
				<div class="tutorials" v-for="(i,x) in ruleForm.videoCourses" :key="x">
					<p class="tut-title">
						视频教程{{x+1}}
						<i title="删除此添加行" class="iconwrong" @click="ruleForm.videoCourses.splice(x,1); "></i>
					</p>
					<el-form-item
						label="标题："
						:prop="'videoCourses.' + x + '.title'"
						:rules="{ required: true, message: '请输入教程标题', trigger: 'blur' }"
					>
						<el-input placeholder="标题" size="small" v-model.trim="i.title"></el-input>
					</el-form-item>
					<el-form-item
						label="视频文件："
						:prop="'videoCourses.' + x + '.file'"
						:rules="{ required: true, message: '请上传视频文件', trigger: 'blur' }"
					>
						<input
							v-if="i.file!='oldFile'"
							ref="fileInput"
							type="file"
							@change="fileChang(x,$event)"
							accept=".mp4"
						/>
						{{i.file=='oldFile'?i.videoOriginalName:''}}
						<button
							v-if="i.file=='oldFile'"
							style="float:right;margin-top: 8px;"
							@click.prevent="reUpload(x)"
						>重新上传</button>
						<br />
						{{i.file!='oldFile'?'格式：.mp4视频，建议压缩尺寸后上传':''}}
					</el-form-item>
				</div>
				<div
					class="tutorials add"
					v-if="!ruleForm.videoCourses||ruleForm.videoCourses.length<20"
					@click="ruleForm.videoCourses.push({title:'',videoName:'',videoOriginalName:'',file:''})"
				>新增视频教程</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addBox = false">取 消</el-button>
				<el-button type="danger" @click="submitForm('ruleForm')">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data() {
		return {
			loading: false,
			uploadNum: 0, //文件上传进度
			addBox: false,
			imageUrl: "",
			imageName: "",
			oldFileName: "",
			oldFileNames: "", //需要删除的旧文件
			oldFiles: [], //加载的旧文件(用作对比)
			ruleForm: {
				key: "", //key
				useUrl: "", //使用教程链接
				useTitle: "", //使用教程标题
				// faultUrl: '',//故障教程链接
				imageName: "", //图片名称
				note: "", //备注
				model: "", //产品型号
				videoCourses: [
					{
						title: "",
						videoName: "",
						videoOriginalName: "",
						file: "",
					},
				],
			},
			videoFiles: [],
			users: {
				useUrl: [
					{
						required: true,
						message: "请输入使用说明链接",
						trigger: "blur",
					},
					{
						pattern: /^(http|https):\/\/([\w.]+\/?)\S*/,
						message: "请输入正确的url地址",
						trigger: "blur",
					},
				],
				useTitle: [
					{
						required: true,
						message: "请输入使用说明标题",
						trigger: "blur",
					},
				],
			},
			tableHeader: {
				sortMethod: function () {},
				tableStatus: false,
				filters: this.filters,
				tableHeight: "calc(100% - 45px)",
				comHeight: "calc(100% - 10px)",
				handleSelectionChange: 0, //选中表格数据方法
				isSelection: [false], //是否显示序列号
				oper: {
					//操作栏
					label: "操作",
					prop: "oper",
					minWidth: "90",
					fixed: "right",
					oper: [
						{
							name: "配置",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf("g12") != -1
									? this.deleteRow
									: 0,
						},
					],
				},
				data: [
					//表格头数据绑定
					{
						label: "产品类型",
						prop: "type",
						minWidth: "120",
						fixed: false,
						filters: this.$store.state.oldStore.deviceTypeFilters,
						filterList: [],
					},
					{
						label: "产品型号",
						prop: "model",
						minWidth: "120",
						fixed: false,
						filters: this.$store.state.oldStore.deviceModelFilters,
						filterList: [],
					},
					{
						label: "使用教程",
						prop: "useUrl",
						minWidth: "120",
						fixed: false,
					},
					{
						label: "备注",
						prop: "note",
						minWidth: "120",
						fixed: false,
					},
					{
						label: "添加时间",
						prop: "createTime",
						minWidth: "160",
						fixed: false,
					},
					{
						label: "更新时间",
						prop: "updateTime",
						minWidth: "160",
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
			deviceTypes: {
				model: "",
				pageNumber: 1,
				pageSize: 20,
			},
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					var data = new FormData(),
						uploadMark = [],
						obj = Object.assign({}, this.ruleForm),
						fileNames = 0;
					// 添加视频文件
					if (obj.videoCourses.length > 0) {
						for (let i in obj.videoCourses) {
							if (obj.videoCourses[i].file != "oldFile") {
								if (fileNames) {
									fileNames +=
										"#" + obj.videoCourses[i].videoName;
								} else {
									fileNames = obj.videoCourses[i].videoName;
								}
								data.append("files", obj.videoCourses[i].file);
								uploadMark.push(i);
							}
						}
					}
					// 添加图片文件
					if (this.oldFileName != this.imageName) {
						if (fileNames) {
							fileNames += "#" + this.imageName;
						} else {
							fileNames = this.imageName;
						}
						if (this.oldFileNames == "") {
							this.oldFileNames = this.oldFileName;
						} else {
							this.oldFileNames += "#" + this.oldFileName;
						}
						uploadMark.push("imageName");
						data.append("files", this.imageUrl);
					}
					data.append("oldFileNames", this.oldFileNames);
					if (
						fileNames ||
						this.oldFileNames != "" ||
						this.oldFileName != this.imageName
					) {
						document.getElementById("addAdvert").style.overflow =
							"inherit";
						this.loading = true;
						this.$http.batchFile(data, this.upload).then((res) => {
							document.getElementById(
								"addAdvert"
							).style.overflow = "auto";
							this.loading = false;
							document.body.style.overflowY = "auto";
							if (res.data.success) {
								let names = res.data.fileNames.split("#");
								for (let i in uploadMark) {
									if (uploadMark[i] === "imageName") {
										obj.imageName = names[i];
									} else {
										obj.videoCourses[
											uploadMark[i]
										].videoName = names[i];
									}
								}
								this.$http.updataDeviceType(obj).then((res) => {
									this.addBox = false;
									if (res.data.success) {
										this.getDeviceTypes();
									}
								});
							}
						});
					} else {
						this.ruleForm.imageName = this.imageName;
						this.$http
							.updataDeviceType(this.ruleForm)
							.then((res) => {
								this.addBox = false;
								if (res.data.success) {
									this.getDeviceTypes();
								}
							});
					}
				} else {
					return false;
				}
			});
		},
		upload(e) {
			this.uploadNum = ((e.loaded / e.total) * 100) | 0;
		},
		deleteRow(index, row) {
			this.$nextTick(() => {
				this.ruleForm.id = row.id;
				this.ruleForm.model = row.model;
				this.ruleForm.type = row.type;
				this.ruleForm.useUrl = row.useUrl;
				this.ruleForm.useTitle = row.useTitle;
				this.ruleForm.key = row.key;
				this.ruleForm.videoCourses = JSON.parse(
					JSON.stringify(row.videoCourses)
				);
				if (this.ruleForm.videoCourses != null) {
					this.ruleForm.videoCourses.forEach((i) => {
						this.$set(i, "file", "oldFile");
					});
				} else {
					this.ruleForm.videoCourses = [];
				}
				this.ruleForm.note = row.note;
				if (row.imageName.length > 0) {
					this.ruleForm.imageName =
						this.$store.state.oldStore.imgSrc +
						row.imageName +
						"&token=" +
						this.$store.state.oldStore.token;
					this.oldFileName = this.imageName = row.imageName;
				} else {
					this.oldFileName = "";
				}
			});
			this.addBox = true;
		},
		imgPreview(file, fileList, src) {
			var timestamp = new Date().valueOf(),
				fileName = file.name;
			fileName =
				this.$filters.uuid() +
				"_" +
				timestamp +
				"." +
				fileName.split(".")[1];
			var _this = this;
			var event = event || window.event;
			var file = event.target.files[0];
			var reader = new FileReader();
			reader.onload = function (e) {
				_this.ruleForm.imageName = e.target.result; //将图片路径赋值给src
			};
			reader.readAsDataURL(file);
			this.imageUrl = file; //储存即将上传的文件
			this.imageName = fileName; //储存即将上传的文件名
		},
		handleAvatarSuccess(res, file) {
			this.imageUrl = URL.createObjectURL(file.raw);
		},
		handleSizeChange(val) {
			this.tableHeader.pagination.pageSize = this.deviceTypes.pageSize = val;
			this.getDeviceTypes();
		},
		handleCurrentChange(val) {
			this.tableHeader.pagination.currentPage = this.deviceTypes.pageNumber = val;
			this.getDeviceTypes();
		},
		getDeviceTypes() {
			this.$http.deviceTypes(this.deviceTypes).then((res) => {
				this.tableData = res.data.rows;
				this.tableHeader.pagination.total = res.data.total;
				this.$nextTick(() => {
					this.tableHeader.tableStatus = true;
				});
			});
		},
		fileChang(x, event) {
			var _this = this;
			var event = event || window.event;
			var file = event.target.files[0];
			var type = ".mp4";
			if (
				file.name.indexOf(type) == -1 &&
				file.name.indexOf(".MP4") == -1
			) {
				return false;
			}
			this.$set(this.ruleForm.videoCourses[x], "file", file);
			this.ruleForm.videoCourses[x].videoOriginalName = file.name;
			this.ruleForm.videoCourses[x].videoName = file.name;
		},
		reUpload(index) {
			this.$confirm(
				"原文件将删除",
				"确认重新上传视频文件吗?",
				this.$filters.confirm()
			).then(() => {
				this.ruleForm.videoCourses[index].file = "";
				if (this.oldFileNames === "") {
					this.oldFileNames = this.ruleForm.videoCourses[
						index
					].videoName;
				} else {
					this.oldFileNames +=
						"#" + this.ruleForm.videoCourses[index].videoName;
				}
			});
		},
		//筛选列
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			this.deviceTypes[name] = filters[name][0];
			this.getDeviceTypes();
		},
		close() {
			this.oldFileNames = "";
			this.oldFileName = "";
			this.imageName = "";
			this.imageUrl = "";
			this.$refs.ruleForm.resetFields();
		},
	},
	mounted() {
		this.getDeviceTypes();
	},
};
</script>
<style lang="less">
#productTypoe {
	width: 100%;
	height: 100%;
	background: #fff;
	padding-top: 24px;
	box-sizing: border-box;
	-webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	border-radius: 4px;

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}
	.userAdvert-add {
		font-size: 22px;
		color: #8c939d;
		width: 276px;
		height: 140px;
		line-height: 140px;
		text-align: center;
	}
	.avatar {
		width: 276px;
		height: 140px;
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
		}
	}
	.tutorials {
		width: 100%;
		float: left;
		background: #f6f6f6;
		margin-bottom: 12px;
		border-radius: 4px;
		> .tut-title {
			font-size: 16px;
			padding: 8px;
			font-weight: bolder;
			i {
				float: right;
				font-size: 18px;
				cursor: pointer;
			}
		}
		.el-form-item {
			margin-left: 15px;
			margin-bottom: 12px;
			width: 80%;
		}
		&.add {
			min-height: 40px;
			background: #fff;
			border: 1px solid #d6d6d6;
			text-align: center;
			line-height: 40px;
			color: #409eff;
			font-size: 16px;
			cursor: pointer;
		}
	}
}
</style>