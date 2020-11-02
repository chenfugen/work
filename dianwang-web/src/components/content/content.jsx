import React,{ Component } from "react"
import { Layout,Breadcrumb,Button,Empty} from 'antd'
import PropTypes from "prop-types"
import "./content.scss"
const { Content } = Layout;
export default class content extends  Component{

    static propTypes={
        children:PropTypes.object,
        pagesTitle:PropTypes.object.isRequired,
    }
    state={
        height:""
    }

    componentDidMount(){
        const height=window.innerHeight-100;
        this.setState({height})
    }
    render() {
        const {height}=this.state;
        const {children,pagesTitle}=this.props;
        if(children===undefined){
            return(
                <div className="content">
                    <Content style={{maxHeight:height,padding:0}}>
                        <Breadcrumb style={{ marginBottom: '16px'}}>
                            <Breadcrumb.Item>{pagesTitle.first}</Breadcrumb.Item>
                            <Breadcrumb.Item><a href={pagesTitle.url}>{pagesTitle.second}</a></Breadcrumb.Item>
                            <Breadcrumb.Item>{pagesTitle.three}</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{background: '#fff',minHeight:height-40}}>
                            <Empty style={{paddingTop:"20px"}} />
                        </div>
                    </Content>
                </div>
            )
        }else{
            return(
                <div className="content">
                    <Content style={{maxHeight:height,padding:0}}>
                        <Breadcrumb style={{ marginBottom: '16px', fontWeight: "bold"}}>
                            <Breadcrumb.Item>{pagesTitle.first}</Breadcrumb.Item>
                            <Breadcrumb.Item><a href={pagesTitle.url}>{pagesTitle.second}</a></Breadcrumb.Item>
                            <Breadcrumb.Item>{pagesTitle.three}</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{background: '#fff', minHeight:height-40,overflow:"hidden"}}>
                            {React.Children.map(children, (child, i) => {
                                return child
                            })}
                        </div>
                    </Content>
                </div>
            )
        }
    }
}
