### 台州电网web开发文档

#### 项目简介
本项目为台州电网资产管理后台项目 运用框架[Create React App](https://github.com/facebook/create-react-app).

#### 项目技术文档
   - 项目框架
     - Js框架:react.js  --版本号：^16.9.0
     
     - UI框架  ant desgin  --版本号：^3.23.4
     
     - node-sass  --版本号：^4.13.0
     
     - react-cookie  --版本号：^4.0.3
     
     - redux数据管理库    --版本号：^4.0.4  
     
     - bizcharts图表库   --版本号：^3.5.7,  

  - 项目地址
     - 项目正式服地址：https://dianwang-test.yunext.com
     - 项目测试服地址：--
     - 公司测试服地址：--
     
  - 项目接口地址
    - 项目正式服接口地址：--
    - 项目测试服接口地址：https://dianwang-test.yunext.com/web/api
  
  
  ####  运行环境 
    node+weapack环境
     
  ####  使用说明  
    
      1、下载项目依赖
         yarn install
         
      2、运行项目
         yarn start
      
      3、打包项目
         yarn build(yarn test测试包)
      
#### 项目文档结构
├─ build           //打包页面                                                    
├─ node_modules    //依赖  
├─ config          //项目配置文件  
├─ public          //公共资源  
├─ script          //打包资源配置 
├─ src             //项目代码文件  
│  ├─ axios        //数据请求封装文件  
│  ├─ components   //各个组件  
│  │  ├─ address     //省市区三级联动  
│  │  ├─ code       //二维码组件    
│  │  ├─ content     //内容组件  
│  │  ├─ header       //头部组件      
│  │  ├─ home        //主体框架  
│  │  ├─ nav         //菜单栏   
│  │  ├─ navlink     //链接组件  
│  │  ├─ table       //表单组件  
│  │  └─ search      //查询 组件  
│  ├─ containers       //各页面接口参数入口集  
│  ├─ router       //路由配置         
│  ├─ redux     //数据仓库中心      
│  ├─ static          //外部引用       
│  │   ├─ css         //样式   
│  │   ├─ font        //图标     
│  │   ├─ image       //图片    
│  │   └─ js          //js文件     
│  ├─ views          //页面组件      
│  │   ├─ applyManage      //申请管理   
│  │   ├─ assetConfigure   //资产配置   
│  │   ├─ assetManage      //资产管理   
│  │   ├─ columnStatistics //表格统计     
│  │   ├─ exception        //状态配置集    
│  │   ├─ login            //登录    
│  │   ├─ organizeteManage //组织管理     
│  │   ├─ realBstate       //不动产管理  
│  │   ├─ statistics       //资产统计  
│  │   ├─ systemManage     //系统管理  
│  │   └─ user             //个人中心    
│  ├─ index.js         //入口文件    
│  ├─ setupProxy.js    //跨域配置     
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