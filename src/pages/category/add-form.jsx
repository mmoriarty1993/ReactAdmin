import React, {Component} from 'react'
import {Form,Select,Input} from "antd";
import PropTypes from 'prop-types'
import category from "./category";

const Item = Form.Item
const Option = Select.Option

/*
添加分类的form组件
 */

class AddForm extends Component{
    static propTypes={
        categories: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired,
    }

    componentWillMount() {
        //将form对象通过setForm传递给父组件
        this.props.setForm(this.props.form)
    }

    render(){
        const{categories,parentId} = this.props
        const {getFieldDecorator} = this.props.form
        return(
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId',{
                            initialValue: parentId
                            })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categories.map( c => <Option value={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue: '',
                            rules:[
                                {required: true, message:"必须输入分类名称"}
                                ]
                        })(
                            <Input placeholder="请输入分类名称"/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)