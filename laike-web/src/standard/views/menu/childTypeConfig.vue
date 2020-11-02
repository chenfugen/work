<template>
	<el-card class="childTypeConfig">
		<!-- 操作栏 -->
		<div class="clearfloat">
			<el-button
				type="primary"
				size="small"
				class="right"
				@click="handleAdd"
			>
				新增
			</el-button>
		</div>
		<!-- 表格 -->
		<el-table class="marginT20" :data="tableData" style="width: 100%">
			<el-table-column type="index" fixed="left"> </el-table-column>
			<!-- 缩略图 -->
			<el-table-column fixed="left">
				<!-- <template slot-scope="scope"> -->
				<template>
					<el-popover
						style="margin-right: 0"
						placement="bottom"
						trigger="hover"
					>
						<el-image
							slot="reference"
							style="margin-top: 11px; cursor: pointer"
							width="80"
							lazy
							src="../../../assets/img/template_one.png"
						/>
						<el-image
							style="margin-top: 11px; width: 188px"
							src="../../../assets/img/template_one.png"
						/>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="分类名称" prop="name"> </el-table-column>
			<el-table-column label="归属" align="center" prop="desc">
			</el-table-column>
			<el-table-column label="模板" align="center" prop="">
			</el-table-column>
			<el-table-column label="创建时间" align="center" prop="">
			</el-table-column>
			<el-table-column label="更新时间" align="center" prop="">
			</el-table-column>
			<el-table-column label="操作者" align="center" prop="">
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				width="200"
				fixed="right"
			>
				<template slot-scope="scope">
					<el-link
						class="tableBtn"
						:underline="false"
						size="mini"
						type="primary"
						@click.native.prevent="handleEdit(scope.row)"
					>
						编辑
					</el-link>
					<el-link
						class="tableBtn"
						:underline="false"
						size="mini"
						type="danger"
						@click.native.prevent="handleDelete(scope.row)"
					>
						删除
					</el-link>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination
			class="pagination marginT20"
			align="right"
			background
			@size-change="(pageSize) => getList('pageSize', pageSize)"
			@current-change="(page) => getList('page', page)"
			:current-page.sync="tableFilter.pageNumber"
			:page-sizes="[10, 20, 30, 40]"
			:page-size.sync="tableFilter.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		>
		</el-pagination>
		<!-- 弹窗 -->
		<el-dialog
			title="提示"
			width="50%"
			:visible.sync="dialogVisible"
			:before-close="handleClose"
		>
			<!-- 表单 -->
			<el-form v-model="form" label-width="150px" :rules="rules">
				<el-form-item label="模版名称">
					<span>{{ this.category.menuTempName }}</span>
				</el-form-item>
				<el-form-item label="归属">
					<span>{{ this.category.name }}</span>
				</el-form-item>
				<el-form-item label="分类名称" prop="name">
					<el-input class="formInput" v-model="form.name"></el-input>
				</el-form-item>
				<!-- 分类图片 -->
				<el-form-item label="分类图片" prop="imageFilename">
					<div>
						<el-upload
							ref="image"
							class="pmImg-uploader"
							:show-file-list="false"
							:auto-upload="false"
							action="#"
							:limit="1"
							:on-change="
								(file, filesList) => handleChoseFile(file)
							"
							accept=".jpg"
							style="width: 148px; height: 148px"
						>
							<i
								slot="default"
								class="el-icon-plus pmImg-uploader-icon"
							></i>
							<div slot="file" slot-scope="{ file }">
								<img
									class="el-upload-list__item-thumbnail"
									:src="file.url"
									alt=""
								/>
							</div>
						</el-upload>
						<div class="el-upload__tip">图片支持jpg，尺寸1:1</div>
					</div>
				</el-form-item>
				<!-- 颜色配置 -->
				<el-form-item
					v-if="this.category.colorConfig == 1"
					label="颜色配置"
					prop="color"
				>
					<el-radio-group v-model="form.color">
						<el-radio
							class="radio"
							v-for="item in colorList"
							:key="item.label"
							:label="item.label"
							:style="{ color: item.rgba }"
							><font
								:style="{
									background: item.rgba,
									color: item.color,
									'border-radius': '6px',
									padding: '4px 8px',
								}"
							>
								{{ item.font }}
							</font></el-radio
						>
					</el-radio-group>
				</el-form-item>
				<!-- 激活图片 -->
				<el-form-item label="分类ICON" prop="activeIcon">
					<div class="uploadBox">
						<!-- 激活图片 -->
						<el-upload
							ref="image"
							class="pmImg-uploader"
							:show-file-list="false"
							:auto-upload="false"
							action="#"
							:limit="1"
							:on-change="
								(file, filesList) => handleChoseFile(file)
							"
							accept=".jpg"
							style="width: 148px; height: 148px"
						>
							<i
								slot="default"
								class="el-icon-plus pmImg-uploader-icon"
							></i>
							<div slot="file" slot-scope="{ file }">
								<img
									class="el-upload-list__item-thumbnail"
									:src="file.url"
									alt=""
								/>
							</div>
						</el-upload>
						<div class="el-upload__tip">
							ico 格式；1:1尺寸 激活状态
						</div>
					</div>
				</el-form-item>
				<!-- 未激活图片 -->
				<el-form-item label="分类ICON" prop="unactiveIcon">
					<el-upload
						ref="image"
						class="pmImg-uploader"
						:show-file-list="false"
						:auto-upload="false"
						action="#"
						:limit="1"
						:on-change="(file, filesList) => handleChoseFile(file)"
						accept=".jpg"
						style="width: 148px; height: 148px"
					>
						<i
							slot="default"
							class="el-icon-plus pmImg-uploader-icon"
						></i>
						<div slot="file" slot-scope="{ file }">
							<img
								class="el-upload-list__item-thumbnail"
								:src="file.url"
								alt=""
							/>
						</div>
					</el-upload>
					<div class="el-upload__tip">
						ico 格式；1:1尺寸 未激活状态
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false">
					确 定
				</el-button>
			</span>
		</el-dialog>
	</el-card>
</template>

<script>
import formComp from "../../components/form.vue";
export default {
	name: "childTypeConfig",
	data() {
		return {
			dialogVisible: false,
			total: 0,
			category: {},
			form: {
				productTypeId: "",
				menuTagId: "",
				name: "",
				color: "",
			},
			tableFilter: {
				pageNumber: 1,
				pageSize: 10,
			},
			rules: {
				name: [
					{
						required: true,
						message: "请输入分类名称",
						trigger: "blur",
					},
				],
			},
			tableData: [],
		};
	},
	components: {
		formComp,
	},
	computed: {
		colorList() {
			return this.$staticData.newColorList;
		},
	},
	mounted() {
		this.category = JSON.parse(this.$route.query.info);
		this.category.menuTempName = this.category.menuTemplate.name;
		this.getList();
	},
	methods: {
		getList: function () {
			this.$http
				.menuTypeChilds({
					categoryId: this.category.id,
					...this.tableFilter,
				})
				.then((res) => {
					if (res.data.success) {
						this.tableData = res.data.data;
					}
				});
		},
		handleAdd: function () {
			this.dialogVisible = true;
		},
		handleDelete: function (row) {
			let msg = "确认删除此子分类（" + row.name + "）吗?";
			this.$confirm(msg, "提示", {
				confirmButtonText: "确认",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {})
				.catch(() => {});
		},
		handleClose: function () {
			this.dialogVisible = false;
		},
		handleChoseFile: function () {},
	},
};
</script>

<style>
.childTypeConfig {
	background: white;
	padding: 10px 15px;
	border-radius: 5px;
}

.childTypeConfig .table {
	margin-top: 20px;
}

.childTypeConfig .formTips {
	font-size: 12px;
	color: #ccc;
	display: block;
}

.childTypeConfig .tableBtn {
	margin-right: 10px;
}

.childTypeConfig .el-dropdown-link {
	color: #409eff;
	font-weight: 500;
	font-size: 14px;
}
.childTypeConfig .formInput {
	width: 200px;
}
.childTypeConfig .radio {
	width: 20%;
	margin-top: 15px;
}
.childTypeConfig .uploadBox {
	height: 200px;
	vertical-align: top;
}
.childTypeConfig .upload {
	display: inline-block;
	vertical-align: top;
	height: 200px;
	width: 160px;
	margin-left: 20px;
}
.childTypeConfig .pmImg-uploader {
	border: 2px dashed #d9d9d9;
}
.childTypeConfig .pmImg-uploader:hover {
	border-color: #409eff;
}
.childTypeConfig .pmImg-uploader .el-upload {
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.childTypeConfig .pmImg-uploader:hover {
	border-color: #409eff;
}
.childTypeConfig .pmImg-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 148px;
	height: 148px;
	line-height: 148px;
	text-align: center;
}
</style>
