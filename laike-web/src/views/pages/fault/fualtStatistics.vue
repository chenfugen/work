<template>
    <div id="fualt">
        <div id="model"
        style="width:calc((100% - 24px)/3);height:50%;margin-right:24px;">
            <div class="select">
                <el-select v-model.trim="deviceModel" placeholder="产品型号" @change="faultPieStatistics">
                    <el-option v-for="(i,x) in $store.state.oldStore.deviceModels" :key="x" :label="i" :value="i"></el-option>
                </el-select>
            </div>
            <div class="select last">
                <el-select v-model.trim="deviceType" placeholder="产品类型" @change="faultPieStatistics">
                    <el-option v-for="(i,x) in $store.state.oldStore.deviceTypes" :key="x" :label="i" :value="i"></el-option>
                </el-select>
            </div>
            <div ref="spread" style="width:100%;height:100%"></div>
        </div>
        <div id="spread" style="width:calc((100% - 24px)/3*2);height:50%;">
            <div class="radio">
                <TableSearch :tableSearch="spreadSearch" :tableData="null" :exportHead="null"></TableSearch>
            </div>
            <div ref="spread2" style="width:100%;height:100%"></div>
        </div>
        <div id="faultTrend"
        style="width: calc(100%);height: calc(50% - 24px);margin-top:23px;">
            <div class="inputForm">
                <TableSearch :tableSearch="faultTrendSearch" :tableData="null" :exportHead="null"></TableSearch>
            </div>
            <div class="radio">
                <el-radio-group v-model.trim="radio1" size="small" @change="faultNewTendency">
                    <el-radio-button label="1">24时</el-radio-button>
                    <el-radio-button label="2">月</el-radio-button>
                    <el-radio-button label="3">年</el-radio-button>
                </el-radio-group>
            </div>
            <div ref="faultTrend" style="width:100%;height:100%"></div>
        </div>
    </div>
</template>

<script>
import indexEcharts from '../../../indexEcharts';
export default {
    data(){
        return{
            radio1: '1',
            deviceModel:'CF7',
            deviceType:'智能烹饪机',
            faultTrendData:{
                title:'故障趋势',
                subtext:'总数(次)',
                type:'line',
                sname:'2019-6',
                tip:"{b}\n故障总计：{c}",
                name:[],
                value:[]
            },
            spreadData:{
                title:'故障分布',
                subtext:'报警总数(次)',
                tatol:'99999',
                // tip:"{b}<br/>{c}次 {d}%",
                tip:function(params){
                    return params.data.name+' '+params.data.cen+'<br/>'+params.data.value+'次 '+params.percent+'%';
                },
                name:[],
                value:[],
            },
            spreadData2:{
                title:'故障分布（次）',
                subtext:'',
                type:'bar',
                tatol:'',
                sname:'2019-6',
                name:[],
                tip:function(params){
                    return params[0].data.name+' '+params[0].data.cen+'<br/>'+params[0].data.value+'次 ';
                },
                value:[]
            },
            faultTrendSearch:{
                clearable:'0',
                isExport:false,
                exportName:'',
                funClick:this.faultNewTendency,
                seChang:this.faultNewTendency,
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
                funClick:this.faultLineStatistics,
                seChang:this.faultLineStatistics,
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
    watch:{
    },
    mounted(){
        this.$store.state.oldStore.deviceModels.forEach(i=>{
            this.spreadSearch.select[0].options.push({label:i,value:i});
            this.faultTrendSearch.select[0].options.push({label:i,value:i});
        })
        this.$store.state.oldStore.deviceTypes.forEach(i=>{
            this.spreadSearch.select[1].options.push({label:i,value:i});
            this.faultTrendSearch.select[1].options.push({label:i,value:i});
        })
        this.indexEcharts();
        const that = this;
        window.onresize = () => {
            return (() => {
                this.$echarts.init(that.$refs.faultTrend).resize();
                this.$echarts.init(that.$refs.spread).resize();
                this.$echarts.init(that.$refs.spread2).resize();
            })()
        }
    },
    methods:{
        indexEcharts(){
            this.faultPieStatistics();
            this.faultLineStatistics();
            this.faultNewTendency();
        },
        faultPieStatistics(){
            this.$http.faultPieStatistics({
                deviceType:this.deviceType,
                deviceModel:this.deviceModel,
            }).then(res=>{
                if(res.data.success){
                    this.spreadData.name = [];
                    this.spreadData.value = [];
                    var total = 0;
                    res.data.datas.forEach(item=>{
                        this.spreadData.name.push(item[0])
                        this.spreadData.value.push({name:item[0],value:item[1],cen:item[2]})
                        total += item[1];
                    })
                    this.spreadData.total = total;
                    indexEcharts.model(this.$refs.spread,this.spreadData);
                }
            })
        },
        faultLineStatistics(){
            this.$http.faultLineStatistics({
                deviceType:this.spreadSearch.select[1].value,
                deviceModel:this.spreadSearch.select[0].value,
                reportTime:this.$filters.dateFilter(this.spreadSearch.month.value,''),//1：24小时（默认），2：月，3：年
            }).then(res=>{
                if(res.data.success){
                    this.spreadData2.name = [];
                    this.spreadData2.value = [];
                    res.data.datas.forEach(x=>{
                        this.spreadData2.name.push(x[0])
                        this.spreadData2.value.push({name:x[0],value:x[1],cen:x[2]})
                    })
                indexEcharts.newTrend(this.$refs.spread2,this.spreadData2);
                }
            })
        },
        faultNewTendency(){
            this.$http.faultNewTendency({
                deviceType:this.faultTrendSearch.select[1].value,
                deviceModel:this.faultTrendSearch.select[0].value,
                type:this.radio1,//1：24小时（默认），2：月，3：年
            }).then(res=>{
                if(res.data.success){
                    this.faultTrendData.name = [];
                    this.faultTrendData.value = [];
                    res.data.datas.forEach(x=>{
                        this.faultTrendData.name.push(x[0])
                        this.faultTrendData.value.push(x[1])
                    })
                indexEcharts.newTrend(this.$refs.faultTrend,this.faultTrendData);
                }
            })
        },
        trendBtnClick(){
        },
        cleanClick(){
            this.faultTrendSearch.select[0].value = '';
            this.faultTrendSearch.select[1].value = '智能烹饪机';
            this.faultNewTendency();
        },
        cleanClick1(){
            this.spreadSearch.month.value = '';
            this.spreadSearch.select[0].value = 'CF7';
            this.spreadSearch.select[1].value = '智能烹饪机';
            this.faultLineStatistics();
        },
    },
    destroyed () {
      window.onresize = null;
    }
}
</script>

<style lang="less">
#fualt{
    float: left;
    // overflow-y: auto;
    // overflow-x: hidden;
    height:100%;
    width:100%;
    min-height: 660px;
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
            right: 10px;
            width: 70px;
            position: absolute;
            z-index: 1;
            &.last{
                width: 110px;
                right: 88px;
            }
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
            left: 130px;
            position: absolute;
            z-index: 1;
        }
    }
}
</style>
