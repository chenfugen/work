<template>
<div id="account">
	<el-tabs v-model.trim="activeName" @tab-click="handleClick" style="height:calc(100% - 65px)">
		<el-tab-pane label="员工管理" name="0" v-if="$store.state.oldStore.authThree.indexOf('k11') != -1" style="height:100%">
			<TableSearch :tableData="adminsData" :tableSearch="adminsSearch" :exportHead="adminsHeader.data"></TableSearch>
			<comTable v-if="activeName=='0'" :tableData="adminsData" :tableHeader="adminsHeader"></comTable>
		</el-tab-pane>
		<el-tab-pane label="部门管理" name="1" v-if="$store.state.oldStore.authThree.indexOf('k12') != -1" style="height:100%">
			<TableSearch :tableData="departmentsData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
			<comTable :tableData="departmentsData" :tableHeader="tableHeader"></comTable>
		</el-tab-pane>
		<el-tab-pane label="角色管理" name="2" v-if="$store.state.oldStore.authThree.indexOf('k13') != -1" style="height:100%">
			<TableSearch :tableData="rolesData" :tableSearch="rolesSearch" :exportHead="rolesHeader.data"></TableSearch>
			<comTable :tableData="rolesData" :tableHeader="rolesHeader"></comTable>
		</el-tab-pane>
	</el-tabs>

	<el-dialog :close-on-click-modal="false" :title="msg+'用户'" :visible.sync="addBox" width="550px" @close="initialize('userForm')">
		<div style="padding-right:40px;">
			<el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户名" prop="userName">
					<el-input size="small" placeholder="用户名不能包含中文及特殊字符" onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[\u4e00-\u9fa5]/g,''))" v-model.trim="userForm.userName" :disabled="msg != '新增'" maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input size="small" v-model.trim="userForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input size="small" v-model.trim="userForm.name"></el-input>
				</el-form-item>
				<el-form-item label="部门" prop="departmentId">
					<el-select size="small" placeholder="请选择部门" v-model.trim="userForm.departmentId">
						<el-option v-for="(i,x) in selectDepartment" :key="x" :label="i.name" :value="i.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="角色" prop="roleId">
					<el-select size="small" placeholder="请选择角色" v-model.trim="userForm.roleId">
						<el-option v-for="(i,x) in selectRole" :key="x" :label="i.name" :value="i.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="关联产品" prop="products">
					<el-select size="small" placeholder="请选择产品" multiple v-model.trim="userForm.products">
						<el-option v-for="(i,x) in $store.state.oldStore.deviceTypes" :key="x" :label="i" :value="i"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="note">
					<el-input type="textarea" size="small" :rows="3" v-model.trim="userForm.note"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addBox = false">取 消</el-button>
				<el-button type="danger" @click="addEow">保 存</el-button>
			</div>
		</div>
	</el-dialog>
	<el-dialog :close-on-click-modal="false" :title="msg+'部门'" :visible.sync="addClass" width="550px" @close="initialize('classForm')">
		<div style="padding-right:40px;">
			<el-form :model="classForm" :rules="classRules" ref="classForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="部门名称" prop="name" maxlength="20">
					<el-input size="small" placeholder="部门名不能包含特殊字符" v-model.trim="classForm.name"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="note">
					<el-input type="textarea" size="small" :rows="3" v-model.trim="classForm.note"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addClass = false">取 消</el-button>
				<el-button type="danger" @click="addClassm">保 存</el-button>
			</div>
		</div>
	</el-dialog>
	<el-dialog :close-on-click-modal="false" :title="msg+'角色'" :visible.sync="addRole" width="450px" id="addRole" top="0" :modal="false" @close="initialize('roleForm')">
		<el-form :model="roleForm" :rules="roleRules" ref="roleForm" label-width="100px" class="demo-ruleForm" style="height: 100%;">
			<el-form-item label="角色名称" prop="name" maxlength="20">
				<el-input size="small" placeholder="角色名不能包含特殊字符" v-model.trim="roleForm.name"></el-input>
			</el-form-item>
			<el-form-item label="角色描述" prop="note">
				<el-input type="textarea" size="small" :rows="3" v-model.trim="roleForm.note"></el-input>
			</el-form-item>
			<el-form-item label="角色权限" class="role-permi" prop="auth" style="height:calc(100% - 200px);overflow-y: auto;">
				<el-tree :data="jurisdiction" :default-checked-keys="defaultCheckedKeys" show-checkbox ref="roleTree" @check-change="getChecked" node-key="id" :props="defaultProps">
				</el-tree>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="addRole = false">取 消</el-button>
			<el-button type="danger" @click="addRolem">保 存</el-button>
		</div>
	</el-dialog>
</div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
	inject: ['reload'],
	data() {
		return {
			selectDepartments: [], //部门集合
			selectRoles: [], //角色集合
			selectDepartment: [], //部门集合
			selectRole: [], //角色集合
			filtersDepartment: [], //部门集合
			filtersRole: [], //角色集合
			msg: '新增', //是否新增
			addBox: false, //添加员工
			addClass: false, //添加部门
			addRole: false, //添加角色
			userForm: {
				userName: '', //用户名
				phone: '', //手机号
				name: '', //姓名
				departmentId: '', //部门
				roleId: '', //角色
				products: [], //产品
				note: '', //备注
			},
			userRules: {
				userName: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					},
					{
						pattern: /^([a-zA-Z]|[0-9]|_|-|@)+$/,
						message: '用户名含有特殊字符！',
						trigger: 'blur'
					},
				],
				phone: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					},
					{
						pattern: /^1[3456789]\d{9}$/,
						message: '请输入正确的手机号格式',
						trigger: 'blur'
					},
				],
				name: [{
					required: true,
					message: '请输入姓名',
					trigger: 'blur'
				}, ],
				departmentId: [{
					required: true,
					message: '请选择部门',
					trigger: 'change'
				}],
				roleId: [{
					required: true,
					message: '请选择角色',
					trigger: 'change'
				}],
				products: [{
					required: true,
					message: '请选择产品',
					trigger: 'change'
				}],
			},
			classForm: {
				name: '', //部门名称
				note: '', //备注
			},
			classRules: {
				name: [{
						required: true,
						message: '请输入部门名称',
						trigger: 'blur'
					},
					{
						pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
						message: '部门名含有特殊字符！',
						trigger: 'blur'
					},
				],
			},
			roleForm: {
				name: '', //角色名称
				note: '', //角色描述
				auth: [], //角色权限
				authTree: '', //角色权限树
			},
			roleRules: {
				name: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					},
					{
						pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
						message: '角色名含有特殊字符！',
						trigger: 'blur'
					}
				],
				note: [{
					required: true,
					message: '请输入角色描述',
					trigger: 'blur'
				}, ],
			},
			pickerOptions: { //只允许选择今天之前的日期(包括今天)
				disabledDate(time) {
					return time.getTime() > Date.now() - 8.64e6
				}
			},
			activeName: '0', //当前激活的tabs页
			adminsSearch: {
				isExport: false,
				exportName: '',
				funClick: this.adminsQuery,
				cleanClick: this.cleanClick,
				btn: [{
					name: '新增用户',
					clickInfo: this.$store.state.oldStore.authFour.indexOf('k111') != -1 && this.$store.state.oldStore.userInfo.level != 3 ? this.openRow : 0
				}],
				input: [{
					pla: '手机号/用户名',
					width: '188',
					value: ''
				}, ],
				select: [],
				selectArry: [], //表格选中数据集合
			},
			adminsHeader: {
				tableStatus: false,
				sortMethod: function() {},
				filters: this.filters,
				tableHeight: 'calc(100% - 86px)',
				comHeight: 'calc(100% - 10px)',
				handleSelectionChange: 0, //选中表格数据方法
				isSelection: [false, '55'], //是否显示序列号
				oper: { //操作栏
					label: '操作',
					prop: 'oper',
					minWidth: this.$store.state.oldStore.userInfo.userName === "admin" ? '218' : '133',
					fixed: 'right',
					oper: [{
							name: '编辑',
							clickFun: this.$store.state.oldStore.authFour.indexOf('k112') != -1 ? this.updateUser : 0
						},
						{
							name: '冻结',
							clickFun: this.$store.state.oldStore.authFour.indexOf('k114') != -1 ? this.frozenUser : 0
						},
						{
							name: '删除',
							clickFun: this.$store.state.oldStore.authFour.indexOf('k110') != -1 ? this.deleteUser : 0
						},
					]
				},
				data: [ //表格头数据绑定
					{
						label: '用户名',
						prop: 'userName',
						minWidth: '120',
						fixed: true
					},
					{
						label: '手机号',
						prop: 'phone',
						minWidth: '136',
						fixed: true
					},
					{
						label: '姓名',
						prop: 'name',
						minWidth: '120',
						fixed: false
					},
					{
						label: '角色类别',
						prop: 'role',
						minWidth: '100',
						fixed: false,
						filters: this.$store.state.oldStore.roles,
						filterList: []
					},
					// filters:this.filtersRoles},
					{
						label: '部门',
						prop: 'department',
						minWidth: '100',
						fixed: false,
						filters: this.$store.state.oldStore.departments,
						filterList: []
					},
					// filters:this.filtersDepartments},
					{
						label: '备注',
						prop: 'note',
						minWidth: '150',
						fixed: false
					},
					// { label:'创建人', prop:'creator', minWidth:'120',fixed:false},
					{
						label: '创建时间',
						prop: 'createTime',
						minWidth: '152',
						fixed: false
					},
					{
						label: '更新时间',
						prop: 'updateTime',
						minWidth: '152',
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
			filtersDepartments: [],
			filtersRoles: [{
				text: '暂无',
				value: '暂无'
			}],
			adminsData: [{
				text: '暂无',
				value: '暂无'
			}],
			tableSearch: {
				isExport: false,
				exportName: '设备列表',
				funClick: this.departmentsQuery,
				cleanClick: this.cleanClick,
				btn: [{
					name: '新增部门',
					clickInfo: this.$store.state.oldStore.authFour.indexOf('k121') != -1 && this.$store.state.oldStore.userInfo.level != 3 ? this.openClassm : 0
				}],
				input: [{
					pla: '部门名称',
					width: '168',
					value: ''
				}, ],
				select: [],
				selectArry: [], //表格选中数据集合
			},
			tableHeader: {
				sortMethod: function() {},
				tableStatus: true,
				filters: function() {},
				tableHeight: 'calc(100% - 86px)',
				comHeight: 'calc(100% - 10px)',
				handleSelectionChange: 0, //选中表格数据方法
				isSelection: [false, '55'], //是否显示序列号
				oper: { //操作栏
					label: '操作',
					prop: 'oper',
					minWidth: '133',
					fixed: 'right',
					oper: [{
							name: '编辑',
							clickFun: this.$store.state.oldStore.authFour.indexOf('k122') != -1 ? this.updateClassm : 0
						},
						{
							name: '删除',
							clickFun: this.$store.state.oldStore.authFour.indexOf('k120') != -1 ? this.deleteClassm : 0
						},
					]
				},
				data: [ //表格头数据绑定
					{
						label: '部门名称',
						prop: 'name',
						minWidth: '120',
						fixed: false
					},
					{
						label: '备注',
						prop: 'note',
						minWidth: '180',
						fixed: false
					},
					{
						label: '创建时间',
						prop: 'createTime',
						minWidth: '152',
						fixed: false
					},
					{
						label: '更新时间',
						prop: 'updateTime',
						minWidth: '152',
						fixed: false
					},
					{
						label: '创建人',
						prop: 'creator',
						minWidth: '120',
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
			departmentsData: [],
			rolesSearch: {
				isExport: false,
				exportName: '',
				funClick: this.rolesQuery,
				cleanClick: this.cleanClick,
				btn: [{
					name: '新增角色',
					clickInfo: this.$store.state.oldStore.authFour.indexOf('k131') != -1 && this.$store.state.oldStore.userInfo.level != 3 ? this.openRolem : 0
				}],
				input: [{
					pla: '角色名',
					width: '168',
					value: ''
				}, ],
				select: [],
				selectArry: [], //表格选中数据集合
			},
			rolesHeader: {
				tableStatus: true,
				sortMethod: function() {},
				filters: function() {},
				tableHeight: 'calc(100% - 86px)',
				comHeight: 'calc(100% - 10px)',
				handleSelectionChange: 0, //选中表格数据方法
				isSelection: [false, '55'], //是否显示序列号
				oper: { //操作栏
					label: '操作',
					prop: 'oper',
					minWidth: '133',
					fixed: 'right',
					oper: [{
							name: '编辑',
							clickFun: this.$store.state.oldStore.authFour.indexOf('k132') != -1 ? this.updateRolem : 0
						},
						{
							name: '删除',
							clickFun: this.$store.state.oldStore.authFour.indexOf('k130') != -1 ? this.deleteRolem : 0
						},
					]
				},
				data: [ //表格头数据绑定
					{
						label: '角色名称',
						prop: 'name',
						minWidth: '120',
						fixed: false
					},
					{
						label: '角色描述',
						prop: 'note',
						minWidth: '180',
						fixed: false
					},
					{
						label: '创建时间',
						prop: 'createTime',
						minWidth: '152',
						fixed: false
					},
					{
						label: '更新时间',
						prop: 'updateTime',
						minWidth: '152',
						fixed: false
					},
					{
						label: '创建人',
						prop: 'creator',
						minWidth: '120',
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
			rolesData: [],
			defaultCheckedKeys: ['a'], //选中的集合
			jurisdiction: [{
					id: 'a',
					label: '首页',
					disabled: true,
				},
				{
					id: 'b',
					label: '地图',
				},
				{
					id: 'c',
					label: '设备管理',
					disabled: true,
					children: [{
						id: 'c1',
						label: '智能烹饪机',
						disabled: true,
						children: [{
							id: 'c11',
							label: '设备列表',
							disabled: true,
							children: [{
									id: 'c113',
									label: '查看',
									disabled: false
								},
								// {
								//     id: 'c112',
								//     label: '编辑'
								// },
								{
									id: 'c110',
									label: '删除'
								}, {
									id: 'c114',
									label: '导出'
								}, {
									id: 'c118',
									label: '删除(设备日志)'
								}, {
									id: 'c119',
									label: '删除(关联用户)'
								}
							]
						}, {
							id: 'c12',
							label: '登记列表',
							disabled: true,
							children: [{
									id: 'c123',
									label: '查看',
									disabled: false
								},
								// {
								//     id: 'c122',
								//     label: '编辑'
								// },
								{
									id: 'c120',
									label: '删除'
								}, {
									id: 'c124',
									label: '导入导出'
								}
							]
						}]
					}]
				},
				{
					id: 'd',
					label: '故障管理',
					disabled: true,
					children: [{
						id: 'd1',
						label: '故障统计'
					}, {
						id: 'd2',
						label: '故障记录',
						disabled: true,
						children: [{
							id: 'd23',
							label: '查看',
							disabled: false
						}, {
							id: 'd20',
							label: '删除'
						}, {
							id: 'd25',
							label: '导出'
						}, ]
					}, {
						id: 'd3',
						label: '故障代码',
						disabled: true,
						children: [{
							id: 'd33',
							label: '查看',
							disabled: false
						}, {
							id: 'd31',
							label: '新增'
						}, {
							id: 'd32',
							label: '编辑'
						}, {
							id: 'd30',
							label: '删除'
						}, ]
					}]
				},
				{
					id: 'e',
					label: '菜谱管理',
					disabled: true,
					children: [{
						id: 'e1',
						label: '菜谱统计',
					}, {
						id: 'e2',
						label: '菜谱清单',
						disabled: true,
						children: [{
							id: 'e23',
							label: '查看',
							disabled: false
						}, {
							id: 'e21',
							label: '新增',
						}, {
							id: 'e22',
							label: '编辑',
						}, {
							id: 'e24',
							label: '启用停用',
						}, {
							id: 'e20',
							label: '删除',
						}]
					}]
				},
				{
					id: 'f',
					label: '厂测管理',
					disabled: true,
					children: [{
						id: 'f1',
						label: '厂测统计'
					}, {
						id: 'f2',
						label: '厂测列表',
						disabled: true,
						children: [{
							id: 'f23',
							label: '查看',
							disabled: false
						}, {
							id: 'f22',
							label: '编辑'
						}, {
							id: 'f20',
							label: '删除'
						}, {
							id: 'f25',
							label: '导出'
						}]
					}]
				},
				{
					id: 'g',
					label: '产品管理',
					disabled: true,
					children: [{
						id: 'g1',
						label: '产品类型',
						disabled: true,
						children: [{
							id: 'g13',
							label: '查看',
							disabled: false
						}, {
							id: 'g12',
							label: '配置'
						}]
					}]
				},
				{
					id: 'h',
					label: '消息中心',
					disabled: true,
					children: [{
						id: 'h1',
						label: '推送记录',
						disabled: true,
						children: [{
							id: 'h13',
							label: '查看',
							disabled: false
						}, {
							id: 'h11',
							label: '消息推送'
						}, {
							id: 'h10',
							label: '删除'
						}]
					}, {
						id: 'h2',
						label: '消息反馈',
						disabled: true,
						children: [{
							id: 'h23',
							label: '查看',
							disabled: false
						}, {
							id: 'h20',
							label: '删除'
						}]
					}]
				},
				{
					id: 'i',
					label: '用户管理',
					disabled: true,
					children: [{
						id: 'i1',
						label: '用户中心',
						disabled: true,
						children: [{
							id: 'i13',
							label: '查看',
							disabled: false
						}, {
							id: 'i14',
							label: '关联设备'
						}, {
							id: 'i10',
							label: '删除'
						}]
					}]
				},
				{
					id: 'j',
					label: '版本管理',
					disabled: true,
					children: [{
						id: 'j1',
						label: 'MCU固件',
						disabled: true,
						children: [{
							id: 'j13',
							label: '查看',
							disabled: false
						}, {
							id: 'j11',
							label: '新增'
						}, {
							id: 'j12',
							label: '编辑'
						}, {
							id: 'j10',
							label: '删除'
						}]
					}, {
						id: 'j2',
						label: 'DTU固件',
						disabled: true,
						children: [{
							id: 'j23',
							label: '查看',
							disabled: false
						}, {
							id: 'j21',
							label: '新增'
						}, {
							id: 'j22',
							label: '编辑'
						}, {
							id: 'j20',
							label: '删除'
						}]
					}, {
						id: 'j3',
						label: 'APP版本',
						disabled: true,
						children: [{
							id: 'j33',
							label: '查看',
							disabled: false
						}, {
							id: 'j32',
							label: '编辑'
						}, {
							id: 'j30',
							label: '删除'
						}, {
							id: 'j31',
							label: '新增'
						}]
					}]
				},
				{
					id: 'k',
					label: '系统管理',
					disabled: true,
					children: [{
							id: 'k1',
							label: '账号管理',
							disabled: true,
							children: [{
								id: 'k11',
								label: '员工管理',
								disabled: true,
								children: [{
									id: 'k113',
									label: '查看',
									disabled: false
								}, {
									id: 'k112',
									label: '编辑'
								}, {
									id: 'k114',
									label: '编辑'
								}, {
									id: 'k110',
									label: '删除'
								}, {
									id: 'k111',
									label: '新增'
								}]
							}, {
								id: 'k12',
								label: '部门管理',
								disabled: true,
								children: [{
									id: 'k123',
									label: '查看',
									disabled: false
								}, {
									id: 'k122',
									label: '编辑'
								}, {
									id: 'k120',
									label: '删除'
								}, {
									id: 'k121',
									label: '新增'
								}]
							}, {
								id: 'k13',
								label: '角色管理',
								disabled: true,
								children: [{
									id: 'k133',
									label: '查看',
									disabled: false
								}, {
									id: 'k131',
									label: '新增'
								}, {
									id: 'k132',
									label: '编辑'
								}, {
									id: 'k130',
									label: '删除'
								}]
							}]
						},
						{
							id: 'k2',
							label: '系统日志'
						},
						{
							id: 'k3',
							label: '广告管理',
							disabled: true,
							children: [{
								id: 'k33',
								label: '查看',
								disabled: false
							}, {
								id: 'k31',
								label: '新增'
							}, {
								id: 'k30',
								label: '删除'
							}]
						}, {
							id: 'k4',
							label: '通用设置',
							disabled: true,
							children: [{
								id: 'k43',
								label: '查看',
								disabled: false
							}, {
								id: 'k42',
								label: '编辑'
							}]
						}
					]
				}
			],
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			admins: {
				departmentId: '', //部门id
				roleId: '', //角色id
				userNamePhone: '', //用户名或者手机号
				pageNumber: 1, //分页页码 this.adminsHeader.pagination.currentPage
				pageSize: 20, //分页每页数量 this.adminsHeader.pagination.pageSize
			},
			departments: {
				name: '', //部门名称
				pageNumber: 1, //分页页码 this.tableHeader.pagination.currentPage
				pageSize: 20, //分页每页数量 this.tableHeader.pagination.pageSize
			},
			roles: {
				name: '', //角色名称
				pageNumber: 1, //分页页码 this.rolesHeader.pagination.currentPage
				pageSize: 20, //分页每页数量 this.rolesHeader.pagination.pageSize
			}
		}
	},
	created() {
		this.$http.selectDepartment().then(res => {
			this.selectDepartments = res.data.datas;
			this.selectDepartment = res.data.datas;
			this.$store.commit("add_departments", res.data.datas)
		})
		this.$http.selectRole().then(res => {
			this.selectRoles = res.data.datas;
			this.selectRole = res.data.datas;
			this.$store.commit("add_roles", res.data.datas)
		})
	},
	mounted() {
		//1新增 2 编辑 3查看 0删除
		this.query();
		if (this.$store.state.oldStore.authThree.indexOf('k11') == -1) {
			if (this.$store.state.oldStore.authThree.indexOf('k12') != -1) {
				this.activeName = '1';
			} else {
				this.activeName = '2';
			}
		}
		if (this.$store.state.oldStore.userInfo.userName === "admin") {
			this.adminsHeader.oper.oper.push({
				name: '重置密码',
				clickFun: this.resetPassword
			})
		} else {
			if (this.adminsHeader.oper.oper.length === 4) {
				delete this.adminsHeader.oper.oper[3]
			}
		}
	},
	methods: {
		resetPassword(index, row) {
			this.$confirm('确认重置密码吗?将会重置密码为123456！', '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				confirmButtonClass: 'el-button--danger',
				type: 'warning',
			}).then(() => {
				var that = this;
				that.$http.resetPassword({
					id: row.id
				}).then(res => {
					if (res.data.success) {
						that.$message(this.$filters.succ('密码重置成功！'));
					}
				})
			})
		},
		query() {
			this.adminsQuery();
			this.departmentsQuery();
			this.rolesQuery();
		},
		handleSizeChange(val) {
			if (this.activeName == '0') {
				this.adminsHeader.pagination.pageSize = val;
				this.adminsQuery();
			} else if (this.activeName == '1') {
				this.tableHeader.pagination.pageSize = val;
				this.departmentsQuery();
			} else {
				this.rolesHeader.pagination.pageSize = val;
				this.rolesQuery();
			}
		},
		handleCurrentChange(val) {
			if (this.activeName == '0') {
				this.adminsHeader.pagination.currentPage = val;
				this.adminsQuery();
			} else if (this.activeName == '1') {
				this.tableHeader.pagination.currentPage = val;
				this.departmentsQuery();
			} else {
				this.rolesHeader.pagination.currentPage = val;
				this.rolesQuery();
			}
		},
		//查询员工列表，部门列表，角色列表
		sRloe() {
			this.$http.selectRole().then(res => {
				this.selectRole = res.data.datas;
				this.$store.commit("add_roles", res.data.datas)
			})
		},
		adminsQuery() {
			this.admins.pageNumber = this.adminsHeader.pagination.currentPage;
			this.admins.pageSize = this.adminsHeader.pagination.pageSize;
			this.admins.userNamePhone = this.adminsSearch.input[0].value;
			this.adminsHeader.tableStatus = false;
			this.$http.admins(this.admins).then(res => {
				if (res.data.success) {
					this.adminsData = res.data.rows;
					this.adminsHeader.tableStatus = true;
					this.adminsHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.adminsHeader.pagination.currentPage = 1;
						this.adminsQuery();
					}
					this.$nextTick(() => {
						this.adminsHeader.tableStatus = true;
					})
				}
			})
		},
		departmentsQuery() {
			this.departments.pageNumber = this.tableHeader.pagination.currentPage;
			this.departments.pageSize = this.tableHeader.pagination.pageSize;
			this.departments.name = this.tableSearch.input[0].value;
			this.tableHeader.tableStatus = false;
			this.$http.departments(this.departments).then(res => {
				if (res.data.success) {
					this.departmentsData = res.data.rows;
					this.tableHeader.tableStatus = true;
					this.tableHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.tableHeader.pagination.currentPage = 1;
						this.departmentsQuery();
					}
					this.$nextTick(() => {
						this.tableHeader.tableStatus = true;
					})
				}
			})
		},
		rolesQuery() {
			this.roles.pageNumber = this.rolesHeader.pagination.currentPage;
			this.roles.pageSize = this.rolesHeader.pagination.pageSize;
			this.roles.name = this.rolesSearch.input[0].value;
			this.rolesHeader.tableStatus = false;
			var that = this;
			this.$http.roles(this.roles).then(res => {
				if (res.data.success) {
					this.rolesData = res.data.rows;
					this.rolesHeader.tableStatus = true;
					this.rolesHeader.pagination.total = res.data.total;
					if (res.data.total > 0 && res.data.rows.length == 0) {
						this.rolesHeader.pagination.currentPage = 1;
						this.rolesQuery();
					}
					this.$nextTick(() => {
						this.rolesHeader.tableStatus = true;
					})
				}
			})
		},
		handleClick(tab, event) {
			if (tab.index == 0) { //刷新角色和部门数据
				this.$http.selectDepartment().then(res => {
					this.selectDepartment = res.data.datas;
					this.$store.commit("add_departments", res.data.datas)
					this.$http.selectRole().then(res => {
						this.selectRole = res.data.datas;
						this.$store.commit("add_roles", res.data.datas)
						this.reload();
					})
				})
			}
			if (this.activeName == '0') {
				this.adminsQuery();
			} else if (this.activeName == '1') {
				this.departmentsQuery();
			} else {
				this.rolesQuery();
			}
			this.admins.userNamePhone = this.adminsSearch.input[0].value =
				this.departments.name = this.tableSearch.input[0].value =
				this.roles.name = this.rolesSearch.input[0].value = '';
		},
		//员工操作
		openRow() {
			this.msg = '新增';
			this.$http.selectDepartment().then(res => {
				this.selectDepartment = res.data.datas;
			})
			this.$http.selectRole().then(res => {
				this.selectRole = res.data.datas;
			})
			this.addBox = true;
		},
		addEow() {
			var ajax = this.$http.addAdmin;
			if (this.msg == "编辑") {
				ajax = this.$http.updataAdmin
			}
			this.$refs.userForm.validate((valid) => {
				if (valid) {
					ajax(this.userForm).then(res => {
						this.addBox = false;
						if (res.data.success) {
							this.adminsQuery();
						}
					})
				} else {
					return false;
				}
			});
		},
		frozenUser(index, row) {
			this.$http.frozenAdmin({
				id: row.id,
				status: row.frozen ? false : true
			}).then(res => {
				if (res.data.success) {
					this.adminsQuery();
				}
			})
		},
		updateUser(index, row) {
			this.selectDepartment = JSON.parse(JSON.stringify(this.selectDepartments));
			this.selectRole = JSON.parse(JSON.stringify(this.selectRoles));
			this.msg = '编辑';
			this.addBox = true;
			var isDepar = false,
				isRole = false;
			this.selectDepartment.forEach((i, x) => {
				if (i.id == row.department.id) {
					isDepar = true;
				}
			})
			if (isDepar == false) {
				this.selectDepartment.push(row.department)
			}
			this.selectRole.forEach((i, x) => {
				if (i.id == row.role.id) {
					isRole = true;
				}
			})
			if (isRole == false) {
				this.selectRole.push(row.role)
			}
			this.$nextTick(function() {
				this.userForm.id = row.id;
				this.userForm.userName = row.userName;
				this.userForm.phone = row.phone;
				this.userForm.name = row.name;
				this.userForm.departmentId = row.department.id;
				this.userForm.note = row.note;
				this.userForm.products = row.products;
				this.userForm.roleId = row.role.id;
				//判断编辑用户的部门和角色是否属于当前权限控制的部门角色
			})
		},
		deleteUser(index, row) {
			this.$confirm('确认删除此员工吗?将会删除该员工关联的所有员工，部门，角色！', '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				confirmButtonClass: 'el-button--danger',
				type: 'warning',
			}).then(() => {
				var that = this;
				this.$http.deleteAdmin(row.id).then(res => {
					if (res.data.success) {
						that.adminsQuery();
					}
				})
			})
		},
		//部门操作
		openClassm() {
			this.msg = '新增';
			this.addClass = true;
		},
		addClassm() {
			var ajax = this.$http.addDepartment;
			if (this.msg == "编辑") {
				ajax = this.$http.updataDepartment
			}
			this.$refs.classForm.validate((valid) => {
				if (valid) {
					ajax(this.classForm).then(res => {
						this.addClass = false;
						if (res.data.success) {
							this.departmentsQuery();
						}
					})
				} else {
					return false;
				}
			});
		},
		updateClassm(index, row) {
			this.msg = '编辑';
			this.addClass = true;
			this.$nextTick(function() {
				this.classForm.id = row.id;
				this.classForm.name = row.name;
				this.classForm.note = row.note;
			})
		},
		deleteClassm(index, row) {
			this.$confirm('确认删除吗?', '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				confirmButtonClass: 'el-button--danger',
				type: 'warning',
			}).then(() => {
				var that = this;
				this.$http.deleteDepartment(row.id).then(res => {
					if (res.data.success) {
						that.departmentsQuery();
					}
				})
			})
		},
		//角色操作
		getChecked(a, b, c) {
			var name, num = 0,
				isC = false,
				isId, arr;
			//选中敏感操作按钮
			if (a.id.slice(a.id.length - 1) != '3' && b) {
				var id = a.id.slice(0, a.id.length - 1) + '3';
				if (a.label == '删除(关联用户)' || a.label == '删除(设备日志)' || a.label == '新增' || a.label == '编辑' || a.label == '删除' || a.label == '导入导出' || a.label == '导出' || a.label == '配置' || a.label == '关联设备' || a.label == '消息推送' || a.label == '启用停用' || a.label ==
					'冻结') {
					this.$refs.roleTree.setChecked(id, true);
					this.$nextTick(() => {
						name = a.id.slice(0, a.id.length - 1);
						arr = this.$refs.roleTree.getCheckedNodes();
						arr.forEach((i, x) => {
							//判断当前节点是否存在已选中的查看节点，如果存在 将其勾选并禁用
							if (i.id.indexOf(name) != -1 && name.length > 1) {
								if (i.id.slice(i.id.length - 1) == '3') {
									isId = i.id;
									this.jurisdiction.forEach((ch_i, ch_x) => {
										if (ch_i.id == isId) {
											ch_i.disabled = true;
										}
										if (ch_i.children) {
											ch_i.children.forEach((ch_i1, ch_x1) => {
												if (ch_i1.id == isId) {
													ch_i1.disabled = true;
												}
												if (ch_i1.children) {
													ch_i1.children.forEach((ch_i2, ch_x2) => {
														if (ch_i2.id == isId) {
															ch_i2.disabled = true;
														}
														if (ch_i2.children) {
															ch_i2.children.forEach((ch_i3, ch_x3) => {
																if (ch_i3.id == isId) {
																	ch_i3.disabled = true;
																}
																if (ch_i3.children) {
																	ch_i3.children.forEach((ch_i4, ch_x4) => {
																		if (ch_i4.id == isId) {
																			ch_i4.disabled = true;
																		}
																	})
																}
															})
														}
													})
												}
											})
										}
									})
								}
							}
						})
						name = '';
						isId = '';
					})
				}

			}

			//选中查看按钮
			//1:选中敏感操作按钮引起的自动选中查看按钮，2:手动选择查看按钮
			if (a.id.slice(a.id.length - 1) == '3' && b) {
				console.log(a.id)
				this.$nextTick(() => {
					name = a.id.slice(0, a.id.length - 1);
					arr = this.$refs.roleTree.getCheckedNodes();
					arr.forEach((i, x) => {
						//判断当前已选中查看节点是否存在已选中的敏感操作节点，如果存在 将查看禁用
						if (i.id.indexOf(name) != -1) {
							if (i.id.slice(i.id.length - 1) != '3' && i.id.length != a.id.length - 1) {
								num++;
							}
						}
					})
					if (num > 0) {
						a.disabled = true;
					}
					num = 0;
					name = '';
				})
			}
			this.roleForm.auth = this.$refs.roleTree.getCheckedNodes()
			//取消选中敏感操作按钮
			if (a.id.slice(a.id.length - 1) != '3' && !b) {
				this.$nextTick(() => {
					name = a.id.slice(0, a.id.length - 1);
					arr = this.$refs.roleTree.getCheckedNodes();
					arr.forEach((i, x) => {
						if (i.id.indexOf(name) != -1) {
							if (i.id.slice(i.id.length - 1) == '3') {
								isId = i.id;
								isC = true;
							} else {
								num++;
							}
						}
					})
					if (isC && num == 0) {
						this.jurisdiction.forEach((i, x) => {
							if (i.id == isId) {
								i.disabled = false;
							}
							if (i.children) {
								i.children.forEach((ch_i1, ch_x1) => {
									if (ch_i1.id == isId) {
										ch_i1.disabled = false;
									}
									if (ch_i1.children) {
										ch_i1.children.forEach((ch_i2, ch_x2) => {
											if (ch_i2.id == isId) {
												ch_i2.disabled = false;
											}
											if (ch_i2.children) {
												ch_i2.children.forEach((ch_i3, ch_x3) => {
													if (ch_i3.id == isId) {
														ch_i3.disabled = false;
													}
													if (ch_i3.children) {
														ch_i3.children.forEach((ch_i4, ch_x4) => {
															if (ch_i4.id == isId) {
																ch_i4.disabled = false;
															}
														})
													}
												})
											}
										})
									}
								})
							}
						})
					}
					isId = '';
					num = 0;
					isC = false;
				})
			}
		},
		openRolem() {
			this.msg = '新增';
			delete this.roleForm.id;
			this.jurisdiction = eval('(' + this.$store.state.oldStore.authTree + ')');
			//权限分级。
			//应该先取消所有勾选状态
			//判断当前角色拥有权限 新建角色权限不得超过当前角色权限
			this.addRole = true;
			this.$nextTick(() => {
				this.$refs.roleTree.setChecked('a', true)
			})
		},
		addRolem() {
			var ajax = this.$http.addRole,
				auth = [];
			if (this.msg == "编辑") {
				ajax = this.$http.updataRole;
			}
			this.$refs.roleForm.validate((valid) => {
				this.roleForm.auth.forEach(i => {
					auth.push(i.id);
				})
				if (valid) {
					this.roleForm.auth = auth;
					ajax(this.roleForm).then(res => {
						this.addRole = false;
						if (res.data.success) {
							this.rolesQuery()
						}
					})
				} else {
					return false;
				}
			});
		},
		updateRolem(index, row) {
			this.msg = '编辑';
			var _this = this;
			this.jurisdiction = eval('(' + this.$store.state.oldStore.authTree + ')');
			_this.addRole = true;
			_this.$nextTick(function() {
				_this.roleForm.name = row.name;
				_this.roleForm.note = row.note;
				_this.roleForm.id = row.id;
				row.auth.forEach((i) => {
					_this.$refs.roleTree.setChecked(i, true)
					if (i.slice(i.length - 1) == '3' &&
						(row.auth.indexOf(i.slice(0, i.length - 1) + '0') != -1 ||
							row.auth.indexOf(i.slice(0, i.length - 1) + '1') != -1 ||
							row.auth.indexOf(i.slice(0, i.length - 1) + '2') != -1 ||
							row.auth.indexOf(i.slice(0, i.length - 1) + '4') != -1 ||
							row.auth.indexOf(i.slice(0, i.length - 1) + '5') != -1)) {
						_this.findChaKan(i);
					}
				})
				_this.$refs.roleTree.setChecked('a', true)
			})
		},
		findChaKan(isId) {
			this.jurisdiction.forEach((i, x) => {
				if (i.id == isId) {
					i.disabled = true;
				}
				if (i.children) {
					i.children.forEach((ch_i1, ch_x1) => {
						if (ch_i1.id == isId) {
							ch_i1.disabled = true;
						}
						if (ch_i1.children) {
							ch_i1.children.forEach((ch_i2, ch_x2) => {
								if (ch_i2.id == isId) {
									ch_i2.disabled = true;
								}
								if (ch_i2.children) {
									ch_i2.children.forEach((ch_i3, ch_x3) => {
										if (ch_i3.id == isId) {
											ch_i3.disabled = true;
										}
										if (ch_i3.children) {
											ch_i3.children.forEach((ch_i4, ch_x4) => {
												if (ch_i4.id == isId) {
													ch_i4.disabled = true;
												}
											})
										}
									})
								}
							})
						}
					})
				}
			})
		},
		deleteRolem(index, row) {
			this.$confirm('确认删除吗?', '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				confirmButtonClass: 'el-button--danger',
				type: 'warning',
			}).then(() => {
				this.$http.deleteRole(row.id).then(res => {
					if (res.data.success) {
						this.rolesQuery()
					}
				})
			});
		},
		cleanClick() {
			this.admins.userNamePhone = this.adminsSearch.input[0].value =
				this.departments.name = this.tableSearch.input[0].value =
				this.roles.name = this.rolesSearch.input[0].value = '';
			this.tableHeader.pagination.currentPage = 1;
			this.adminsHeader.pagination.currentPage = 1;
			this.rolesHeader.pagination.currentPage = 1;
			[this.tableHeader, this.adminsHeader, this.rolesHeader].forEach((i1, x1) => {
				i1.data.forEach(item => {
					if (item.hasOwnProperty('filterList')) {
						item.filterList = [];
					}
				});
			})
			this.admins.departmentId = '';
			this.admins.roleId = '';
			this.admins.userNamePhone = '';
			this.query();
		},
		initialize(refs) { //初始化列表
			this.$refs[refs].resetFields();
			if (refs == 'roleForm') {
				+this.$refs.roleTree.setCheckedKeys([])
			}
		},

		//筛选列
		filters(filters) {
			var name;
			for (var x in filters) {
				name = x;
			}
			this.admins[name + 'Id'] = filters[name][0] != undefined ? filters[name][0] : '';
			this.adminsQuery();
		},
		warning() {
			this.$message.warning('无此操作权限！')
		}
	}
}
</script>
<style lang="less">
#account {
    width: 100%;
    height: 100%;
    float: left;
    background: #FFFFFF;
    box-shadow: 0 3px 5px 0 rgba(0,0,0,0.05);
    border-radius: 4px;
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
    .el-dialog__body {
        text-align: left;
    }
    .dialog-footer {
        text-align: right;
    }
    #addRole {
        > .el-dialog {
            height: 100%;
            float: right;
            margin-bottom: 0;
            > .el-dialog__body {
                height: calc(100% - 115px);
            }
            > .el-dialog__footer {
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }
    }
    .role-permi {
        .el-form-item__content {
            width: calc(100% - 100px) !important;
        }
    }
}
</style>
