/*
包含应用中所有接口请求函数的模块
每个函数返回promise对象
 */

import ajax from "./ajax";
import jsonp from 'jsonp'
import {message} from "antd";

//登陆
/*
export function reqLogin(username,password) {
    return ajax('/login',{username,password},'POST')
}
*/
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')

/*
jsonp请求的接口请求函数
 */
export const reqWeather = (city) => {
    return new Promise((resolve,reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url,{},(err,data) => {
            //成功
            if (!err&&data.status==='success'){
                const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            }else {
                //失败
                message.error('获取天气信息失败')
            }
        })
    })


}