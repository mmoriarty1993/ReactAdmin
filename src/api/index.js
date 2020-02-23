/*
包含应用中所有接口请求函数的模块
每个函数返回promise对象
 */

import ajax from "./ajax";


//登陆
/*
export function reqLogin(username,password) {
    return ajax('/login',{username,password},'POST')
}
*/
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')