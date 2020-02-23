import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import memoryUtils from "../../utils/memoryUtils";
/*
后台管理的路由组件
 */
export default class Admin  extends Component {

    render() {
        const user = memoryUtils.user
        if (!user || !user._id){
            //内存中没有存储user,自动跳转到登陆
            return <Redirect to ='/login'/>

        }else {
            return (
                <div>
                    Hello, {user.username}
                </div>
            )
        }

    }
}