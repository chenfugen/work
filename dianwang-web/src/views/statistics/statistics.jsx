import React,{ Component } from "react"
import PropTypes from "prop-types"
import {
    Chart,
    Geom,
    Axis,
    Tooltip} from "bizcharts";
import { Statistic, Card, Row, Col ,Divider } from 'antd';
import  Contents from "../../components/content/content"
import "./statistics.scss"
export default class statistics extends  Component{
    static propTypes={
        getHome:PropTypes.func.isRequired,
        getAsset:PropTypes.func.isRequired,
        asset:PropTypes.object.isRequired,
        getApplyNum:PropTypes.func.isRequired,
        getUseNum:PropTypes.func.isRequired,
        useCount:PropTypes.number.isRequired,
        applyCount:PropTypes.number.isRequired,
        getChartData:PropTypes.func.isRequired,
        chartData:PropTypes.object.isRequired,
    }
    componentDidMount(){
        this.props.getHome();
        this.props.getAsset(1,1);
        this.props.getUseNum();
        this.props.getApplyNum();
        this.props.getChartData();
    }
    render() {
        const {useCount,applyCount,asset,chartData}=this.props;
        const data =chartData.asset;
        const Formdata =chartData.applyRecord;

        const cols = {
            nums: {
                min: 0
            },
            time: {
                range: [0, 1],
                alias:'月份' // 别名
            }
        };
        const Formcols = {
            nums: {
                min: 0,
            },
            time: {
                range: [0.05, 1],
                tickInterval: 20,
                alias:'月份' // 别名
            }
        };
        return(
            <div>
                <Contents pagesTitle={{first:"后勤资产统计",second:"后勤资产统计"}}  >
                    <div className="assetCount" style={{margin:"20px"}}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="资产总数"
                                        value={asset.total}
                                        valueStyle={{ color: '#229794' }}
                                        prefix={<i className="iconfont icon-assetCount"/>}
                                        suffix="个"
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="当日申请"
                                        value={applyCount}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix={<i className="iconfont icon-applyCount"/>}
                                        suffix="个"
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="当日领用"
                                        value={useCount}
                                        valueStyle={{ color: '#cf1322' }}
                                        prefix={<i className="iconfont icon-receive"/>}
                                        suffix="个"
                                    />
                                </Card>
                            </Col>
                        </Row>
                        <Divider dashed style={{margin:"40px 0px"}} />
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card>
                                <h3 style={{fontWeight:"bold"}}>资产每月领用情况</h3>
                                <Chart height={350} data={data} scale={cols} padding="auto"  forceFit>
                                    <Axis name="time"/>
                                    <Axis name="nums"/>
                                    <Tooltip
                                        crosshairs={{
                                            type: "y"
                                        }}
                                    />
                                    <Geom type="line" position="time*nums" size={2} />
                                    <Geom
                                        type="point"
                                        position="time*nums"
                                        size={4}
                                        shape={"circle"}
                                        style={{
                                            stroke: "#fff",
                                            lineWidth: 1
                                        }}
                                    />
                                </Chart>
                                </Card>
                            </Col>
                            <Col span={16}>
                                <Card>
                                    <h3 style={{fontWeight:"bold"}}>资产每月申请柱形图</h3>
                                    <Chart height={350} padding="auto"  data={Formdata} scale={Formcols} forceFit>
                                        <Axis name="time" />
                                        <Axis name="nums" />
                                        <Tooltip
                                            crosshairs={{
                                                type: "y"
                                            }}
                                        />
                                        <Geom type="interval" position="time*nums" size={30} />
                                    </Chart>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Contents>
            </div>
        )
    }
}
