const env=process.env.NODE_ENV;
let Process;
if(env==="development"){
	console.log(1)
    Process={
        // "baseURL":"https://dianwang-test.yunext.com",
        // "webAPI":"https://dianwang-test.yunext.com/web/api/"
        "baseURL":"https://zc.yunext.com",
        "webAPI":"https://zc.yunext.com/web/api/"
    };
}else if(env==="production") {
    Process={
        "baseURL":"https://zc.yunext.com",
        "webAPI":"https://zc.yunext.com/web/api/"
    };
} else{
    Process={
        "baseURL":"http://localhost:3001/",
        "webAPI":"http://localhost:3000/"
    };
}
export default  Process;
