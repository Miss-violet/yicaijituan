import React, { Component } from 'react'
import { Button, Table, Modal, Form, Row, Col, Input, Select, DatePicker, Radio, message, Switch, Icon } from 'antd'
import * as moment from 'moment'
import styles from './basicDataList.less'


const FormItem = Form.Item;
const confirm = Modal.confirm;

class BasicDataList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      visible: false,
      confirmLoading: false,
      disabled: false,
      modalType: '',
      selected: {},
      selectedId: '',
      selectedRowKeys: [],
      pagination: props.pagination,
      changeCode: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pagination !== nextProps.pagination) {
      setTimeout(() => {
        this.setState({
          pagination: {
            ...nextProps.pagination,
          },
        })
      }, 0)
    }
  }

  getFields = () => {
    const { fmFields } = this.props
    const { disabled } = this.state
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 16 },
      },
    };
    const Option = Select.Option;
    const RadioGroup = Radio.Group;

    const validatePSW = (rule, value, callback) => {
      const regx = new RegExp(/^[A-Za-z0-9]{6,}$/)
      if (value && !regx.test(value)) {
        callback('请输入至少6位由字母或数字组成的密码')
      }
      callback();
    }

    const compareToFirstPassword = (rule, value, callback) => {
      if (value && value !== getFieldValue('password')) {
        callback('两次输入的密码不一致，请确认');
      } else {
        callback();
      }
    }

    const handleToSwitch = (event) => {
      this.setState({
        changeCode: event,
      })
    }

    const handleChange = (event, item) => {
      const value = event.target.value
      const { modalType } = this.state
      /* 有唯一性校验设置的新增弹窗都要执行唯一性校验 */
      if (modalType === 'add' && value && item.verifyUnique) {
        item.verifyFunc(value)
      }
      /* 用户管理-编辑时（用户管理不允许修改登录名），不校验唯一性 */
      else if (modalType !== 'add' && value && item.verifyUnique && item.name !== 'loginName') {
        item.verifyFunc(value)
      }
    }

    const fmItem = fmFields.map(item => {
      const { modalType } = this.state

      const itemDisabled = (name) => {
        let textDisabled
        if (modalType !== 'add' && name === 'loginName') {
          textDisabled = true
        } else {
          textDisabled = disabled
        }
        return textDisabled
      }

      switch (item.type) {
        case 'text':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [{
                    required: item.required,
                    message: `请输入${item.label}`,
                  },
                  ],
                  initialValue: item.initialValue,
                })(
                  <Input
                    placeholder={modalType === 'check' ? '' : `请输入${item.label}`}
                    disabled={(item.name === 'loginName') ? itemDisabled(`${item.name}`) : disabled}
                    onChange={(event) => handleChange(event, item)}
                  />
                  )}
              </FormItem>
            </Col>
          )
        case 'select':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [{
                    required: item.required,
                    message: `请选择${item.label}`,
                  }],
                  initialValue: item.initialValue,
                })(
                  <Select disabled={disabled}>
                    {
                      item.data && item.data.map(selectItem => <Option value={selectItem.id} key={selectItem.id}>{selectItem.name}</Option>)
                    }
                  </Select>
                  )}
              </FormItem>
            </Col>
          )
        case 'radio':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [{
                    required: item.required,
                    message: `请选择${item.label}`,
                  }],
                  initialValue: (item.initialValue !== null && item.initialValue !== undefined) ? item.initialValue : item.defaultValue,
                })(
                  <RadioGroup name={item.name} disabled={disabled}>
                    {
                      item.data && item.data.map(radioItem => <Radio value={radioItem.id} key={radioItem.id}>{radioItem.name}</Radio>)
                    }
                  </RadioGroup>
                  )}
              </FormItem>
            </Col>
          )
        case 'password':
          return (
            <div key={item.key}>
              {
                modalType === 'edit' && (
                  <Col span={24}>
                    <FormItem label='是否修改密码' {...formItemLayout}>
                      {getFieldDecorator('changeCode')(
                        <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} defaultChecked={this.state.changeCode} onChange={handleToSwitch} />
                      )}
                    </FormItem>
                  </Col>
                )
              }
              {
                modalType !== 'add' && this.state.changeCode && (
                  <div>
                    <Col span={24}>
                      <FormItem label={item.label} {...formItemLayout}>
                        {getFieldDecorator('password', {
                          rules: [{
                            required: modalType === 'add' ? true : this.state.changeCode,
                            message: '请输入密码',
                          },
                          {
                            validator: validatePSW,
                          }],
                        })(
                          <Input type="password" placeholder={modalType === 'check' ? '' : '请输入密码'} disabled={disabled} />
                          )}
                      </FormItem>
                    </Col>
                    <Col span={24}>
                      <FormItem label='确认密码' {...formItemLayout}>
                        {getFieldDecorator('comfirmPsw', {
                          rules: [{
                            required: modalType === 'add' ? true : this.state.changeCode,
                            message: '请再次输入密码',
                          },
                          {
                            validator: compareToFirstPassword,
                          }],
                        })(
                          <Input type="password" placeholder={modalType === 'check' ? '' : '请再次输入密码'} disabled={disabled} />
                          )}
                      </FormItem>
                    </Col>
                  </div>
                )
              }
              {
                modalType === 'add' && (
                  <div>
                    <Col span={24}>
                      <FormItem label={item.label} {...formItemLayout}>
                        {getFieldDecorator('password', {
                          rules: [{
                            required: modalType === 'add' ? true : this.state.changeCode,
                            message: '请输入密码',
                          }],
                        })(
                          <Input type="password" placeholder={modalType === 'check' ? '' : '请输入密码'} disabled={disabled} />
                          )}
                      </FormItem>
                    </Col>
                    <Col span={24}>
                      <FormItem label='确认密码' {...formItemLayout}>
                        {getFieldDecorator('comfirmPsw', {
                          rules: [{
                            required: modalType === 'add' ? true : this.state.changeCode,
                            message: '请再次输入密码',
                          },
                          {
                            validator: compareToFirstPassword,
                          }],
                        })(
                          <Input type="password" placeholder={modalType === 'check' ? '' : '请再次输入密码'} disabled={disabled} />
                          )}
                      </FormItem>
                    </Col>
                  </div>
                )
              }
            </div>
          )
        case 'datepicker':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [{
                    required: item.required,
                    message: `请输入${item.label}`,
                  }],
                  initialValue: item.initialValue ? moment(item.initialValue) : '',
                })(
                  <DatePicker
                    format="YYYY-MM-DD"
                    placeholder={modalType === 'check' ? '' : `请选择${item.label}`}
                    disabled={disabled}
                    style={{ width: '100%' }}
                  />
                  )}
              </FormItem>
            </Col>
          )
        default:
          break;
      }
    })
    return fmItem
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      selected: {},
      selectedId: '',
      selectedRowKeys: [],
      changeCode: false,
    });
  }

  showModal = (type) => {
    switch (type) {
      case 'add':
        this.setState({
          title: '新增',
          disabled: false,
          modalType: 'add',
          selected: {},   /* 点击新增的时候，不带入值。防止选中后点击新增把值带入 */
        })
        break;
      case 'edit':
        if (JSON.stringify(this.state.selected) === '{}') {
          message.warning('请选择数据后再进行操作', 3);
          return
        }
        this.setState({
          title: '编辑',
          disabled: false,
          modalType: 'edit',
        })
        break;
      case 'check':
        if (JSON.stringify(this.state.selected) === '{}') {
          message.warning('请选择数据后再进行操作', 3);
          return
        }
        this.setState({
          title: '查看',
          disabled: true,
          modalType: 'check',
        })
        break;
      default:
        break;
    }

    setTimeout(() => {
      const { selected } = this.state
      if (JSON.stringify(this.state.selected) === '{}') {
        /* 如果 this.state.selected 为空，则说明是 新增 */
        this.props.fmFields.map(fmItem => {
          fmItem.initialValue = null
          return fmItem
        })
      } else {
        for (const i in selected) {
          if (selected[i] !== null) {
            this.props.fmFields.map(fmItem => {
              if (i === fmItem.name) {
                fmItem.initialValue = selected[i]
              }
              return fmItem
            })
          }
        }
      }
      this.setState({
        visible: true,
      })
    }, 0)
  }
  handleSubmit = (modalType) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (modalType === 'add') {
          this.props.handleCreate(values)
        }
        else if (modalType === 'edit') {
          if (values.changeCode) {
            this.props.handleEdit({
              ...values,
              id: this.state.selectedId,
            })
          } else {
            const { password, ...restValues } = values
            this.props.handleEdit({
              ...restValues,
              id: this.state.selectedId,
            })
          }
        }
        this.setState({
          confirmLoading: true,
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false,
            selectedRowKeys: [],
            changeCode: false,
          });
        }, 500);
      }
    })
  }
  handleDelete = () => {
    if (!this.state.selectedId) {
      message.warning('请选择数据后再进行操作', 2);
      return
    }
    confirm({
      title: '删除',
      content: '确定要删除选中的数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.handleDelete(this.state.selectedId)
      },
      onCancel() {
      },
    });
  }

  rowOnChange = (selectedRowKeys, selectedRows) => {
    const selected = selectedRows[0]
    this.setState({
      selected,
      selectedId: selected.id,
      selectedRowKeys,
    })
  }

  render() {
    const { visible, title, confirmLoading, modalType, selectedRowKeys, pagination } = this.state;
    const { columns, data, addBtn, updateBtn, checkBtn, deleteBtn, handleTableChange, scrollX } = this.props
    const rowSelection = {
      type: "radio",
      selectedRowKeys,
      onChange: this.rowOnChange,
    };
    return (
      <div>
        <div className={styles.btnBar}>
          {
            addBtn && (
              <Button className={styles.btn} onClick={() => this.showModal('add')}>
                新增
              </Button>
            )
          }
          {
            updateBtn && (
              <Button className={styles.btn} onClick={() => this.showModal('edit')}>
                编辑
              </Button>
            )
          }{
            checkBtn && (
              <Button className={styles.btn} onClick={() => this.showModal('check')}>
                查看
              </Button>
            )
          }
          {
            deleteBtn && (
              <Button className={styles.btn} onClick={this.handleDelete}>
                删除
              </Button>
            )
          }
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: scrollX }}
        />

        <Modal
          title={title}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={null}
          width="60%"
          destroyOnClose
        >
          <Form className={styles.fm}>
            <Row gutter={24}>{this.getFields()}</Row>
            <FormItem className={styles.fmBtn}>
              <Button type="default" onClick={this.handleCancel} className={styles.backBtn}>返回</Button>
              {
                this.state.modalType !== 'check' && (
                  <Button type="primary" htmlType="submit" className={styles.submitBtn} onClick={() => this.handleSubmit(modalType)}>保存</Button>
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(BasicDataList)