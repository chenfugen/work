<template>
	<div id="userAdvert">
		<TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
		<comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>

		<el-dialog
			:close-on-click-modal="false"
			title="新建广告"
			:visible.sync="addBox"
			width="600px"
			id="addAdvert"
			@close="close"
		>
			<el-form
				:model="ruleForm"
				:rules="ruless"
				ref="ruleForm"
				label-width="80px"
				class="demo-ruleForm"
			>
				<div style="width:350px;height:375px;float:left">
					<el-form-item label="播放时长" prop="second">
						<el-input-number
							v-model.trim="ruleForm.second"
							controls-position="right"
							size="small"
							:min="1"
							:max="30"
						></el-input-number>&nbsp;秒&nbsp;&nbsp;
						<font style="color:#cccccc">范围1~30秒之间</font>
					</el-form-item>
					<el-form-item label="点击动作" prop="clickType">
						<el-radio v-model.trim="ruleForm.clickType" :label="1">淘宝APP</el-radio>
						<br />
						<el-radio v-model.trim="ruleForm.clickType" :label="2">京东APP</el-radio>
						<br />
						<el-radio v-model.trim="ruleForm.clickType" :label="3">浏览器</el-radio>
					</el-form-item>
					<el-form-item label="url" prop="url">
						<el-input type="textarea" autosize placeholder="请输入url" v-model.trim="ruleForm.url"></el-input>
						<br />
						{{ruleForm.clickType==2?'示例:https://item.jd.com/10644038952.html':(ruleForm.clickType==1?'示例:https://item.taobao.com/item.htm?id=562298814990':'')}}
					</el-form-item>
				</div>
				<div style="width:170px;height:375px;float:right">
					<el-upload
						:http-request="function(){}"
						class="avatar-uploader"
						:on-change="imgPreview"
						action="https://jsonplaceholder.typicode.com/posts/"
						:show-file-list="false"
						accept=".jpg, .png"
					>
						<img v-if="imageUrl" :src="ruleForm.imageName" class="avatar" />
						<div class="userAdvert-add" v-if="!imageUrl">单击上传</div>
					</el-upload>
					<el-form-item label="图片" prop="imageName" style="margin:0 0 0 30px" class="imgReoo"></el-form-item>
					<span style="color:#cccccc">支持扩展名：.jpg,.png,图片比例：9:16,图片大小：<= 1MB</span>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addBox = false">取 消</el-button>
				<el-button type="danger" @click="submitForm('ruleForm')">保 存</el-button>
			</div>
		</el-dialog>
		<el-dialog
			:close-on-click-modal="false"
			title="查看"
			:visible.sync="seeBox"
			width="550px"
			id="seeAdvert"
		>
			<div class="seeAdvert-box">
				<p>
					<font>播放时长：</font>
					{{seeForm.second+'秒'}}
				</p>
				<p>
					<font>点击动作：</font>
					{{seeForm.clickType==1?'淘宝APP':(seeForm.clickType==2?'京东APP':'浏览器')}}
				</p>
				<p>
					<font>url：</font>
					{{seeForm.url}}
				</p>
				<img :src="$store.state.oldStore.imgSrc+seeForm.imageName+'&token='+$store.state.oldStore.token" />
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			addBox: false,
			seeBox: false,
			seeForm: {},
			num: 1,
			imageUrl: false, //储存即将上传的文件
			imageName: "", //储存即将上传的文件名
			ruleForm: {
				second: "",
				url: "",
				clickType: 1,
				imageName: "",
			},
			ruless: {
				url: [
					{
						pattern: /^(http|https):\/\/([\w.]+\/?)\S*/,
						message: "请输入正确的url地址",
						trigger: "blur",
					},
					{
						required: true,
						message: "请输入url",
						trigger: "blur",
					},
				],
				imageName: [
					{
						required: true,
						message: "请上传图片",
						trigger: "blur",
					},
				],
			},
			tableSearch: {
				isExport: false,
				exportName: "广告列表",
				btn: [
					{
						name: "新建广告",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf("k31") != -1
								? this.addAdvert
								: 0,
					},
					{
						name: "启用广告",
						clickInfo:
							this.$store.state.oldStore.authThree.indexOf("k31") != -1
								? this.sAdvert
								: 0,
					},
				],
				funClick: this.getAdvertisements,
				cleanClick: this.cleanClick,
				input: [],
				picker: {
					value: "",
					startPlaceholder: "开始日期",
					endPlaceholder: "结束日期",
				},
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
						{
							name: "查看",
							clickFun: this.seeAdvert,
						},
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf("k30") != -1
									? this.deleteRow
									: 0,
						},
					],
				},
				data: [
					//表格头数据绑定
					{
						label: "点击动作",
						prop: "clickType",
						minWidth: "120",
						fixed: true,
						name: "点击动作",
						filters: [
							{
								text: "淘宝APP",
								value: 1,
							},
							{
								text: "京东APP",
								value: 2,
							},
							{
								text: "浏览器",
								value: 3,
							},
						],
						filterList: [],
					},
					{
						label: "url",
						prop: "url",
						minWidth: "300",
						fixed: false,
					},
					{
						label: "创建时间",
						prop: "createTime",
						minWidth: "156",
						fixed: false,
					},
					{
						label: "创建人",
						prop: "creator",
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
			rules: {
				clickType: "", //点击动作
				startTime: "", //创建开始时间
				endTime: "", //创建结束时间
				pageNumber: 1, //分页页数
				pageSize: 20, //分页每页数量
			},
		};
	},
	mounted() {
		this.getAdvertisements();
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (
						this.ruleForm.clickType == 2 &&
						this.ruleForm.url.indexOf("https://item.jd.com") ==
							-1 &&
						this.ruleForm.url.indexOf("http://item.jd.com") == -1
					) {
						this.$message.warning(
							"url地址不符合规范！请参照示例重新输入"
						);
						return false;
					}
					var data = new FormData();
					data.append("fileName", this.imageName);
					data.append("oldFileName", "");
					data.append("file", this.imageUrl);
					this.$http.file(data).then((res) => {
						if (res.data.success) {
							this.ruleForm.imageName = res.data.fileName;
							this.$http
								.addAdvertisement(this.ruleForm)
								.then((res) => {
									this.addBox = false;
									if (res.data.success) {
										this.getAdvertisements();
									}
								});
						} else {
							this.addBox = false;
						}
					});
				} else {
					return false;
				}
			});
		},
		deleteRow(index, row) {
			this.$confirm("确认删除吗?", "提示", this.$filters.confirm())
				.then(() => {
					this.$http.deleteDvertisement(row.id).then((res) => {
						if (res.data.success) {
							this.getAdvertisements();
						}
					});
				})
				.catch(() => {});
		},
		getAdvertisements() {
			if (
				this.tableSearch.picker.value &&
				this.tableSearch.picker.value.length > 0
			) {
				this.rules.startTime = this.$filters.dateFilter(
					this.tableSearch.picker.value[0],
					""
				);
				this.rules.endTime = this.$filters.dateFilter(
					this.tableSearch.picker.value[1],
					""
				);
			} else {
				this.rules.startTime = "";
				this.rules.endTime = "";
			}
			this.tableHeader.tableStatus = false;
			this.$http.advertisements(this.rules).then((res) => {
				if (res.data.success) {
					this.tableData = res.data.rows;
					this.tableHeader.tableStatus = true;
					this.tableHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.tableHeader.pagination.currentPage = this.rules.pageNumber = 1;
						this.getAdvertisements();
					}
					if (this.tableData[0].status) {
						this.tableSearch.btn[1].name = "停用广告";
					} else {
						this.tableSearch.btn[1].name = "启用广告";
					}
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					});
				}
			});
		},
		handleSizeChange(val) {
			this.tableHeader.pagination.pageSize = this.rules.pageSize = val;
			this.getAdvertisements();
		},
		handleCurrentChange(val) {
			this.tableHeader.pagination.currentPage = this.rules.pageNumber = val;
			this.getAdvertisements();
		},
		cleanClick() {
			// this.rules.clickType = '';
			this.tableSearch.picker.value = "";
			this.rules.clickType = "";
			this.tableHeader.pagination.currentPage = 1;
			this.tableHeader.data.forEach((item) => {
				if (item.hasOwnProperty("filterList")) {
					item.filterList = [];
				}
			});
			this.getAdvertisements();
		},
		close() {
			this.ruleForm.imageName = "";
			this.imageUrl = ""; //储存即将上传的文件
			this.imageName = ""; //储存即将上传的文件名
			this.$refs.ruleForm.resetFields();
		},
		addAdvert() {
			this.addBox = true;
		},
		sAdvert() {
			this.$http
				.enableAdvertisement({
					status: !this.tableData[0].status,
				})
				.then((res) => {
					if (res.data.success) {
						this.getAdvertisements();
					}
				});
		},
		seeAdvert(index, row) {
			this.seeForm = row;
			this.seeBox = true;
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
		//筛选列
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			this.rules[name] =
				filters[name][0] != undefined ? filters[name][0] : "";
			this.getAdvertisements();
		},
	},
};
</script>

<style lang="less">
#userAdvert {
	width: 100%;
	height: 100%;
	float: left;
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
		width: 153px;
		height: 272px;
		line-height: 272px;
		text-align: center;
	}
	.avatar {
		width: 153px;
		height: 272px;
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
}
</style>
