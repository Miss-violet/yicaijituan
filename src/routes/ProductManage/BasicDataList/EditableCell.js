import React from 'react'
import { Input, InputNumber, Form } from 'antd';

const FormItem = Form.Item

class EditableCell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,   /* 多次渲染时，props.value值没有变 */
    }
  }
  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  }
  check = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  inputNumberCheck = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  }

  render() {
    const { value } = this.state;
    const { getFieldDecorator, name } = this.props.form
    const {validatorNum} = this.props
    if (this.props.type === 'input') {
      return (
        <div className="editable-cell">
          <FormItem>
            {getFieldDecorator(`${name}`, {
              rules: [{ required: true, message: '此项必填' }, {
                // validator: validatorNum,
              }],
              initialValue: value,
            })(
              <Input
                value={value}
                onChange={this.handleChange}
                onBlur={this.check}
                disabled={this.props.disabled}
              />
              )}
          </FormItem>
        </div>
      )
    } else if (this.props.type === 'numberInput') {
      return (
        <div className="editable-cell">
          <FormItem>
            {getFieldDecorator(`${name}`, {
              rules: [{ required: true, message: '此项必填' }],
              initialValue: value,
            })(
              <InputNumber
                defaultValue={value}
                onBlur={this.inputNumberCheck}
                disabled={this.props.disabled}
                step={this.props.step}
                min={this.props.min}
                max={this.props.max}
              />)}
          </FormItem>
        </div>
      )
    }
  }
}

export default Form.create()(EditableCell)