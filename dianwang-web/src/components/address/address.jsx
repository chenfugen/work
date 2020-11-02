import React,{ Component } from "react"
import PropTypes from "prop-types"
import { Cascader } from 'antd';
export default class Address extends  Component{
    static propTypes={
        cityList:PropTypes.array.isRequired,
        province:PropTypes.array.isRequired,
    }
state={
    address:[],
}
    componentWillReceiveProps(next) {
        const address=[];
        const province = next.province;
        const cityList = next.cityList;
        for (let i in province) {
            address[i] = {
                label:province[i].name,
                value:province[i].id,
                children:[]
            };
            for (let j in cityList) {
                if (address[i].value === cityList[j].provinceId) {
                    address[i]["children"][j] = cityList[j];
                }
            }
        }
        this.setState({address})
    }
    render() {
        const {address}=this.state;
        return(
            <div>
                <Cascader options={address}  placeholder="城市选择" />
            </div>
        )
    }
}