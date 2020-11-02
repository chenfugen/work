<template>
	<el-card class="addParent">
		<div slot="header">
			<span class="pageTitle">创建菜谱概要</span>
		</div>
		<div class="main">
			<!-- 表单 -->
			<el-form inline label-width="120px">
				<div class="clearfloat">
					<div class="formBoxLeft left">
						<el-form-item label="产品类型"></el-form-item>
						<el-form-item label="菜谱模版"></el-form-item>
						<el-form-item label="内置菜"></el-form-item>
						<el-form-item label="菜谱类型"></el-form-item>
						<el-form-item
							class="block"
							label="推荐菜"
						></el-form-item>
						<el-form-item
							class="block"
							label="菜谱ID"
						></el-form-item>
						<el-form-item
							class="block"
							label="菜谱名称"
						></el-form-item>
						<el-form-item
							class="block"
							label="美食家"
						></el-form-item>
						<el-form-item
							class="block"
							label="食材分类"
						></el-form-item>
						<el-form-item class="block" label="菜系"></el-form-item>
						<el-form-item
							class="block"
							label="可预约"
						></el-form-item>
						<el-form-item
							class="block"
							label="关键字"
						></el-form-item>
					</div>
					<!-- 图片上传 -->
					<div class="imageBox right">
						<!-- BIG -->
						<el-upload
							ref="image"
							class="bigImg-uploader"
							style="width: 256px; height: 393px"
							:show-file-list="false"
							:auto-upload="false"
							action=""
							:limit="1"
							:on-change="
								(file, filesList) => handleChoseFile(file)
							"
							accept=".png"
						>
							<div class="uploadTip" slot="tip">
								<p>Pad菜谱列表使用，如不使用可不上传</p>
								<p>支持扩展名 .jpg</p>
							</div>
							<img v-if="base64" :src="base64" class="bigImg" />
							<i v-else class="el-icon-plus icon"></i>
						</el-upload>
						<!-- SMALL -->
						<el-upload
							ref="image"
							class="smallImg-uploader"
							style="width: 256px; height: 256px"
							:show-file-list="false"
							:auto-upload="false"
							action=""
							:limit="1"
							:on-change="
								(file, filesList) => handleChoseFile(file)
							"
							accept=".png"
						>
							<div class="uploadTip" slot="tip">
								<p>Pad、APP菜谱列表使用，如不使用可不上传</p>
							</div>
							<img v-if="base64" :src="base64" class="smallImg" />
							<i v-else class="el-icon-plus icon"> </i>
						</el-upload>
					</div>
				</div>
				<el-form-item class="block" label="菜谱要点">
					<el-input type="textarea" class="texta" rows="3"></el-input>
				</el-form-item>
				<el-form-item class="block" label="营养价值">
					<el-input type="textarea" class="texta" rows="3"></el-input>
				</el-form-item>
				<div class="clearfloat">
					<el-button class="left">返回</el-button>
					<el-button class="right" type="primary" @click="handleNext">
						下一步
					</el-button>
				</div>
			</el-form>
		</div>
	</el-card>
</template>

<script>
export default {
	name: "addParent",
	data() {
		return {
			base64: "",
		};
	},
	methods: {
		handleNext: function () {
			this.$router.push({
				path: "/menuStandard/addChild",
			});
		},
	},
};
</script>

<style scoped>
.addParent {
	padding: 0 20px;
}
.addParent .pageTitle {
	font-size: 20px;
	font-weight: 600;
}
.formBoxLeft {
	max-width: 400px;
}

.imageBox {
	width: 700px;
	height: 500px;
	vertical-align: bottom;
}

.bigImg-uploader {
	display: inline-block;
	border: 1px dashed #d9d9d9;
	vertical-align: bottom;
}
.bigImg-uploader .el-upload {
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.bigImg-uploader .el-upload:hover {
	border-color: #409eff;
}
.bigImg-uploader .icon {
	font-size: 28px;
	color: #8c939d;
	width: 256px;
	height: 393px;
	line-height: 393px;
	text-align: center;
}
.bigImg {
	width: 256px;
	height: 393px;
	display: block;
}

.smallImg-uploader {
	margin-left: 20px;
	display: inline-block;
	border: 1px dashed #d9d9d9;
	vertical-align: bottom;
}
.smallImg-uploader .el-upload {
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.smallImg-uploader .el-upload:hover {
	border-color: #409eff;
}
.smallImg-uploader .icon {
	font-size: 28px;
	color: #8c939d;
	width: 256px;
	height: 256px;
	line-height: 256px;
	text-align: center;
}
.smallImg {
	width: 256px;
	height: 256px;
	display: block;
}
.uploadTip {
	color: #ccc;
	font-size: 13px;
	margin-top: 6px;
}
.texta {
	width: 800px;
}
</style>