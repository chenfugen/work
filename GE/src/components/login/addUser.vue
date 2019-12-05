<template>
	<div class="peopleMsg">
		<van-cell-group style="margin-top:0.1rem;border:none;">
			<div class="van-cell van-field" is-link style="line-height: 50px;">
				<div class="van-cell__title"><span>头像</span></div>
				<div class="van-cell__value" @click="uploadHead">
					<img :src="headerImg" class="buddna" />
				</div>
				<i class="van-icon van-icon-arrow van-cell__right-icon" style="line-height: 50px;"></i>
			</div>
			<van-field v-model="userInfo.nickName" clear input-align="right" label="昵称" placeholder="请输入昵称" />
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label"><span>姓名</span></div>
				<div class="van-cell__value">
					<div class="van-field__body"><input type="text" v-model="userInfo.realName" v-fixedInput clear="" placeholder="请输入姓名" class="van-field__control van-field__control--right"></div>
				</div>
			</div>
			<van-field v-model="sex" clear label="性别" is-link input-align="right" @click="showSex" placeholder="请选择性别" readonly/>
			<van-field v-model="area" clear label="区域" is-link input-align="right" @click="showArea" placeholder="请选择区域" readonly/>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label"><span>详细地址</span></div>
				<div class="van-cell__value">
					<div class="van-field__body"><input type="text" v-fixedInput v-model="userInfo.address" clear="" placeholder="请输入详细地址" class="van-field__control van-field__control--right"></div>
				</div>
			</div>
		</van-cell-group>
		<div class="save">
			<van-button  @click="save" :disabled="isDisable" >完成</van-button>
		</div>
		<!--性别-->
		<van-actionsheet v-model="sexShow" :actions="actions" cancel-text="取消" @select="onSelect" @cancel="onCancel" />
		<!--头像-->
		<!--<van-actionsheet v-model="uploadShow" :actions="uploadSelelct" cancel-text="取消" @select="uploadImg" @cancel="onCancel" />-->
		<van-popup v-model="uploadShow" position="bottom" :overlay="true">
			<div style="background:#eef3fa">
				<div class="van-actionsheet__item van-hairline--top">
					<van-uploader :after-read="onRead" class='camera'>相册</van-uploader>
				</div>
				<!--<div class="van-actionsheet__item van-hairline--top" @click="cameraFile">
					<input type="file" accept="image/*" id="camera" capture="camera" style="width:0px;">拍摄</div>-->
				<div class="van-actionsheet__cancel" @click="onCancel">取消</div>
			</div>
		</van-popup>
		<!--省市区三联动-->
		<van-popup v-model="areaShow" position="bottom">
			<van-area :area-list="areaList" @cancel="onCancel" @confirm="onConfirm" cancel :columns-num="3" />
		</van-popup>
	</div>
</template>

<script>
	import Exif from 'exif-js'
	export default {
		inject: ['reload'],
		data() {
			return {
				userInfo: {
					nickName: "",
					realName: "",
					sex: "",
					address: "",
					province: "",
					provinceId: "",
					city: "",
					cityId: "",
					region: "",
					regionId: "",
					fileId: "",
				},
				isDisable:false,
				sex: "",
				area: "",
				headerImg: "../../../static/image/avatar_112.png",
				areaList: {
					province_list: "",
					city_list: "",
					county_list: "",
				},
				areaShow: false,
				sexShow: false,
				uploadShow: false,
				actions: [{
						name: '男',
						value: 1
					},
					{
						name: '女',
						value: 2
					},
					{
						name: '保密',
						value: 3
					}
				],
				uploadSelelct: [{
					name: '相册'
				}, {
					name: '拍摄'
				}]
			}
		},
		mounted() {
			this.getUser();
			this.getAreaList();		
		},
		methods: {
			getAreaList() {
				this.$Ax.get('common/getAddressList?commonKey=' + this.$store.state.commonKey).then((res) => {
					if(res.data.success) {
						this.areaList.province_list = {};
						this.areaList.city_list = {};
						this.areaList.county_list = {};
						res.data.data.region.forEach((item) => {
							this.areaList.province_list[item.provinceId] = item.provinceName;
							this.areaList.city_list[item.cityId] = item.cityName;
							this.areaList.county_list[item.regionId] = item.regionName;
						})
					} else {
						this.$toast(res.data.message);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			getUser() {
				this.$Ax.get('wechat/user/register/getWxUserInfo', {
					params: {
						"accessKey": this.$store.state.accessKey,
						"refreshToken": this.$cookies.get("refreshToken"),
						"customerId": "GE"
					}
				}).then((res) => {
					if(res.data.success) {
						this.headerImg = res.data.data.headUrl;
						this.userInfo.fileId = res.data.data.headUrl;
						this.userInfo.nickName = res.data.data.nickName;
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			showArea() {
				this.areaShow = !this.areaShow;
			},
			onConfirm(value, index) {
				this.userInfo.province = value[0].name;
				this.userInfo.city = value[1].name;
				this.userInfo.region = value[2].name;
				this.userInfo.provinceId = value[0].code;
				this.userInfo.cityId = value[1].code;
				this.userInfo.regionId = value[2].code;
				this.area = this.userInfo.province + this.userInfo.city + this.userInfo.region;
				this.areaShow = false;
			},
			onCancel() {
				this.areaShow = false;
				this.sexShow = false;
				this.uploadShow = false;
			},
			showSex() {
				this.sexShow = !this.sexShow;
			},
			onSelect(item) {
				this.userInfo.sex = item.value;
				this.sex = item.name;
				this.sexShow = !this.sexShow;
			},
			uploadHead() {
				this.uploadShow = !this.uploadShow;
			},
			onRead(event) {
				this.imgPreview(event.file);
				this.fileName = event.file.name;
				this.$toast.loading({
					mask: true,
					duration: 2000,
					message: '上传图片中...'
				});
				this.uploadShow = false;
			},
			imgPreview(file) {
				let self = this;
				let Orientation;
				//去获取拍照时的信息，解决拍出来的照片旋转问题
				Exif.getData(file, function() {
					Orientation = Exif.getTag(this, 'Orientation');
				});
				// 看支持不支持FileReader
				if(!file || !window.FileReader) return;

				if(/^image/.test(file.type)) {
					// 创建一个reader
					let reader = new FileReader();
					// 将图片2将转成 base64 格式
					reader.readAsDataURL(file);
					// 读取成功后的回调
					reader.onloadend = function() {
						let result = this.result;
						let img = new Image();
						img.src = result;
						//判断图片是否大于100K,是就直接上传，反之压缩图片	
						img.onload = function() {
							let data = self.compress(img, Orientation);
							self.headerImg = data;
							let compassFile = self.dataURLtoFile(data, self.fileName);
							self.upload(compassFile);
						}
					}
				}
			},
			upload(e) {
				var fromData = new FormData();
				fromData.append("file", e);
				fromData.append("commonKey", this.$store.state.commonKey);
				this.$Upload.post('common/upload/file', fromData).then((res) => {
					if(res.data.success) {
						this.userInfo.fileId = res.data.data;
					} else {
						this.$toast(res.data.message)
					}
				}).catch((res) => {
					console.log(res.message);
				});
			},
			dataURLtoFile(dataurl, filename) { //将base64转换为文件
				var arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while(n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new File([u8arr], filename, {
					type: mime
				});
			},
			rotateImg(img, direction, canvas) {
				//最小与最大旋转方向，图片旋转4次后回到原方向    
				const min_step = 0;
				const max_step = 3;
				if(img == null) return;
				//img的高度和宽度不能在img元素隐藏后获取，否则会出错    
				let height = img.height;
				let width = img.width;
				let step = 2;
				if(step == null) {
					step = min_step;
				}
				if(direction == 'right') {
					step++;
					//旋转到原位置，即超过最大值    
					step > max_step && (step = min_step);
				} else {
					step--;
					step < min_step && (step = max_step);
				}
				//旋转角度以弧度值为参数    
				let degree = step * 90 * Math.PI / 180;
				let ctx = canvas.getContext('2d');
				switch(step) {
					case 0:
						canvas.width = width;
						canvas.height = height;
						ctx.drawImage(img, 0, 0);
						break;
					case 1:
						canvas.width = height;
						canvas.height = width;
						ctx.rotate(degree);
						ctx.drawImage(img, 0, -height);
						break;
					case 2:
						canvas.width = width;
						canvas.height = height;
						ctx.rotate(degree);
						ctx.drawImage(img, -width, -height);
						break;
					case 3:
						canvas.width = height;
						canvas.height = width;
						ctx.rotate(degree);
						ctx.drawImage(img, -width, 0);
						break;
				}
			},
			compress(img, Orientation) {
				let canvas = document.createElement("canvas");
				let ctx = canvas.getContext('2d');
				//瓦片canvas
				let tCanvas = document.createElement("canvas");
				let tctx = tCanvas.getContext("2d");
				let initSize = img.src.length;
				let width = img.width;
				let height = img.height;
				//如果图片大于四百万像素，计算压缩比并将大小压至400万以下
				let ratio;
				if((ratio = width * height / 4000000) > 1) {
					console.log("大于400万像素")
					ratio = Math.sqrt(ratio);
					width /= ratio;
					height /= ratio;
				} else {
					ratio = 1;
				}
				canvas.width = width;
				canvas.height = height;
				//        铺底色
				ctx.fillStyle = "#fff";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				//如果图片像素大于100万则使用瓦片绘制
				let count;
				if((count = width * height / 1000000) > 1) {
					console.log("超过100W像素");
					count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
					//            计算每块瓦片的宽和高
					let nw = ~~(width / count);
					let nh = ~~(height / count);
					tCanvas.width = nw;
					tCanvas.height = nh;
					for(let i = 0; i < count; i++) {
						for(let j = 0; j < count; j++) {
							tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
							ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
						}
					}
				} else {
					ctx.drawImage(img, 0, 0, width, height);
				}
				//修复ios上传图片的时候 被旋转的问题
				if(Orientation != "" && Orientation != 1) {
					switch(Orientation) {
						case 6: //需要顺时针（向左）90度旋转
							this.rotateImg(img, 'left', canvas);
							break;
						case 8: //需要逆时针（向右）90度旋转
							this.rotateImg(img, 'right', canvas);
							break;
						case 3: //需要180度旋转
							this.rotateImg(img, 'right', canvas); //转两次
							this.rotateImg(img, 'right', canvas);
							break;
					}
				}
				//进行最小压缩
				let ndata = canvas.toDataURL('image/jpeg', 0.1);
				tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
				return ndata;
			},
			cameraFile() {
				var file = document.getElementById("camera").files[0];
				if(file.size > 512000) {
					this.$toast("上传文件过大");
					return false
				}
				this.uploadShow = false;
				var windowURL = window.URL || window.webkitURL;        
				//创建图片文件的url		        
				this.headerImg = windowURL.createObjectURL(event.file);
				var fromData = new FormData();
				fromData.append("file", event.file);
				fromData.append("commonKey", this.$store.state.commonKey);
				this.$Upload.post('common/upload/file', fromData).then((res) => {
					if(res.data.success) {
						this.userInfo.fileId = res.data.data;
					} else {
						this.$toast(res.data.message)
					}
				}).catch((res) => {
					console.log(res.message);
				});
			},
			onClickLeft() {
				this.$router.go(-1);
			},
			save() {
				if(this.userInfo.nickName == "") {
					this.$toast("请填写用户昵称");
					return false;
				}
				if(this.userInfo.nickName != null) {
					this.userInfo.nickName = this.userInfo.nickName.replace(/^\s*|\s*$/g, "");
				}
				if(this.userInfo.realName != null) {
					this.userInfo.realName = this.userInfo.realName.replace(/^\s*|\s*$/g, "");
				}
				if(this.userInfo.address != null) {
					this.userInfo.address = this.userInfo.address.replace(/^\s*|\s*$/g, "");
				}
				this.isDisable=true;
				this.userInfo.name = this.userInfo.realName;
				this.$Axios.post('wechat/user/fill/userInfo', this.userInfo).then((res) => {
					if(res.data.success) {
						this.$cookies.set('userId',res.data.data.userId);
						this.$toast("保存成功")
						this.$router.push("/device");
					} else {
						this.$toast(res.data.message)
					}
				}).catch((res) => {
					console.log(res.message);
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.peopleMsg {
		.van-nav-bar .van-icon {
			color: #323233;
		}
		.buddna {
			float: right;
			width: 0.5rem;
			height: 0.5rem;
			border: 1px solid #eee;
			border-radius: 50%;
			overflow: hidden;
		}
		.camera {
			width: 100%;
			height: 100%
		}
		.save {
			padding: 0.2rem 0.15rem;
			text-align: center;
		}
		.save button {
			display: block;
			width: 100%;
			background: #005EB8;
			color: white;
		}
	}
</style>