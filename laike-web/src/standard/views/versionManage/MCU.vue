<template>
  <div class="mcu">
    <search :searchList="searchList" :searchParams="searchParams" formName="searchParams" isAdd buttonName="新增DTU固件"
      @add="handleAdd" @resetForm="resetForm" @submitForm="submitForm"></search>
    <table-page class="table" :page="tableFilter.page" :limit="tableFilter.pageSize" :tableDable="tableData" :columns="columns"
      @changeTableSort="changeTableSort"></table-page>
    <pagination v-show="total > 0" :total="total" :page.sync="tableFilter.page" :limit.sync="tableFilter.pageSize"
      @pagination="getVersionList" />
    <!-- 表单弹窗 -->
    <el-dialog :title="activeName" width="30%" class="edit" :visible.sync="dialogVisible">
      <el-form :model="editForm" status-icon :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="版本名称" prop="name">
          <el-input v-model.trim="editForm.name" placeholder="版本名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model.trim="editForm.version" placeholder="版本号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="productTypeId">
          <el-select class="select" v-model="editForm.productTypeId" placeholder="请选择" @change="selectProduct">
            <el-option v-for="item in products" :key="item.id" :label="item.productType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productId">
          <el-select class="select" v-model="editForm.productId" placeholder="请选择" @change="selectProductModel">
            <el-option v-for="item in productModels" :key="item.id" :label="item.productModel" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固件类别" prop="versionTypeId">
          <el-select class="select" v-model="editForm.versionTypeId" placeholder="请选择">
            <el-option v-for="item in otaTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本上传" prop="filename">
          <el-input v-model="editForm.filename" placeholder="文件名"></el-input>
          <el-upload class="upload-demo" ref="upload" action="" :file-list="fileList" :limit="1" :http-request="UploadApk"
            :before-upload="beforeAvatarUpload">
            <el-button slot="trigger" size="small" type="primary">{{editForm.filename?"重新上传":"上传文件"}}</el-button>
            <div slot="tip" class="el-upload__tip">
              仅支持.bin的二进制文件 <span v-show="editForm.filename">（原文件将删除）</span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="更新内容" prop="updateContent">
          <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 6 }" v-model="editForm.updateContent" placeholder="更新内容"></el-input>
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
  import search from "../../components/searchList.vue";
  import pagination from "../../components/pagination.vue";
  import Utils from "../../utils";
  export default {
    data() {
      return {
        dialogVisible: false,
        activeName: "新建版本类别",
        products: [],
        productModels: [],
        otaTypeList: [],
        fileList: [],
        searchList: [{
            label: "产品类型",
            prop: "productTypeId",
            type: "select",
            options: [],
          },
          {
            label: "产品型号",
            prop: "productId",
            type: "select",
            options: [],
          },
          {
            label: "版本类别",
            prop: "versionTypeId",
            type: "select",
            options: [],
          },
        ],
        searchParams: {
          productTypeId: null,
          productId: null,
          versionTypeId: null,
        },
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
            prop: "productType",
            label: "产品类型",
            width: 150,
            align: "left",
          },
          {
            prop: "productModel",
            label: "产品型号",
            align: "left",
          },
          {
            prop: "versionName",
            label: "版本类别",
            align: "left",
          },
          {
            prop: "url",
            label: "URL",
            align: "left",
            showOverflow: true,
          },
          {
            prop: "md5",
            label: "MD5",
            align: "left",
            showOverflow: true,
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
            prop: "uid",
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
          productTypeId: null,
          productId: null,
          versionTypeId: null,
          filename:null,
          updateContent: null,
        },
        editRules: {
          name: [{
            required: true,
            message: "请输入版本名称",
            trigger: "blur",
          }, ],
          version: [{
            required: true,
            message: "请输入版本号",
            trigger: "blur",
          }, ],
          productTypeId: [{
            required: true,
            message: "请选择产品类型",
            trigger: "change",
          }, ],
          productId: [{
            required: true,
            message: "请选择产品型号",
            trigger: "change",
          }, ],
          versionTypeId: [{
            required: true,
            message: "请选择固件类别",
            trigger: "change",
          }, ],
          filename: [{
            required: true,
            message: "请上传文件",
            trigger: "change",
          }],
          updateContent: [{
            required: true,
            message: "请选择更新内容",
            trigger: "change",
          }],
        },
        tableData: [],
        tableFilter: {
          page: 1,
          pageSize: 10,
        },
        total: 0,
      };
    },
    components: {
      tablePage,
      pagination,
      search,
    },
    mounted() {
      this.getProductType();
      this.getProductModel();
      this.getVersionList();
      this.firmwarePage();
    },
    methods: {
      //排序
      changeTableSort(val) {
        this.searchParams.sort =
          val == null ? null : val == "ascending" ? false : true;
        this.firmwarePage();
      },
      submitForm(formName) {
        if (formName == "searchParams") {
          this.page = 1;
          this.limit = 10;
          this.firmwarePage();
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.activeName == "新增固件版本") {
                this.$http
                  .firmwareAdd(this.editForm)
                  .then((res) => {
                    if (res.data.success) {
                      this.$message({
                        message: "创建成功",
                        type: "success",
                      });
                      this.firmwarePage();
                    }
                  })
              }else {
                this.$http
                  .firmwareEdit(this.editForm)
                  .then((res) => {
                    if (res.data.success) {
                      this.$message({
                        message: "编辑成功",
                        type: "success",
                      });
                      this.firmwarePage();
                    }
              })
              this.dialogVisible = false;
            }
            }
          });
        }
      },
      resetForm(formName) {
        if (formName == "searchParams") {
          this.searchParams = {
            productTypeId: null,
            productId: null,
            versionTypeId: null,
          };
          this.firmwarePage();
        } else {
          this.$refs[formName].resetFields();
          this.dialogVisible = false;
        }
      },
      // 获取列表
      firmwarePage() {
        let params = { ...this.tableFilter,
          ...this.searchParams
        };
        this.$http.firmwarePage(params).then((res) => {
          if (res.data.success) {
            this.$set(this, "tableData", res.data.data.list);
            this.$set(this, "total", res.data.data.total);
          }
        });
      },
      // 获取版本列表
      getVersionList() {
        this.$http .versionClassList().then((res) => {
            if (res.data.success) {
              let list = [];
              for (let i in res.data.data) {
                list[i] = {
                  label: res.data.data[i].name,
                  value: res.data.data[i].id,
                };
              }
              this.searchList[2].options = list;
            }
          });
      },
      //获取产品类型
      getProductType() {
        this.$http.productTypesAll().then((res) => {
          if (res.data.success) {
            this.products = res.data.data;
            let list = [];
            for (let i in res.data.data) {
              list[i] = {
                label: res.data.data[i].productType,
                value: res.data.data[i].id,
              };
            }
            this.searchList[0].options = list;
          }
        });
      },
      //获取产品型号
      getProductModel(e) {
        this.$http.productModuleAll({
          productTypeId: e
        }).then((res) => {
          if (res.data.success) {
            this.productModels = res.data.data;
            let list = [];
            for (let i in res.data.data) {
              list[i] = {
                label: res.data.data[i].productModel,
                value: res.data.data[i].id,
              };
            }
            this.searchList[1].options = list;
          }
        });
      },
      //获取固件类别
      getOtaType(x,y) {
        this.$http.versionClassList({
          productTypeId:x,
          productId:y,
        }).then((res) => {
          if (res.data.success) {
            this.otaTypeList = res.data.data;
          }
        });
      },
      selectProduct() {
        this.getProductModel(this.editForm.productTypeId);
      },
      selectProductModel() {
         this.getOtaType(this.editForm.productTypeId,this.editForm.productId);
      },
      //文件上传
      UploadApk(param) {
        const formData = new FormData()
        formData.append('files', param.file)
        formData.append('oldFileNames', this.editForm.fileName)
        this.$http.uploadFiles(formData).then((res) => {
          if (res.data.success) {
            this.editForm.filename=res.data.data.toString()
          }
        });
      },
      handleRemove(file, fileName) {
        console.log(file, fileName);
      },
      handlePreview(file) {
        console.log(file);
      },
      // 上传前对文件的大小和类型的判断
      beforeAvatarUpload(file) {
        const type = ".bin";
        const isAPK = file.name.indexOf(type) > -1;
        if (!isAPK) {
          this.$message.error('请上传.bin文件');
           return isAPK;
        }else{
           this.editForm.fileOriginalName=file.name;
        }
      },
      handleRemove(file, filename) {
        console.log(file, filename);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleAdd() {
        this.activeName = "新增固件版本";
        this.dialogVisible = true;
        this.editForm = {
          name: null,
          version: null,
          productTypeId: null,
          productId: null,
          versionTypeId: null,
          filename: null,
          updateContent: null,
        };
      },
      // 编辑
      handleEdit(raw) {
        this.dialogVisible = true;
        this.activeName = "编辑固件版本";
        this.editForm = {
          id: raw.id,
          name: raw.name,
          version: raw.version,
          productTypeId: raw.productTypeId,
          productId: raw.productId,
          versionTypeId: raw.versionTypeId,
          filename: raw.filename,
          updateContent: raw.updateContent,
        };
      },
      // 删除
      handleDelete(row) {
        this.$confirm("确认删除该固件版本？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$http.firmwareDelete(row.id).then((res) => {
            this.firmwarePage();
          });
        }).catch(() => {});
      },
    },
  };
</script>

<style>
  .mcu {
    background: #ffffff;
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
