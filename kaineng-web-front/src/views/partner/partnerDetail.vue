<template>
	<div class="agencyDetail">
		<Row :gutter="20">
			<Col span="12">
			<Card shadow>
				<div class="title">LOGO图片</div>
				<div class="logoBox">
					<div class="logo">
						<img v-if="partner.logoImage==null" :src="require('../../assets/defaultLogo.jpg')" alt="logo" />
						<img v-else :src="imgUrl+partner.logoImage+'?commonKey='+apiConfig.commonKey" alt="logo" />
						<p class="hint">系统平台logo</p>
						<p class="hint">尺寸建议 200*120</p>
						<p class="hint">
							<Upload class="upload" :before-upload="uploadLogo" accept='image/jpg,image/jpeg,image/png,image/gif,image/bmp'
							 action="">
								<p class="link">修改图片</p>
							</Upload>
						</p>
					</div>
				</div>
				<div class="logoBox">
					<div class="wechatLog">
						<img v-if="partner.wechatLogoImage==null" :src="require('../../assets/default.jpg')" alt="weixinlogo" />
						<img v-else :src="imgUrl+partner.wechatLogoImage+'?commonKey='+apiConfig.commonKey" alt="weixinlogo" />
						<p class="hint">微信logo</p>
						<p class="hint">尺寸建议 120*120</p>
						<p class="hint">
							<Upload class="upload" :before-upload="uploadwechatLogo" accept='image/jpg,image/jpeg,image/png,image/gif,image/bmp'
							 action="">
								<span class="link">修改图片</span>
							</Upload>
						</p>
					</div>
				</div>
			</Card>
			</Col>
			<Col span="12">
			<Card shadow>
				<div class="title">基本信息</div>
				<ul class="messgeEdit">
					<li>
						<span>委托商登录用户名：(为保障正常使用请设置用户名、权限、以及品牌名)</span>
						<p>
							{{partner.adminAccount | dealNullData}}</span>
							<Button type="text" class="edit" @click="handleChangeName">设置用户名</Button>
							<Button type="text" class="edit" @click="handleEditTitle">设置品牌名</Button>
							<Button type="text" class="edit" @click="handleChangePermission">设置权限</Button>
							<Button type="text" class="edit" @click="handleChangePassword">重置密码</Button>
						</p>
					</li>
					<li>
						<p>委托商IoT平台期限：（“--”未设置，表示为长期委托商）</p>
						<p>
							<span>{{partner.expireTime | dealNullData}}</span>
							<Button type="text" class="edit" @click="handleEdit">设置</Button>
						</p>

					</li>
					<li>
						<p>
							<span>自主域名信息：</span>
							<Tooltip content="“--”表示未设置，填写后优先使用该域名" theme="light">
								<Icon type="ios-help-circle-outline" size="16" />
							</Tooltip>
							<span class="error">联系技术提供商</span>
						</p>
						<p>
							<span>{{partner.ownUrl | dealNullData}}</span>
							<Button type="text" class="edit" @click="handleChangeDomain">设置</Button>
						</p>
					</li>
					<li>
						<p>IoT平台提供地址：（示例：{{apiConfig.partnerUrl+'/iot/+'}}<span class="link">别名</span>）</p>
						<p class="alias">
							<span>{{partnerUrl | dealNullData}} </span>
							<span v-if="!partnerUrl">&nbsp;&nbsp;请先</span>
							<span v-if="!partnerUrl" class="edit" @click="handleSetAlias">设置别名</span>
							<Button v-else type="text" @click="handleSetAlias">修改别名</Button>
							<Button type="text" v-if="partnerUrl" :data-clipboard-text="partnerUrl" class="edit tag-read" @click="handleCopy">复制</Button>
						</p>
					</li>
				</ul>
			</Card>
			</Col>
		</Row>
		<Row class="marginTop">
			<Col span="24">
			<Card shadow>
				<Row :gutter="20">
					<Col span="12">
					<div class="title">基础信息</div>
					<Form class="pertnerMessge" :label-width="150">
						<FormItem label="委托商编号：">
							<span class="value">{{partner.partnerId | dealNullData}}</span>
						</FormItem>
						<FormItem label="委托商名称：">
							<span class="value">{{partner.partnerName | dealNullData}}</span>
						</FormItem>
						<FormItem label="联系方式：">
							<span class="value">{{partner.userContact | dealNullData}}</span>
						</FormItem>
						<FormItem label="委托商等级：">
							<span class="value">{{partner.level=="1"?"非常重要":"重要"}}</span>
						</FormItem>
						<FormItem label="联系地址：">
							<span class="value">{{partner.country+" "+partner.province + partner.city+ partner.region+" "+partner.address | dealNullData}}</span>
						</FormItem>
						<FormItem label="注册时间：">
							<span class="value">{{partner.createTime | dealNullData}}</span>
						</FormItem>
						<FormItem label="同步时间：">
							<span class="value">{{partner.syncTime | dealNullData}}</span>
						</FormItem>
					</Form>
					</Col>
					<Col span="12">
					<div class="title">委托商联系人</div>
					<ul class="commonMessge">
						<li>
							<span class="label">姓名：</span>
							<span style="font-weight:bold;">{{partner.username | dealNullData}}</span>
						</li>
						<li>
							<span class="label">职位：</span>
							<span class="value">{{partner.job | dealNullData}}</span>
						</li>
						<li>
							<span class="label">电话：</span>
							<span class="value">{{partner.phone | dealNullData}}</span>
						</li>
						<li>
							<span class="label">邮件：</span>
							<span class="value">{{partner.email | dealNullData}}</span>
						</li>
					</ul>
					</Col>
				</Row>
			</Card>
			</Col>
		</Row>
		<!-- 设置委托商期限 -->
		<Modal v-model="dialogDeadline" title="委托商IOT平台期限" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true" @on-cancel="cancel">
			<Form ref="formDeadline" :model="formDeadline" :rules="ruleDeadline" :label-width="150">
				<FormItem label="委托商到期时间" prop="time">
					<DatePicker type="datetime" :options="options" v-model="formDeadline.time" placeholder="请选择到期时间"></DatePicker>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formDeadline')">确认</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
		<!-- 修改用户名称 -->
		<Modal v-model="dialogUserName" title="设置用户名" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true" @on-cancel="cancel">
			<Form ref="formUserName" :model="formUserName" :rules="ruleUserName" :label-width="100">
				<FormItem label="用户名" prop="accountName">
					<Input v-model="formUserName.accountName" placeholder="请输入用户名"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formUserName')">确认</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
		<!-- 设置别名 -->
		<Modal v-model="dialogAlias" title="设置别名" class-name="detailModal" :mask-closable="false" :width="500" :footer-hide="true"
		 @on-cancel="cancel">
			<Form ref="formAlias" :model="formAlias" :rules="ruleAlias">
				<FormItem prop="alias">
					<Input v-model="formAlias.alias" placeholder="请输入委托商别名">
					<span slot="prepend">{{apiConfig.partnerUrl+'/iot/'}}</span>
					</Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formAlias')">确认</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
		<!-- 修改密码 -->
		<Modal v-model="dialogPassword" title="重置密码" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true" @on-cancel="cancel">
			<Form ref="formPassword" :model="formPassword" :rules="rulePassword" :label-width="100">
				<FormItem label="新密码" prop="password">
					<Input type="password" v-model="formPassword.password" placeholder="请输入新密码"></Input>
				</FormItem>
				<FormItem label="确认密码" prop="newPassword">
					<Input type="password" v-model="formPassword.newPassword" placeholder="请再次输入新密码"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formPassword')">确认</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
		<!-- 设备品牌名 -->
		<Modal v-model="dialogBrand" title="设置品牌商" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true" @on-cancel="cancel">
			<Form ref="formBrand" :model="formBrand" :rules="ruleBrand" :label-width="120">
				<FormItem label="品牌商名称" prop="logoName">
					<Input v-model="formBrand.logoName" placeholder="请输入品牌商名称"></Input>
				</FormItem>
				<FormItem label="客服热线" prop="servicePhone">
					<Input  v-model="formBrand.servicePhone" placeholder="请输入品牌商热线"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formBrand')">确认</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>		
		<!--设置自主域名-->
		<Modal v-model="dialogDomain" title="域名设置" class-name="detailModal" :mask-closable="false" :width="500" :footer-hide="true"
		 @on-cancel="cancel">
			<Form ref="formDomain" :model="formDomain" :rules="ruleDomain" :label-width="80">
				<FormItem label="域名" prop="ownUrl">
					<Input v-model="formDomain.ownUrl" placeholder="请输入自主域名"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formDomain')">确认</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
		<!-- 图片查看 -->
		<Modal v-model="dialogImg" :title="activeName" @on-ok="uploadImg" @on-cancel="cancel">
			<div style="text-align: center">
				<img :src="logoImage" :style="{width:(imgType==1?'300px':'100px')}" alt="logo" />
			</div>
		</Modal>
		<!-- 权限设置 -->
		<Modal v-model="dialogPermission" title="权限设置" @on-ok="uploadPermission" @on-cancel="cancel">
			<Tree ref='formEdit' :data="editPermissionList" show-checkbox :children-key='"child"' class="partnerTree"></Tree>
			<Spin fix v-if='editLoading'></Spin>
		</Modal>

	</div>
</template>

<script>
	//引入复制插件
	import Clipboard from 'clipboard'
	import utils from '../../utils/dealNullData.js'
	import apiConfig from '@/apiConfig'
	import md5 from 'js-md5';
	import editTree from './funTree.js';
	export default {
		data() {
			const validatePassCheck = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入新密码'));
				} else if (value !== this.formPassword.password) {
					callback(new Error('两次密码不相同'));
				} else {
					callback();
				}
			};
			return {
				options: {
					disabledDate(date) { //设置不可选择的日期。
						return date && date.valueOf() < Date.now() - 86400000;
					}
				},
				apiConfig: apiConfig,
				partner: {},
				logoImage: require('../../assets/logoHome.png'),
				wechatLogoImage: require('../../assets/kainenglogo.png'),
				activeName: "",
				file: '',
				imgType: 1, //平台判断
				partnerUrl: '', //apiConfig.domainURL + "#/login?partnerId=" + this.$route.query.partnerId,
				imgUrl: apiConfig.baseURL + this.$api.common_getFile,
				partnerId: this.$BASE.Decrypt(this.$route.query.partnerId),
				dialogDeadline: false,
				dialogUserName: false,
				dialogDomain: false,
				dialogPassword: false,
				dialogImg: false,
				dialogPermission: false,
				dialogBrand:false,
				dialogAlias: false,
				editLoading: false,
				editPermissionList: [],
				permissionTree: [],
				formAlias: {
					alias: '',
				},
				formDeadline: {
					time: '',
				},
				formUserName: {
					accountName: '',
				},
				formDomain: {
					ownUrl: '',
				},
				formPassword: {
					password: '',
					newPassword: '',
				},
				formBrand: {
					servicePhone: '',
					logoName: '',
				},
				ruleBrand: {
					servicePhone:[{
						required: false,
						message: '请输入品牌商热线',
						trigger: 'blur'
					}],
					logoName: [{
						required: true,
						message: '请输入品牌商名称',
						trigger: 'blur'
					}]
				},
				ruleDeadline: {
					time: [{
						required: true,
						type: 'date',
						message: '请选择到期时间',
						trigger: 'change'
					}],
				},
				ruleUserName: {
					accountName: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
				},
				ruleDomain: {
					ownUrl: [{
						required: true,
						message: '请输入自主域名',
						trigger: 'blur'
					}],
				},
				ruleAlias: {
					alias: [{
						required: true,
						message: '请输入委托商别名',
						trigger: 'blur'
					}],
				},
				rulePassword: {
					password: [{
							required: true,
							message: '请输入新密码',
							trigger: 'blur'
						},
						{
							type: 'string',
							min: 6,
							message: '至少六位密码',
							trigger: 'blur'
						}
					],
					newPassword: [{
						validator: validatePassCheck,
						trigger: 'blur'
					}],
				},
			}
		},
		filters: {
			// 处理空数据
			dealNullData(data) {
				return utils.dealNullData(data)
			}
		},
		mounted() {
			this.getPartnerDetail();
			this.getModuleList();
		},
		methods: {
			getPartnerDetail() {
				this.$Ax.get(this.$api.manage_businessPartner_detail, {
					params: {
						partnerId: this.partnerId
					}
				}).then(res => {
					if (res.success) {
						this.partner = res.data;
						this.partnerUrl = res.data.alias ? apiConfig.partnerUrl + "/iot/" + res.data.alias : null;
					} else {
						this.$Message.error(res.message)
					}
				})
			},
			//获取权限数组
			getModuleList() {
				this.$Ax.get(this.$api.manage_getModuleList, {
					params: {
						commonKey: apiConfig.commonKey
					}
				}).then(res => {
					if (res.success) {
						this.permissionTree = res.data;
					} else {
						this.$Message.error(res.message)
					}
				})
			},
			//权限数组处理
			handleChangeTree(list) {
				for (let i in list) {
					list[i].expand = true
					if (list[i].child && list[i].child.length > 0) {
						if (list[i].child.length == 8) {
							(list[i].child).pop()
						}
						for (let y in list[i].child) {
							list[i].child[y].expand = false
							if (list[i].child[y].child && list[i].child[y].child.length > 0) {
								for (let x in list[i].child[y].child) {
									list[i].child[y].child[x].expand = false
									if (list[i].child[y].child[x].child && list[i].child[y].child[x].child.length > 0) {
										for (let u in list[i].child[y].child[x].child) {
											list[i].child[y].child[x].child[u].expand = false
											list[i].child[y].child[x].child[u].title = list[i].child[y].child[x].child[u].name
										}
									}
								}
							}
						}
					}
				}
				return list
			},
			handleCheckTree(list) {
				for (let i in list) {
					list[i].expand = true
					if (list[i].child && list[i].child.length > 0) {
						for (let y in list[i].child) {
							list[i].child[y].checked = true
							if (list[i].child[y].child && list[i].child[y].child.length > 0) {
								for (let x in list[i].child[y].child) {
									list[i].child[y].child[x].checked = true
									if (list[i].child[y].child[x].child && list[i].child[y].child[x].child.length > 0) {
										for (let u in list[i].child[y].child[x].child) {
											list[i].child[y].child[x].child[u].checked = true
											list[i].child[y].child[x].child[u].title = list[i].child[y].child[x].child[u].name
										}
									}
								}
							}
						}
					}
				}
				return list
			},
			// 关闭弹出层
			cancel() {
				this.dialogDeadline = false;
				this.dialogUserName = false;
				this.dialogDomain = false;
				this.dialogPassword = false;
				this.dialogImg = false;
				this.dialogPermission = false;
				this.dialogAlias = false;
				this.dialogBrand = false;
			},
			handleSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.dialogDeadline = false;
						let para;
						let api;
						let messge = "设置成功";
						if (formName == "formDeadline") {
							api = this.$api.manage_businessPartner_updateExpireTime;
							this.formDeadline.time = utils.dealTime(this.formDeadline.time)
							para = {
								partnerId: this.partnerId,
								...this.formDeadline
							}
						}
						if (formName == "formUserName") {
							api = this.$api.manage_businessPartner_updateAccountName;
							para = {
								partnerId: this.partnerId,
								...this.formUserName
							}
							messge = "修改成功";
						}
						if (formName == "formPassword") {
							api = this.$api.manage_businessPartner_resetPassword;
							para = {
								partnerId: this.partnerId,
								password: md5(this.formPassword.password).toLocaleUpperCase()
							}
							messge = "重置成功";
						}

						if (formName == "formDomain") {
							api = this.$api.manage_businessPartner_setOwnUrl;
							para = {
								partnerId: this.partnerId,
								...this.formDomain
							}
						}

						if (formName == "formAlias") {
							api = this.$api.manage_businessPartner_setAlias;
							para = {
								partnerId: this.partnerId,
								...this.formAlias
							}
						}
						if (formName == "formBrand") {
							api = this.$api.manage_businessPartner_setServicePhone;
							para = {
								partnerId: this.partnerId,
								...this.formBrand
							}
						}	

						this.$Ax.post(api, para).then(res => {
							if (res.success) {
								this.cancel();
								this.$Message.success(messge)
								this.getPartnerDetail()
							} else {
								this.$Message.error(res.message)
							}
						}).catch(err => {
							console.log(err);
						})
					}
				})
			},
			uploadLogo(file) {
				const isLimit = file.size / 1024 / 1024 < 2
				if (!isLimit) {
					this.$Message.error('上传文件大小不得大于2MB')
					return false
				}
				this.activeName = "系统平台LOGO"
				this.dialogImg = true;
				this.imgType = 1;
				this.logoImage = window.URL.createObjectURL(file);
				this.file = file;
				return false
			},
			uploadwechatLogo(file) {
				const isLimit = file.size / 1024 / 1024 < 2
				if (!isLimit) {
					this.$Message.error('上传文件大小不得大于2MB')
					return false
				}
				this.activeName = "微信LOGO"
				this.dialogImg = true;
				this.imgType = 2;
				this.logoImage = window.URL.createObjectURL(file);
				this.file = file;
				return false
			},
			uploadImg() {
				const formData = new FormData()
				formData.append('file', this.file);
				formData.append('partnerId', this.partnerId);
				formData.append('type', this.imgType);
				let api = this.$api.manage_businessPartner_updateLogo;
				this.$upload.post(api, formData).then(res => {
					if (res.data.success) {
						this.$Message.success("上传成功")
						this.getPartnerDetail()
					} else {
						this.$Message.error(res.message)
					}
				}).catch(err => {
					console.log(err);
				})
			},
			handleEdit() {
				if (!this.partner.adminAccount) {
					this.$Message.error("请先设置用户")
					return false
				}
				this.dialogDeadline = true;
				this.formDeadline.time = this.partner.expireTime;
			},
			handleChangeName() {
				this.dialogUserName = true;
				this.formUserName.accountName = this.partner.adminAccount;
			},
			handleEditTitle() {
				this.dialogBrand = true;
				this.formBrand ={
					servicePhone:this.partner.servicePhone,
					logoName:this.partner.logoName,
				};
			},
			handleChangePassword() {
				this.dialogPassword = true;
				this.formPassword = {
					password: null,
					newPassword: null,
				}
			},
			dealTree(array, tree) {
				let newTree = tree;
				for (let i in newTree[0].child) {
					for (let y in array[0].child) {
						if (newTree[0].child[i].name === array[0].child[y].name) {
							newTree[0].child[i] = array[0].child[y]
						}
					}
				}
				return newTree
			},
			handleChangePermission() {
				this.dialogPermission = true;
				this.editLoading = true
				this.editPermissionList = []
				if (this.partner.modules) {
					let permissionName = this.handleCheckTree(JSON.parse(this.partner.modules))
					let nameArray = [JSON.parse(sessionStorage.getItem('permissionTree'))[0]]
					this.editPermissionList = this.handleChangeTree(this.dealTree(permissionName, nameArray))
					this.editLoading = false
				} else {
					let nameArray = [JSON.parse(sessionStorage.getItem('permissionTree'))[0]]
					this.editPermissionList = this.handleChangeTree(nameArray)
					this.editLoading = false
				}
			},
			uploadPermission() {
				let api = this.$api.manage_businessPartner_setModules;
				let list = JSON.stringify(editTree.clearTree(editTree.dealTree(this.editPermissionList)))
				let para = {
					partnerId: this.partnerId,
					modules: list,
				}
				this.$Ax.post(api, para).then(res => {
					if (res.success) {
						this.cancel();
						this.$Message.success("设置成功")
						this.getPartnerDetail()
					}
				}).catch(err => {
					console.log(err);
				})
			},
			handleChangeDomain() {
				this.dialogDomain = true
				this.formDomain = {
					ownUrl: this.partner.ownUrl,
				}
			},
			handleSetAlias() {
				this.dialogAlias = true
				this.formAlias = {
					alias: this.partner.alias,
				}
			},
			handleCopy() {
				let clipboard = new Clipboard('.tag-read')
				clipboard.on('success', e => {
					this.$Message.success('复制成功')
					// 释放内存
					clipboard.destroy()
				})
				clipboard.on('error', e => {
					// 不支持复制
					alert("不支持此浏览器");
					// 释放内存
					clipboard.destroy()
				})
			}
		}
	}
</script>

<style lang="less">
	.partnerTree .ivu-tree-arrow i {
		display: none;
	}

	.agencyDetail {
		padding: 20px 0px;

		.marginTop {
			margin-top: 20px;
		}

		.title {
			font-weight: bold;
			font-size: 15px;
			line-height: 40px;
		}

		.logoBox {
			display: inline-block;
			width: 50%;
			height: 280px;

			.logo {
				margin: 10px auto;
				width: 200px;
				height: 220px;
				border-radius: 4px;
				overflow: hidden;
				vertical-align: top;

				img {
					width: 100%;
					height: 120px;
					border: 1px solid #eee;
				}

				.hint {
					text-align: center;
					color: #666666;
					font-size: 12px;
					line-height: 30px;
				}

				.link {
					color: #3399ff;
					cursor: pointer;
				}
			}

			.wechatLog {
				margin: 10px auto;
				width: 120px;
				height: 220px;
				border-radius: 4px;
				overflow: hidden;
				vertical-align: top;

				img {
					width: 100%;
					height: 120px;
					border: 1px solid #eee;
				}

				.hint {
					text-align: center;
					color: #666666;
					font-size: 12px;
					line-height: 30px;
				}

				.link {
					color: #3399ff;
					cursor: pointer;
				}
			}
		}

		.messgeEdit {
			display: inline-block;
			list-style: none;
			margin-left: 20px;
			font-size: 14px;
			color: #616B81;

			li {
				line-height: 30px;
				font-size: 14px;
				margin-bottom: 15px;

				.alias {
					font-size: 12px;

					.edit {
						color: #2b85e4;
						cursor: pointer;
					}
				}

				.error {
					color: #ed4014;
					margin-left: 10px;
				}
			}
		}

		.pertnerMessge {
			.ivu-form-item-label {
				font-size: 14px;
				color: #616B81;
			}

			.value {
				font-size: 14px;
				color: #616B81;
			}
		}

		.commonMessge {
			width: 310px;
			height: 170px;
			background: url(../../assets/client_management_list_details_pic_card_bg.png) no-repeat;
			background-size: 100% 100%;
			list-style: none;
			padding: 20px 24px;
			margin-top: 10px;
			color: #3F4656;

			li {
				width: 100%;
				line-height: 35px;
				font-size: 14px;

				.label {
					font-weight: bold;
				}
			}
		}

		#domain {
			border: 0px;
			min-width: 280px;
		}
	}
</style>
