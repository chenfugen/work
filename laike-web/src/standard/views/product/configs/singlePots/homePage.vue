<template>
	<el-card id="singlePot">
		<div class="cardBody">
			<el-steps class="steps" :active="step">
				<el-step title="详情页面"></el-step>
				<el-step title="次级页面"></el-step>
				<el-step title="更多"></el-step>
			</el-steps>
			<div class="mainBox marginT20">
				<!-- 示意图 -->
				<div class="phoneBox">
					<img
						class="phone"
						src="../../../../assets/img/template_singlePot.png"
					/>
					<div class="mark markBg">背景图片</div>
					<span class="mark markDevice">设备图片</span>
				</div>
				<!-- 背景 -->
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
					<div class="tips">
						支持扩展名：.PNG； 尺寸要求：750*750；
						<span class="red">TBD</span>
					</div>
				</div>
				<!-- 设备 -->
				<div class="phoneBox">
					<div class="title">设备图片</div>
					<el-upload
						ref="deviceImg"
						class="deviceImg-uploader"
						action="useless"
						:show-file-list="false"
						:limit="1"
						:auto-upload="false"
						:on-change="
							(file, filesList) => handleChoseFile(file, 'device')
						"
					>
						<img
							v-if="deviceBase64"
							:src="deviceBase64"
							class="deviceImg"
						/>
						<i
							v-else
							class="el-icon-plus deviceImg-uploader-icon"
						></i>
					</el-upload>
				</div>
			</div>
		</div>
		<div class="marginT20 clearfloat">
			<el-button class="left" @click="handleBack()"> 返回 </el-button>
			<el-button
				class="right"
				@click="handleNext()"
				:disabled="step == 3"
			>
				下一步
			</el-button>
		</div>
		<!-- <img src="" alt=""> -->
	</el-card>
</template>

<script>
import { Message } from "element-ui";
export default {
	name: "singlePot",
	data() {
		return {
			step: 1,
			bgBase64: "",
			bgFile: "",
			deviceBase64: "",
			deviceFile: "",
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
		handleNext: function () {
			this.$parent.$parent.handleSave();
		},
	},
};
</script>

<style>
#singlePot {
	background: #fff;
}
.cardBody {
	margin: 0 auto;
}
.mainBox {
	height: 500px;
	vertical-align: top;
}
#singlePot .phoneBox {
	vertical-align: top;
	display: inline-block;
	width: 270px;
	height: 490px;
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
	height: 486px;
	border: 2px solid #ccc;
}
.radio {
	margin-top: 10px;
}
.mark {
	width: 65px;
	height: 30px;
	text-align: center;
	position: absolute;
	line-height: 30px;
	font-size: 14px;
	color: #fff;
	border-radius: 5px;
	font-weight: 700;
	background-color: red;
}
.markBg {
	top: 80px;
	left: 100px;
}

.markDevice {
	top: 165px;
	left: 100px;
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
.deviceImg-uploader {
	margin-left: 50px;
}
.deviceImg-uploader .el-upload {
	border: 2px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.deviceImg-uploader .el-upload:hover {
	border-color: #409eff;
}
.deviceImg-uploader-icon {
	font-size: 35px;
	color: #8c939d;
	width: 170px;
	height: 170px;
	line-height: 170px;
	text-align: center;
}
.deviceImg {
	width: 170px;
	height: 170px;
	display: block;
}
.red {
	color: red;
}
</style>