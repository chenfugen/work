<template>
	<el-card id="TC501FirstStep">
		<div slot="header">详情页面 1/3</div>
		<div class="cardBody">
			<div class="mainBox marginT20">
				<!-- 示意图 -->
				<div class="phoneBox">
					<img class="phone" src="../../../../assets/img/TC501/info1.png" />
				</div>
				<!-- 背景图片 -->
				<div class="phoneBox">
					<div class="title">背景图片</div>
					<el-upload
						ref="bgImg"
						class="bgImg-uploader"
						action="useless"
						:show-file-list="false"
						:limit="1"
						accept=".png"
						:auto-upload="false"
						:on-change="
							(file, filesList) => handleChoseFile(file, 'bg')
						"
					>
						<img v-if="bgBase64" :src="bgBase64" class="bgImg" />
						<i v-else class="el-icon-plus bgImg-uploader-icon"></i>
					</el-upload>
					<div class="tips">支持扩展名：.PNG； 尺寸要求：750*750；</div>
				</div>
				<!-- 产品图片 -->
				<div class="phoneBox">
					<div class="title">产品图片</div>
					<el-upload
						ref="productImg"
						class="productImg-uploader"
						action="useless"
						:show-file-list="false"
						accept=".png"
						:limit="1"
						:auto-upload="false"
						:on-change="
							(file, filesList) =>
								handleChoseFile(file, 'product')
						"
					>
						<img v-if="productBase64" :src="productBase64" class="productImg" />
						<i v-else class="el-icon-plus productImg-uploader-icon"></i>
					</el-upload>
					<div class="tips">支持扩展名：.PNG； 尺寸要求：750*750；</div>
				</div>
			</div>
		</div>
	</el-card>
</template>

<script>
import { Message } from "element-ui";
export default {
	name: "TC501FirstStep",
	props: {
		productId: {
			type: String,
			default: () => {
				return "";
			},
		},
		infoData: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	watch: {
		infoData: {
			deep: true,
			handler(val) {
				if (val.innerImageFilename) {
					this.productBase64 =
						this.$store.state.standard.fileLoad +
						val.innerImageFilename;
				}
				if (val.outerImageFilename) {
					this.bgBase64 =
						this.$store.state.standard.fileLoad +
						val.outerImageFilename;
				}
			},
		},
	},
	data() {
		return {
			bgBase64: "",
			bgFile: "", // outerImageFilename
			productBase64: "",
			productFile: "", // innerImageFilename
			activeName: "info",
		};
	},
	methods: {
		// 图片选择时
		handleChoseFile: function (file, flag) {
			let _this = this,
				reader = new FileReader(),
				image = new Image(),
				base64 = null;
			image.onload = function () {
				if (
					(image.width != 750 || image.height != 750) &&
					flag == "bg"
				) {
					Message.error("图片尺寸错误");
					_this.$refs[flag + "Img"].clearFiles();
				} else {
					_this[flag + "Base64"] = base64;
					_this[flag + "File"] = file.raw;
					_this.$refs[flag + "Img"].clearFiles();
				}
			};
			reader.onload = function (e) {
				base64 = e.target.result;
				image.src = base64;
			};
			reader.readAsDataURL(file.raw);
		},
		// 提交表单
		handleSubmit: function () {
			return {
				bgFile: this.bgFile,
				productFile: this.productFile,
			};
		},
	},
};
</script>

<style>
#TC501FirstStep {
	background: #fff;
}
.cardBody {
	margin: 0 auto;
}
.mainBox {
	height: 600px;
	vertical-align: top;
}
#TC501FirstStep .phoneBox {
	vertical-align: top;
	display: inline-block;
	width: 270px;
	height: 556px;
	position: relative;
	margin-left: 40px;
}
.phoneBox .title {
	text-align: center;
	margin-bottom: 20px;
	font-size: 16px;
}

.phoneBox .tips {
	margin-top: 20px;
	font-size: 12px;
	color: #ccc;
}
.phone {
	width: 270px;
	height: 556px;
	border: 2px solid #ccc;
}
.radio {
	margin-top: 10px;
}
.bgImg-uploader .el-upload {
	border: 2px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.bgImg-uploader .el-upload:hover {
	border-color: #409eff;
}
.bgImg-uploader-icon {
	font-size: 42px;
	color: #8c939d;
	width: 270px;
	height: 270px;
	line-height: 270px;
	text-align: center;
}
.bgImg {
	width: 270px;
	height: 270px;
	display: block;
}
.productImg-uploader .el-upload {
	border: 2px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.productImg-uploader .el-upload:hover {
	border-color: #409eff;
}
.productImg-uploader-icon {
	font-size: 35px;
	color: #8c939d;
	width: 270px;
	height: 270px;
	line-height: 270px;
	text-align: center;
}
.productImg {
	width: 270px;
	height: 270px;
	display: block;
}
.red {
	color: red;
}
</style>