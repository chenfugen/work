import React from "react"
import PropTypes from "prop-types"
import {Form, Row, Col, Input, Button, InputNumber, Cascader, Select} from 'antd';
import "./search.scss";

const {Option} = Select;

class AdvancedSearchForm extends React.Component {
    static propTypes = {
        searchList:PropTypes.array,
        search:PropTypes.func,
        Address:PropTypes.array,
        department:PropTypes.array,
        clearSearch:PropTypes.func,
    }
    state = {
        expand:false,
    };
    getFields() {
        const count = this.state.expand ? 10 : 3;
        const {searchList, Address, department} = this.props;
        const {getFieldDecorator} = this.props.form;
        const children = [];
        if(searchList!==undefined){
        for (let i = 0; i < searchList.length; i++) {
            {/*style={{display:i < count ? 'block' : 'none'}}*/}
            children.push(
               <Col span={6} key={i}>
                    {
                        searchList[i].type === "string" ? (
                            <Form.Item label={searchList[i].title}>
                                {getFieldDecorator(searchList[i].dataIndex, {
                                    initialValue:searchList[i].value,
                                    rules:[
                                        {
                                            required:false,
                                        },
                                    ],
                                })(<Input placeholder="请输入"/>)}
                            </Form.Item>
                        ) : searchList[i].type === "number" ? (
                            <Form.Item label={searchList[i].title}>
                                {getFieldDecorator(searchList[i].dataIndex, {
                                    initialValue:searchList[i].value,
                                })(<InputNumber min={0} max={1000}/>)}
                            </Form.Item>
                        ) : searchList[i].type === "address" ? (
                            <Form.Item label={searchList[i].title}>
                                {getFieldDecorator(searchList[i].dataIndex, {
                                    initialValue:searchList[i].value,
                                    rules:[
                                        {type:'array', required:false},
                                    ],
                                })(<Cascader options={Address} placeholder="省市区" changeOnSelect/>)}
                            </Form.Item>
                        ): searchList[i].type === "cascader" ? (
                                <Form.Item label={searchList[i].title}>
                                    {getFieldDecorator(searchList[i].dataIndex, {
                                        initialValue:searchList[i].value,
                                        rules:[
                                            {type:'array', required:false},
                                        ],
                                    })(<Cascader options={  searchList[i].list} placeholder="请选择" changeOnSelect/>)}
                                </Form.Item>
                            ): searchList[i].type === "organization" ? (
                            <Form.Item label={searchList[i].title}>
                                {getFieldDecorator(searchList[i].dataIndex, {
                                    initialValue:searchList[i].value,
                                    rules:[
                                        {type:'array', required:false},
                                    ],
                                })(<Cascader options={department} changeOnSelect />)}
                            </Form.Item>
                        ) : searchList[i].type === "select" ? (
                            <Form.Item label={searchList[i].title}>
                                {getFieldDecorator(searchList[i].dataIndex, {
                                    initialValue:searchList[i].value,
                                    rules:[{required:false}],
                                })(
                                    <Select placeholder="请选择" >
                                        {
                                            searchList[i].list.map((c, index) => <Option value={c.id}
                                                                                         key={index}>{c.name}</Option>)
                                        }
                                    </Select>,
                                )}
                            </Form.Item>
                        ) : (
                            <Form.Item label={searchList[i].title}>
                                {getFieldDecorator(searchList[i].dataIndex, {
                                    initialValue:searchList[i].value,
                                    rules:[{required:false}],
                                })(
                                    <Select placeholder="请选择" >
                                        {
                                            searchList[i].list.map((c, index) => <Option value={c.name}
                                                                                         key={index}>{c.name}</Option>)
                                        }
                                    </Select>,
                                )}
                            </Form.Item>
                        )
                    }
                </Col>,)
        }
        }
            return children;
        }

        handleSearch = e => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                this.props.search(values);
            });
        };

        handleReset = () => {
            this.props.form.resetFields();
            this.props.clearSearch();
        };

        toggle = () => {
            const {expand} = this.state;
            this.setState({expand:!expand});
        };

        render()
        {
            return (
                <div>
                    <Form  className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                        <Row gutter={24} style={{width:"88%"}}>
                            {this.getFields()}
                        </Row>
                        <div  className="searchBox">
                                <Button  className="handleReset" onClick={this.handleReset}>
                                    重置
                                </Button>
                            <Button type="primary"  htmlType="submit">
                                查询
                            </Button>
                        </div>
                    </Form>
                </div>
            );
        }
    }

    const
    Search = Form.create({name:'advanced_search'})(AdvancedSearchForm);
    export
    default
    Search;