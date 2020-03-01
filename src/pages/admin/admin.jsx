import React, {Component} from 'react'
import {Layout} from 'antd'
import {Redirect,Route,Switch} from 'react-router-dom'


import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/left-nav";
import Header from "../../components/header";
import Home from "../home/home";
import Category from "../category/category";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";

/*
后台管理的路由组件
 */
const {Footer, Sider, Content} = Layout

export default class Admin extends Component {

    render() {
        const user = memoryUtils.user
        if (!user || !user._id) {
            //内存中没有存储user,自动跳转到登陆
            return <Redirect to='/login'/>

        } else {
            return (
                <Layout style={{height:'100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{margin: 20,backgroundColor:'white'}}>
                            <Switch>
                                <Route path='/home' component={Home}/>
                                <Route path='/product' component={Product}/>
                                <Route path='/category' component={Category}/>
                                <Route path='/role' component={Role}/>
                                <Route path='/user' component={User}/>
                                <Route path='/charts/bar' component={Bar}/>
                                <Route path='/charts/line' component={Line}/>
                                <Route path='/charts/pie' component={Pie}/>
                                <Redirect to='/home'/>
                            </Switch>

                            <div>
                                Hello, {user.username}
                            </div>
                        </Content>
                        <Footer style={{textAlign:'center',color:'#cccccc'}}>
                            这里是页脚
                        </Footer>
                    </Layout>
                </Layout>
            )
        }
    }
}