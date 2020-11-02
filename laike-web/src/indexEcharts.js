
import echarts from 'echarts' //引入echarts
var indexEcharts = {
    offline: function (dom, data) {
        if (dom) {
            var option = {
                title: [{
                    text: '在离线统计',
                    left: 24,
                    top: 24,
                    textStyle: {
                        color: '#59626C',
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'PingFangSC-Medium',
                    },
                }, {
                    text: data.total,
                    subtext: '总数(台)',
                    left: 'center',
                    top: 'center',
                    itemGap: 5,
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                        fontFamily: 'PingFangSC-Medium',
                        color: '#59626C'
                    },
                    subtextStyle: {
                        color: '#999999',
                        fontSize: 12,
                        fontFamily: 'PingFangSC-Medium',
                    },
                }],
                tooltip: {
                    trigger: 'item',
                    position: 'right',
                    formatter: "{b}: {c}台 ({d}%)"
                },
                color: ['#60ACFC', '#FF7B7B'],
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    icon: "circle",
                    itemGap: 50,
                    bottom: '10',
                    data: ['在线', '离线']
                },
                series: [
                    {
                        name: '在离线统计',
                        type: 'pie',
                        radius: ['30%', '40%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            formatter: "{b}\n{c}台"
                        },
                        data: [
                            { value: data.online, name: '在线' },
                            { value: data.offline, name: '离线' }
                        ]
                    }
                ]
            }
            var echart = echarts.init(dom);
            echart.setOption(option);
        }
    },
    category: function (dom, data) {
        if (dom) {
            var option = {
                title: [{
                    text: '产品型号统计',
                    left: 24,
                    top: 24,
                    textStyle: {
                        color: '#59626C',
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'PingFangSC-Medium',
                    },
                }, {
                    text: data.total,
                    subtext: '总数(台)',
                    left: 'center',
                    top: 'center',
                    itemGap: 5,
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                        fontFamily: 'PingFangSC-Medium',
                        color: '#59626C',
                    },
                    subtextStyle: {
                        color: '#999999',
                        fontSize: 12,
                        fontFamily: 'PingFangSC-Medium',
                    },
                }],
                tooltip: {
                    trigger: 'item',
                    position: 'right',
                    formatter: "{a}\n {b}: {c}台 ({d}%)"
                },
                color: ['#60ACFC', '#32D3EB', '#5BC49F', '#FEB64D', '#FF7B7B', '#9287E7'],
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    icon: "circle",
                    itemGap: 10,
                    bottom: '10',
                    data: data.name
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['30%', '40%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            formatter: "{b}\n{c}台"
                        },
                        data: data.value
                    }
                ]
            }
            var echart = echarts.init(dom);
            echart.setOption(option);
        }
    },
    model: function (dom, data) {
        if (dom) {
            var option = {
                title: [{
                    text: data.title,
                    left: 24,
                    top: 24,
                    textStyle: {
                        color: '#59626C',
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'PingFangSC-Medium',
                    },
                }, {
                    text: data.total,
                    subtext: data.subtext,
                    left: 'center',
                    top: data.title == '故障分布' ? '52%' : 'center',
                    itemGap: 5,
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                        fontFamily: 'PingFangSC-Medium',
                        color: '#59626C'
                    },
                    subtextStyle: {
                        color: '#999999',
                        fontSize: 12,
                        fontFamily: 'PingFangSC-Medium',
                    },
                }],
                tooltip: {
                    trigger: 'item',
                    position: 'right',
                    formatter: data.tip,
                },
                color: ['#60ACFC', '#32D3EB', '#5BC49F', '#FEB64D', '#FF7B7B', '#9287E7'],
                legend: {
                    type: 'scroll',
                    orient: 'horizontal',
                    bottom: '26',
                    left: 'center',
                    data: data.name
                },
                series: [
                    {
                        type: 'pie',
                        avoidLabelOverlap: true,
                        radius: data.type == "all" ? '40%' : ['30%', '40%'],
                        center: data.title == '故障分布' ? ['50%', '56%'] : '50%',
                        label: {
                            show: true,
                            formatter: data.title == "故障分布" ? "{b}" : data.tip,
                        },
                        labelLine: {
                            normal: {
                                length: 10,
                                length2: 8,
                            }
                        },
                        data: data.value
                    }
                ]
            }
            var echart = echarts.init(dom);
            echart.setOption(option);
        }
    },
    spread: function (dom, data) {
        if (dom) {
            var option = {
                title: [{
                    text: '设备分布',
                    left: 24,
                    top: 24,
                    textStyle: {
                        color: '#59626C',
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'PingFangSC-Medium',
                    },
                }, {
                    text: data.total,
                    subtext: '总数(台)',
                    right: '24',
                    top: '16',
                    itemGap: 5,
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                        fontFamily: 'PingFangSC-Medium',
                        color: '#59626C',
                    },
                    subtextStyle: {
                        color: '#999999',
                        fontSize: 12,
                        fontFamily: 'PingFangSC-Medium',
                    },
                }],
                color: ['#60ACFC'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: "{b}: {c}台"
                },
                grid: {
                    left: '8%',
                    right: '8%',
                    bottom: '0',
                    containLabel: true
                },
                xAxis: [
                    {
                        show: false,
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: data.name,
                        axisLabel: {
                            color: '#59626C',
                            fontSize: 12,
                            fontFamily: 'PingFangSC-Medium',
                        },
                        axisLine: { show: false },
                        axisTick: { show: false },
                    }, {
                        type: 'category',
                        axisLine: { show: false },
                        axisTick: { show: false },
                        data: data.barValue
                    }
                ],
                series: [{
                    type: 'bar',
                    yAxisIndex: 1,
                    barGap: '-100%',
                    data: data.barData,
                    barWidth: '60%',
                    color: '#EBECF0',
                }, {
                    type: 'bar',
                    barWidth: '60%',
                    yAxisIndex: 0,
                    data: data.value
                }]
            }
            var echart = echarts.init(dom);
            echart.setOption(option);
        }
    },
    newTrend: function (dom, data) {
        if (dom) {
            var option = {
                title: [{
                    text: data.title,
                    left: 24,
                    top: 24,
                    textStyle: {
                        color: '#59626C',
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'PingFangSC-Medium',
                    },
                }],
                tooltip: {
                    trigger: 'axis',
                    formatter: data.tip || "{b}: {c}",
                    // formatter: function(params){
                    //     console.log(params)
                    //     return "检验趋势<br/> 检验总数："+params[0].data.value+"<br/> 不合格数："+params[0].data.value1
                    // },
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    top: '85',
                    bottom: '20',
                    x: 40,
                    y: 100,
                    y2: 150,
                    containLabel: true
                },
                color: '#60ACFC',
                xAxis: {
                    type: 'category',
                    axisTick: { show: false },
                    axisLabel: {
                        interval: 'auto',  //类目全显
                    },
                    data: data.name
                },
                yAxis: {
                    type: 'value',
                    axisLine: { show: false },
                    axisTick: { show: false },
                },
                dataZoom: data.title == '检验故障分布' ? [] : [{
                    type: 'inside',
                    startValue: data.value.length > 8 ? data.value.length - 8 : 0,
                    endValue: data.value.length
                }, {
                    start: 0,
                    end: 50,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '60%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 2,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                series: [{
                    name: data.sname,
                    data: data.value,
                    type: data.type,
                    barWidth: '60%',
                    smooth: true,
                    showSymbol: true,
                    areaStyle: {
                        normal: {
                            color: '#EFF6FE'
                        }
                    }
                }]
            }
            var echart = echarts.init(dom);
            echart.setOption(option);
        }
    },
}
export default indexEcharts;