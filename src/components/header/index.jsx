import React, {Component} from "react";
import {withRouter} from 'react-router-dom'
import {Modal} from "antd";

import menuList from "../../config/menuConfig";
import {reqWeather} from "../../api";
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'
/*
头部组件
 */
class Header extends Component {
    state ={
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather:'',
    }

    getTime = () => {
        //每隔一秒获取当前时间，并更新state
      this.intervalId =  setInterval(() =>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async () => {
        //调用接口请求函数获取数据
        const {dayPictureUrl,weather} = await reqWeather('杭州')
        this.setState({dayPictureUrl,weather})
    }

    getTitle = () =>{
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path){
                title = item.title
                this.setState()
            }else if (item.children){
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = () =>{
        Modal.confirm({
            content: '确定退出登录吗',
            onOk: ()=> {
                //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                //跳转到登录界面
                this.props.history.replace('/login')
            },
        })
    }

    //第一次render后执行
    componentDidMount() {
        //获取当前时间
        this.getTime()
        //获取当前天气
        this.getWeather()
    }
    //当前组件卸载前执行
    componentWillUnmount() {
        //清除定时器
        clearInterval(this.intervalId)
    }

    render() {
        const {currentTime,dayPictureUrl,weather} = this.state
        const title = this.getTitle()
        const username = memoryUtils.user.username
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <a href="javascript:" onClick={this.logout}>退出</a>
                </div>

                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)