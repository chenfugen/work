<template>
    <div id="plantSurveyList">
        <TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
        <comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>
        
        <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="editBox" width="500px" @close="close">
            <el-form :model="editData" ref="ruleForm">
                <el-form-item label="MAC地址:" label-width="100px" prop="mac" :rules="[{ required: true, message: '请填写MAC地址', trigger: 'blur' }]">
                    <el-input v-model.trim="editData.mac" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editBox = false">取 消</el-button>
                <el-button type="danger" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            editBox:false,
            editData:{
                mac:'',
            },
            tableStutas:true,
            tableSearch:{
                isExport:this.$store.state.oldStore.authThree.indexOf('f25') != -1?true:false,
                exportName:'厂测列表',
                funClick:this.tabSearBtnClick,
                cleanClick:this.cleanClick,
                input:[
                    { pla:'MAC',width:'178',value:''},
                ],
                picker:{
                    name:'首次检验日期：',
                    value:'',
                    startPlaceholder:'首次检验开始日期',
                    endPlaceholder:'首次检验结束日期',
                },
                selectArry:[],//表格选中数据集合
            },
            tableHeader:{ sortMethod:function(){},
                tableStatus:false,
                filters:this.filters,
                tableHeight:'calc(100% - 86px)',
                comHeight:'calc(100% - 10px)',
                handleSelectionChange:this.handleSelectionChange,//选中表格数据方法
                isSelection:[true,'55'],//是否显示序列号
                oper:{ //操作栏
                    label:'操作', prop:'oper', minWidth:'135',fixed:'right',
                    oper:[
                        {name:'查看',clickFun: this.details},
                        {name:'编辑',clickFun: this.$store.state.oldStore.authThree.indexOf('f22') != -1?this.upData:0},
                        {name:'删除',clickFun: this.$store.state.oldStore.authThree.indexOf('f20') != -1?this.deleteRow:0},
                    ]
                },
                data:[//表格头数据绑定
                    
                    { label:'MAC地址', prop:'mac', minWidth:'120',fixed:true},
                    { label:'产品类型', prop:'deviceType', minWidth:'120',fixed:false,
                    filters:this.$store.state.oldStore.deviceTypeFilters,filterList:[]},
                    { label:'产品型号', prop:'deviceModel', minWidth:'120',fixed:false,
                    filters:this.$store.state.oldStore.deviceModelFilters,filterList:[]},
                    { label:'检验状态', prop:'totalStatus', minWidth:'120',fixed:false,
                    filters:[{text:'合格',value:true},{text:'不合格',value:false}],filterList:[]},
                    { label:'首次检验日期', prop:'firstCheckTime', minWidth:'160',fixed:false},
                    { label:'检验更新日期', prop:'updateCheckTime', minWidth:'160',fixed:false},
                ],
                pagination:{
                   currentPage:1,// 当前页码
                   total:0,//总页数
                   pageSize:20,//每页数据条数
                   pageSizes:[20, 50, 100, 200],//每页数据条数集合
                   handleSizeChange:this.handleSizeChange,//切换每页多少条
                   handleCurrentChange:this.handleCurrentChange,//切换当前页码
                }
            },
            tableData: [],
            upDate:{},
            factoryForm:{
                mac:'',
                firstCheckStartTime:'',
                firstCheckEndTime:'',
                deviceType:'',
                deviceModel:'',
                totalStatus:'',
                pageNumber:1,
                pageSize:20,
            }
        }
    },
    methods:{
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http.updataFactoryTest(this.editData).then(res=>{
                        this.editBox = false;
                        if(res.data.success){
                            this.getFactoryTests();
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        deleteRow(index, row) {
            this.$confirm('此设备的所有检验记录将被删除！','确认删除此设备吗？',this.$filters.confirm()).then(() => {
                this.$http.deleteFactoryTest(row.id).then(res => {
                    if(res.data.success){
                        this.getFactoryTests();
                    }
                })
            })
        },
        upData(index, row){
            this.upDate = row;
            this.$nextTick(()=>{
                this.editData.mac = row.mac;
                this.editData.id = row.id;
            })
            this.editBox = true;
        },
        details(index, row){
            this.$router.push({path:'/planSurvey/details/'+row.id})
        },
        handleSelectionChange(val) {
            this.tableSearch.selectArry = val;
        },
        handleSizeChange(val) {
            this.factoryForm.pageSize = this.tableHeader.pagination.pageSize = val;
            this.getFactoryTests();
        },
        handleCurrentChange(val) {
            this.factoryForm.pageNumber = this.tableHeader.pagination.currentPage = val;
            this.getFactoryTests();
        },
        tabSearBtnClick(){
            this.getFactoryTests();
        },
        cleanClick(){
            this.factoryForm.mac = this.tableSearch.input[0].value = '';
            this.tableSearch.picker.value = '';
            this.tableHeader.pagination.currentPage = 1;
            this.factoryForm.firstCheckStartTime = '';
            this.factoryForm.firstCheckEndTime = '';
            this.factoryForm.deviceType = '';
            this.factoryForm.deviceModel = '';
            this.factoryForm.totalStatus = '';
            this.tableHeader.data.forEach(item=>{
                if(item.hasOwnProperty('filterList')){
                    item.filterList = [];
                }
            });
            this.getFactoryTests();
        },
        filters(filters) {
            var name;
            for(var x in filters){
                name = x;
            }
            this.factoryForm[name] = filters[name][0];
            this.getFactoryTests();
        },
        close(){
            this.$refs.ruleForm.resetFields();
        },
        getFactoryTests(){
            this.factoryForm.mac = this.tableSearch.input[0].value;
            if(this.tableSearch.picker.value){
                this.factoryForm.firstCheckStartTime = this.$filters.dateFilter(this.tableSearch.picker.value[0],'');
                this.factoryForm.firstCheckEndTime = this.$filters.dateFilter(this.tableSearch.picker.value[1],'');
            }else{
                this.factoryForm.firstCheckStartTime = ''; 
                this.factoryForm.firstCheckEndTime = ''; 
            }
            this.tableHeader.tableStatus = false;
            this.$http.factoryTests(this.factoryForm).then(res=>{
                if(res.data.success){
                    this.tableData = res.data.rows;
                    this.tableHeader.tableStatus = true;
                    this.tableHeader.pagination.total = res.data.total;
                    if(res.data.total>0&&res.data.rows.length==0){
                        this.factoryForm.pageNumber = this.tableHeader.pagination.currentPage = 1;
                        this.getFactoryTests();
                    }
                    this.$nextTick(()=>{
                        this.tableHeader.tableStatus = true;
                    })
                }
            })
        }
    },
    mounted(){
        this.getFactoryTests();
    }
}
</script>

<style scoped lang="less">
#plantSurveyList{
    width: 100%;
    height: 100%;
    float: left;
    background: #fff;
    padding-top: 24px;
    box-sizing: border-box;
    -webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}
</style>
