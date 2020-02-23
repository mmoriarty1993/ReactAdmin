import React, {Component} from 'react'
import {Form, Icon, Input, Button,message} from 'antd';
import {Redirect} from 'react-router-dom'

import './login.less'
import {reqLogin} from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
/*
后台登陆的路由组件
 */
class Login extends Component {

    handleSubmit = (event) => {
        // //阻止事件的默认行为
        event.preventDefault()
        //得到具有很多功能的form对象
        const form = this.props.form
        form.validateFields(async (err, values) => {
            //校验成功
            if (!err) {
                //console.log('提交登录的ajax请求 ', values);
                const {username, password} = values
                // reqLogin(username,password).then(response => {
                //     console.log('请求成功了',response.data)
                // }).catch(error => {
                //     console.log('请求失败了',error)
                // })
                const response = await reqLogin(username, password)
                //console.log('请求成功了', response.data)
                const result = response.data
                if (result.status===0){
                    //登陆成功
                    //提示登陆成功
                    message.success('登陆成功')
                    //保存user
                    const user = result.data
                    //保存到内存中
                    memoryUtils.user = user
                    //保存到local中
                    storageUtils.saveUser(user)
                    //跳转到管理界面
                    this.props.history.replace('/')
                }else {
                    //登陆失败
                    message.error(result.msg)
                }
            } else {
                console.log('校验失败')
            }
        });

    }

    /*
    对密码进行自定义验证
     */
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码')
        } else if (value.length < 4) {
            callback('长度不能小于4')
        } else if (value.length > 12) {
            callback('长度不能大于12')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('必须是英文，数字或者下划线')
        } else {
            callback()
        }
    }

    render() {
        //如果用户已经登录，跳转到管理界面
        if (memoryUtils.user && memoryUtils.user._id){
            return <Redirect to='/'/>
        }

        //得到具有很多功能的form对象
        const {form} = this.props
        const {getFieldDecorator} = form

        return (
            <div className="login">
                <header className='login-header'>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [
                                    {required: true, whiteSpace: true, message: 'Please input your username!'},
                                    {min: 4, message: '至少4位'},
                                    {max: 12, message: '最多12位'},
                                    {pattern: /^[a-zA-Z0-9_]+$/, message: '必须是英文，数字或者下划线'}
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {validator: this.validatePwd}
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/*
1.高阶函数
   1). a.接受函数类型的参数
       b.返回值是函数

   2). 常见的高阶函数:
        定时器:setTimeout()/setInterval()
        Promise: Promise(() => {}) then(value =>{},reason =>{})
        数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()

        函数对象.bind():返回值是函数

   3).高阶函数更加具有扩展性

2.高阶组件
    1).本质是一个函数
    2).接收一个组件，返回一个新的组件，包装组件会向被包装组件传入特定的props
    3).扩展组件的功能
    4).高阶组件也是高阶函数，接收一个组件函数，返回一个新的组件函数
 */

/*
包装Form组件生成一个新的组件：Form(Login)，新组件会向Form组件传递一个form属性对象
 */
const WrapLogin = Form.create()(Login)
export default WrapLogin

/*
async和await
1.作用：简化了promise对象的使用，不用再使用then()来指定成功/失败的回调函数
        以同步编码方式实现异步流程
2.哪里写await
    返回promise的表达式左侧，得到promise异步执行成功的value数据
3.哪里写async
    await所在最近的函数的左侧
 */