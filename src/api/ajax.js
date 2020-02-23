/*
能发送ajax异步请求的模块
封装axios库
函数的返回值是promise对象

1.统一处理请求异常
2.异步直接得到result，通过resolve(response.data)
 */

import axios from 'axios'
import {message} from "antd";

export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        let promise
        //1.执行异步ajax请求
        if (type === 'GET') {//发送GET请求
            promise = axios.get(url, {//配置对象
                params: data
            })
        } else {//发送POST请求
            promise = axios.post(url, data)
        }
        //2.成功，调用resolve(value)
        promise.then(response => {
            resolve(response)
        })
            //3.失败，不调用reject(reason)，而是提示异常信息
            .catch(error => {
                message.error('请求出错了:' + error.message)
            })

    })

}

//请求登陆接口
ajax('/login', {username: 'Tom', password: '12345'}, 'POST').then()