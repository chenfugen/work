<template>
    <div id="map">
        <div id="map-con">
            <div ref="wrapper" id="wrapper"></div>
        </div>
    </div>
</template>

<script>
var marker,map,infoWindow,cluster,markers = [];
export default {
    inject:['deviceMap'],
    data() {
        return {
            mapArry:[],
        }
    },
    mounted(){
        // var map = new AMap.Map('wrapper');
        marker, map = new AMap.Map("wrapper", {
            resizeEnable: true,
            zoom: 8
        });
        this.getDeviceMap();
        // this.$nextTick(()=>{
        //     this.$http.deviceMap(this.deviceMap).then(res=>{
        //         if(res.data.success){
        //             this.mapArry = res.data.datas;
        //             // this.addMarker();
        //         }
        //     })
        // })
    },
    methods:{
        getDeviceMap(){
            if(markers.length>0){
                map.remove(marker);
                map.clearMap();
            }
            this.$nextTick(()=>{
                marker,map,infoWindow,cluster,markers = [];
                this.$http.deviceMap(this.deviceMap).then(res=>{
                    if(res.data.success){
                        marker, map = new AMap.Map("wrapper", {
                            resizeEnable: true,
                            zoom: 8
                        });
                        this.mapArry = res.data.datas;
                        this.addMarker();
                    }
                })
            })
        },
        addMarker(){
            var arr = this.mapArry;
            for(var i = 0; i <  arr.length;i++){
                if(arr[i].location&&arr[i].location.coordinates){
                    let content = "<i class='iconaddress map' style='color:#60ACFC'></i>";
                    if(!arr[i].online){
                        content = "<i class='iconaddress map' style='color:#708090'></i>";
                    }
                    marker = new AMap.Marker({
                        position: arr[i].location.coordinates,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        content: content,
                        map: map,
                        data:arr[i]
                    });
                    var that = this;
                    AMap.event.addListener(marker, 'mouseover', function (e) {
                        that.openInfo(e)
                    });
                    // AMap.event.addListener(marker, 'mouseout', function (e) {
                    //     infoWindow.close();
                    // });
                    markers.push(marker)
                }
            }
            var sts = [{
                url: require('../../assets/imges/mapAdree.png'),
                size: new AMap.Size(48, 48),
                textColor:'#fff',
                offset: new AMap.Pixel(-16, -16)
            }, {
                url: require('../../assets/imges/mapAdree.png'),
                size: new AMap.Size(48, 48),
                textColor:'#fff',
                offset: new AMap.Pixel(-16, -16)
            }, {
                url: require('../../assets/imges/mapAdree.png'),
                size: new AMap.Size(48, 48),
                textColor:'#fff',
                offset: new AMap.Pixel(-18, -18)
            }, {
                url: require('../../assets/imges/mapAdree.png'),
                size: new AMap.Size(48, 48),
                textColor:'#fff',
                offset: new AMap.Pixel(-24, -24)
            }, {
                url: require('../../assets/imges/mapAdree.png'),
                size: new AMap.Size(48, 48),
                textColor:'#fff',
                offset: new AMap.Pixel(-24, -24)
            }];
            map.plugin(["AMap.MarkerClusterer"], function() {
                cluster = new AMap.MarkerClusterer(map, markers, {
                    styles: sts,
                    gridSize:5,
                });
            });
        },
        openInfo(e) {
            //构建信息窗体中显示的内容
            var info = [];
            info.push("<div style=\"padding:0px 0px 0px 4px;\"><font style=\"width: 15px;height: 15px;display: block;float: left;border-radius: 50%;background: "+(e.target.Ce.data.online?'#60ACFC':'rgb(225, 227, 231)')+";;margin: 2px 8px 0 0;\"></font><b style=\"color:"+(e.target.Ce.data.online?'#60ACFC':'rgb(225, 227, 231)')+"\">"+(e.target.Ce.data.online?'在线':'离线')+"</b>");
            info.push("SN："+e.target.Ce.data.deviceSN);
            info.push("MAC : "+e.target.Ce.data.mac);
            info.push("产品类型 : "+e.target.Ce.data.deviceType);
            info.push("产品型号 : "+e.target.Ce.data.deviceModel);
            info.push("<a class='map-more' data-id='"+e.target.Ce.data.mac+"' style='color:#0000FF;cursor: pointer;'>更多</a></div></div>");
            infoWindow = new AMap.InfoWindow({
                content: info.join("<br/>"),  //使用默认信息窗体框样式，显示信息内容
                autoMove: true,
                offset: new AMap.Pixel(0, -25)
            });
            infoWindow.open(map, e.target.getPosition());
            
            // document.getElementsByClassName('more').click(function(){
            //     console.log(this.attr('data-id'))
            // })
        },
    }
}
</script>

<style lang="less">
#map{
    height: 100%;
    width: 100%;
    float: left;
    background: #FFFFFF;
    box-shadow: 0 3px 5px 0 rgba(0,0,0,0.05);
    border-radius: 4px;
    #map-con{
        margin: 8px ;
        height:calc(100% - 16px);
        width:calc(100% - 16px)
    }
    #wrapper{
    height: 100%;
    width: 100%;
        // margin: 8px ;
        // height:calc(100% - 16px);
        // width:calc(100% - 16px)
    }
}
</style>
