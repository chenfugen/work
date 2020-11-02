<template>
    <div id="messageNewPush">
        <TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
        <comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>

        <el-dialog :close-on-click-modal="false" title="消息推送" :visible.sync="addBox" width="550px" @close="close">
            <div style="padding-right:40px;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="标题" prop="title">
                        <el-input size="small" v-model.trim="ruleForm.title"  maxlength="32"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <el-input type="textarea" size="small" :rows="3" v-model.trim="ruleForm.content"></el-input>
                    </el-form-item>
                    <el-form-item label="产品类型" prop="deviceType">
                        <el-select size="small" placeholder="请选择产品类型" v-model.trim="ruleForm.deviceType">
                            <el-option v-for="(i,x) in $store.state.oldStore.deviceTypes" :key="x" :label="i" :value="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产品型号" prop="deviceModel" v-if="ruleForm.clickType==2">
                        <el-select size="small" placeholder="请选择产品型号" no-data-text="请先选择产品类型" v-model.trim="ruleForm.deviceModel">
                            <el-option v-for="(i,x) in $store.state.oldStore.types[ruleForm.deviceType]" :key="x" :label="i" :value="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="点击动作" prop="clickType">
                        <el-radio-group v-model.trim="ruleForm.clickType">
                            <el-radio :label="1">打开APP消息中心</el-radio>
                            <el-radio :label="2">打开APP菜谱上新</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="用户范围" prop="type">
                        <el-radio-group v-model.trim="ruleForm.type">
                            <el-radio :label="3">所有用户</el-radio>
                            <el-radio :label="1">Android</el-radio>
                            <el-radio :label="2">IOS</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addBox = false">取 消</el-button>
                    <el-button type="danger" @click="submitForm('ruleForm')">推 送</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="消息详情" :visible.sync="seeBox" width="550px" custom-class="seeBox" @close="close">
            <div class="see-center">
                <p><font class="title">标题：</font><font>{{seeForm.title}}</font></p>
                <p><font class="title">产品范围：</font><font>{{seeForm.deviceType}}</font></p>
                <p><font class="title">用户范围：</font><font>{{seeForm.type==1?'Android':(seeForm.type==3?'所有用户':'IOS')}}</font></p>
                <p><font class="title">点击动作：</font><font>{{seeForm.clickType==1?'打开APP消息中心':'打开APP菜谱上新'}}</font></p>
                <p><font class="title">内容：</font><font>{{seeForm.content}}</font></p>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            addBox:false,
            seeBox:false,
            region:'1',
            seeForm:{
                deviceType: '',//产品范围
                type:'',
                clickType: 1,//点击动作
                content: '',//内容
            },
            ruleForm: {
                deviceType: '',//产品范围
                deviceModel:'',
                type: 3,//用户范围
                clickType: 1,//点击动作
                content: '',//内容
            },
            rules: {
                title: [ { required: true, message: '请输入标题', trigger: 'blur' },],
                content: [ { required: true, message: '请输入内容', trigger: 'blur' },],
                deviceType: [ { required: true, message: '请选择产品类型', trigger: 'change' }],
                deviceModel: [ { required: true, message: '请选择产品型号', trigger: 'change' }],
            },
            tableSearch:{
                isExport:false,
                exportName:'',
                btn:[{
                    name:'消息推送',
                    clickInfo:this.$store.state.oldStore.authThree.indexOf('h11') != -1?this.addRow:0
                }],
                funClick:this.getMessagePushs,
                cleanClick:this.cleanClick,
                input:[
                    { pla:'推送人',width:'138',value:''},
                ],
                picker:{
                    value:'',
                    startPlaceholder:'推送开始日期',
                    endPlaceholder:'推送结束日期',
                },
                select:[],
                selectArry:[],//表格选中数据集合
            },
            tableHeader:{ 
                sortMethod:function(){},
                tableStatus:false,
                ref:'as',
                filters:this.filters,
                tableHeight:'calc(100% - 86px)',
                comHeight:'calc(100% - 10px)',
                handleSelectionChange:0,//选中表格数据方法
                isSelection:[false,'55'],//是否显示序列号
                oper:{ //操作栏
                    label:'操作', prop:'oper', minWidth:'135',fixed:'right',
                    oper:[
                        {name:'查看',clickFun: this.seeRow},
                        {name:'删除',clickFun: this.$store.state.oldStore.authThree.indexOf('h10') != -1?this.deleteRow:0},
                    ]
                },
                data:[//表格头数据绑定
                    { label:'产品范围', prop:'deviceType', minWidth:'120',fixed:false,
                    filters:this.$store.state.oldStore.deviceTypeFilters,filterList:[]},
                    { label:'标题', prop:'title', minWidth:'150',fixed:false},
                    { label:'用户范围', prop:'type', minWidth:'120',fixed:false,
                    filters:[{text:'Android',value:1},{text:'IOS',value:2},{text:'所有用户',value:3}],filterList:[]},
                    { label:'点击动作', prop:'clickType', minWidth:'145',fixed:false,name:'消息推送',
                    filters:[{text:'打开APP消息中心',value:1},{text:'打开APP菜谱上新',value:2}],filterList:[]},
                    { label:'内容', prop:'content', minWidth:'240',fixed:false},
                    { label:'推送时间', prop:'pushTime', minWidth:'160',fixed:false},
                    { label:'推送人', prop:'pusher', minWidth:'120',fixed:false},
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
            data: [{
                id: 1,
                label: '首页',
                }, {
                id: 2,
                label: '地图',
                }, {
                id: 3,
                label: '设备管理',
                children: [{
                    id: 7,
                    label: '智能烹饪机'
                }]
                },{
                id: 4,
                label: '故障管理',
                children: [{
                    id: 8,
                    label: '故障统计'
                },{
                    id: 9,
                    label: '故障记录'
                },{
                    id: 10,
                    label: '故障代码'
                },]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                messagePushs:{
                    deviceType: '',//产品范围
                    type: '',//用户范围
                    clickType: '',//点击动作
                    content: '',//内容
                    pusher:'',//推送人
                    pushStartTime:'',//推送开始时间
                    pushEndTime:'',//推送结束时间
                    pageNumber:1,//分页页数
                    pageSize:20,//分页每页数量
                }
        }
    },
    mounted(){
        this.getMessagePushs();
    },
    methods:{
        deleteRow(index, row) {
            this.$confirm('确认删除?','提示',{
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                confirmButtonClass:'el-button--danger',
                type: 'warning',
                }).then(() => {
                    this.$http.deleteMessagePush(id).then(res=>{
                        this.getMessagePushs();
                    })
                })
        },
        seeRow(index, row){
            this.seeForm = row;
            this.seeBox = true;
        },
        addRow(){
            this.addBox = true;
        },
        close(){
            this.$refs.ruleForm.resetFields();
        },
        //筛选列
        filters(filters) {
            var name;
            for(var x in filters){
                name = x;
            }
            this.messagePushs[name] = filters[name][0];
            this.getMessagePushs();
        },
        submitForm(formName) {
            var ajax = this.$http.addMessagePush;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    ajax(this.ruleForm).then(res => {
                        this.addBox = false;
                        if(res.data.success){
                            this.getMessagePushs();
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        deleteRow(index, row) {
            this.$confirm('确认删除吗?','提示',this.$filters.confirm()).then(() => {
                this.$http.deleteMessagePush(row.id).then(res => {
                    if(res.data.success){
                        this.getMessagePushs();
                    }
                })
            })
        },
        getMessagePushs(){
            this.messagePushs.pusher = this.tableSearch.input[0].value;
            if(this.tableSearch.picker.value){
                this.messagePushs.pushStartTime = this.$filters.dateFilter(this.tableSearch.picker.value[0],'');;
                this.messagePushs.pushEndTime = this.$filters.dateFilter(this.tableSearch.picker.value[1],'');;
            }else{
                this.messagePushs.pushStartTime = '';
                this.messagePushs.pushEndTime = '';
            }
            this.tableHeader.tableStatus = false;
            this.messagePushs.pageNumber = this.tableHeader.pagination.currentPage;
            this.messagePushs.pageSize = this.tableHeader.pagination.pageSize;
            this.$http.messagePushs(this.messagePushs).then(res=>{
                this.tableData = res.data.rows;
                this.tableHeader.tableStatus = true;
                this.tableHeader.pagination.total = res.data.total;
                if(res.data.total>0&&res.data.rows.length==0){
                    this.tableHeader.pagination.currentPage = 1;
                    this.getMessagePushs();
                }
                    this.$nextTick(()=>{
                        this.tableHeader.tableStatus = true;
                    })
            })
        },
        handleSizeChange(val) {
            this.tableHeader.pagination.pageSize = val;
            this.getMessagePushs();
        },
        handleCurrentChange(val) {
            this.tableHeader.pagination.currentPage = val;
            this.getMessagePushs();
        },
        cleanClick(){
            this.tableSearch.input[0].value = '';
            this.tableSearch.picker.value = '';
            this.tableHeader.pagination.currentPage = 1;
            this.tableHeader.pagination.pageSize = 20;
            this.messagePushs.pageNumber = 1;
            this.messagePushs.pageSize = 20;
            this.messagePushs.deviceType = '';
            this.messagePushs.clickType = '';
            this.messagePushs.content = '';
            this.messagePushs.pusher = '';
            this.tableHeader.data.forEach(item=>{
                if(item.hasOwnProperty('filterList')){
                    item.filterList = [];
                }
            });
            this.getMessagePushs();
        },
        close(){
            this.$refs.ruleForm.resetFields();
        },
    }
}
</script>

<style lang="less">
#messageNewPush{
    width: 100%;
    height: 100%;
    float: left;
    background: #fff;
    padding-top: 24px;
    box-sizing: border-box;
    -webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    #addRole{
        >.el-dialog{
            height: 100%;
            float: right;
            margin-bottom: 0;
            >.el-dialog__footer{
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }
    }
    .el-select--small{
        width: 100%;
    }
    .el-dialog__body {
        text-align: left;
    }
    .dialog-footer{
        text-align: right;
    }
    .seeBox{
        .see-center{
            width: 100%;
            height: auto;
        }
        p{
            display: inline-block;
            margin: 10px 0;
            width: 100%;
            font{
                width: calc(100% - 90px);
                display: block;
                float: left;
                &.title{
                    width: 90px;
                    text-align: right;
                }
            }
        }
    }
}
</style>
