开能项目开发文档
-------
#### 项目简介
本项目为开能公众号设备配网，控制等功能的H5项目

#### 项目技术文档
   - 项目框架
     - Js框架:vue.js  --版本号：2.5.2
     
     - UI框架  vant  --版本号：1.6.4
     
     - sass预编辑  --版本号：4.5.3
     
     - vue-amap地图插件  --版本号：0.5.8
     
     -vuex数据管理库    --版本号：3.1.0  
     
     -echarts图表库   --版本号：4.1.0  
   
  - 开能项目地址
     - 项目正式服地址：--
     - 项目测试服地址：--
     - 公司测试服地址：--
     
  - 开能项目接口地址
    - 项目正式服接口地址：--
    - 项目测试服接口地址：https://kaineng-test.yunext.com/web/api
  
  - 公司管理托管平台地址
      - [码云]：https://gitee.com/canature
        
  - 高德地图API文档
     - 获取高德文档地址：https://webapi.amap.com/maps?v=1.3&key=eb0a2b2199fbc67ac5b3c84faf91d519&plugin=AMap.MarkerClusterer

#### 运行环境
  weapack环境
   
#### 使用说明 
  
    1、下载项目依赖
       npm install
       
    2、运行项目
     npm run dev
    
    3、打包项目
     npm run build 
    

#### 项目结构

#### 项目文档结构
├─ dist            //打包页面
├─ node_modules    //依赖
├─ config          //项目配置文件
├─ src             //项目代码文件
│  ├─ assets       //vue自带文件包
│  ├─ axios        //数据请求封装文件
│  ├─ components   //各个页面组件
│  │  ├─ datas     //数据模块
│  │  ├─ device    //设备模块
│  │  ├─ login     //登录模块
│  │  ├─ map       //地图模块
│  │  ├─ tabbar    //公共组件(底部栏)
│  │  └─ user      //用户组件
│  ├─ router       //路由配置          
│  ├─ store        //数据中心
│  ├─ app.vue      //入口vue文件
│  └─ main.js      //项目配置引入
├─ static          //外部引用
│   ├─ css         //样式
│   ├─ font        //图标
│   ├─ image       //图片
│   └─ js          //js文件
│
├─ .gitignore          //项目git上传可忽略内容
├─ package-lock.json   //项目npm package的具体来源和版本号
├─ package.json        //项目(配置)所需要的各种模块、插件等
├─ index.html          //项目入口
            
#### 项目版本
   1.0.0
    
#### 其他联系信息
   
   - 公司名称：海大物联科技有限公司
   - 项目开发者：陈福根、周强、（后台）

