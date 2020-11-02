台州电网H5开发文档
-------
#### 项目简介
本项目为台州电网心悦后勤资产管理H5项目主要是审批、申请资产操作

#### 项目技术文档
   - 项目框架
     - Js框架:vue.js  --版本号：2.5.2
     
     - UI框架  vant  --版本号：1.6.4
     
     - sass预编辑  --版本号：4.5.3
     
     - vuex数据管理库    --版本号：3.1.0  
     
   
  - 电网项目地址
     - 项目正式服地址：[心悦后勤正式](https://dianwang-H5.yunext.com)
     - 项目测试服地址：[心悦后勤测试](https://dianwang-H5-test.yunext.com)
     - 公司测试服地址：--
     
  - 电网项目接口地址
    - 项目正式服接口地址：[心悦后勤接口](https://dianwang.yunext.com)
    - 项目测试服接口地址：[心悦后勤接口](https://dianwang-test.yunext.com)
  
  - 公司管理托管平台地址
      - [gitlab]：https://gitlab.yunext.com
        

#### 运行环境
  weapack环境
   
#### 使用说明 
  
    1、下载项目依赖
       npm install
       
    2、运行项目
       npm run dev
    
		3、打包测试服项目
			npm run devbuild 
			
    4、打包正式服项目
       npm run build 
    

#### 项目文档结构
├─ dist            //打包页面                                                    
├─ node_modules    //依赖  
├─ config          //项目配置文件  
├─ src             //项目代码文件  
│  ├─ assets       //vue自带文件包  
│  ├─ axios        //数据请求封装文件  
│  ├─ components   //各个页面组件  
│  │  ├─ admin     //管理员    
│  │  ├─ code      //验证码组件    
│  │  ├─ header     //头部组件   
│  │  ├─ home        //首页     
│  │  ├─ login       //登录模块    
│  │  ├─ test        //测试模块      
│  │  └─ user       //用户组件    
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

