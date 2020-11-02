import {connect} from "react-redux"
import {getHome,getApplyNum,getUseNum,getAsset,getChartData} from "../redux/actions"
import  statistics from "../views/statistics/statistics"

export default connect(
    state=>({useCount:state.useCount,applyCount:state.applyCount,asset:state.asset,chartData:state.chartData}),
    { getHome,getApplyNum,getUseNum,getAsset,getChartData}
)(statistics)