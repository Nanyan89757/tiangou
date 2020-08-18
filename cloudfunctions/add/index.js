// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var rp = require('request-promise');

// 云函数入口函数
// exports.main = async (event, context) => {
//     // ...
//     return {
//       sum: event.a + event.b
//     }
// }

//引入request-promise

//云函数入口函数
exports.main = async (event, context) => {
    urls = ["https://api.ixiaowai.cn/tgrj/index.php","https://v1.alapi.cn/api/dog?format=text"]
    url = urls[Math.floor((Math.random()*urls.length))]
    return rp(url).then(function(res){
        return {
            data:res
        }
    })
    .catch(function(err){
    })
}

