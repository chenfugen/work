import React, {Component} from "react"
import PropTypes from "prop-types"
import {Modal, Form, Input, Button, Select} from 'antd';
import Contents from "../../components/content/content"
import Tables from "../../components/table/table"
import {formItemLayout, tailFormItemLayout} from "../../static/js/from"
import cookie from "react-cookies";

const {confirm} = Modal;
const {Option} = Select;

class category extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        getCategory:PropTypes.func.isRequired,
        category:PropTypes.object.isRequired,
        getAllParent:PropTypes.func.isRequired,
        allParent:PropTypes.array.isRequired,
        createCategory:PropTypes.func.isRequired,
        editCategory:PropTypes.func.isRequired,
        exportCategory:PropTypes.func.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        activeName:"新增",
        method:"新增",
        parentId:"",
        name:""
    }

    componentDidMount() {
        this.props.getCategory(1, 10);
        this.props.getAllParent();
        this.props.getHome();
    }

    changePageSize = (pageNum, pageSize) => {
        this.props.getCategory(pageNum, pageSize)
    }
    changePageNum = (pageNum, pageSize) => {
        this.props.getCategory(pageNum, pageSize)
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {

                if (this.state.method === "新增") {
                    const account = {
                        parentId:item.parentId,
                        name:item.name,
                    }
                    this.props.createCategory(account)
                }else {
                    const account = {
                        id:this.state.id,
                        name:item.name,
                    }

                    this.props.editCategory(account)
                }
                this.setState({
                    visible:false,
                });
                this.props.form.resetFields();
            }
        });
    };
    add = () => {
        this.setState({
            visible:true,
            activeName:"新增",
            method:"新增",
            parentId:"",
            name:""
        });
    }
    edit = asset => {
        this.setState({
            visible:true,
            activeName:"编辑",
            method:"编辑",
            id:asset.categoryId,
            parentId:asset.parentId,
            name:asset.categoryName,
        });
    }
    detail = id => {
        console.log(id);
    }
    delete = id => {
        // const {delAccount} = this.props;
        confirm({
            title:'删除',
            content:'您确定要删除该仓库吗?',
            okText:'确认',
            okType:'danger',
            cancelText:'取消',
            onOk() {
                // delAccount(id)
            },
            onCancel() {
            },
        });
    }

    handleCancel = e => {
        this.setState({
            visible:false,
        });
    };
    derived = () => {
        cookie.save("fileName", "资产品类数据")
        this.props.exportCategory();
    }

    render() {
        const {category, allParent} = this.props;
        const {activeName, parentId, name} = this.state;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'资产分类',
                dataIndex:'parentId',
                render:(parentId) =>
                    allParent.map((item, index) =>
                        item.id === parentId ? item.name : ""
                    )
            },
            {
                title:'资产品类',
                dataIndex:'categoryName',
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            }, {
                title:'操作 ',
                render:(asset) => <span> <span className="primary"
                                               onClick={this.edit.bind(this, asset)}> 编辑 </span> </span>
                //     render:(asset) => <span> <span className="primary" onClick={this.detail.bind(this, asset.id)}> 详情 </span> &nbsp;&nbsp;
                // <span className="danger" onClick={this.delete.bind(this, asset.id)}> 删除 </span>  </span>
            }];

        return (
            <div>
                <Contents pagesTitle={{first:"后勤资产管理", second:"品类管理"}}>
                    <Tables isAdd isExport derived={this.derived} add={this.add} data={category} columns={columns}
                            changePageSize={this.changePageSize}
                            changePageNum={this.changePageNum}/>
                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    {
                        activeName === "新增" ? (
                            <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                                <Form.Item label="资产大类">
                                    {getFieldDecorator('parentId', {
                                        initialValue:parentId,
                                        rules:[{required:true, message:'请选择资产大类!'}],
                                    })(
                                        <Select
                                            placeholder="请选择资产大类"
                                        >
                                            {
                                                allParent.map((c, index) => <Option value={c.id}
                                                                                    key={index}>{c.name}</Option>)
                                            }
                                        </Select>,
                                    )}
                                </Form.Item>
                                <Form.Item label="品类名称">
                                    {getFieldDecorator('name', {
                                        initialValue:name,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入资产名称!',
                                                whitespace:true
                                            }],
                                    })(<Input/>)}
                                </Form.Item>
                                <Form.Item  {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit">
                                        确认
                                    </Button>
                                </Form.Item>
                            </Form>) : (
                            <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                                <Form.Item label="资产大类">
                                    {getFieldDecorator('parentId', {
                                        initialValue:parentId,
                                        rules:[{required:true, message:'请选择资产大类!'}],
                                    })(
                                        <Select
                                            placeholder="请选择资产大类"
                                            disabled
                                        >
                                            {
                                                allParent.map((c, index) => <Option value={c.id}
                                                                                    key={index}>{c.name}</Option>)
                                            }
                                        </Select>,
                                    )}
                                </Form.Item>
                                <Form.Item label="品类名称">
                                    {getFieldDecorator('name', {
                                        initialValue:name,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入资产名称!',
                                                whitespace:true
                                            }],
                                    })(<Input/>)}
                                </Form.Item>
                                <Form.Item  {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit">
                                        确认
                                    </Button>
                                </Form.Item>
                            </Form>
                        )
                    }
                </Modal>
            </div>
        )
    }
}

const sortManage = Form.create({name:'category'})(category);
export default sortManage