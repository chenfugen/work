<template>
	<div id="messageFeedback">
		<TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
		<comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>
		<el-dialog
			@close="close"
			:close-on-click-modal="false"
			title="反馈详情"
			top="3vh"
			:visible.sync="seeBox"
			width="550px"
			custom-class="seeBox"
		>
			<div class="see-center">
				<p>
					<font class="title">反馈人：</font>
					<font>{{boxForm.feedback}}</font>
				</p>
				<p>
					<font class="title">反馈类型：</font>
					<font>{{boxForm.type==1?'设备':(boxForm.type==2?'APP':'其他')}}</font>
				</p>
				<p>
					<font class="title">联系方式：</font>
					<font>{{boxForm.contact}}</font>
				</p>
				<p>
					<font class="title">反馈时间：</font>
					<font>{{$filters.dateFilter(boxForm.feedbackTime,'')}}</font>
				</p>
				<p :title="boxForm.content">
					<font class="title">内容：</font>
					{{boxForm.content}}
				</p>
			</div>
			<div class="see-img" v-if="boxForm.imageName">
				<img
					v-for="(name,index) in boxForm.imageName.split('#').length"
					:key="index"
					:src="$store.state.oldStore.imgSrc+boxForm.imageName.split('#')[index]+'&token='+$store.state.oldStore.token"
				/>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			seeBox: false,
			ruleForm: {
				name: "",
				region: "",
			},
			boxForm: {
				feedback: "",
				type: "",
				content: "",
				contact: "",
				feedbackTime: "",
			},
			rules: {
				name: [
					{
						required: true,
						message: "请输入活动名称",
						trigger: "blur",
					},
				],
				region: [
					{
						required: true,
						message: "请选择活动区域",
						trigger: "change",
					},
				],
			},
			tableSearch: {
				isExport: false,
				exportName: "",
				btn: [],
				funClick: this.getFeedbacks,
				cleanClick: this.cleanClick,
				input: [{ pla: "反馈人", width: "138", value: "" }],
				picker: {
					value: "",
					startPlaceholder: "反馈开始日期",
					endPlaceholder: "反馈结束日期",
				},
				select: [],
				selectArry: [], //表格选中数据集合
			},
			tableHeader: {
				sortMethod: function () {},
				tableStatus: false,
				filters: this.filters,
				tableHeight: "calc(100% - 86px)",
				comHeight: "calc(100% - 10px)",
				handleSelectionChange: this.handleSelectionChange, //选中表格数据方法
				isSelection: [false, "55"], //是否显示序列号
				oper: {
					//操作栏
					label: "操作",
					prop: "oper",
					minWidth: "135",
					fixed: "right",
					oper: [
						{ name: "查看", clickFun: this.seeRow },
						{
							name: "删除",
							clickFun:
								this.$store.state.oldStore.authThree.indexOf("h20") != -1
									? this.deleteRow
									: 0,
						},
					],
				},
				data: [
					//表格头数据绑定
					{
						label: "反馈人",
						prop: "feedback",
						minWidth: "120",
						fixed: false,
					},
					{
						label: "反馈类型",
						prop: "type",
						minWidth: "120",
						fixed: false,
						filters: [
							{ text: "设备", value: 1 },
							{ text: "APP", value: 2 },
							{ text: "其他", value: 3 },
						],
						filterList: [],
					},
					{
						label: "消息状态",
						prop: "ifRead",
						minWidth: "100",
						fixed: false,
						filters: [
							{ text: "已读", value: true },
							{ text: "未读", value: false },
						],
						filterList: [],
					},
					{
						label: "联系方式",
						prop: "contact",
						minWidth: "140",
						fixed: false,
					},
					{
						label: "内容",
						prop: "content",
						minWidth: "240",
						fixed: false,
					},
					{
						label: "反馈时间",
						prop: "feedbackTime",
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
			feedbacks: {
				ifRead: "", //已读未读
				type: "", //反馈类型
				feedback: "", //反馈人
				feedbackStartTime: "",
				feedbackEndTime: "",
				pageNumber: 1,
				pageSize: 20,
			},
		};
	},
	methods: {
		deleteRow(index, row) {
			this.$confirm("确认删除吗?", "提示", this.$filters.confirm()).then(
				() => {
					this.$http.deleteFeedback(row.id).then((res) => {
						if (res.data.success) {
							this.getFeedbacks();
						}
					});
				}
			);
		},
		handleSelectionChange(val) {
			this.tableSearch.selectArry = val;
		},
		handleSizeChange(val) {
			this.tableHeader.pagination.pageSize = this.feedbacks.pageSize = val;
			this.getFeedbacks();
		},
		handleCurrentChange(val) {
			this.tableHeader.pagination.currentPage = this.feedbacks.pageNumber = val;
			this.getFeedbacks();
		},
		cleanClick() {
			this.tableSearch.input[0].value = "";
			this.tableSearch.picker.value = "";
			this.feedback.ifRead = "";
			this.feedback.type = "";
			this.tableHeader.pagination.currentPage = 1;
			this.tableHeader.data.forEach((item) => {
				if (item.hasOwnProperty("filterList")) {
					item.filterList = [];
				}
			});
			// this.feedbacks.type = '';
			this.getFeedbacks();
		},
		seeRow(index, row) {
			this.$http.feedbackRecord({ id: row.id }).then((res) => {
				if (res.data.success) {
					this.boxForm = row;
					this.seeBox = true;
					this.getFeedbacks();
				}
			});
		},
		//筛选列
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			this.feedbacks[name] = filters[name][0];
			this.getFeedbacks();
		},
		getFeedbacks() {
			this.tableHeader.tableStatus = false;
			this.feedbacks.feedback = this.tableSearch.input[0].value;
			if (this.tableSearch.picker.value) {
				this.feedbacks.feedbackStartTime = this.$filters.dateFilter(
					this.tableSearch.picker.value[0],
					""
				);
				this.feedbacks.feedbackEndTime = this.$filters.dateFilter(
					this.tableSearch.picker.value[1],
					""
				);
			} else {
				this.feedbacks.feedbackStartTime = "";
				this.feedbacks.feedbackEndTime = "";
			}
			this.$http.feedbacks(this.feedbacks).then((res) => {
				if (res.data.success) {
					this.tableData = res.data.rows;
					this.tableHeader.tableStatus = true;
					this.tableHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.tableHeader.pagination.currentPage = this.feedbacks.pageNumber = 1;
						this.getFeedbacks();
					}
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					});
				}
			});
		},
		close() {
			this.boxForm = {
				feedback: "",
				type: "",
				content: "",
				contact: "",
				feedbackTime: "",
			};
		},
	},
	mounted() {
		this.getFeedbacks();
	},
};
</script>

<style lang="less">
#messageFeedback {
	width: 100%;
	height: 100%;
	float: left;
	background: #fff;
	padding-top: 24px;
	box-sizing: border-box;
	-webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	border-radius: 4px;
	#addRole {
		> .el-dialog {
			height: 100%;
			float: right;
			margin-bottom: 0;
			> .el-dialog__footer {
				position: absolute;
				bottom: 0;
				right: 0;
			}
		}
	}
	.seeBox {
		.see-center {
			width: 100%;
			height: auto;
		}
		.see-img {
			width: 100%;
			height: auto;
			> img {
				width: calc(50% - 10px);
				margin-bottom: 10px;
				&:nth-of-type(odd) {
					margin-right: 10px;
				}
			}
		}
		p {
			display: inline-block;
			margin: 10px 0;
			width: 100%;
			line-height: 19px;
			font {
				width: calc(100% - 90px);
				display: block;
				float: left;
				height: 19px;
				line-height: 19px;
				&.title {
					width: 90px;
					text-align: right;
				}
			}
		}
	}
}
</style>
