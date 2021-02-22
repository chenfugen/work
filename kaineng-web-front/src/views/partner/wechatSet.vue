<template>
	<div class="wechatSet">
		<div class="step">
			<Steps :current="step">
				<Step title="第一步" content="获取微信公众号信息"></Step>
				<Step title="第二步" content="设置微信H5页面地址"></Step>
				<Step title="第三步" content="确定开启设备功能"></Step>
				<Step title="第四步" content="获取验证TXT文件，并且上传文件"></Step>
				<Step title="第五步" content="获取域名相关信息"></Step>
				<Step title="第六步" content="设备二维码地址，以及公众号菜单地址设置"></Step>
				<Step title="第七步" content="添加对应消息模板"></Step>
				<Step title="第八步" content="已完成，相关信息查看"></Step>
			</Steps>
		</div>

		<Card v-if="step==0">
			<p slot="title">第一步 获取微信公众号信息</p>
			<div class="messageBox">
				<p class="wechatUrl">登录微信公众号后台管理系统（<a href="https://mp.weixin.qq.com" target="_blank">mp.weixin.qq.com</a>）</p>
				<Divider />
				<p class="procedure">【开发】—>【基本信息】—>【公众号开发信息】</p>
				<Form class="marginTop" :label-width="150">
					<FormItem label="开发者ID(AppID)：">
						<span>{{wechatInfo.appId | dealNullData}}</span>
					</FormItem>
					<FormItem label="开发者密码(AppSecret)：" prop="appSecret">
						<span>{{wechatInfo.secret | dealNullData }}</span>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="handleEdit">编辑</Button>
					</FormItem>
				</Form>
				<Divider />
				<p class="procedure">【开发】—>【基本信息】—>【IP白名单】—>【查看/修改】</p>
				<ul class="domain">
					<li v-for="(item,index) in apiConfig.IP" :key="index">
						<span>IP：{{item}}</span>
						<Button type="text" class="tag-read" :data-clipboard-text="item" @click="copy">复制信息</Button>
					</li>
				</ul>
				<Divider />
				<Button type="info" @click="next(1)">下一步</Button>
			</div>
			<div class="reference">
				<img src="../../assets/wechatOne.jpg" alt="公众号图片">
			</div>
		</Card>

		<Card v-if="step==1">
			<p slot="title">第二步 设置微信H5页面地址，上传公众号二维码</p>
			<div class="messageBox">
				<p class="wechatUrl">登录微信公众号后台管理系统（<a href="https://mp.weixin.qq.com" target="_blank">mp.weixin.qq.com</a>）</p>
				<Divider />
				<p class="procedure">【设置H5链接地址】—>【确认并保存】</p>
				<Form class="marginTop" :label-width="90">
					<FormItem label="H5链接地址">
						<span>{{wechatInfo.h5url | dealNullData }}</span>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="handleEditUrl">编辑</Button>
					</FormItem>
				</Form>
				<Divider />
				<p class="procedure">【公众号设置】—>【账号详情】—>【二维码】—>【下载二维码】—>【上传】</p>
				<div class="qrCode">
					<img v-if="wechatInfo.qrImage==null" :src="require('../../assets/qrCode.jpg')" alt="logo" />
					<img v-else :src="imgUrl+wechatInfo.qrImage+'?commonKey='+apiConfig.commonKey" alt="logo" />
					<p class="hint">
						<Upload class="upload" :before-upload="uploadLogo" accept='image/jpg,image/jpeg,image/png,image/gif,image/bmp'
						 action="">
							<p class="link">上传</p>
						</Upload>
					</p>
				</div>
				<Divider />
				<Button type="info" @click="pre(0)">上一步</Button>
				<Button type="info" class="next" @click="next(2)">下一步</Button>
			</div>
			<div class="reference">
				<img src="../../assets/wechatSeven.jpg" alt="公众号图片">
			</div>
		</Card>

		<Card v-if="step==2">
			<p slot="title">第三步 确定开启设备功能</p>
			<div class="messageBox">
				<p class="wechatUrl">登录微信公众号后台管理系统（<a href="https://mp.weixin.qq.com" target="_blank">mp.weixin.qq.com</a>）</p>
				<Divider />
				<p class="procedure">【添加功能插件】—>【设备功能】—>【开通】</p>
				<Divider />
				<Button type="info" @click="pre(1)">上一步</Button>
				<Button type="info" class="next" @click="next(3)">下一步</Button>
			</div>
			<div class="reference">
				<img src="../../assets/wechatTwo.jpg" alt="公众号图片">
			</div>
		</Card>

		<Card v-if="step==3">
			<p slot="title">第四步 获取验证TXT文件，并且上传文件</p>
			<div class="messageBox">
				<p class="wechatUrl">登录微信公众号后台管理系统（<a href="https://mp.weixin.qq.com" target="_blank">mp.weixin.qq.com</a>）</p>
				<Divider />
				<p class="procedure">【公众号设置】—>【功能设置】—>【业务域名】</p>
				<div class="marginTop">
					<Upload :before-upload="handleUpload" action="">
						<Button icon="ios-cloud-upload-outline">上传TXT文件</Button>
					</Upload>
					<div v-if="file!=null">文件名: {{ file.name }}
						<Button v-if="!uploadStatus" type="primary" @click="upload" :loading="loadingStatus">{{ loadingStatus ? '上传中' : '确认上传' }}</Button>
					</div>
				</div>
				<Divider />
				<Button type="info" @click="pre(2)">上一步</Button>
				<Button type="info" class="next" @click="next(4)">下一步</Button>
			</div>
			<div class="reference">
				<img src="../../assets/wechatThree.jpg" alt="公众号图片">
			</div>
		</Card>

		<Card v-if="step==4">
			<p slot="title">第五步 获取域名相关信息</p>
			<div class="messageBox">
				<p class="wechatUrl">登录微信公众号后台管理系统（<a href="https://mp.weixin.qq.com" target="_blank">mp.weixin.qq.com</a>）</p>
				<Divider />
				<p class="procedure">【公众号设置】—>【功能设置】—>【业务域名】</p>
				<ul class="domain">
					<li>
						<span>业务域名：{{jumpUrl}}</span>
						<Button type="text" class="tag-read" :data-clipboard-text="jumpUrl" @click="copy">复制信息</Button>
					</li>
					<li>
						<span>JS接口安全域名：{{jumpUrl}}</span>
						<Button type="text" class="tag-read" :data-clipboard-text="jumpUrl" @click="copy">复制信息</Button>
					</li>
					<li>
						<span>网页授权域名：{{jumpUrl}}</span>
						<Button type="text" class="tag-read" :data-clipboard-text="jumpUrl" @click="copy">复制信息</Button>
					</li>
				</ul>
				<Divider />
				<Button type="info" @click="pre(3)">上一步</Button>
				<Button type="info" class="next" @click="next(5)">下一步</Button>
			</div>
			<div class="reference">
				<img src="../../assets/wechatFive.jpg" alt="公众号图片">
			</div>
		</Card>

		<Card v-if="step==5">
			<p slot="title">第六步 设备二维码地址，以及公众号菜单地址设置</p>
			<div class="messageBox">
				<p class="wechatUrl">登录微信公众号后台管理系统（<a href="https://mp.weixin.qq.com" target="_blank">mp.weixin.qq.com</a>）</p>
				<Divider />
				<ul class="domain">
					<li>
						<span>设备二维码地址示例：{{wechatInfo.h5url+deviceUrl | dealNullData}}</span>
						<Button type="text" class="tag-read" :data-clipboard-text="wechatInfo.h5url+deviceUrl" @click="copy">复制信息</Button>
					</li>
				</ul>
				<p class="hint">productKey对应产品PK，DeviceName对应设备MAC/IMEI，SN对应设备的SN码</p>
				<Divider />
				<p class="procedure">【功能】—>【自定义菜单】—>【确认并保存】</p>
				<ul class="domain">
					<li>
						<span>菜单地址：{{wechatInfo.h5url | dealNullData}}</span>
						<Button type="text" class="tag-read" :data-clipboard-text="wechatInfo.h5url" @click="copy">复制信息</Button>
					</li>
				</ul>
				<Divider />
				<Button type="info" @click="pre(4)">上一步</Button>
				<Button type="info" class="next" @click="next(6)">下一步</Button>
			</div>
			<div class="reference">
				<img src="../../assets/wechatSix.jpg" alt="公众号图片">
			</div>
		</Card>

		<!-- 滤芯更换、故障等消息提醒 -->
		<Card v-if="step==6">
			<p slot="title">第七步 添加对应消息模板</p>
			<div class="messageBox">
				<p class="wechatUrl">登录微信公众号后台管理系统（<a href="https://mp.weixin.qq.com" target="_blank">mp.weixin.qq.com</a>）</p>
				<Divider />
				<p class="procedure">【消息模板】—>【模板库】—>【查找对应模块】—>【添加】</p>
				<div class="timeline">
					<p class="wechatUrl">具体步骤</p>
					<Timeline>
						<TimelineItem>
							<p class="time">1、选择所属行业</p>
							<p class="content">点击模板库，选择所在行业（主营业选择消费品，副营业根据你们情况来）</p>
						</TimelineItem>
						<TimelineItem>
							<p class="time">2、添加故障提醒模块</p>
							<p class="content">搜索“故障提醒”，找到编号为（OPENTM405636663），点击详情添加</p>
						</TimelineItem>
						<TimelineItem>
							<p class="time">3、添加滤芯更换提醒模块</p>
							<p class="content">搜索“滤芯更换提醒”，找到编号为（OPENTM402027268），点击详情添加</p>
						</TimelineItem>
						<p class="time">4、查看我的模板</p>
						<p class="content">将对应模板ID复制、保存</p>
						</TimelineItem>
					</Timeline>
				</div>
				<Divider />
				<p class="procedure">【上传消息模板ID】—>【保存】</p>
				<Form class="marginTop" :label-width="125">
					<FormItem label="故障提醒模板ID：">
						<span>{{wechatInfo.errorTempleteId | dealNullData}}</span>
					</FormItem>
					<FormItem label="滤芯更换模板ID：">
						<span>{{wechatInfo.filterTempleteId | dealNullData}}</span>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="handleSave">编辑</Button>
					</FormItem>
				</Form>
				<Divider />
				<Button type="info" @click="pre(5)">上一步</Button>
				<Button type="info" class="next" @click="next(7)">完成</Button>
			</div>
			<div class="reference">
				<img src="../../assets/wechatFour.jpg" alt="公众号图片">
			</div>
		</Card>
		<!-- 滤芯更换、故障等消息提醒 -->
		<Card v-if="step==7">
			<p slot="title">第八步 已完成，相关信息查看</p>
			<div class="achieve">
				<p class="headline">
					<Icon type="ios-checkmark-circle" color="#19be6b" />
					<span> 恭喜，微信配置成功</span>
				</p>
				<p class="subtitle">微信H5地址</p>
				<p class="content">
					<span>{{wechatInfo.h5url | dealNullData }}</span>
					<Button type="text" class="tag-read" :data-clipboard-text="wechatInfo.h5url" @click="copy">复制信息</Button>
				</p>
				<p class="subtitle">设备二维码生产打印格式</p>
				<p class="content">
					<span>{{wechatInfo.h5url+deviceUrl | dealNullData}}</span>
					<Button type="text" class="tag-read" :data-clipboard-text="wechatInfo.h5url+deviceUrl" @click="copy">复制信息</Button>
				</p>
				<p class="subtitle">公众号二维码</p>
				<p class="content">
					<img :src="imgUrl+wechatInfo.qrImage+'?commonKey='+apiConfig.commonKey" alt="logo" />
				</p>
				<Button type="info" class="next" @click="next(8)">修改</Button>
			</div>
		</Card>
		<!-- 微信信息编辑 -->
		<Modal v-model="dialogApp" title="编辑公众号信息" class-name="detailModal" :mask-closable="false" :width="500" :footer-hide="true">
			<Form ref="formApp" :model="formApp" :rules="ruleApp" class="marginTop" :label-width="170">
				<FormItem label="开发者ID(AppID)：" prop="appId">
					<Input v-model.trim="formApp.appId" placeholder="开发者ID(AppID)" style="width:250px"></Input>
				</FormItem>
				<FormItem label="开发者密码(AppSecret)：" prop="appSecret">
					<Input v-model.trim="formApp.appSecret" placeholder="开发者密码(AppSecret)" style="width:250px"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formApp')">{{wechatInfo.appId!=null?"修改":"保存"}}</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
		<!-- H5页面更新 -->
		<Modal v-model="dialogH5url" title="编辑H5链接地址" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true">
			<p style="font-size:14px;color:#ed4014;">请先将你要填入的域名myDNS解析至该IP:xxx (联系技术支持提供商)</p>
			<Form ref="formUrl" :model="formUrl" :rules="ruleUrl" class="marginTop" :label-width="90">
				<FormItem label="H5链接地址" prop="h5Url">
					<Input v-model.trim="formUrl.h5Url" placeholder="H5链接地址" clearable style="width:250px"></Input>
					<p class="hint">地址格式参考：https://******/login.html</p>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formUrl')">{{wechatInfo.h5url!=null?"修改":"保存"}}</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
		<!-- 上传消息模板ID-->
		<Modal v-model="dialogTemplate" title="上传消息模板ID" class-name="detailModal" :mask-closable="false" :width="500"
		 :footer-hide="true">
			<Form ref="formTemlate" :model="formTemlate" :rules="ruleMessage" class="marginTop" :label-width="110">
				<FormItem label="故障提醒模板ID" prop="faultTempleteId">
					<Input v-model.trim="formTemlate.faultTempleteId" placeholder="故障提醒模板ID" style="width:250px"></Input>
				</FormItem>
				<FormItem label="滤芯更换模板ID" prop="filterTempleteId">
					<Input v-model.trim="formTemlate.filterTempleteId" placeholder="滤芯更换模板ID" style="width:250px"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formTemlate')">{{wechatInfo.filterTempleteId!=null?"修改":"保存"}}</Button>
					<Button @click="cancel" style="margin-left: 8px">取消</Button>
				</FormItem>
			</Form>
		</Modal>
		<!-- 图片查看 -->
		<Modal v-model="dialogImg" title="上传公众号二维码" @on-ok="uploadImg" @on-cancel="cancel">
			<div style="text-align: center">
				<img :src="logoImage" style="width:150px" alt="logo" />
			</div>
		</Modal>
	</div>
</template>

<script>
	//引入复制功能插件
	import Clipboard from 'clipboard'
	import apiConfig from '@/apiConfig/index.js'
	import utils from '../../utils/dealNullData.js'
	export default {
		data() {
			return {
				apiConfig: apiConfig,
				wechatInfo: {},
				imgUrl: apiConfig.baseURL + this.$api.common_getFile,
				step: 0, //步骤 
				file: null,
				loadingStatus: false,
				uploadStatus: false,
				dialogApp: false,
				dialogH5url: false,
				dialogTemplate: false,
				dialogImg: false,
				qrcode: "",
				logoImage: "",
				partnerId: this.$BASE.Decrypt(this.$route.query.partnerId),
				jumpUrl: "",
				pageUrl: apiConfig.domainURL + "/#/login?partnerId=" + this.$BASE.Decrypt(this.$route.query.partnerId),
				deviceUrl: "?productKey=***&DeviceName=***&SN=***",
				formApp: {
					appId: '',
					appSecret: '',
				},
				ruleApp: {
					appId: [{
						required: true,
						message: '请输入开发者ID(AppID)',
						trigger: 'blur'
					}],
					appSecret: [{
						required: true,
						message: '请输入开发者密码(AppSecret)',
						trigger: 'blur'
					}],
				},
				formUrl: {
					h5Url: '',
				},
				ruleUrl: {
					h5Url: [{
						required: true,
						message: '请输入H5链接地址',
						trigger: 'blur'
					}],
				},
				formTemlate: {
					filterTempleteId: '',
					faultTempleteId: '',
				},
				ruleMessage: {
					faultTempleteId: [{
						required: true,
						message: '请输入故障模板ID',
						trigger: 'blur'
					}],
					filterTempleteId: [{
						required: true,
						message: '请输入滤芯更换模板ID',
						trigger: 'blur'
					}],
				},
			}
		},
		mounted() {
			this.getWechatDetail()
		},
		filters: {
			// 处理空数据
			dealNullData(data) {
				return utils.dealNullData(data)
			}
		},
		methods: {
			handleEdit() {
				this.dialogApp = true
			},
			handleEditUrl() {
				this.dialogH5url = true
			},
			handleSave() {
				this.dialogTemplate = true
			},
			cancel() {
				this.dialogApp = false
				this.dialogH5url = false
				this.dialogTemplate = false
				this.dialogImg = false
			},
			getWechatDetail() {
				let api = this.$api.manage_businessPartner_getWechatAccount;
				this.$Ax.get(api, {
					params: {
						partnerId: this.partnerId
					}
				}).then(res => {
					if (res.success) {
						this.wechatInfo = res.data;
						if (res.data.h5url) {
							this.jumpUrl = (res.data.h5url).split("//")[1].split("/")[0]
							this.step = 7
						}
						this.formApp = {
							appId: res.data.appId,
							appSecret: res.data.secret,
						}
						this.formUrl = {
							h5Url: res.data.h5url,
						}
						this.formTemlate = {
							faultTempleteId: res.data.errorTempleteId,
							filterTempleteId: res.data.filterTempleteId
						}
					} else {
						this.$Message.error(res.message)
					}
				})
			},
			getWechatAccount() {
				let api = this.$api.manage_businessPartner_getWechatAccount;
				this.$Ax.get(api, {
					params: {
						partnerId: this.partnerId
					}
				}).then(res => {
					if (res.success) {
						this.wechatInfo = res.data;
						if (res.data.h5url) {
							this.jumpUrl = (res.data.h5url).split("//")[1].split("/")[0]
						}
					} else {
						this.$Message.error(res.message)
					}
				})
			},
			//文件正则
			handleUpload(file) {
				if (file.type != "text/plain") {
					this.$Message.error("请选择上传正确格式的文件")
					return false;
				}
				this.file = file;
				return false;
			},
			//上传文件
			upload() {
				this.loadingStatus = true;
				const formData = new FormData()
				formData.append('file', this.file);
				formData.append('commonKey', apiConfig.commonKey);
				let api = this.$api.manage_upload_wechatFile;
				this.$upload.post(api, formData).then(res => {
					if (res.data.success) {
						this.loadingStatus = false;
						this.$Message.success("上传成功")
						this.uploadStatus = true;
					} else {
						this.$Message.error(res.message)
					}
				})
			},
			//图片上传
			uploadLogo(file) {
				const isLimit = file.size / 1024 / 1024 < 1
				if (!isLimit) {
					this.$Message.error('上传文件大小不得大于1MB')
					return false
				}
				this.dialogImg = true;
				this.logoImage = window.URL.createObjectURL(file);
				this.qrcode = file;
				return false
			},
			uploadImg() {
				const formData = new FormData()
				formData.append('file', this.qrcode);
				formData.append('partnerId', this.partnerId);
				let api = this.$api.manage_businessPartner_setQrImage;
				this.$upload.post(api, formData).then(res => {
					if (res.data.success) {
						this.$Message.success("上传成功")
						this.getWechatAccount()
					} else {
						this.$Message.error(res.message)
					}
				}).catch(err => {
					console.log(err);
				})
			},
			//复制
			copy() {
				let clipboard = new Clipboard('.tag-read')
				clipboard.on('success', () => {
					this.$Message.success('复制成功')
					// 释放内存
					clipboard.destroy()
				})
				clipboard.on('error', () => {
					// 不支持复制
					alert("不支持此浏览器");
					// 释放内存
					clipboard.destroy()
				})
			},
			//下一步
			pre(num) {
				this.step = num;
			},
			//下一步
			next(num) {
				switch (num) {
					case 1:
						if (!this.formApp.appId || !this.formApp.appSecret) {
							this.$Message.error("请先完善公众号基础信息")
							return false
						}
						this.step = num;
						break;
					case 2:
						if (!this.formUrl.h5Url) {
							this.$Message.error("请先输入H5地址，并保存")
							return false
						}
						if (!this.wechatInfo.qrImage) {
							this.$Message.error("请上传公众号二维码")
							return false
						}
						this.step = num;
						break;
					case 3:
						this.step = num;
						break;
					case 4:
						this.step = num;
						break;
					case 5:
						this.step = num;
						break;
					case 6:
						this.step = num;
						break;
					case 7:
						// if (!this.formTemlate.filterTempleteId || !this.formTemlate.faultTempleteId) {
						// 	this.$Message.error("请上传消息模板ID")
						// 	return false
						// }
						this.$Modal.confirm({
							title: '提示',
							content: '<p>确定已完成微信配置</p>',
							onOk: () => {
								this.step = num;
							},
							onCancel: () => {}
						});
						break;
					case 8:
						this.step = 0;
						break;
				}
			},
			handleSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let api;
						let para;
						if (formName == "formApp") {
							api = this.$api.manage_businessPartner_createWechatAccount;
							para = {
								partnerId: this.partnerId,
								...this.formApp
							}
						}
						if (formName == "formUrl") {
							api = this.$api.manage_businessPartner_setH5url;
							para = {
								partnerId: this.partnerId,
								...this.formUrl
							}
						}
						if (formName == "formTemlate") {
							api = this.$api.manage_businessPartner_setTemplete
							para = {
								partnerId: this.partnerId,
								...this.formTemlate
							}
						}
						this.$Ax.post(api, para).then(res => {
							if (res.success) {
								this.$Message.success("新增成功")
								this.getWechatAccount()
								this.cancel()
							}
						})
					}
				})
			},
		}
	}
</script>

<style lang="less">
	.wechatSet {
		.step {
			margin: 20px 0px;
		}

		.messageBox {
			display: inline-block;
			vertical-align: top;
			width: 39%;
			margin-left: 1%;

			.wechatUrl {
				line-height: 40px;
				font-weight: bolder;
			}

			.procedure {
				line-height: 40px;
				font-weight: bolder;
			}

			.timeline {
				margin-left: 15px;
			}

			.domain {
				list-style: none;

				li {
					line-height: 40px;
					margin-left: 15px;
				}
			}

			.hint {
				color: #999999;
				line-height: 30px;
				margin-left: 15px;
			}

			.time {
				font-size: 14px;
				font-weight: bold;
			}

			.content {
				padding-left: 5px;
			}

			.next {
				margin-left: 10px;
			}


			.qrCode {
				display: inline-block;
				width: 140px;
				height: 180px;
				border-radius: 4px;
				overflow: hidden;
				vertical-align: top;
				margin: 10px 0px 0px 10px;

				img {
					width: 100%;
					height: 140px;
					border: 1px solid #eee;
				}

				.hint {
					text-align: center;
					color: #666666;
					font-size: 12px;
				}

				.link {
					color: #3399ff;
					cursor: pointer;
				}
			}
		}

		.achieve {
			text-align: center;

			.headline {
				text-align: center;
				font-size: 20px;
				line-height: 40px;
				color: #000000;
			}

			.subtitle {
				font-size: 15px;
				line-height: 40px;
				color: #000000;
			}

			.content {
				font-size: 15px;
				line-height: 40px;
				color: #333333;
				text-align: center;

				img {
					width: 210px;
				}
			}
		}

		.reference {
			display: inline-block;
			text-align: center;
			width: 60%;

			img {
				width: 100%;
				border: 1px solid #ccc;
				border-radius: 8px 8px;
			}
		}

		.marginTop {
			margin-top: 20px;
		}

		.remind {
			text-align: center;
		}
	}
</style>
