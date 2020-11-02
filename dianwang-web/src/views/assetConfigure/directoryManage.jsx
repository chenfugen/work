import React, {Component} from "react"
import PropTypes from "prop-types"
import {Modal, Form, Input, Icon, Button, Cascader, message} from 'antd';
import Contents from "../../components/content/content"
import Tables from "../../components/table/table"
import {formItemLayout, tailFormItemLayout, formItemLayoutWithOutLabel} from "../../static/js/from";
import cookie from "react-cookies";

const {confirm} = Modal;
let id = 0;

class category extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        getDirectory:PropTypes.func.isRequired,
        directory:PropTypes.object.isRequired,
        getCategory:PropTypes.func.isRequired,
        getParent:PropTypes.func.isRequired,
        category:PropTypes.object.isRequired,
        parent:PropTypes.object.isRequired,
        createDirectory:PropTypes.func.isRequired,
        editDirectory:PropTypes.func.isRequired,
        exportDirectory:PropTypes.func.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        id:"",
        activeName:"新增",
        isAdd:false,
        categoryList:[],
        asssetList:[],
        method:"新增",
        categoryId:"",
        factory:"",
        model:"",
        unit:"",
        attribute:"",
    }

    componentDidMount() {
        this.props.getDirectory(1, 10);
        this.props.getCategory(1, 100);
        this.props.getParent(1, 100);
        this.props.getHome();
    }

    componentWillReceiveProps(next) {
        if (next.category.list !== undefined) {
            const categoryList = [];
            const category = next.category.list;
            const parent = next.parent.data;
            for (let i in parent) {
                categoryList[i] = {
                    label:parent[i].name,
                    value:parent[i].id,
                    children:[]
                };
                for (let j in category) {
                    if (parent[i].id === category[j].parentId) {
                        categoryList[i]["children"][j] = {
                            label:category[j].categoryName,
                            value:category[j].categoryId,
                        };
                    }
                }
            }
            this.setState({categoryList})
        }
    }

    changePageSize = (pageNum, pageSize) => {
        this.props.getDirectory(pageNum, pageSize)
    }
    changePageNum = (pageNum, pageSize) => {
        this.props.getDirectory(pageNum, pageSize)
    }
    handleSubmit = e => {
        const {isAdd} = this.state;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                const attribute = [];
                const titles = item.titles;
                if (titles !== undefined) {
                    for (let i in titles) {
                        attribute[i] = {
                            title:titles[i],
                            value:""
                        }
                    }
                }
                if (isAdd) {
                    if (this.state.method === "新增") {
                        const account = {
                            categoryId:item.asssetList[1],
                            factory:item.factory,
                            model:item.model,
                            unit:item.unit,
                            attribute:attribute.length === 0 ? "" : JSON.stringify(attribute),
                        }
                        this.props.createDirectory(account);
                    }else{
                        const account = {
                            id:this.state.id,
                            factory:item.factory,
                            model:item.model,
                            unit:item.unit,
                            attribute:attribute.length === 0 ? "" : JSON.stringify(attribute),
                        }
                        this.props.editDirectory(account);
                    }
                    this.setState({
                        visible:false,
                    });
                    this.props.form.resetFields();
                } else {
                    message.error("请选择有具体品类的资产");
                }
            }
        });
    };
    add = () => {
        this.setState({
            visible:true,
            activeName:"新增",
            method:"新增",
            isAdd:false,
            asssetList:[],
            categoryId:"",
            factory:"",
            model:"",
            unit:"",
            attribute:"",
        });
    }
    handleCancel = e => {
        this.setState({
            visible:false,
        });
    };
    remove = k => {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys:keys.filter(key => key !== k),
        });
    };

    addAttribute = () => {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
            keys:nextKeys,
        });
    };
    selectCategory = value => {
        if (value.length === 1) {
            message.error("请选择有具体品类的资产");
            this.setState({isAdd:false});
        } else {
            this.setState({isAdd:true});
        }
    }
    detail = id => {
        console.log(id);
    }
    edit = asset => {
        this.setState({
            visible:true,
            activeName:"编辑",
            method:"编辑",
            id:asset.directoryId,
            isAdd:true,
            asssetList:[asset.parentId,asset.categoryId],
            factory:asset.factory,
            model:asset.model,
            unit:asset.unit,
            attribute:asset.attribute=== "" ? "" : JSON.parse(asset.attribute),
        });
    }
    delete = id => {
        const {delAccount} = this.props;
        confirm({
            title:'删除',
            content:'您确定要删除该账户吗?',
            okText:'确认',
            okType:'danger',
            cancelText:'取消',
            onOk() {
                delAccount(id)
            },
            onCancel() {
            },
        });
    }

    derived=()=> {
        cookie.save("fileName","资产名录数据")
       this.props.exportDirectory();
    }

    render() {
        const {directory, category} = this.props;
        const {activeName, categoryList, asssetList, factory, model, unit,} = this.state;
        var arr = Object.keys(category);
        const list = arr.length === 0 ? [] : category.data === undefined ? category.list : category.data;
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'资产大类',
                dataIndex:'parentName',
            },
            {
                title:'资产品类',
                dataIndex:'categoryName',
            },
            {
                title:'资产名录',
                dataIndex:'model',
            },
            {
                title:'品牌/厂家',
                dataIndex:'factory',
            },
            {
                title:'单位',
                dataIndex:'unit',
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
            {
                title:'操作 ',
                render:(asset) => <span> <span className="primary" onClick={this.edit.bind(this, asset)}> 编辑 </span> </span>
        //         render:(asset) => <span> <span className="primary"
        //                                        onClick={this.detail.bind(this, asset.id)}> 详情 </span> </span>
        //             &nbsp;&nbsp;
        // <span className="danger" onClick={this.delete.bind(this, asset.id)}> 删除 </span>
    }];

        getFieldDecorator('keys', {initialValue:[]});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayout)}
                label={index === 0 ? '属性1' : '属性' + (index + 1)}
                required={false}
                key={k}
            >
                {getFieldDecorator(`titles[${k}]`, {
                    validateTrigger:['onChange', 'onBlur'],
                    rules:[
                        {
                            required:true,
                            whitespace:true,
                            message:"请输入增加的属性名称",
                        },
                    ],
                })(<Input placeholder="属性名称" style={{width:'60%', marginRight:8}}/>)}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));
        return (
            <div>
                <Contents pagesTitle={{first:"后勤资产管理", second:"名录管理"}}>
                    <Tables isAdd isExport derived={this.derived} add={this.add} data={directory} columns={columns} changePageSize={this.changePageSize}
                            changePageNum={this.changePageNum}/>
                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                        {
                            activeName === "新增" ? (
                        <Form.Item label="所属资产">
                            {getFieldDecorator('asssetList', {
                                initialValue:asssetList,
                                rules:[
                                    {type:'array', required:true, message:'请选择详所属资产!'},
                                ],

                            })(<Cascader options={categoryList} onChange={this.selectCategory} placeholder="所属资产"/>)}
                        </Form.Item>):(
                                <Form.Item label="所属资产">
                                    {getFieldDecorator('asssetList', {
                                        initialValue:asssetList,
                                        rules:[
                                            {type:'array', required:true, message:'请选择详所属资产!'},
                                        ],

                                    })(<Cascader options={categoryList} onChange={this.selectCategory} placeholder="所属资产" disabled />)}
                                </Form.Item>
                            )}
                        <Form.Item label="厂商/品牌">
                            {getFieldDecorator('factory', {
                                initialValue:factory,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入厂商/品牌!',
                                        whitespace:true
                                    }],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="规格/型号">
                            {getFieldDecorator('model', {
                                initialValue:model,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入规格/型号!',
                                        whitespace:true
                                    }],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="计量单位">
                            {getFieldDecorator('unit', {
                                initialValue:unit,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入资产单位!',
                                        whitespace:true
                                    }],
                            })(<Input/>)}
                        </Form.Item>
                        {formItems}
                        <Form.Item {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={this.addAttribute} style={{width:'60%'}}>
                                <Icon type="plus"/> 增加属性
                            </Button>
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

const sortManage = Form.create({name:'category'})(category);
export default sortManage