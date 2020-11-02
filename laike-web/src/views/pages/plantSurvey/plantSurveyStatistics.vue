<template>
    <div id="plantSurvey-statistics">
        <div id="model"
        style="width:calc((100% - 24px)/3);height:50%;margin-right:24px;">
            <div ref="spread" style="width:100%;height:100%"></div>
        </div>
        <div id="faultTrend" style="width:calc((100% - 24px)/3*2);height:50%;">
            <div class="inputForm">
                <TableSearch :tableSearch="faultTrendSearch" :tableData="null" :exportHead="null"></TableSearch>
            </div>
            <div class="radio">
                <el-radio-group v-model.trim="radio1" size="small" @change="getTestRecordTendency">
                    <el-radio-button label="1">24时</el-radio-button>
                    <el-radio-button label="2">月</el-radio-button>
                    <el-radio-button label="3">年</el-radio-button>
                </el-radio-group>
            </div>
            <div ref="faultTrend" style="width:100%;height:100%"></div>
        </div>
        <div id="spread" style="width: calc(100%);height: calc(50% - 24px);margin-top:23px;">
            <div class="radio">
                <TableSearch :tableSearch="spreadSearch" :tableData="null" :exportHead="null"></TableSearch>
            </div>
            <div ref="spread2" style="width:100%;height:100%"></div>
        </div>
    </div>
</template>

<script>
import indexEcharts from '../../../indexEcharts';
export default {
    data(){
        return{
            value: '1',
            radio1: '1',
            radio2: '月',
            deviceModels:[],
            deviceTypes:[],
            faultTrendData:{
                title:'检验趋势',
                subtext:'总计(台)',
                type:'line',
                sname:'2019-6',
                tip:function(params){
                    return "检验总数："+params[0].data.value+"<br/> 不合格数："+params[0].data.value1
                },
                name:[],
                value:[]
            },
            spreadData:{
                title:'检验产品总数',
                subtext:'总计(台)',
                total:'',
                tip:"{b}\n {c}台 ({d}%)",
                name:[],
                value:[],
            },
            spreadData2:{
                title:'检验故障分布',
                subtext:'',
                type:'bar',
                sname:'2019-6',
                name:[],
                value:[]
            },
            faultTrendSearch:{
                clearable:'0',
                isExport:false,
                exportName:'',
                funClick:this.getTestRecordTendency,
                seChang:this.getTestRecordTendency,
                cleanClick:this.cleanClick,
                input:[],
                select:[
                    { pla:'产品型号 ',width:'128',value:'CF7',
                    options:[]},
                    { pla:'产品类型',width:'128',value:'智能烹饪机',
                    options:[]},
                ]//表格选中数据集合
            },
            spreadSearch:{
                clearable:'0',
                isExport:false,
                exportName:'',
                funClick:this.getTestRecordDistribution,
                seChang:this.getTestRecordDistribution,
                cleanClick:this.cleanClick1,
                month:{
                    value:'',
                },
                input:[],
                select:[
                    { pla:'产品型号 ',width:'128',value:'CF7',
                    options:[]},
                    { pla:'产品类型',width:'128',value:'智能烹饪机',
                    options:[]},
                ]//表格选中数据集合
            },
        }
    },
    mounted(){
        this.indexEcharts();
        const that = this;
        window.onresize = () => {
            return (() => {
                this.$echarts.init(that.$refs.faultTrend).resize();
                this.$echarts.init(that.$refs.spread).resize();
                this.$echarts.init(that.$refs.spread2).resize();
            })()
        }
        this.$store.state.oldStore.deviceModels.forEach(i=>{
            this.spreadSearch.select[0].options.push({label:i,value:i});
            this.faultTrendSearch.select[0].options.push({label:i,value:i});
        })
        this.$store.state.oldStore.deviceTypes.forEach(i=>{
            this.spreadSearch.select[1].options.push({label:i,value:i});
            this.faultTrendSearch.select[1].options.push({label:i,value:i});
        })
    },
    methods:{
        indexEcharts(){
            this.$http.factoryTestProductStatistics().then(res=>{
                if(res.data.success){
                    this.spreadData.name = [];
                    this.spreadData.value = [];
                    res.data.datas.forEach(item=>{
                        this.spreadData.name.push(item[0])
                        this.spreadData.value.push({name:item[0],value:item[1]})
                    })
                this.spreadData.total = res.data.total;
                indexEcharts.model(this.$refs.spread,this.spreadData);
                }
            })
            this.getTestRecordTendency();
            this.getTestRecordDistribution();
        },
        cleanClick(){
            this.faultTrendSearch.select[0].value = '';
            this.faultTrendSearch.select[1].value = '智能烹饪机';
            this.getTestRecordTendency();
        },
        cleanClick1(){
            this.spreadSearch.month.value = '';
            this.spreadSearch.select[0].value = 'CF7';
            this.spreadSearch.select[1].value = '智能烹饪机';
            this.getTestRecordDistribution();
        },
        getTestRecordTendency(){
            this.$http.testRecordTendency({
                deviceType:this.faultTrendSearch.select[1].value,
                deviceModel:this.faultTrendSearch.select[0].value,
                type:this.radio1,//1：24小时（默认），2：月，3：年
            }).then(res=>{
                if(res.data.success){
                    this.faultTrendData.name = [];
                    this.faultTrendData.value = [];
                    res.data.datas.forEach(item=>{
                        this.faultTrendData.name.push(item[0])
                        this.faultTrendData.value.push({value:item[1],value1:item[2]})
                    })
                    indexEcharts.newTrend(this.$refs.faultTrend,this.faultTrendData);
                }
            })
        },
        getTestRecordDistribution(){
            this.$http.testRecordDistribution({
                deviceType:this.spreadSearch.select[1].value,
                deviceModel:this.spreadSearch.select[0].value,
                time:this.$filters.dateFilter(this.spreadSearch.month.value,''),//1：24小时（默认），2：月，3：年
            }).then(res=>{
                if(res.data.success){
                    this.spreadData2.name = [];
                    this.spreadData2.value = [];
                    for(var x in res.data.datas){
                        this.spreadData2.name.push(x)
                        this.spreadData2.value.push(res.data.datas[x])
                    }
                    indexEcharts.newTrend(this.$refs.spread2,this.spreadData2);
                }
            })
        },
    },
    destroyed () {
      window.onresize = null;
    }
}
</script>

<style lang="less">
#plantSurvey-statistics{
    float: left;
    height:100%;
    width:100%;
    min-height: 660px;
    min-width: 1090px;
    >div{
        border-radius: 4px;
        background:#fff;
        box-shadow: 0 3px 5px 0 rgba(0,0,0,0.05);
        float: left;
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
        >.select{
            height: 24px;
            top: 24px;
            right: 14px;
            width: 100px;
            position: absolute;
            z-index: 1;
            .el-input__icon{
                line-height: 24px;
            }
            input.el-input__inner{
                height: 24px;
            }
        }
    }
    #faultTrend,#spread{
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
            left: 80px;
            position: absolute;
            z-index: 1;
        }
    }
}
</style>
