<template>
    <div id="user">
        <div id="model" style="width:calc((100% - 24px)/3);height:330px;margin:0 24px 15px 0;">
            <div ref="spread" style="width:100%;height:100%"></div>
        </div>
        <div id="faultTrend" style="width:calc((100% - 24px)/3*2);height:330px;margin-bottom:15px;">
            <div class="radio">
                <el-radio-group v-model.trim="radio1" size="small" @change="userNewTendency">
                    <el-radio-button label="1">24时</el-radio-button>
                    <el-radio-button label="2">月</el-radio-button>
                    <el-radio-button label="3">年</el-radio-button>
                </el-radio-group>
            </div>
            <div ref="faultTrend" style="width:100%;height:100%"></div>
        </div>
        <div class="user-center">
            <TableSearch :tableData="tableData" :tableSearch="tableSearch" :exportHead="tableHeader.data"></TableSearch>
            <comTable :tableData="tableData" :tableHeader="tableHeader"></comTable>
        </div>

        <el-dialog :close-on-click-modal="false" title="用户详情" :visible.sync="dialogDetails" width="550px">
            <div id="dialogDetails">
                <img :src="dialogDetailForm.imageName!=null&&dialogDetailForm.imageName?$store.state.oldStore.imgSrc+dialogDetailForm.imageName+'&token='+$store.state.oldStore.token:require('@/assets/imges/user.png')"/>
                <p :title="dialogDetailForm.userName">用户名:{{dialogDetailForm.userName==null||dialogDetailForm.userName==''?'未绑定手机号':dialogDetailForm.userName}}</p>
                <p :title="dialogDetailForm.nickName">昵称:{{dialogDetailForm.nickName}}</p>
                <p>注册时间:{{$filters.dateFilter(dialogDetailForm.createTime,'')}}</p>
                <p>APP类型:{{dialogDetailForm.appType==1?'Android':'IOS'}}</p>
                <p :title="dialogDetailForm.appVersion">APP版本:{{dialogDetailForm.appVersion}}</p>
                <p>系统版本:{{dialogDetailForm.osVersion}}</p>
                <p>手机型号:{{dialogDetailForm.phoneModel}}</p>
                <p>最后登录时间:{{$filters.dateFilter(dialogDetailForm.lastLoginTime)}}</p>
                <p :title="dialogDetailForm.lastLoginIp">最后登录IP:{{dialogDetailForm.lastLoginIp}}</p>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="关联设备" :visible.sync="dialogRelation" width="550px">
            <el-table :data="detailsData">
                <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                <el-table-column label="产品类型" width="120">
                    <template slot-scope="scope">
                        {{scope.row['device'].deviceType}}
                    </template>
                </el-table-column>
                <el-table-column label="产品型号" width="120">
                    <template slot-scope="scope">
                        {{scope.row['device'].deviceModel}}
                    </template>
                </el-table-column>
                <el-table-column label="SN" width="140">
                    <template slot-scope="scope">
                        {{scope.row['device'].deviceSN}}
                    </template>
                </el-table-column>
                <el-table-column property="address" label="操作">
                    <template slot-scope="scope">
                    <el-button  @click.native.prevent="function(){$store.state.oldStore.authThree.indexOf('c11') != -1?$router.push({path:'/device/details/'+scope.row['device'].mac}):$message.warning('无此操作权限！')}" type="text" size="small">
                        更多
                    </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import indexEcharts from '../../../indexEcharts';
export default {
    data(){
        return{
            dialogDetails:false,//详情弹框
            dialogDetailForm:{
                userName:'',
                nickName:'',
                createTime:'',
                imageName:'',
                appType:'',
                appVersion:'',
                lastLoginIp:'',
                lastLoginTime:'',
            },
            dialogRelation:false,//关联设备弹框
            radio1: '1',
            detailsData:[],
            faultTrendData:{
                title:'用户新增',
                subtext:'总数(个)',
                type:'line',
                sname:'2019-6',
                name:[],
                value:[]
            },
            spreadData:{
                title:'用户类型',
                subtext:'',
                total:'',
                tip:"{b}\n{c}台 ({d}%)",
                name:[],
                type:'all',
                value:[],
            },
            tableSearch:{
                isExport:false,
                exportName:'',
                funClick:this.getUsers,
                cleanClick:this.cleanClick,
                input:[
                    { pla:'用户名',width:'138',value:''},
                ],
                picker:{
                    value:'',
                    startPlaceholder:'注册开始时间',
                    endPlaceholder:'注册结束时间',
                },
                select:[],
                selectArry:[],//表格选中数据集合
            },
            tableHeader:{ 
                sortMethod:function(){},
                tableStatus:false,
                tableHeight:'calc(100% - 86px)',
                comHeight:'calc(100% - 10px)',
                filters:this.filters,
                handleSelectionChange:0,//选中表格数据方法
                isSelection:[false],//是否显示序列号
                oper:{ //操作栏
                    label:'操作', prop:'oper', minWidth:'150',fixed:'right',
                    oper:[
                        {name:'查看',clickFun: this.ofDetails},
                        {name:'关联设备',clickFun: this.$store.state.oldStore.authThree.indexOf('i14') != -1?this.ofRelation:0},
                        {name:'删除',clickFun: this.$store.state.oldStore.authThree.indexOf('i10') != -1?this.deleteRow:0},
                    ]
                },
                data:[//表格头数据绑定
                    { label:'用户名', prop:'userName', minWidth:'120',fixed:true},
                    { label:'昵称', prop:'nickName', minWidth:'120',fixed:true},
                    { label:'注册时间', prop:'createTime', minWidth:'160',fixed:false},
                    { label:'最后登录时间', prop:'lastLoginTime', minWidth:'160',fixed:false},
                    { label:'APP类型', prop:'appType', minWidth:'120',fixed:false,
                    filters:[{text:'Android',value:1},{text:'IOS',value:2}],filterList:[]},
                    { label:'系统版本', prop:'osVersion', minWidth:'120',fixed:false},
                    { label:'APP版本', prop:'appVersion', minWidth:'120',fixed:false},
                    { label:'手机型号', prop:'phoneModel', minWidth:'120',fixed:false},
                    { label:'最后登录IP', prop:'lastLoginIp', minWidth:'120',fixed:false},
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
            users:{
                appType:'',//APP类型
                appVersion:'',//APP版本
                userName:'',//用户名
                startTime:'',//注册开始时间
                endTime:'',//注册结束时间
                pageNumber:1,
                pageSize:20,
            }
        }
    },
    watch:{
    },
    mounted(){
        this.indexEcharts();
        this.getUsers();
        const that = this;
        window.onresize = () => {
            return (() => {
                this.$echarts.init(that.$refs.faultTrend).resize();
                this.$echarts.init(that.$refs.spread).resize();
            })()
        }
    },
    methods:{
        indexEcharts(){
            this.appTypeStatistics();
            this.userNewTendency();
        },
        appTypeStatistics(){
            this.$http.appTypeStatistics().then(res=>{
                if(res.data.success){
                    this.spreadData.name = [];
                    this.spreadData.value = [];
                    res.data.datas.forEach(item=>{
                        this.spreadData.name.push(item[0])
                        this.spreadData.value.push({name:item[0],value:item[1]})
                    })
                    indexEcharts.model(this.$refs.spread,this.spreadData);
                }
            })
        },
        userNewTendency(){
            this.$http.userNewTendency({type:this.radio1}).then(res=>{
                if(res.data.success){
                    this.faultTrendData.name = [];
                    this.faultTrendData.value = [];
                    res.data.datas.forEach(item=>{
                        this.faultTrendData.name.push(item[0])
                        this.faultTrendData.value.push(item[1])
                    })
                indexEcharts.newTrend(this.$refs.faultTrend,this.faultTrendData);
                }
            })
        },
        handleSizeChange(val) {
            this.tableHeader.pagination.pageSize = this.users.pageSize = val;
            this.getUsers();
        },
        handleCurrentChange(val) {
            this.tableHeader.pagination.currentPage = this.users.pageNumber = val;
            this.getUsers();
        },
        cleanClick(){
            this.users.userName = '';
            this.users.startTime = ''; 
            this.users.endTime = ''; 
            this.users.appType = '';
            this.tableHeader.pagination.currentPage = 1;
            this.tableHeader.data.forEach(item=>{
                if(item.hasOwnProperty('filterList')){
                    item.filterList = [];
                }
            });
            this.tableSearch.picker.value = this.tableSearch.input[0].value = '';
            this.getUsers();
        },
        ofDetails(index, row){
            this.dialogDetailForm = row;
            this.dialogDetails = true;
        },
        ofRelation(index, row){
            this.detailsData = [];
            this.$http.userDevices({id:row.id}).then(res=>{
                if(res.data.success){
                    this.detailsData = res.data.rows;
                    this.dialogRelation = true;
                }
            })
        },
        deleteRow(index, row) {
            this.$confirm('确认删除此用户吗?','提示',this.$filters.confirm()).then(() => {
                this.$http.deleteUser(row.id).then(res=>{
                    if(res.data.success){
                        this.getUsers();
                    }
                })
            })
        },
        getUsers(){
            this.users.userName = this.tableSearch.input[0].value;
            if(this.tableSearch.picker.value&&this.tableSearch.picker.value.length>0){
                this.users.startTime = this.$filters.dateFilter(this.tableSearch.picker.value[0],''); 
                this.users.endTime = this.$filters.dateFilter(this.tableSearch.picker.value[1],''); 
            }else{
                this.users.startTime = ''; 
                this.users.endTime = ''; 
            }
                        this.tableHeader.tableStatus = false;
            this.$http.users(this.users).then(res=>{
                this.tableData = res.data.rows;
                this.tableHeader.pagination.total = res.data.total;
                if(res.data.total>0&&res.data.rows.length==0){
                    this.tableHeader.pagination.currentPage = this.users.pageNumber = 1;
                    this.getUsers();
                }
                    this.$nextTick(()=>{
                        this.tableHeader.tableStatus = true;
                    })
            })
        },
        //筛选列
        filters(filters) {
            var name;
            for(var x in filters){
                name = x;
            }
            this.users[name] = filters[name][0];
            this.getUsers();
        },
    },
    destroyed () {
      window.onresize = null;
    }
}
</script>

<style lang="less">
#user{
    width: 100%;
    height: 100%;
    min-height: 660px;
    float: left;
    #dialogDetails{
        width: 100%;
        height: 330px;
        >img{
            width: 150px;
            height: 150px;
            border-radius: 50%;
            float: right;
            margin-right: 70px;
            margin-left: 25px;
        }
        >p{
            float: right;
            height: 55px;
            line-height: 55px;
            width: 245px;
            text-indent: 20px;
            overflow:hidden; //超出的文本隐藏
            text-overflow:ellipsis; //溢出用省略号显示
            white-space:nowrap; //溢出不换行
        }
    }
    >.user-center,#model,#faultTrend{
        border-radius: 4px;
        background:#fff;
        box-shadow: 0 3px 5px 0 rgba(0,0,0,0.05);
        float: left;
    }
    >.user-center{
        width:100%;
        height: 500px;
        padding-top: 15px;
    }
    #model{
        position: relative;
        >p{
            float: left;
            padding: 24px 0 0 24px;
            font-size: 14px;
            color: #59626C;
            font-weight: bold;
        }
    }
    #faultTrend{
        position: relative;
        >.radio{
            top: 24px;
            right: 30px;
            position: absolute;
            z-index: 1;
            .el-radio-button__orig-radio:checked+.el-radio-button__inner{
                background-color:#F02B54;
                border-color: #F02B54;
                box-shadow: -1px 0 0 0 #F02B54;
                color: #fff;
            }
            .el-radio-button__inner:hover{
                color:#F02B54;
            }
        }
        >.inputForm{
            top: 24px;
            left: 130px;
            position: absolute;
            z-index: 1;
        }
    }
}
</style>
