<template>
	<div class="home">
		<el-container>
			<el-aside :width="width">
				<el-row>
					<el-col>
						<img v-if="!isCollapse" src="../../assets/image/menu_icon_logo.png" alt="logo">
						<img class="logo" v-else src="../../assets/image/menu_icon_logo_icon.png" alt="logo">
						<el-menu router :default-active="routePath" class="el-menu-vertical-demo" unique-opened :collapse="isCollapse">
							<template v-for="(menu,index) in navList">
								<el-submenu v-if="menu.child.length>0" :key="index" :index="index.toString()">
									<template slot="title">
										<i class="iconfont" :class="menu.icon"></i>
										<span class="menuName">{{menu.moduleName}}</span>
									</template>
									<el-menu-item v-for="(item,key) in menu.child" :key="key" :index="item.menuPath">
										<div class="empty">{{item.moduleName}}</div>
									</el-menu-item>
								</el-submenu>
							<!-- 	<el-menu-item v-if="menu.sort==5" :index="'/'+menu.moduleId">
									<i class="iconfont" :class="menu.icon"></i>
									<span class="menuName"> {{menu.moduleName}}</span>
								</el-menu-item> -->
							</template>
						</el-menu>
					</el-col>
				</el-row>
			</el-aside>
			<el-container>
				<el-header>
					<ul class="header">
						<li class="collapse">
							<img v-if="isCollapse" src="../../assets/image/top_btn_menu.png" style="transform:rotate(180deg)" alt="收起"
							 @click="collapse(false)">
							<img v-else src="../../assets/image/top_btn_menu.png" alt="展开" @click="collapse(true)">
						</li>
						<li class="title">沁园运营中心</li>
						<li class="user">
							<i class="el-icon-user-solid avatar"></i>&nbsp;&nbsp;&nbsp;&nbsp;
							<el-dropdown trigger="click" style="cursor:pointer">
								<span class="el-dropdown-link">
									{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<!-- <el-dropdown-item @click.native="searchUser">用户信息</el-dropdown-item> -->
									<el-dropdown-item @click.native="changePassword">修改密码</el-dropdown-item>
									<el-dropdown-item @click.native="exit">退出</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</li>
					</ul>
				</el-header>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
		<el-dialog title="修改密码" width="30%" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
				<el-form-item prop="pass">
					<el-input type="password" placeholder="新密码" v-model.trim="ruleForm.pass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item prop="checkPass">
					<el-input type="password" placeholder="确认密码" v-model.trim="ruleForm.checkPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog title="用户信息" width="30%" :visible.sync="dialogUserVisible">
			<ul class="userInfo">
				<li>用户名：{{userInfo.userName}}</li>
				<li>角色名：{{userInfo.roleName}}</li>
				<li>联系方式：{{userInfo.phone}}</li>
				<li>创建时间：{{userInfo.createTime}}</li>
			</ul>
		</el-dialog>
	</div>
</template>

<script>
	import menuList from "../../assets/js/menu.js"
	import md5 from 'js-md5';
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					pass: '',
					checkPass: '',
					age: ''
				},
				userInfo: {
					userName: "测试",
					roleName: "管理员",
					phone: "15868411714",
					createTime: "2020-04-17 13:13:45"
				},
				rules: {
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						validator: validatePass2,
						trigger: 'blur'
					}]
				},
				username: this.$cookies.get('username'),
				routePath: this.$route.path,
				dialogUserVisible: false,
				dialogFormVisible: false,
				isCollapse: false,
				width: "240px",
				navList: []
			}
		},
		created() {
			this.$store.commit('updateTime');
			if (localStorage.getItem("permission") == "root") {
				this.getuserTree();
			} else {
				const data = localStorage.getItem("permission");
				this.getNavList(data);
			}
		},
		methods: {
			collapse(val) {
				this.width = val ? "64px" : "240px";
				this.isCollapse = val;
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let api = this.$Api.manage_updatePassword;
						this.$Axios.post(api, {
							password: this.CalcuMD5(this.ruleForm.pass),
						}).then((res) => {
							if (res.success) {
								this.$confirm('修改成功，退出登录？')
									.then(() => {
										this.$router.push("/");
										this.$cookies.remove("token");
										localStorage.clear("permission");
										localStorage.clear("isShowActiveButton");
									}).catch((res) => {});
							} else {
								this.$message({
									message: res.message,
									type: 'warning'
								});
							}
							this.getOrderDetail();
							this.getcheckTotal();
							this.getCheckRecordPageList();
						}).catch((res) => {});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			searchUser() {
				this.dialogUserVisible = true;
			},
			CalcuMD5(pwd) {
				pwd = md5(pwd);
				pwd = pwd.toUpperCase();
				return pwd;
			},
			changePassword() {
				this.dialogFormVisible = true;
				this.$nextTick(() => {
					this.$refs["ruleForm"].resetFields();
				})
			},
			getuserTree() {
				let api = this.$Api.manage_tree;
				this.$Ax.get(api, {
					params: {
						timestamp: this.$store.state.axiosTime,
					}
				}).then((res) => {
					if (res.success) {
						this.navList = res.data;
						this.navList.sort((a, b) => {
							return a.sort - b.sort
						})
						for (let j = 0; j < this.navList.length; j++) {
							if (this.navList[j].child == null) {
								this.navList[j].child = [];
							} else {
								for (let i = 0; i < this.navList[j].child.length; i++) {
									this.navList[j].child.sort((a, b) => {
										return a.menuSort - b.menuSort
									})
								}
							}
						}
					} else {
						this.$message({
							message: res.message,
							type: 'warning'
						});
					}
				}).catch((res) => {});
			},
			getNavList(treeDate) {
				let permissions = menuList;
				for (let i = 0; i < permissions.length; i++) {
					permissions[i].child = [];
				}
				JSON.parse(treeDate).forEach((item, index) => {
					if (item.moduleId == "filterSend" || item.moduleId == "filterSetting" || item.moduleId == "filterStatistic") {
						permissions[0].child.push(item)
					}
					if (item.moduleId == "deviceSetting") {
						permissions[1].child.push(item)
					}
					if (item.moduleId == "userList") {
						permissions[2].child.push(item)
					}
					if (item.moduleId == "productSetting") {					
						permissions[3].child.push(item)
					}
					if (item.moduleId == "customerManage") {
						permissions[4].child.push(item)
					}
					if (item.moduleId == "accountManage" || item.moduleId == "deviceLog" || item.moduleId == "emailManage" || item.moduleId ==
						"roleManage" || item.moduleId == "supplierManage" || item.moduleId == "systemLog") {
						permissions[5].child.push(item)
					}
				})
				this.navList = permissions;
			},
			exit() {
				this.$confirm('确定要退出该系统吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$router.push("/");
					localStorage.clear("permission");
					localStorage.clear("isShowActiveButton");
				}).catch(() => {

				})
			}
		}
	}
</script>

<style lang="scss">
	.home {
		width: 100%;
		height: 100%;

		a {
			text-decoration: none;
		}

		.el-header,
		.el-footer {
			background-color: #fff;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

			.header {
				width: 100%;
				height: 100%;
				padding: 0px;

				li {
					list-style: none;
					float: left;

					img {
						cursor: pointer;
					}
				}

				.title {
					font-size: 16px;
					color: #333333;
					letter-spacing: 0;
					padding: 0px 20px;
					font-weight: bold;
				}

				.user {
					float: right;
					line-height: 35px;

					.avatar {
						float: left;
						line-height: 38px;
						padding-right: 10px;
					}
				}
			}
		}

		.el-aside {
			background-image: linear-gradient(to bottom, #1F9AD6, #57B2D9);
			color: #fff;
			text-align: left;
			box-shadow: 2px 0 12px 0 rgba(0, 0, 0, 0.05);
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;

			.logo {
				display: block;
				padding: 15px;
			}

			.el-submenu__title {
				background: rgba(255, 255, 255, 0);
				color: rgba(255, 255, 255, 0.8);
			}

			i {
				color: rgba(255, 255, 255, 0.8);
			}

			.menuName {
				padding-left: 15px;
			}

			.empty {
				display: block;
				width: 100%;
				height: 100%;
				text-decoration: none;
				padding-left: 20px;
				font-size: 12px;
				letter-spacing: 0;
				color: rgba(255, 255, 255, 0.8);
			}

			.is-active {
				.menuName {
					color: #fff;
				}

				i {
					color: #fff;
				}

			}


			.is-active {
				.el-submenu {
					.menuName {
						color: #fff;
					}

					i {
						color: #fff;
					}
				}
			}

			.is-active.el-menu-item {
				background: #EBF7FF;

				.menuName {
					color: #1F9AD6;
				}

				i {
					color: #1F9AD6;
				}

				.empty {
					color: #1F9AD6;
				}
			}

			.el-menu-item.is-active {
				color: #1F9AD6;
			}
		}

		.el-menu {
			border: none;
			background: rgba(255, 255, 255, 0);

			.el-menu-item {
				color: rgba(255, 255, 255, 0.8);
			}
		}

		.el-main {
			background-color: #F7F9FC;
			color: #333;
		}

		.el-main::-webkit-scrollbar {
			width: 0;
		}

		.el-container {
			height: 100%;
		}

		.el-container:nth-child(5) .el-aside,
		.el-container:nth-child(6) .el-aside {
			line-height: 260px;
		}

		.el-container:nth-child(7) .el-aside {
			line-height: 320px;
		}

		.userInfo {
			li {
				list-style: none;
				line-height: 40px;
			}
		}
	}
</style>
