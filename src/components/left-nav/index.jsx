import React, {Component} from "react";
import {Link,withRouter} from "react-router-dom";
import {Menu, Icon} from 'antd';


import menuList from '../../config/menuConfig'
import './index.less'
import logo from '../../assets/images/logo.png'


/*
左侧导航组件
 */
const {SubMenu} = Menu;

class LeftNav extends Component {

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    /*
    根据menu的数据数组生成对应的标签数组
    */
    getMenuNodes_map = (menuList) => {
        //得到当前请求的路径
        const path = this.props.location.pathname
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem){
                    this.openKey = item.key
                }
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes_map(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    getMenuNodes_reduce = (menuList) => {
        return menuList.reduce((pre, item) => {
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                pre.push((<SubMenu
                    key={item.key}
                    title={
                        <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>
                    }
                >
                    {this.getMenuNodes_reduce(item.children)}
                </SubMenu>))
            }
            return pre
        }, [])
    }

    //第一次render前执行一次,为第一次render准备数据(同步)
    componentWillMount() {
        this.menuNodes = this.getMenuNodes_map(menuList)
    }


    render() {
        //得到当前请求的路径
        const path = this.props.location.pathname
        //得到需要打开菜单项的key
        const openKey = this.openKey
        return (
            <div className="left-nav">
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>


                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {
                        this.menuNodes
                    }


                    {/*<Menu.Item key="/home">
                        <Link to='/home'>
                            <Icon type='pie-chart'/>
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type='mail'/>
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/category">
                            <Link to='/category'>
                                <span>
                                    <Icon type='mail'/>
                                <span>品类管理</span>
                            </span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/product">
                            <Link to='/product'>
                                <span>
                                    <Icon type='mail'/>
                                <span>商品管理</span>
                            </span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user">
                        <Link to='/user'>
                            <Icon type='pie-chart'/>
                            <span>用户管理</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/role">
                        <Link to='/role'>
                            <Icon type='pie-chart'/>
                            <span>角色管理</span>
                        </Link>
                    </Menu.Item>*/}
                </Menu>
            </div>
        )
    }
}
/*
高阶组件：包装非路由组件返回一个新的组件，向非路由组件传递history,location,match
 */
export default withRouter(LeftNav)