<template>
<div id="faultRecord">
	<TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
	<!-- <comTable :tableData="tableData" :tableHeader="tableHeader"></comTable> -->
	<div id="com-table" :style="tableHeader.comHeight?'height:'+tableHeader.comHeight:'height:100%'">
		<el-table id="out-table" v-if="tableHeader.tableStatus" :data="tableData" @selection-change="tableHeader.handleSelectionChange" style="width: 100%" :height="tableHeader.tableHeight?tableHeader.tableHeight:640" header-cell-class-name="cheTabHreaClass"
		    cell-class-name="cheTabConClass" @filter-change="tableHeader.filters" @sort-change="tableHeader.sortMethod">
			<el-table-column v-if="tableHeader.isSelection[0]" fixed type="selection" :width="tableHeader.isSelection[1]"></el-table-column>
			<el-table-column type="index" width="50" label="序号" align="center" fixed="left"></el-table-column>
			<el-table-column v-for="(i,index) in tableHeader.data" :key="index" :fixed="i.fixed" :prop="i.prop" :label="i.label" :min-width="i.minWidth" :show-overflow-tooltip="i.prop!='name'?true:false" :filter-multiple="false" :sortable="i.sortable?'custom':false"
			    :align="i.prop.indexOf('p_s')!= -1||i.prop.indexOf('popover')!= -1?'center':'left'" :filters="i.filters?i.filters:null" :filtered-value="i.filterList?i.filterList:null" :column-key="i.prop" filter-placemen="bottom">
				<template slot-scope="scope">
					<i v-if="i.prop == 'ifRead'" :class="scope.row[i.prop]?'iconread':'iconunread'" :style="!scope.row[i.prop]?'color:#60ACFC':''"></i>
					{{i.prop != 'deviceSN'&&i.label != '点击动作'&&i.label != '反馈类型'&&i.label != '用户范围'&&i.prop != 'appType'&&i.prop != 'status'&&i.prop != 'online'&&i.prop != 'totalStatus'&&i.prop != 'init'&&i.prop != 'clickType' && i.prop != 'ifRead'?(i.prop.indexOf('Time') != -1?dateFilter(scope.row[i.prop],'秒'):(scope.row[i.prop]!=null && typeof(scope.row[i.prop])=='object'?scope.row[i.prop].name:scope.row[i.prop])):''}}
					{{i.prop == 'ifRead'?(scope.row[i.prop]?'已读':'未读'):''}}
					<el-button v-if="i.prop == 'deviceSN'" @click.native.prevent="i.clickFun?i.clickFun(scope.$index, scope.row):$message.warning('无此操作权限！')" type="text" size="small">{{scope.row[i.prop]}}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column v-if="tableHeader.oper" :fixed="tableHeader.oper.fixed" :label="tableHeader.oper.label" :min-width="tableHeader.oper.minWidth">
				<template slot-scope="scope">
					<el-button v-for="(i,index) in tableHeader.oper.oper" :key="index" @click.native.prevent="i.clickFun?i.clickFun(scope.$index, scope.row):$message.warning('无此操作权限！')" type="text" size="small">
						<el-divider v-if="index != 0" direction="vertical"></el-divider>{{i.name}}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination id="pagination" background align="right" @size-change="tableHeader.pagination.handleSizeChange" @current-change="tableHeader.pagination.handleCurrentChange" :current-page="tableHeader.pagination.currentPage" :page-sizes="tableHeader.pagination.pageSizes"
		    :page-size="tableHeader.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableHeader.pagination.total">
		</el-pagination>
	</div>
	<el-dialog :close-on-click-modal="false" title="故障详情" :visible.sync="seeBox" width="550px" custom-class="seeBox">
		<div class="see-center">
			<p>
				<font class="title">产品类型：</font>
				<font>{{seeForm.deviceType}}</font>
			</p>
			<p>
				<font class="title">产品型号：</font>
				<font>{{seeForm.deviceModel}}</font>
			</p>
			<p>
				<font class="title">故障代码：</font>
				<font>{{seeForm.code}}</font>
			</p>
			<p>
				<font class="title">上报时间：</font>
				<font>{{$filters.dateFilter(seeForm.reportTime,'')}}</font>
			</p>
			<p>
				<font class="title">更新时间：</font>
				<font>{{$filters.dateFilter(seeForm.updateTime,'')}}</font>
			</p>
			<p>
				<font class="title">消息状态：</font>
				<font>{{seeForm.ifRead?'已读':'未读'}}</font>
			</p>
			<p>
				<font class="title">通知内容：</font>
				<font>{{seeForm.content}}</font>
			</p>
		</div>
	</el-dialog>
</div>
</template>

<script>
export default {
	data() {
		return {
			tableStatus: false,
			seeBox: false, //详情弹框
			seeForm: {
				code: "0xA0",
				content: "NTC开路",
				createTime: "2019-08-01T03:55:11.101+0000",
				deviceModel: null,
				deviceSN: null,
				deviceType: null,
				id: "5d42629ff75051765af90eab",
				ifRead: false,
				mac: "1A2A3A4A5A6A",
				reportTime: "2019-08-01T03:55:11.101+0000",
				timestamp: 1564631711000,
				updateTime: "2019-08-01T03:55:11.101+0000"
			},
			tableSearch: {
				isExport: this.$store.state.oldStore.authThree.indexOf('d25') != -1 ? true : false,
				exportName: '故障记录',
				funClick: this.tabSearBtnClick,
				cleanClick: this.cleanClick,
				input: [{
					pla: '故障代码/SN',
					width: '178',
					value: ''
				}, ],
				picker: {
					value: '',
					startPlaceholder: '首次上报开始日期',
					endPlaceholder: '首次上报结束日期',
				},
				selectArry: [], //表格选中数据集合
			},
			tableHeader: {
				sortMethod: function() {},
				tableStatus: false,
				filters: this.filters,
				tableHeight: 'calc(100% - 86px)',
				comHeight: 'calc(100% - 10px)',
				handleSelectionChange: this.handleSelectionChange, //选中表格数据方法
				isSelection: [true, '55'], //是否显示序列号
				oper: { //操作栏
					label: '操作',
					prop: 'oper',
					minWidth: '90',
					fixed: 'right',
					oper: [{
							name: '查看',
							clickFun: this.seeRow
						},
						{
							name: '删除',
							clickFun: this.$store.state.oldStore.authThree.indexOf('d20') != -1 ? this.deleteRow : 0
						},
					]
				},
				data: [ //表格头数据绑定
					{
						label: '产品型号',
						prop: 'deviceModel',
						minWidth: '120',
						fixed: true,
						filters: this.$store.state.oldStore.deviceModelFilters,
						filterList: []
					},
					{
						label: 'SN序列号',
						prop: 'deviceSN',
						minWidth: '150',
						fixed: true,
						clickFun: this.$store.state.oldStore.authThree.indexOf('c11') != -1 ? this.lookSn : 0
					},
					{
						label: '产品类型',
						prop: 'deviceType',
						minWidth: '120',
						fixed: false,
						filters: this.$store.state.oldStore.deviceTypeFilters,
						filterList: []
					},
					{
						label: '故障代码',
						prop: 'code',
						minWidth: '120',
						fixed: false
					},
					{
						label: '通知内容',
						prop: 'content',
						minWidth: '220',
						fixed: false
					},
					{
						label: '消息状态',
						prop: 'ifRead',
						minWidth: '120',
						fixed: false,
						filters: [{
							text: '已读',
							value: true
						}, {
							text: '未读',
							value: false
						}],
						filterList: []
					},
					{
						label: '上报时间',
						prop: 'reportTime',
						minWidth: '156',
						fixed: false
					},
					{
						label: '更新时间',
						prop: 'updateTime',
						minWidth: '156',
						fixed: false
					},
				],
				pagination: {
					currentPage: 1, // 当前页码
					total: 0, //总页数
					pageSize: 20, //每页数据条数
					pageSizes: [20, 50, 100, 200], //每页数据条数集合
					handleSizeChange: this.handleSizeChange, //切换每页多少条
					handleCurrentChange: this.handleCurrentChange, //切换当前页码
				}
			},
			tableData: [],
			recordForm: {
				codeMacSn: '',
				reportStartTime: '',
				reportEndTime: '',
				deviceType: '',
				deviceModel: '',
				ifRead: '', //已读未读
				pageNumber: 1,
				pageSize: 20,
			}
		}
	},
	mounted() {},
	methods: {
		deleteRow(index, row) {
			this.$confirm('确认删除此记录吗?', '提示', this.$filters.confirm()).then(() => {
				this.$http.deleteFaultRecord(row.id).then(res => {
					if (res.data.success) {
						this.getFaultRecords();
					}
				})
			})
		},
		lookSn(index, row) {
			var href = window.location.href.split('#')[0] + '#/device/details/' + row.mac;
			window.open(href);
		},
		seeRow(index, row) {
			this.$http.readFaultRecord({
				id: row.id
			}).then(res => {
				if (res.data.success) {
					this.getFaultRecords();
					this.$http.faultRecordNotReadNumber().then(res => {
						if (res.data.success) {
							this.$store.commit('add_msgNum', res.data.data);
							this.seeForm = row;
							this.seeBox = true;
						}
					})
				}
			})
		},
		handleSelectionChange(val) {
			this.tableSearch.selectArry = val;
		},
		handleSizeChange(val) {
			this.recordForm.pageSize = this.tableHeader.pagination.pageSize = val;
			this.getFaultRecords();
		},
		handleCurrentChange(val) {
			this.recordForm.pageNumber = this.tableHeader.pagination.currentPage = val;
			this.getFaultRecords();
		},
		tabSearBtnClick() {
			this.getFaultRecords();
		},
		cleanClick() {
			this.recordForm.codeMacSn = this.tableSearch.input[0].value = '';
			this.tableSearch.picker.value = '';
			this.recordForm.reportStartTime = '';
			this.recordForm.reportEndTime = '';
			this.recordForm.deviceType = '';
			this.recordForm.deviceModel = '';
			this.recordForm.ifRead = '';
			this.tableHeader.pagination.currentPage = 1;
			this.tableHeader.data.forEach(item => {
				if (item.hasOwnProperty('filterList')) {
					item.filterList = [];
				}
			});
			this.getFaultRecords();
		},
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			this.recordForm[name] = filters[name][0];
			this.getFaultRecords();
		},
		getFaultRecords() {
			this.recordForm.codeMacSn = this.tableSearch.input[0].value;
			if (this.tableSearch.picker.value) {
				this.recordForm.reportStartTime = this.$filters.dateFilter(this.tableSearch.picker.value[0], '');
				this.recordForm.reportEndTime = this.$filters.dateFilter(this.tableSearch.picker.value[1], '');
			} else {
				this.recordForm.reportStartTime = '';
				this.recordForm.reportEndTime = '';
			}
			this.tableHeader.tableStatus = false;
			this.$http.faultRecords(this.recordForm).then(res => {
				if (res.data.success) {
					this.tableData = res.data.rows;
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					})
					this.tableHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.tableHeader.pagination.currentPage = this.recordForm.pageNumber = 1;
						this.getFaultRecords();
					}
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					})
				}
			})
		},
		dateFilter(msg, pattern = '') {
			// 将字符串转换为Date类型
			var mt = new Date(msg)
			// 获取年份
			var y = mt.getFullYear()
			// 获取月份 从0开始
			var m = (mt.getMonth() + 1).toString().padStart(2, "0")
			// 获取天数
			var d = (mt.getDate()).toString().padStart(2, "0")
			if (pattern === '天') {
				return y + "-" + m + "-" + d
			}
			// 获取小时
			var h = mt.getHours().toString().padStart(2, "0")
			// 获取分钟
			var mi = mt.getMinutes().toString().padStart(2, "0")
			// 获取秒
			var s = mt.getSeconds().toString().padStart(2, "0")
			// 拼接为我们需要的各式
			if (y == '1970') {
				return msg;
			} else {
				return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s
			}
			return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s;
		}
	},
	mounted() {
		this.getFaultRecords()
	}
}
</script>

<style lang="less">
#faultRecord {
    width: 100%;
    height: 100%;
    float: left;
    background: #fff;
    padding-top: 24px;
    box-sizing: border-box;
    -webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    .seeBox {
        .see-center {
            width: 100%;
            height: auto;
        }
        p {
            display: inline-block;
            margin: 10px 0;
            width: 100%;
            font {
                width: calc(100% - 100px);
                display: block;
                float: left;
                &.title {
                    width: 100px;
                    text-align: right;
                }
            }
        }
    }
}
</style>
