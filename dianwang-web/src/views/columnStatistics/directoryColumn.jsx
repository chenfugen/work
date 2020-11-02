import React, {Component} from "react"
import PropTypes from "prop-types"
import {Descriptions, Card, Row, Col, Avatar, Divider, Empty} from 'antd';
import Contents from "../../components/content/content"
const { Meta } = Card;
export default class statistics extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        getDirectoryCount:PropTypes.func.isRequired,
        assetCount:PropTypes.array.isRequired,
    }
    state={
        imgUrl: [
            "../../static/image/electrical_equipment_80.png",
            "../../static/image/furniture_80.png",
            "../../static/image/articles_80.png",
            "../../static/image/real_estate_80.png",
            "../../static/image/car_80.png",
            "../../static/image/renovation_80.png"
        ]
    }
    componentDidMount() {
        this.props.getHome();
        this.props.getDirectoryCount(this.props.match.params.id);
    }

    onChange = checked => {
        this.setState({ loading: !checked });
    };
    render() {
        const {assetCount} = this.props;
        const {imgUrl}=this.state;
        return (
            <div>
                <Contents pagesTitle={{first:"报表统计",second:"资产大类",three:"资产名录",url:"#/parentColumn"}}>
                    <div style={{margin:"20px"}}>
                        <Row gutter={16}>
                            {
                                assetCount.length ===0?(
                                    <div style={{background:'#fff'}}>
                                        <Empty style={{paddingTop:"20px"}}/>
                                    </div>
                                ):(
                                    assetCount.map((item, index) => <span key={index}>
                                <Col span={12} style={{marginBottom:"15px", cursor:"pointer"}}>
                                <Card title={item.model}
                                      extra={<a href={"#/assetManage?model=" +item.model}>查看资产</a>}>
                                <Descriptions column={2}>
                                <Descriptions.Item label="资产(件)"><span
                                    className={item.assetNums > 0 ? "primary" : "danger"}>{item.assetNums}</span></Descriptions.Item>
                                <Descriptions.Item label="在库(件)"><span
                                    className={item.assetNums-item.usingNums > 0 ? "primary" : "danger"}>{item.assetNums-item.usingNums}</span></Descriptions.Item>
                                </Descriptions>
                                </Card>
                                </Col>
                                </span>
                                    )
                                )
                            }
                        </Row>
                    </div>
                </Contents>
            </div>
        )
    }
}
