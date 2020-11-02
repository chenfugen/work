import React,{ Component } from "react"
import {Modal} from 'antd';
import PropTypes from "prop-types"
import  Contents from "../../components/content/content"
import  Tables from "../../components/table/table"
const {confirm} = Modal;
export default class log extends  Component{
    static propTypes={
        getHome:PropTypes.func.isRequired,
        logList:PropTypes.object.isRequired,
        getLog:PropTypes.func.isRequired,
    }
    componentDidMount(){
        this.props.getHome();
        this.props.getLog(1,10);
    }
    changePageSize = (pageNum, pageSize) => {
        this.props.getLog(pageNum, pageSize)
    }
    changePageNum = (pageNum, pageSize) => {
        this.props.getLog(pageNum, pageSize)
    }
    delete = (id) => {
        const {delRole} = this.props;
        confirm({
            title:'删除',
            content:'您确定要删除该角色吗?',
            okText:'确认',
            okType:'danger',
            cancelText:'取消',
            onOk() {
                delRole(id)
            },
            onCancel() {
            },
        });
    }
    render() {
        const {logList}=this.props;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'账号',
                dataIndex:'admin',
            },
            {
                title:'登陆IP',
                dataIndex:'ip',
            },
            {
                title:'操作描述',
                dataIndex:'operation',
            },
            {
                title:'操作时间',
                dataIndex:'createTime',
            }]
        return(
            <div>
                <Contents pagesTitle={{first:"系统管理",second:"日志管理"}}  >
                    <Tables  data={logList} columns={columns} changePageSize={this.changePageSize}
                            changePageNum={this.changePageNum}/>
                </Contents>
            </div>
        )
    }
}
