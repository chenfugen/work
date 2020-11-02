import React,{ Component } from "react"
import {Table, Modal, Select, Row, Col, Button} from 'antd'
import PropTypes from "prop-types"
import "./table.scss"
const {confirm} = Modal;
const {Option} = Select;
export default class Tables extends  Component{
    static propTypes={
        data:PropTypes.object.isRequired,
        columns:PropTypes.array.isRequired,
        changePageNum:PropTypes.func.isRequired,
        changePageSize:PropTypes.func.isRequired,
        isAdd:PropTypes.bool,
        isExport:PropTypes.bool,
        add:PropTypes.func,
        isMerge:PropTypes.bool,
        merge:PropTypes.func,
        derived:PropTypes.func,
        width:PropTypes.number,
    }
    state = {
        selectedRowKeys: [], // 选择序列
        selectedRows: [], // 选择内容
        windowWidth:0,
        isShowY:0,
        pagination: {
            showSizeChanger: true, // 显示可改变每页数量
            showQuickJumper: true,
            total:50,
            showTotal: total => `共 ${total} 条`, // 显示总数
            onShowSizeChange: (pageNum,pageSize) => this.changePageSize(pageNum,pageSize),
            onChange: (pageNum,pageSize) => this.affiliatedTableTableChangePage (pageNum,pageSize)
        }
    };
    affiliatedTableTableChangePage = (page,pageSize) => {
         this.props.changePageNum(page,pageSize)
    }

    //全选
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys,selectedRows });
    };
    changePageSize=(pageNum,pageSize)=> {
        if(pageSize>10){
            this.setState({ isShowY:600 });
        }else{
            this.setState({ isShowY:0 });
        }
        this.props.changePageSize(pageNum,pageSize)
    }
    componentWillReceiveProps(next){
        const pagination = {...this.state.pagination }
        const windowWidth=window.innerWidth-240;
        if(next.data.total!=undefined){
            pagination.total=next.data.total;
        }else{
            pagination.total=next.data.count;
        }
        this.setState({pagination,windowWidth});
    }
    adds=()=>{
        const {add}=this.props;
        add();
    }
    merges=()=>{
        const {selectedRows}=this.state;
        const {merge}=this.props;
        merge(selectedRows);
    }
    exports=()=>{
        const {derived}=this.props;
        derived();
    }
    render() {
        const {data,columns,isAdd,isExport,isMerge,width}=this.props;
        const { selectedRowKeys } = this.state;
        const isShowAdd=isAdd?"block":"none";
        const isShowExport=isExport?"block":"none";
        const isShowMerge=isMerge?"block":"none";
        const isShowFunc=!isExport && !isAdd?"none":"block";
        var arr = Object.keys(data);
        const list=arr.length==0?[]:data.data==undefined?data.list:data.data;
        const {pagination,isShowY,windowWidth}=this.state;
        const isShowX=width!==undefined?windowWidth>width?0:windowWidth:0;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return(
            <div>
                <Row gutter={24}>
                    <Col span={12}>
                        <div className="tableOprate" style={{display:isShowFunc}}>
                            <Button  type="primary" style={{display:isShowAdd}} className="add" onClick={this.adds}>新增</Button>
                            <Button  type="primary" style={{display:isShowMerge}} disabled={!hasSelected} className="merges" onClick={this.merges}>合并</Button>
                            <Button className="export" style={{display:isShowExport}} onClick={this.exports} >导出</Button>
                        </div>
                    </Col>
                </Row>
                {
                    isMerge?(
                        <Table rowSelection={rowSelection}  rowKey={row=>row.key} columns={columns} dataSource={list}  scroll={{ x: isShowX, y: isShowY }} pagination={pagination} />
                    ):(
                        <Table rowKey={row=>row.key} columns={columns} dataSource={list}  scroll={{ x: isShowX, y: isShowY }} pagination={pagination} />
                    )
                }
            </div>
        )
    }
}
