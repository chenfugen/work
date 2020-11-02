import React, {Component} from "react"
import PropTypes from "prop-types"
import {withRouter} from 'react-router-dom'
import {Modal, Form, Input, Button, InputNumber, Cascader, Divider, Menu, Dropdown, Icon} from 'antd';
import Contents from "../../components/content/content"
import Search from "../../components/search/search"
import Tables from "../../components/table/table"
import {formItemLayout, tailFormItemLayout} from "../../static/js/from"
import Address from "../../static/js/address"
import cookie from "react-cookies";

const {confirm} = Modal;

class build extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        build:PropTypes.object.isRequired,
        getBuild:PropTypes.func.isRequired,
        createBuild:PropTypes.func.isRequired,
        delBuild:PropTypes.func.isRequired,
        exportBuild:PropTypes.func.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        id:"",
        activeName:"新增",
        method:"新增",
        searchList:{},
        name:"",
        number:"",
        upstairs:"",
        downstairs:"",
        belongto:"",
        province:"",
        city:"",
        address:"",
        region:"",
        site:""
    }

    componentDidMount() {
        this.props.getHome();
        this.props.getBuild(1, 10);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                const account = {
                    verifyLevel:item.verifyLevel,
                    name:item.name,
                    number:item.number,
                    upstairs:item.upstairs,
                    downstairs:item.downstairs,
                    belongto:item.belongto,
                    province:item.site[0],
                    city:item.site[1],
                    region:item.site[2],
                    address:item.address,
                }
                if (this.state.method == "新增") {
                    this.props.createBuild(account);
                }
                this.setState({
                    visible:false,
                });
                this.props.form.resetFields();
            }
        });
    };

    detail = (id) => {
        this.props.history.push('/realBstateDetail/' + id);
    }
    delete = (id) => {
        const {delBuild} = this.props;
        confirm({
            title:'删除',
            content:'您确定要删除该不动产吗?',
            okText:'确认',
            okType:'danger',
            cancelText:'取消',
            onOk() {
                delBuild(id)
            },
            onCancel() {
            },
        });
    }
    changePageSize = (pageNum, pageSize) => {
        const {searchList} = this.state;
        this.props.getBuild(pageNum, pageSize, searchList)
    }
    changePageNum = (pageNum, pageSize) => {
        const {searchList} = this.state;
        this.props.getBuild(pageNum, pageSize, searchList)
    }
    handleCancel = e => {
        this.setState({
            visible:false,
            isPermission:false,
        });
    };
    add = () => {
        this.setState({
            visible:true,
            activeName:"新增",
            method:"新增",
            name:"",
            number:"",
            upstairs:0,
            downstairs:0,
            belongto:"",
            province:"",
            city:"",
            address:"",
            region:"",
            site:"",
        });
    }

    derived = () => {
        cookie.save("fileName", "不动产数据");
        this.props.exportBuild();
    }
    search = (value) => {
        const {getBuild} = this.props;
        let searchList = {
            name:value.name,
            number:value.number,
            belongto:value.belongto,
            province:value.address[0],
            city:value.address[1],
            region:value.address[2],
        }
        this.setState({searchList})
        getBuild(1, 10, searchList)
    }
    clearSearch = () => {
        this.setState({searchList:{}})
        const {getBuild} = this.props;
        getBuild(1, 10);
    }

    render() {
        const {build} = this.props;
        const {activeName, name, number, downstairs, upstairs, belongto, address, site} = this.state;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'不动产名称',
                dataIndex:'name',
            },
            {
                title:'楼号（楼/座）',
                dataIndex:'number',
            },
            {
                title:'地面层高（层）',
                dataIndex:'upstairs',
            },
            {
                title:'地下层高（层）',
                dataIndex:'downstairs',
            },
            {
                title:'产权所属 ',
                dataIndex:'belongto',
            },
            {
                title:'VR查看',
                width:150,
                render:(build) => build.vrUrl===null?"--":build.selectFlag === 0 ? (<a href={build.vrUrl} target="_blank"> 查看 </a>) : (
                    <Dropdown overlayClassName="dropdown" trigger={['click']} overlay={() => {
                        return (
                            <Menu>
                                {
                                    JSON.parse(build.vrUrl).map((c, index) => <Menu.Item key={index}>
                                        <a target="_blank" rel="VR地址" href={c.url}>{c.name}</a>
                                    </Menu.Item>)
                                }
                            </Menu>
                        )
                    }}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            查看 <Icon type="down"/>
                        </a>
                    </Dropdown>)
            },
            {
                title:'详细地址 ',
                render:(build) => build.province + build.city + build.region + build.address
            },
            {
                title:'操作 ',
                fixed:'right',
                width:150,
                render:(build) => <span><span className="primary"
                                              onClick={this.detail.bind(this, build.id)}> 详情 </span>&nbsp;&nbsp;<span
                    className="danger" onClick={this.delete.bind(this, build.id)}> 删除 </span></span>
            }];
        const searchList = [
            {
                title:"不动产名称",
                dataIndex:'name',
                type:"string",
                value:""
            },
            {
                title:"楼号(楼/座)",
                dataIndex:'number',
                type:"string",
                value:""
            },
            {
                title:"产权所属",
                dataIndex:'belongto',
                type:"string",
                value:""
            },
            {
                title:"省市区",
                dataIndex:'address',
                type:"address",
                value:[]
            }
        ]
        return (
            <div>
                <Contents pagesTitle={{first:"不动产管理", second:"不动产管理"}}>
                    <div>
                        <Search search={this.search} searchList={searchList} clearSearch={this.clearSearch}
                                Address={Address}></Search>
                        <span className="divider"> <Divider dashed/></span>
                        <Tables isAdd isExport derived={this.derived} add={this.add} data={build} columns={columns}
                                changePageSize={this.changePageSize}
                                changePageNum={this.changePageNum}/>
                    </div>
                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="不动产名称">
                            {getFieldDecorator('name', {
                                initialValue:name,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入不动产名称!',
                                        whitespace:true
                                    }],
                            })(<Input placeholder="请输入不动产名称"/>)}
                        </Form.Item>
                        <Form.Item label="楼号(楼/座)">
                            {getFieldDecorator('number', {
                                initialValue:number,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入产权所属!',
                                        whitespace:true
                                    }],
                            })(<Input placeholder="请输入楼号"/>)}
                        </Form.Item>
                        <Form.Item label="地面层高">
                            {getFieldDecorator('upstairs', {
                                initialValue:upstairs, rules:[
                                    {required:true, message:'请输入'},
                                ],
                            })(<InputNumber min={0} max={100}/>)}
                        </Form.Item>
                        <Form.Item label="地下层高">
                            {getFieldDecorator('downstairs', {
                                initialValue:downstairs, rules:[
                                    {required:true, message:'请输入'},
                                ],
                            })(<InputNumber min={0} max={5}/>)}
                        </Form.Item>
                        <Form.Item label="产权所属">
                            {getFieldDecorator('belongto', {
                                initialValue:belongto,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入产权所属!',
                                        whitespace:true
                                    }],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="所属城市">
                            {getFieldDecorator('site', {
                                initialValue:site,
                                rules:[
                                    {type:'array', required:true, message:'请选择详所属城市!'},
                                ],
                            })(<Cascader options={Address} placeholder="省市区"/>)}
                        </Form.Item>
                        <Form.Item label="详细地址">
                            {getFieldDecorator('address', {
                                initialValue:address,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入详细地址!',
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
                </Modal>
            </div>
        )
    }
}

const realBstate = Form.create({name:'build'})(build);
export default withRouter(realBstate);