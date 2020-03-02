import React, {Component} from 'react'
import {Card, Table, Button, Icon, message, Modal} from 'antd'

import LinkButton from "../../components/linkButton";
import {reqCategories, reqAddCategory, reqUpdateCategory} from '../../api/index'
import AddForm from "./add-form";
import UpdateForm from "./update-form"
/*
商品分类路由
 */

export default class Category extends Component {
    state = {
        categories: [], //一级分类列表
        loading: false,
        parentId: '0',//当前需要显示的分类列表的parentId
        parentName: '',
        subCategories: [],//二级分类列表
        showStatus: 0,//标示添加/更新的确认框是否显示,0:都不显示,1:显示添加,2:显示更新
    }

    /*
    初始化table的columns
     */

    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                dataIndex: '',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => {
                            this.showUpdate(category)
                        }}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数：先定义一个匿名回调函数，在回调函数中调用处理的函数，并传入参数*/}
                        {this.state.parentId === '0' ? (<LinkButton onClick={() => {
                            this.showSubCategories(category)
                        }}>查看子分类</LinkButton>) : null}
                    </span>
                )
            },
        ]
    }

    /*
    异步获取分类列表显示
    parentId:如果不传，根据状态中的parentId,如果传，则根据指定的值去请求
     */
    getCategories = async (parentId) => {
        //发送请求前，显示loading
        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        const response = await reqCategories(parentId)
        //请求结束后，隐藏loading
        this.setState({loading: false})
        const result = response.data
        if (result.status === 0) {
            const categories = result.data
            if (parentId === '0') {
                //更新一级分类的数组
                this.setState({categories})
            } else {
                //更新二级分类的数组
                this.setState({subCategories: categories})
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    showCategories = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: [],
        })
    }


    showSubCategories = async (category) => {
        this.setState({parentId: category._id, parentName: category.name},
            () => {//在状态更新并且重新render()后执行
                this.getCategories()
            })
    }

    handleCancel = () => {
        this.form.resetFields()
        this.setState({
            showStatus: 0
        })
    }

    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    showUpdate = (category) => {
        this.category = category

        this.setState({
            showStatus: 2
        })
    }

    addCategory =  () => {
        //表单验证
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //关闭确认框
                this.setState({
                    showStatus: 0
                })
                //发请求添加分类
                const {categoryName, parentId} = values
                this.form.resetFields()
                const response = await reqAddCategory(categoryName, parentId)
                const result = response.data
                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        //重新显示新的列表
                        this.getCategories()
                    } else if (parentId === '0') {
                        //在二级分类列表下添加一级分类,需要更新一级分类列表，但不需要显示
                        this.getCategories('0')
                    }
                }
            }
        })
    }

    updateCategory = () => {
        //表单验证
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //关闭确认框
                this.setState({
                    showStatus: 0
                })
                //发请求更新分类
                const categoryId = this.category._id
                const {categoryName} = values
                this.form.resetFields()
                const response = await reqUpdateCategory({categoryName, categoryId})
                const result = response.data
                if (result.status === 0) {
                    //重新显示新的列表
                    this.getCategories()
                }
            }
        })
    }

    //为第一次render准备数据
    componentWillMount() {
        this.initColumns()
    }

    //发异步ajax请求
    componentDidMount() {
        //获取一级分类列表数据
        this.getCategories()
    }

    render() {
        //读取状态数据
        const {categories, loading, parentName, subCategories, parentId, showStatus} = this.state
        //读取当前指定category名
        const category = this.category || {} //如果不存在的话，指定为空对象
        //card的左侧标题
        const title = parentId === '0' ? '一级分类菜单' : (
            <span>
                <LinkButton onClick={this.showCategories}>一级分类菜单</LinkButton>
                <Icon type='arrow-right' style={{marginRight: 5}}></Icon>
                <span>{parentName}</span>
            </span>
        )
        //card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'/>
                添加分类
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={parentId === '0' ? categories : subCategories}
                    bordered
                    rowKey='_id'
                    columns={this.columns}
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                    loading={loading}
                />
                <Modal
                    title='添加分类'
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categories={categories} parentId={parentId} setForm={(form) => {
                        this.form = form
                    }}/>
                </Modal>

                <Modal
                    title='修改分类'
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} setForm={(form) => {
                        this.form = form
                    }}/>
                </Modal>
            </Card>
        )
    }
}