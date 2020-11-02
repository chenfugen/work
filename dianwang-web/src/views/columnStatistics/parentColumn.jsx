import React, {Component} from "react"
import {withRouter} from 'react-router-dom'
import PropTypes from "prop-types"
import {Descriptions, Card, Row, Col, Avatar, Divider, Empty} from 'antd';
import Contents from "../../components/content/content"

const {Meta} = Card;

class parentColumn extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        getAssetCount:PropTypes.func.isRequired,
        assetCount:PropTypes.array.isRequired,
    }
    state = {
        imgUrl:[
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
        this.props.getAssetCount();
    }

    onChange = checked => {
        this.setState({loading:!checked});
    };
    categoryDetail = (id) => {
        this.props.history.push('/categoryColumn/' + id);
    }

    render() {
        const {assetCount} = this.props;
        const {imgUrl} = this.state;
        return (
            <div>
                <Contents pagesTitle={{first:"报表统计", second:"资产大类"}}>
                    <div style={{margin:"20px"}}>
                        <Row gutter={16}>
                            {
                                    assetCount.length === 0 ? (
                                        <div style={{background:'#fff'}}>
                                            <Empty style={{paddingTop:"20px"}}/>
                                        </div>
                                    ) : (assetCount.map((item, index) => <span key={index}>
                                    <Col span={12} style={{marginBottom:"15px", cursor:"pointer"}} >
                                             <Card title={item.parentName}
                                                   extra={<span><a href={"#/assetManage?parentId=" + item.parentId}>查看资产</a>&nbsp;&nbsp;<span className="primary"
                                                                                                                                              onClick={this.categoryDetail.bind(this, item.parentId)}> 资产品类 </span></span>}>
                                              {/*<Meta  avatar={ <Avatar src={imgUrl[index]}/>*/}
                                                 <Descriptions column={4}>
                                                  <Descriptions.Item label="品类(件)"><span
                                                      className={item.categoryNums > 0 ? "primary" : "danger"}>{item.categoryNums}</span></Descriptions.Item>
                                                 <Descriptions.Item label="名录(个)"><span
                                                     className={item.directoryNums > 0 ? "primary" : "danger"}>{item.directoryNums}</span></Descriptions.Item>
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
                            export default withRouter(parentColumn);