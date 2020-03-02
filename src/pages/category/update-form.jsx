import React, {Component} from 'react'
import {Form,Select,Input} from "antd";
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

/*
更新分类的form组件
 */

class UpdateForm extends Component{
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        //将form对象通过setForm传递给父组件
        this.props.setForm(this.props.form)
    }

    render(){
        const {getFieldDecorator} = this.props.form
        const {categoryName} = this.props
        return(
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue: categoryName,
                            rules:[
                                {required: true, message:'必须输入分类名称'},
                            ]
                        })(
                            <Input placeholder='请输入分类名称'/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UpdateForm)