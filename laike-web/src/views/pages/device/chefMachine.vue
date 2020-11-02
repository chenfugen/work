<template>
<div id="chefMachine">
	<el-tabs v-model.trim="activeName" @tab-click="handleClick" style="height:calc(100% - 65px)">
		<el-tab-pane label="设备列表" name="0" v-if="$store.state.oldStore.authThree.indexOf('c11') != -1" style="height:100%">
			<TableSearch :tableData="deviceData" :tableSearch="deviceSearch" :exportHead="deviceHeader.data"></TableSearch>
			<comTable v-if="tableStutas" :tableData="deviceData" :tableHeader="deviceHeader"></comTable>
		</el-tab-pane>
		<el-tab-pane label="登记列表" name="1" style="height:100%" v-if="this.$store.state.oldStore.authThree.indexOf('c12') != -1">
			<TableSearch :tableData="registerData" :tableSearch="registerSearch" :exportHead="registerHeader.data"></TableSearch>
			<comTable v-if="tableStutas1" :tableData="registerData" :tableHeader="registerHeader"></comTable>
			<el-dialog :close-on-click-modal="false" :title="'文件导入 共'+(dataFrom.length)+'条数据'" top="8vh" :visible.sync="preview" @close="preClose" width="950px">
				<el-table :data="dataFrom" height="600px">
					<el-table-column property="序列号" label="序列号" width="150"></el-table-column>
					<el-table-column property="MAC地址" label="MAC地址" width="150"></el-table-column>
					<el-table-column property="产品类型" label="产品类型" width="150"></el-table-column>
					<el-table-column property="产品型号" label="产品型号" width="150"></el-table-column>
					<el-table-column property="生产线" label="生产线" width="150"></el-table-column>
					<el-table-column property="生产时间" label="生产时间" width="150"></el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button @click="preview = false">取 消</el-button>
					<el-button type="danger" @click="previewTrue">导入</el-button>
				</div>
			</el-dialog>
		</el-tab-pane>
	</el-tabs>

	<el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editBox" width="500px" @close="close('ruleForm')">
		<el-form :model="editData" ref="ruleForm">
			<el-form-item label="MAC地址:" label-width="100px" prop="mac" :rules="[{ required: true, message: '请填写MAC地址', trigger: 'blur' }]">
				<el-input v-model.trim="editData.mac" autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="editBox = false">取 消</el-button>
			<el-button type="danger" @click="submitForm('ruleForm')">确 定</el-button>
		</div>
	</el-dialog>

	<el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editBox1" width="500px" @close="close('ruleForm1')">
		<el-form :model="editData1" ref="ruleForm1">
			<el-form-item label="产品型号:" label-width="100px" prop="deviceModel" :rules="[{ required: true, message: '请选择产品类型', trigger: 'blur' }]">
				<el-select v-model.trim="editData1.deviceModel" placeholder="请选择产品型号">
					<el-option v-for="(i,x) in $store.state.oldStore.deviceModels" :key="x" :label="i" :value="i"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="SN序列号:" label-width="100px" prop="deviceSN" :rules="[{ required: true, message: '请填写SN序列号', trigger: 'blur' }]">
				<el-input v-model.trim="editData1.deviceSN"></el-input>
			</el-form-item>
			<el-form-item label="MAC地址:" label-width="100px" prop="mac" :rules="[{ required: true, message: '请填写MAC地址', trigger: 'blur' }]">
				<el-input v-model.trim="editData1.mac" autocomplete="off"></el-input>
			</el-form-item>
			<!-- <el-form-item label="生产日期:" label-width="100px" prop="productTime" :rules="[{ required: true, message: '请选择生产日期', trigger: 'chang' }]">
                    <div class="block">
                        <el-date-picker
                        v-model="editData1.productTime"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </el-form-item> -->
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="editBox1 = false">取 消</el-button>
			<el-button type="danger" @click="submitForm('ruleForm1')">确 定</el-button>
		</div>
	</el-dialog>
	<el-dialog :close-on-click-modal="false" title="详情" :visible.sync="seeBox" width="550px" custom-class="seeBox">
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
				<font class="title">MAC地址：</font>
				<font>{{seeForm.mac}}</font>
			</p>
			<p>
				<font class="title">SN号：</font>
				<font>{{seeForm.deviceSN}}</font>
			</p>
			<p>
				<font class="title">IP地址：</font>
				<font>{{seeForm.ip}}</font>
			</p>
			<p>
				<font class="title">MCU固件版本：</font>
				<font>{{seeForm.mcuVersion}}</font>
			</p>
			<p>
				<font class="title">安卓屏app版本：</font>
				<font>{{seeForm.dtuVersion}}</font>
			</p>
			<p>
				<font class="title">信号强度值：</font>
				<font>{{seeForm.wifiRSSI}}</font>
			</p>
			<p>
				<font class="title">登记时间：</font>
				<font>{{$filters.dateFilter(seeForm.createTime)}}</font>
			</p>
			<p>
				<font class="title">激活时间：</font>
				<font>{{$filters.dateFilter(seeForm.activeTime)}}</font>
			</p>
			<p>
				<font class="title">最近在线时间：</font>
				<font>{{$filters.dateFilter(seeForm.lastOnlineTime)}}</font>
			</p>
		</div>
	</el-dialog>
</div>
</template>

<script>
import XLSX from 'xlsx'
export default {
	data() {
		return {
			excel: '',
			seeBox: false,
			seeForm: {},
			tableStutas: true,
			tableStutas1: true,
			editBox: false, //设备列表编辑框
			editBox1: false, //登记列表编辑框
			editData: {
				mac: '',
			},
			editData1: {
				mac: '',
				deviceSN: '',
				productTime: '',
				deviceModel: '',
			},
			pickerOptions: { //只允许选择今天之前的日期(包括今天)
				disabledDate(time) {
					return time.getTime() > Date.now() - 8.64e6
				}
			},
			activeName: '', //当前激活的tabs页
			deviceData: [], //数据集合
			deviceSearch: {
				isExport: this.$store.state.oldStore.authFour.indexOf('c114') != -1 ? true : false,
				exportName: '设备列表',
				funClick: this.tabSearBtnClick,
				cleanClick: this.cleanClick,
				input: [{
					pla: 'MAC地址/SN号',
					width: '128',
					value: ''
				}, ],
				select: [],
				picker: {
					value: '',
					startPlaceholder: '激活开始日期',
					endPlaceholder: '激活结束日期',
				},
				selectArry: [], //表格选中数据集合
			},
			deviceHeader: {
				tableStatus: false,
				sortMethod: function() {},
				filters: this.filters,
				tableHeight: 'calc(100% - 86px)',
				comHeight: 'calc(100% - 10px)',
				handleSelectionChange: this.handleSelectionChange, //选中表格数据方法
				isSelection: [true, '55'], //是否显示序列号
				oper: { //操作栏
					label: '操作',
					prop: 'oper',
					minWidth: '93',
					fixed: 'right',
					oper: [{
							name: '查看',
							clickFun: this.details
						},
						// {name:'编辑',clickFun: this.$store.state.oldStore.authFour.indexOf('c112') != -1?this.editRow:0},
						{
							name: '删除',
							clickFun: this.$store.state.oldStore.authFour.indexOf('c110') != -1 ? this.deleteRow : 0
						},
					]
				},
				data: [ //表格头数据绑定
					{
						label: 'SN号',
						prop: 'deviceSN',
						minWidth: '180',
						fixed: true
					},
					{
						label: 'MAC地址',
						prop: 'mac',
						minWidth: '180',
						fixed: true
					},
					{
						label: '产品型号',
						prop: 'deviceModel',
						minWidth: '120',
						fixed: false,
						filters: this.$store.state.oldStore.deviceModelFilters,
						filterList: []
					},
					{
						label: '在离线',
						prop: 'online',
						minWidth: '120',
						fixed: false,
						filters: [{
							text: '在线',
							value: true
						}, {
							text: '离线',
							value: false
						}],
						filterList: []
					},
					{
						label: 'MCU版本号',
						prop: 'mcuVersion',
						minWidth: '120',
						fixed: false
					},
					{
						label: 'DTU版本号',
						prop: 'dtuVersion',
						minWidth: '120',
						fixed: false
					},
					{
						label: '登记日期',
						prop: 'createTime',
						minWidth: '156',
						fixed: false
					},
					{
						label: '激活日期',
						prop: 'activeTime',
						minWidth: '156',
						fixed: false
					},
					{
						label: '最近在线时间',
						prop: 'lastOnlineTime',
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
			registerSearch: {
				isExport: this.$store.state.oldStore.authFour.indexOf('c124') != -1 ? true : false,
				exportName: '登记列表',
				funClick: this.tabSearBtnClick,
				cleanClick: this.cleanClick,
				input: [{
					pla: 'MAC地址/SN号',
					width: '128',
					value: ''
				}, ],
				picker: {
					value: '',
					startPlaceholder: '登记开始日期',
					endPlaceholder: '登记结束日期',
				},
				selectArry: [], //表格选中数据集合
			},
			registerHeader: {
				tableStatus: false,
				filters: this.filters1,
				sortMethod: function() {},
				tableHeight: 'calc(100% - 86px)',
				comHeight: 'calc(100% - 10px)',
				handleSelectionChange: this.handleSelectionChange1, //选中表格数据方法
				isSelection: [true, '55'], //是否显示序列号
				oper: { //操作栏
					label: '操作',
					prop: 'oper',
					minWidth: '96',
					fixed: 'right',
					oper: [
						// {name:'编辑',clickFun: this.$store.state.oldStore.authFour.indexOf('c122') != -1?this.editRow1:0},
						{
							name: '查看',
							clickFun: this.$store.state.oldStore.authFour.indexOf('c123') != -1 ? this.lookRow : 0
						},
						{
							name: '删除',
							clickFun: this.$store.state.oldStore.authFour.indexOf('c120') != -1 ? this.deleteRow : 0
						},
					]
				},
				data: [ //表格头数据绑定
					{
						label: 'SN号',
						prop: 'deviceSN',
						minWidth: '180',
						fixed: true
					},
					{
						label: 'MAC地址',
						prop: 'mac',
						minWidth: '180',
						fixed: true
					},
					{
						label: '产品型号',
						prop: 'deviceModel',
						minWidth: '120',
						fixed: false,
						filters: this.$store.state.oldStore.deviceModelFilters,
						filterList: []
					},
					{
						label: '激活状态',
						prop: 'init',
						minWidth: '100',
						fixed: false,
						filters: [{
							text: '已激活',
							value: true
						}, {
							text: '未激活',
							value: false
						}],
						filterList: []
					},
					// { label:'生产日期', prop:'productTime', minWidth:'156',fixed:false},
					{
						label: '登记日期',
						prop: 'createTime',
						minWidth: '156',
						fixed: false
					},
					{
						label: '激活日期',
						prop: 'activeTime',
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
			registerData: [],
			deviceForm: {
				macSn: '', //mac地址或deviceSN
				activeStartTime: '', //激活开始时间
				activeEndTime: '', //激活结束时间
				deviceModel: '', //设备型号
				online: '', //在离线
				pageNumber: 1, //分页页数
				pageSize: 20, //分页每页数量
			},
			registerForm: {
				macSn: '', //mac地址或deviceSN
				startTime: '', //激活开始时间
				endTime: '', //激活结束时间
				deviceModel: '', //设备型号
				online: '', //在离线
				pageNumber: 1, //分页页数
				pageSize: 20, //分页每页数量
			},
			preview: false, //批量导入
			dataFrom: [], //批量导入预览数据
		}
	},
	created() {
		if (this.$store.state.oldStore.authThree.indexOf('c11') == -1) {
			this.activeName = '1';
		} else {
			this.activeName = '0';
		}
	},
	methods: {
		submitForm(formName) {
			var ajax = this.$http.updataDevice,
				updata = this.getDevices,
				data = this.editData;
			if (formName == 'ruleForm1') {
				ajax = this.$http.updataRegister;
				updata = this.getRegister;
				data = this.editData1;
				data.productTime = this.$filters.dateFilter(data.productTime, '')
			}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					ajax(data).then(res => {
						this.editBox = false;
						this.editBox1 = false;
						if (res.data.success) {
							updata();
						}
					})
				} else {
					return false;
				}
			});
		},
		handleClick(tab, event) {
			if (tab.index == 0) {
				this.getDevices();
			} else {
				this.getRegister();
			}
		},
		editRow(index, rows) {
			this.$nextTick(() => {
				this.editData.id = rows.id;
				this.editData.mac = rows.mac;
			})
			this.editBox = true;
		},
		lookRow(index, row) {
			this.seeForm = row;
			this.$nextTick(() => {
				this.seeBox = true;
			})
		},
		deleteRow(index, row) {
			var msg = '删除此设备后，与此设备关联的用户都将失去设备的控制权',
				ajax = this.$http.deleteDevice,
				updata = this.getDevices;
			if (this.activeName == '1') {
				msg = '确认删除此设备吗？',
					ajax = this.$http.deleteRegister;
				updata = this.getRegister;
			}
			this.$confirm(msg, this.activeName == '1' ? '提示' : '确认删除此设备吗？', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				confirmButtonClass: 'el-button--danger',
				type: 'warning',
			}).then(() => {
				ajax(row.id).then(res => {
					if (res.data.success) {
						updata();
					}
				})
			})
		},
		editRow1(index, rows) {
			this.$nextTick(() => {
				this.editData1.id = rows.id;
				this.editData1.mac = rows.mac;
				this.editData1.deviceSN = rows.deviceSN;
				this.editData1.productTime = rows.productTime;
				this.editData1.deviceModel = rows.deviceModel;
			})
			this.editBox1 = true;
		},
		handleSelectionChange(val) {
			this.deviceSearch.selectArry = val;
		},
		handleSelectionChange1(val) {
			this.registerSearch.selectArry = val;
		},
		handleSizeChange(val) {
			if (this.activeName == '0') {
				this.deviceHeader.pagination.pageSize = val;
				this.getDevices();
			} else {
				this.registerHeader.pagination.pageSize = val;
				this.getRegister();
			}
		},
		handleCurrentChange(val) {
			if (this.activeName == '0') {
				this.deviceHeader.pagination.currentPage = val;
				this.getDevices();
			} else {
				this.registerHeader.pagination.currentPage = val;
				this.getRegister();
			}
		},
		tabSearBtnClick() {
			if (this.activeName == '1') {
				this.registerForm.macSn = this.registerSearch.input[0].value;
				if (this.registerSearch.picker.value) {
					this.registerForm.startTime = this.$filters.dateFilter(this.registerSearch.picker.value[0]);
					this.registerForm.endTime = this.$filters.dateFilter(this.registerSearch.picker.value[1]);
				} else {
					this.registerForm.startTime = '';
					this.registerForm.endTime = '';
				}
				this.getRegister();
			} else {
				this.deviceForm.macSn = this.deviceSearch.input[0].value;
				if (this.deviceSearch.picker.value) {
					this.deviceForm.activeStartTime = this.$filters.dateFilter(this.deviceSearch.picker.value[0]);
					this.deviceForm.activeEndTime = this.$filters.dateFilter(this.deviceSearch.picker.value[1]);
				} else {
					this.deviceForm.activeStartTime = '';
					this.deviceForm.activeEndTime = '';
				}
				this.getDevices();
			}
		},
		cleanClick() {
			if (this.activeName == '1') {
				this.registerForm.macSn = this.registerSearch.input[0].value = '';
				if (this.registerSearch.picker.value) {
					this.registerSearch.picker.value = '';
					this.registerForm.startTime = '';
					this.registerForm.endTime = '';
				}
				this.registerHeader.data.forEach(item => {
					if (item.hasOwnProperty('filterList')) {
						item.filterList = [];
					}
				});
				this.registerForm.isInit = '';
				this.registerForm.deviceModel = '';
				this.registerForm.online = '';
				this.registerForm.pageNumber = 1;
				this.registerForm.pageSize = 10;
				this.getRegister();
			} else {
				this.deviceForm.macSn = this.deviceSearch.input[0].value = '';
				if (this.deviceSearch.picker.value) {
					this.deviceSearch.picker.value = '';
					this.deviceForm.activeStartTime = '';
					this.deviceForm.activeEndTime = '';
				}
				this.deviceHeader.data.forEach(item => {
					if (item.hasOwnProperty('filterList')) {
						item.filterList = [];
					}
				});
				this.deviceForm.deviceModel = '';
				this.deviceForm.online = '';
				this.deviceForm.pageNumber = 1;
				this.deviceForm.pageSize = 10;
				this.getDevices();
			}
		},
		details(index, rows) {
			this.$router.push({
				path: '/device/details/' + rows.mac
			})
		},
		getDevices() {
			this.deviceForm.pageNumber = this.deviceHeader.pagination.currentPage;
			this.deviceForm.pageSize = this.deviceHeader.pagination.pageSize;
			this.tableStutas = false;
			this.$http.devices(this.deviceForm).then(res => {
				if (res.data.success) {
					this.deviceData = res.data.rows;
					this.tableStutas = true;
					this.deviceHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.deviceHeader.pagination.currentPage = 1;
						this.getDevices();
					}
					this.$nextTick(() => {
						this.deviceHeader.tableStatus = true;
					})
				}
			})
		},
		getRegister() {
			this.registerForm.pageNumber = this.registerHeader.pagination.currentPage;
			this.registerForm.pageSize = this.registerHeader.pagination.pageSize;
			this.tableStutas1 = false;
			this.$http.register(this.registerForm).then(res => {
				if (res.data.success) {
					this.registerData = res.data.rows;
					this.tableStutas1 = true;
					this.registerHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.registerHeader.pagination.currentPage = 1;
						this.getRegister();
					}
					this.$nextTick(() => {
						this.registerHeader.tableStatus = true;
					})
				}
			})
		},
		//筛选列
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			this.deviceForm[name] = filters[name][0];
			this.getDevices();
		},
		filters1(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			if (name == 'init') {
				this.registerForm['isInit'] = filters[name][0];
			} else {
				this.registerForm[name] = filters[name][0];
			}
			this.getRegister();
		},
		preClose() {
			this.dataFrom = [];
		},
		close(formName) {
			this.$refs[formName].resetFields();
		},
		importf(file) {
			this.file = file;
			this.excel = file.raw;
			const isLt5M = file.size / 1024 / 1024 < 5;
			const extention = file.name.split('.')[1] === 'xls';
			const extention2 = file.name.split('.')[1] === 'xlsx';
			// console.log(extention,extention2,isLt5M)
			if (!extention && !extention2) {
				this.$message.warning('上传格式不正确！')
				return false
			}
			if (!isLt5M) {
				this.$message.warning('文件大小不能超过5MB')
				return false
			}
			if (this.dataFrom.length > 0) {
				return false
			}
			let data1 = XLSX.utils.sheet_to_json(file.name)

			var f = file.raw,
				dataDate;
			var that = this;
			var reader = new FileReader();
			reader.onload = function(e) {
				let wb = that.wb
				var data = e.target.result;
				if (that.rABS) {
					wb = XLSX.read(btoa(that.fixdata(data)), { //手动转化
						type: 'base64'
					});
				} else {
					wb = XLSX.read(data, {
						type: 'binary'
					});
				}
				// wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
				// wb.Sheets[Sheet名]获取第一个Sheet的数据
				// document.getElementById("demo").innerHTML= JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
				dataDate = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
				dataDate.forEach(o => {
					if ("序列号" in o && "MAC地址" in o && "产品类型" in o && "产品型号" in o && "生产时间" in o && "生产线" in o) {
						// o['生产时间']  = that.formatDate(o['生产时间'],'/')
						that.dataFrom.push(o)
					}
				});
				if (that.dataFrom.length < dataDate.length - 2) {
					that.$message(that.$filters.wrong('操作失败', 88888));
					return false;
				} else {
					that.preview = true;
				}
			};
			if (this.rABS) {
				reader.readAsArrayBuffer(f);
			} else {
				reader.readAsBinaryString(f);
			}
		},
		previewTrue() {
			var data = new FormData();
			data.append('excel', this.excel);
			this.$http.importDevice(data).then(res => {
				this.preview = false;
				if (res.data.errorData == 0) {
					this.getRegister();
				} else {
					this.getRegister();
					this.$message(this.$filters.succ('导入成功' + res.data.successData + '条数据,导入失败' + res.data.errorData + '条数据,请检查数据格式是否符合规范！'));
				}
			})
		},
		formatDate(numb, format) {
			let time = new Date((numb - 1) * 24 * 3600000 + 1)
			time.setYear(time.getFullYear() - 70)
			let year = time.getFullYear() + ''
			let month = time.getMonth() + 1 + ''
			let date = time.getDate() + ''
			if (format && format.length === 1) {
				return year + format + month + format + date
			}
			return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
		},
		fixdata(data) { //文件流转BinaryString(不需要此功能可以删掉)
			var o = "",
				l = 0,
				w = 10240;
			for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
			o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
			return o;
		},
	},
	mounted() {
		this.getDevices();
		this.getRegister();
	}
}
</script>
<style lang="less">
#chefMachine {
    width: 100%;
    height: 100%;
    float: left;
    background: #FFFFFF;
    box-shadow: 0 3px 5px 0 rgba(0,0,0,0.05);
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
                width: calc(100% - 150px);
                display: block;
                float: left;
                &.title {
                    width: 150px;
                    text-align: right;
                }
            }
        }
    }
    .el-tabs__content {
        height: 100%;
    }
    #chefMachine-headComp {
        float: right;
        width: 100%;
        padding: 0 12px 16px;
        box-sizing: border-box;
        p {
            font-size: 12px;
            color: #999999;
            line-height: 32px;
            margin-left: 12px;
            float: right;
            cursor: pointer;
            transition: 0.3s all;
            &:hover {
                color: #409EFF;
            }
        }
        .el-cascader {
            height: 32px;
            line-height: 32px;
        }
        .block {
            height: 32px;
            width: 240px;
            float: right;
            .el-input__inner {
                height: 32px;
                line-height: 32px;
            }
            i {
                line-height: 32px;
            }
        }
        .chefMachine-btn {
            margin-left: 12px;
            float: right;
        }
        .chefMachine-input,
        .chefMachine-picker,
        .chefMachine-select {
            width: 108px;
            margin-left: 12px;
            float: right;
            &.el-input__inner,
            .el-input__inner {
                height: 32px;
                line-height: 32px;
            }
            i {
                line-height: 32px;
            }
        }
        .chefMachine-input {
            width: 160px;
        }
        .chefMachine-picker {
            width: 360px;
            i {
                line-height: 24px;
            }
        }
        .el-date-editor .el-range-separator {
            line-height: 23px;
        }
    }
    #che-pagination {
        float: right;
        padding: 12px 12px 0 0;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #F02B54;
    }
    .el-tabs__nav-wrap {
        padding-left: 12px;
    }
    .el-tabs__active-bar {
        background-color: #F02B54;
    }
    .el-tabs__item.is-active {
        color: #2c3e50;
        font-weight: bold;
        font-size: 15px;
    }
}
</style>
