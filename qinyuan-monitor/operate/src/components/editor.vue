<template>
	<!-- 子组建 -->
	<div class="editor">
		<div ref="toolbar" class="toolbar">
			<!-- 头部 -->
		</div>
		<div ref="editor" class="editor-text">
			<!-- 内容 -->
		</div>
	</div>
</template>

<script>
	import E from 'wangeditor' //引用

	export default {
		name: 'Editorbar',
		data() {
			return {
				editor: null,
			}
		},	
		props: {
			content: {
				type: String
			},
		},
		watch: {
			content(newOne, oldOne) {
				this.editor.txt.html(newOne)
			}
		},
		mounted() {
			this.seteditor();
		},
		methods: {
			//获取编辑器中内容
			getContent() {
				return this.editor.txt.html()
			},
			setContent() {
				this.editor.txt.html(this.content)
			},
			clearContent() {
				this.editor.txt.clear()
			},
			seteditor() {
				this.editor = new E(this.$refs.toolbar, this.$refs.editor);

				this.editor.customConfig.uploadImgShowBase64 = true; // base 64 存储图片
				this.editor.customConfig.uploadImgServer = ''; // 配置服务器端地址
				this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
				this.editor.customConfig.uploadFileName = ''; // 后端接受上传文件的参数名
				this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
				this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
				this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

				// 配置菜单
				this.editor.customConfig.menus = [
					'head', // 标题
					'bold', // 粗体
					'fontSize', // 字号
					'fontName', // 字体
					'italic', // 斜体
					'underline', // 下划线
					'strikeThrough', // 删除线
					'foreColor', // 文字颜色
					'backColor', // 背景颜色
					'link', // 插入链接
					'list', // 列表
					'justify', // 对齐方式
					'quote', // 引用
					'emoticon', // 表情
					'image', // 插入图片
					'table', // 表格
					'video', // 插入视频
					'code', // 插入代码
					'undo', // 撤销
					'redo' // 重复
				]

				this.editor.customConfig.uploadImgHooks = {
					fail: (xhr, editor, result) => {
						this.$message({
							message: "上传图片失败",
							type: 'warning'
						});
					},
					success: (xhr, editor, result) => {
						// 图片上传成功回调
						this.$message({
							message: "上传图片成功",
							type: 'warning'
						});
					},
					timeout: (xhr, editor) => {
						// 网络超时的回调
						this.$message({
							message: "上传图片超时",
							type: 'warning'
						});
					},
					error: (xhr, editor) => {
						// 图片上传错误的回调
						this.$message({
							message: "上传图片出错",
							type: 'warning'
						});
					},
					customInsert: (insertImg, result, editor) => {
						// 图片上传成功，插入图片的回调
						let url = result.data[0]
						// window.serverUrl 是nginx图片服务器地址
						// url 是后台返回的上传图片的路径
						insertImg(window.serverUrl + url)
					}
				}
				// this.editor.customConfig.onchange = (html) => {
				// 		this.content = html;
				// 		this.$emit('content', html); //将内容上传到父组件里
				// 	},
				// 创建富文本编辑器
				this.editor.create()
				// 富文本内容
				this.editor.txt.html(this.content)
			}
		}
	}
</script>

<style scoped>
	.editor {
		border: 1px solid #ccc;
	}

	.toolbar {
		border-bottom: 1px solid #ccc;
	}

	/* .w-e-toolbar {
		flex-wrap: wrap;
	} */

	.editor-text {
		height: 300px;
		overflow-y:auto;
	}
</style>
