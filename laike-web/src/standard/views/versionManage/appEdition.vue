<template>
  <div class="appEdition">
    <el-button type="primary" class="add" size="mini" @click="handleAdd">新增APP版本</el-button>
    <table-page class="table" :page="tableFilter.pageNumber" :limit="tableFilter.pageSize" :tableDable="tableData"
      :columns="columns"></table-page>
    <pagination v-show="total > 0" :total="total" :page.sync="tableFilter.pageNumber" :limit.sync="tableFilter.pageSize"
      @pagination="getAppList" />
    <!-- 表单弹窗 -->
    <el-dialog :title="activeName" width="30%" class="edit" :visible.sync="dialogVisible">
      <el-form :model="editForm" status-icon :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="版本名称" prop="name">
          <el-input v-model.trim="editForm.name" placeholder="版本名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model.trim="editForm.version" placeholder="版本名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="升级模式" prop="force">
          <el-radio-group v-model="editForm.force" size="medium">
            <el-radio :label="true">强制更新</el-radio>
            <el-radio :label="false">非强制</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文件上传" prop="filename">
          <el-input v-model="editForm.fileName" placeholder="文件名"></el-input>
          <el-upload class="upload-demo" ref="upload" action="" :file-list="fileList" :limit="1" :http-request="UploadApk"
            :before-upload="beforeAvatarUpload">
            <el-button  slot="trigger" size="small" type="primary">{{editForm.fileName?"重新上传":"上传文件"}}</el-button>
            <div slot="tip" class="el-upload__tip">
              仅支持.apk的二进制文件<span v-show="editForm.fileName">（原文件将删除）</span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="更新内容">
          <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 6 }" v-model="editForm.note" placeholder="更新内容"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 10px">
          <el-button type="primary" @click="submitForm('editForm')">确认</el-button>
          <el-button @click="resetForm('editForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import tablePage from "../../components/table.vue";
  import pagination from "../../components/pagination.vue";
  import Utils from "../../utils";
  export default {
    data() {
      return {
        dialogVisible: false,
        activeName: "新建APP版本",
        product: [],
        fileList: [],
        columns: [{
            prop: "name",
            label: "版本名称",
            align: "left",
          },
          {
            prop: "version",
            label: "版本号",
            align: "left",
          },
          {
            prop: "url",
            label: "URL",
            align: "left",
            width: 200,
            showOverflow: true,
          },
          {
            prop: "md5",
            label: "MD5",
            align: "left",
          },
          {
            prop: "",
            label: "升级模式",
            align: "left",
            render: (h, params) => {
              return h(
                "span", params.row.force ? "强制升级" : "非强制"
              );
            },
          },
          {
            prop: "note",
            label: "更新内容",
            align: "left",
            width: 250,
            showOverflow: true,
          },
          {
            prop: "updateTime",
            label: "更新时间",
            align: "left",
            width: 150,
            sortable: true,
            render: (h, params) => {
              return h(
                "span",
                Utils.formatDate(params.row.updateTime)
              );
            },
          },
          {
            prop: "createTime",
            label: "发布时间",
            align: "left",
            width: 150,
            sortable: true,
            render: (h, params) => {
              return h(
                "span",
                Utils.formatDate(params.row.createTime)
              );
            },
          },
          {
            prop: "creator",
            label: "发布人",
            align: "left",
          },
          {
            label: "操作",
            width: 120,
            align: "left",
            fixed: "right",
            operates: [{
                label: "编辑",
                type: "primary",
                disabled: false,
                method: (index, row) => {
                  this.handleEdit(row);
                },
              },
              {
                label: "删除",
                type: "primary",
                disabled: false,
                method: (index, row) => {
                  this.handleDelete(row);
                },
              },
            ],
          },
        ],
        editForm: {
          name: null,
          version: null,
          force: null,
          fileName: null,
          note: null,
          fileOriginalName: null,
        },
        editRules: {
          name: [{
            required: true,
            message: "请输入版本名称",
            trigger: "blur",
          }],
          version: [{
            required: true,
            message: "请输入版本号",
            trigger: "blur",
          }],
          force: [{
            required: true,
            message: "请选择升级模式",
            trigger: "change",
          }],
          fileName: [{
            required: true,
            message: "请上传文件",
            trigger: "blur",
          }],
        },
        tableData: [],
        tableFilter: {
          pageNumber: 1,
          pageSize: 10,
        },
        total: 0,
      };
    },
    components: {
      tablePage,
      pagination,
    },
    mounted() {
      this.getAppList();
    },
    methods: {
      //文件上传
      UploadApk(param) {
        const formData = new FormData()
        formData.append('files', param.file)
        formData.append('oldFileNames', this.editForm.fileName)
        this.$http.uploadFiles(formData).then((res) => {
          if (res.data.success) {
            this.editForm.fileName = res.data.data.toString()
          }
        });
      },
      handleRemove(file, fileName) {
        console.log(file, fileName);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleAdd() {
        this.activeName = "新增APP版本";
        this.dialogVisible = true;
        this.editForm = {
          name: null,
          version: null,
          force: null,
          fileName: null,
          note: null,
          fileOriginalName: null,
        }
      },
      // 上传前对文件的大小和类型的判断
      beforeAvatarUpload(file) {
        const type = ".apk";
        const isAPK = file.name.indexOf(type) > -1;
        if (!isAPK) {
          this.$message.error('请上传.apk文件');
           return isAPK;
        }else{
           this.editForm.fileOriginalName=file.name;
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.activeName == "新增APP版本") {
              this.$http
                .addAPP(this.editForm)
                .then((res) => {
                  if (res.data.success) {
                    this.$message({
                      message: "创建成功",
                      type: "success",
                    });
                     this.getAppList();
                     this.dialogVisible = false;
                  }
                })
            } else {
              this.$http
                .updataAPP(this.editForm)
                .then((res) => {
                  if (res.data.success) {
                    this.$message({
                      message: "编辑成功",
                      type: "success",
                    });
                    this.getAppList();
                     this.dialogVisible = false;
                  }
                })
            }

          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
      },
      // 获取列表
      getAppList() {
        this.$http.appList(this.tableFilter).then((res) => {
          if (res.data.success) {
            this.$set(this, "tableData", res.data.rows);
            this.$set(this, "total", res.data.total);
          }
        });
      },
      // 编辑
      handleEdit: function(raw) {
        this.activeName = "编辑APP版本";
        this.dialogVisible = true;
        this.editForm = {
          id: raw.id,
          name: raw.name,
          version: raw.version,
          force: raw.force,
          fileName: raw.fileName,
          note: raw.note,
          fileOriginalName: raw.fileOriginalName,
        }
      },
      // 删除
      handleDelete(row) {
        this.$confirm("确认删除该APP版本？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            this.$http.deleteAPP(row.id).then((res) => {
              this.getAppList();
            });
          })
          .catch(() => {});
      },
    },
  };
</script>

<style>
  .appEdition {
    background: #ffffff;
  }

  .add {
    float: right;
    margin: 20px 10px;
  }

  .select {
    width: 80%;
  }

  .hint {
    display: block;
  }

  .el-upload__tip {
    display: inline-block;
    margin-left: 10px;
  }
</style>
