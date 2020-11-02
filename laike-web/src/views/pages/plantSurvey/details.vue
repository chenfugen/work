<template>
    <div id="plan-details" ref="planDetails">
        <div class="details-survey" v-if="complete">
            <span class="title">设备概况</span>
            <span>产品型号：{{ruleData.deviceModel}}</span>
            <span>产品类型：{{ruleData.deviceType}}</span>
            <span>MAC地址：{{ruleData.mac}}
                <i class="iconicon-question tips" v-popover:popover></i>
                <!-- MAC历史地址 -->
                <el-popover width="420" trigger="hover" ref="popover" placement="left" popper-class="detailsPopper">
                    <el-table :data="macData">
                        <el-table-column width="50" type="index" label="序号" fixed="left"></el-table-column>
                        <el-table-column width="170" property="mac" label="MAC地址"></el-table-column>
                        <el-table-column width="170" label="更新时间">
                        <template slot-scope="scope">
                            {{$filters.dateFilter(scope.row['updateTime'],'')}}
                        </template>
                        </el-table-column>
                    </el-table>
                </el-popover>
            </span> 
            <span>电机软件版本号：{{ruleData.motorVersion?ruleData.motorVersion:'暂无'}}</span>
            <span>电子秤软件版本号：{{ruleData.scaleVersion?ruleData.scaleVersion:'暂无'}}</span>
            <span>MCU固件版本：{{ruleData.mcuVersion?ruleData.mcuVersion:'暂无'}}</span>
            <span>安卓屏固件版本：{{ruleData.padBinVersion?ruleData.padBinVersion:'暂无'}}</span>
            <span v-if="ruleData.deviceModel==='CF7'">安卓屏app版本：{{ruleData.dtuVersion?ruleData.dtuVersion:'暂无'}}</span>
            <span>首次检验日期：{{$filters.dateFilter(ruleData.firstCheckTime,'')}}</span>
            <span>检验更新日期：{{$filters.dateFilter(ruleData.updateCheckTime,'')}}</span>
        </div>
        <div class="details-img" v-if="complete">
            <img :src="ruleData.imageName?$store.state.oldStore.imgSrc+ruleData.imageName:require('@/assets/imges/laike.jpg')"/>
        </div>
        <div class="details-table">
            <div class="details-table-head">
                检验项目
                <p><i class="iconqualified" style="color:#5BC49F;margin-right:3px"></i>通过</p>
                <p><i class="iconwrong" style="color:#FF7C7C;margin-right:3px"></i>未通过</p>
            </div>
            <el-table id="out-table" :data="tableData" @selection-change="tableHeader.handleSelectionChange" 
                style="width: 100%;" height="380" header-cell-class-name="cheTabHreaClass"
                cell-class-name="cheTabConClass">
                <el-table-column v-for="(i,index) in tableHeader.data" :render-header="index<2?renderHeader:null"
                :key="index" :fixed="i.fixed" :prop="i.prop" :label="i.label" :min-width="i.minWidth" 
                :show-overflow-tooltip="true" :sortable="i.sortable?i.sortable:false" align="center"
                :filters="i.filters?i.filters:null" :filter-method="i.filters?filterTag:null">
                    <template slot-scope="scope">
                        <!-- 厂测详情电子秤回检 -->
                        <!-- <el-popover width="420" trigger="hover" placement="top-start" v-if="i.prop.indexOf('scaleStatus')!= -1" popper-class="detailsPopper">
                            <span class="title">电子秤回检</span>
                            <i :class="scope.row[i.prop]?'iconqualified':'iconwrong'"></i>
                            <span>{{scope.row[i.prop]?'通过':'未通过'}}  {{$filters.dateFilter(scope.row.updateCheckTime,'')}}</span>
                            <el-table :data="scope.row['scales']" header-cell-class-name="cheTabHreaClass" center>
                                <el-table-column v-for="(i,index) in scaleHead" :key="index" width="70" :property="i.prop" :label="i.label">
                                    <template slot-scope="scope">
                                        <div :class="i.prop=='original'?'fontSix':''" 
                                        :style="(scope.row.original==100&&Math.abs(scope.row.original-scope.row[i.prop])<6)||scope.row.original==3000&&Math.abs(scope.row.original-scope.row[i.prop])<31?'':'color:#FF7C7C'">
                                            {{scope.row[i.prop]}}
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div slot="reference" class="name-wrapper">
                                <i :class="scope.row[i.prop]?'iconqualified':'iconwrong'" style="cursor: pointer"></i>
                            </div>
                        </el-popover> -->
                        <!-- 厂测详情显示屏回检 -->
                        <el-popover width="280" trigger="hover" placement="top-start" v-if="i.prop.indexOf('screenStatus')!= -1" popper-class="detailsPopper">
                            <span class="title">显示屏测试</span>
                            <i :class="scope.row[i.prop]?'iconqualified':'iconwrong'"></i>
                            <span>{{scope.row[i.prop]?'通过':'未通过'}}  {{$filters.dateFilter(scope.row.updateCheckTime,'')}}</span>
                            <el-table :data="[scope.row]">
                                <el-table-column width="70" label="红">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.screenRed?'通过':'未通过'}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column width="70" label="绿">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.screenGreen?'通过':'未通过'}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column width="70" label="蓝">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.screenBlue?'通过':'未通过'}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column width="70" label="灰">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.screenGrey?'通过':'未通过'}}</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div slot="reference" class="name-wrapper">
                                <i :class="scope.row[i.prop]?'iconqualified':'iconwrong'" style="cursor: pointer"></i>
                            </div>
                        </el-popover>
                        <!-- 厂测详情RTC时间测试 -->
                        <el-popover trigger="hover" placement="top-start" v-if="i.prop.indexOf('rtcStatus')!= -1" popper-class="detailsPopper">
                            <span class="title">RTC时间测试</span>
                            <i :class="scope.row[i.prop]?'iconqualified':'iconwrong'"></i>
                            <span>{{scope.row[i.prop]?'通过':'未通过'}}  {{$filters.dateFilter(scope.row.updateCheckTime,'')}}  {{tableData[0].rtcTimeOffset}}s</span>
                            <div slot="reference" class="name-wrapper">
                                <i :class="scope.row[i.prop]?'iconqualified':'iconwrong'" style="cursor: pointer"></i>
                            </div>
                        </el-popover>
                        <i v-if="index>1&&index<12" :class="scope.row[i.prop]?'iconqualified':'iconwrong'" style="cursor: pointer"></i>
                        {{i.prop=='firstCheckTime'||i.prop=='updateCheckTime'?$filters.dateFilter(scope.row[i.prop],''):''}}
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination id="pagination" background align="right"
                @size-change="(val)=>{testRecords.pageSize = val;getTestRecords()}"
                @current-change="(val)=>{testRecords.pageNumber = val;getTestRecords()}"
                :current-page="1"
                :page-sizes="[20, 50, 100, 200]" :page-size="testRecords.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableHeader.pagination.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            complete:false,
            ruleData:{
                device:{
                    activeTime: null,
                    city: null,
                    createTime: "2019-08-12T08:02:56.572+0000",
                    deviceCode: "7777777",
                    deviceModel: "CF7",
                    deviceSN: "2032337C6CAC",
                    deviceType: "智能烹饪机",
                    district: null,
                    downloadMenuNumber: 0,
                    dtuVersion: "0.0",
                    id: "5d52100ed4719a3c279e9d89",
                    imageName: null,
                    init: true,
                    ip: null,
                    lastOfflineTime: null,
                    lastOnlineTime: null,
                    location: null,
                    mac: "2032337C6CAC",
                    mcuVersion: "0.0",
                    motorVersion: "0.0",
                    name: null,
                    online: false,
                    productLine: null,
                    productTime: "2019-08-12T08:02:59.595+0000",
                    province: null,
                    scaleVersion: "0.0",
                    padBinVersion:'0.0',
                    timestamp: 1565659150000,
                    updateTime: "2019-08-13T09:19:42.120+0000",
                }
            },
            macData:[],
            scaleHead:[
                {prop:'original',label:'砝码'},
                {prop:'leftUpper',label:'左上'},
                {prop:'leftDown',label:'左下'},
                {prop:'middle',label:'中间'},
                {prop:'rightUpper',label:'右上'},
                {prop:'rightDown',label:'右下'},
            ],
            scaleData:[
            ],
            displayData:[
                [{}]
                // {
                //     screenRed:'',
                //     screenBlue:'',
                //     screenGreen:'',
                // }
            ],
            tableHeader:{ sortMethod:function(){},
                tableStatus:false,
                filters:function(){},
                handleSelectionChange:100,//选中表格数据方法
                isSelection:[false,'55'],//是否显示序列号
                data:[//表格头数据绑定
                    // { label:'电子秤回检', prop:'scaleStatus', minWidth:'135',fixed:false},
                    { label:'显示屏测试', prop:'screenStatus', minWidth:'150',fixed:false},
                    { label:'RTC时间测试', prop:'rtcStatus', minWidth:'150',fixed:false},
                    { label:'触摸测试', prop:'touchStatus', minWidth:'150',fixed:false},
                    { label:'微动开关测试', prop:'switchStatus', minWidth:'120',fixed:false},
                    { label:'电机及编解码测试', prop:'machineStatus', minWidth:'140',fixed:false},
                    { label:'加热及NTC测试', prop:'heatingStatus', minWidth:'120',fixed:false},
                    { label:'通讯测试', prop:'communicationStatus', minWidth:'80',fixed:false},
                    { label:'声音测试', prop:'soundStatus', minWidth:'80',fixed:false},
                    { label:'信号强度', prop:'wifiSSRStatus', minWidth:'80',fixed:false},
                    { label:'亮度测试', prop:'brightnessStatus', minWidth:'80',fixed:false},
                    { label:'内置菜谱', prop:'buildInMenuStatus', minWidth:'80',fixed:false},
                    { label:'整机信息', prop:'wholeMachineStatus', minWidth:'80',fixed:false},
                    // { label:'首次检验日期', prop:'firstCheckTime', minWidth:'160',fixed:'right'},
                    { label:'检测更新日期', prop:'updateCheckTime', minWidth:'160',fixed:'right'},
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
            testRecords:{
                factoryTestId:this.$route.params.id,
                pageNumber:1,
                pageSize:20,
            }
        }
    },
    methods:{
        // render 事件
        renderHeader (h,{column}) { // h即为cerateElement的简写，具体可看vue官方文档
            return h(
                'div',
                [ 
                    h('span', column.label),
                    h('i', {
                        class:'iconicon-question tips',
                        style:'margin-left:5px;',
                    })
                ],
            );
        },
        getDetails(){
            this.$http.factoryTest({id:this.$route.params.id}).then(res=>{
                if(res.data.success){
                    if(res.data.data!=null){
                        this.complete = true;
                    }
                    this.ruleData = res.data.data;
                }
            })
        },
        getTestRecords(){
            this.$http.testRecords(this.testRecords).then(res=>{
                if(res.data.success){
                    this.tableData = res.data.rows;
                    this.tableHeader.pagination.total = res.data.total;
                    res.data.rows.forEach(i => {
                        this.displayData.push({
                            screenRed:i.screenRed?'通过':'未通过',
                            screenBlue:i.screenBlue?'通过':'未通过',
                            screenGreen:i.screenGreen?'通过':'未通过',
                            screenGrey:i.screenGrey?'通过':'未通过',
                        })
                    });
                    this.$nextTick(()=>{
                        this.tableHeader.tableStatus = true;
                    })
                }
            })
        },
        getMacRecords(){
            this.$http.macRecords({factoryTestId:this.$route.params.id}).then(res=>{
                if(res.data.success){
                    this.macData = res.data.datas;
                }
            })
        }
    },
    mounted(){
        this.getDetails();
        this.getTestRecords();
        this.getMacRecords();
    }
}
</script>

<style lang="less">
#plan-details{
    width: 100%;
    float: left;
    color: #59626C;
    .tips{
        color: #F02B54;
        cursor: pointer;
        font-size: 16px;
        position: relative;
        top: -3px;
        left: 4px;
    }
    >div{
        float: left;
        background: #fff;
        box-sizing: border-box;
        -webkit-box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
        box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }
    >.details-survey{
        width: calc(100% - 385px);
        height: 270px;
        margin-right: 20px;
        padding: 24px;
        >span{
            float: left;
            display: block;
            width: 50%;
            color: #59626C;
            font-size: 14px;
            margin-bottom: 16px;
            &.title{
                width: 100%;
                font-weight: bold;
                margin-bottom: 24px;
            }
        }
    }
    >.details-img{
        width: 365px;
        height: 270px;
        >img{
            width: 100%;
            height: 100%;
            display: block;
        }
    }
    >.details-table{
        margin-top: 20px;
        width: 100%;
        >.details-table-head{
            width: 100%;
            height: 70px;
            padding:0 24px;
            line-height: 70px;
            box-sizing: border-box;
            font-weight: bold;
            font-size: 14px;
            >p{
                float: right;
                font-size: 16px;
                margin-left: 40px;
                font-weight: 100;
            }
        }
    }
    #pagination{
        float: right;
        padding: 12px 12px 12px 0;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active{
        background-color: #F02B54;
    }
    .el-button+.el-button{
        margin-left: 0;
    }
    .fontSix{
        font-weight: 600;
    }
}
</style>
