import React,{ Component } from "react"
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types"
import { Descriptions ,Divider, Card, Row, Col,Modal,Button,Form,Input} from 'antd';
import  Contents from "../../components/content/content"
import {getApplyDetail, refuseApply} from "../../redux/actions";
import {formItemLayout, tailFormItemLayout} from "../../static/js/from";
const {confirm} = Modal;
const {TextArea}=Input;

class detail extends  Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        getApplyDetail:PropTypes.func.isRequired,
        applyRecord:PropTypes.object.isRequired,
        consentApply:PropTypes.func.isRequired,
        refuseApply:PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getHome();
        this.props.getApplyDetail(this.props.match.params.id);
    }

    state = {
        confirmDirty:false,
        visible:false,
        id:"",
        activeName:"拒绝",
        method:"拒绝",
        description:"",
        detail:"",
        apply:""
    }

    componentWillReceiveProps(next) {
        if (next.applyRecord != undefined) {
            const detail = next.applyRecord.applyRecord === undefined ? {} : next.applyRecord.applyRecord;
            const apply = next.applyRecord.verifyRecord;
            this.setState({detail, apply})
        }
    }

    handleSubmit = e => {
        const {id} = this.state;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                const account = {
                    id:id,
                    description:item.description,
                }
                if (this.state.method == "拒绝") {
                    this.props.refuseApply(account)
                }
                this.setState({
                    visible:false,
                });
                this.props.form.resetFields();
            }
        });
    };
    handleCancel = e => {
        this.setState({
            visible:false,
        });
    };
    pass = (id) => {
        const {consentApply} = this.props;
        confirm({
            title:'审批通过',
            content:'您确定要同意该资产审批?',
            okText:'确认',
            cancelText:'取消',
            onOk() {
                consentApply(id);
            },
            onCancel() {
            },
        });
    }
    refuse = (id) => {
        this.setState({
            visible:true,
            id:id
        });
    }

    render() {
        const {applyRecord} = this.props;
        const {activeName, description, detail, apply} = this.state;
        const {getFieldDecorator} = this.props.form;
        const list = apply === "" ? [] : apply;
        return (
            <div>
                <Contents pagesTitle={{first:"申领管理",second:"申请详情", url:"#/applyManage"}}>
                    <div style={{margin:"20px"}}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card title="资产详情" layout="vertical">
                                    <Descriptions column={1}>
                                        <Descriptions.Item label="资产分类">{detail.parentName}</Descriptions.Item>
                                        <Descriptions.Item label="资产品类">{detail.categoryName}</Descriptions.Item>
                                        <Descriptions.Item label="型号">{detail.model}</Descriptions.Item>
                                        <Descriptions.Item label="品牌/厂家">{detail.factory}</Descriptions.Item>
                                        <Descriptions.Item label="是否维修">{detail.repairStatus==1 ? (
                                            <span className="danger">是</span>) : (
                                            <span className="primary">否</span>)}</Descriptions.Item>
                                        <Descriptions.Item label="状态">{detail.status === 1 ? (
                                            <span className="primary">在库</span>) : detail.status === 2 ? (
                                            <span className="primary">在用</span>) : (
                                            <span className="danger">回收</span>)}</Descriptions.Item>
                                        <Descriptions.Item label="单位">{detail.organizationName}</Descriptions.Item>
                                        <Descriptions.Item label="部门">{detail.departmentName}</Descriptions.Item>
                                        <Descriptions.Item label="使用人">{detail.user}</Descriptions.Item>
                                        <Descriptions.Item label="创建时间">{detail.assetCreateTime}</Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={8}>
                                <Card title="申请详情" layout="vertical">
                                    <Descriptions column={1}>
                                        <Descriptions.Item label="申请用户">{detail.applicant}</Descriptions.Item>
                                        <Descriptions.Item label="资产申请人">{detail.assetOperator}</Descriptions.Item>
                                        <Descriptions.Item
                                            label="审批状态">{detail.verifyStatus === 1 ? "待审批" : apply.verifyStatus === 2 ? "审批中" : "审批完成"}</Descriptions.Item>
                                    </Descriptions>
                                    <Divider/>
                                    {
                                        list.map((c, index) => {
                                            if (c.verifyStatus == 0) {
                                                return (
                                                    <Descriptions column={1}>
                                                        <Descriptions.Item
                                                            label="预审">{c.status == 1 ? "同意":"拒绝"} ({c.operator}）</Descriptions.Item>
                                                        <Descriptions.Item label="日期">{c.createTime}</Descriptions.Item>
                                                        <Descriptions.Item
                                                            label="操作说明">{c.refuseReason}</Descriptions.Item>
                                                    </Descriptions>
                                                )
                                            } else if (c.verifyStatus == 1) {
                                                return (
                                                    <Descriptions column={1}>
                                                        <Descriptions.Item
                                                            label="二审">{c.status == 1 ? "同意":"拒绝"} ({c.operator}）</Descriptions.Item>
                                                        <Descriptions.Item label="日期">{c.createTime}</Descriptions.Item>
                                                        <Descriptions.Item
                                                            label="操作说明">{c.refuseReason}</Descriptions.Item>
                                                    </Descriptions>
                                                )
                                            } else {
                                                return (
                                                    <Descriptions column={1}>
                                                        <Descriptions.Item
                                                            label="终审">{c.status == 1 ? "同意":"拒绝"} ({c.operator}）</Descriptions.Item>
                                                        <Descriptions.Item label="日期">{c.createTime}</Descriptions.Item>
                                                        <Descriptions.Item
                                                            label="操作说明">{c.refuseReason}</Descriptions.Item>
                                                    </Descriptions>
                                                )
                                            }
                                        })
                                    }
                                    <div style={{display:detail.status===1 ? "inline-block" : "none"}}>
                                        <Button type="primary"
                                                onClick={this.pass.bind(this, detail.id)}>通过</Button> &nbsp;&nbsp;
                                        <Button type="danger" onClick={this.refuse.bind(this, detail.id)}>拒绝</Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="描述">
                            {getFieldDecorator('description', {
                                initialValue:description, rules:[
                                    {
                                        required:true,
                                        message:'请输入描述!',
                                        whitespace:true
                                    }],
                            })(<TextArea placeholder="请输入描述" autoSize={{minRows:3, maxRows:5}}/>)}
                        </Form.Item>
                        <Form.Item  {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                确认
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const applyDetail= Form.create({name:'detail'})(detail);
export default withRouter(applyDetail);