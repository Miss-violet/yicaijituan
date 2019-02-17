import React, { Component } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Radio,
  message,
  Popconfirm,
  Progress,
} from 'antd';
import EditableCell from './EditableCell';
import styles from './basicDataList.less';

const { Option } = Select
const FormItem = Form.Item;
const { confirm } = Modal
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 20 },
  },
};

class BasicDataList extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      visible: false,
      confirmLoading: false,
      disabled: false,
      modalType: '',
      selectedProductId: '',
      selected: {},
      selectedRowKeys: [],
      tableTitleDialogVisible: false,     /* 控制弹窗展示/隐藏 */
      rowName: [],                        /* 记录表头列标题 */
      selectedStandardTitleData: {},                  /* 记录选中的标题 */
      selectedRowName: '',                 /* 记录选中的表头列标题 */
      progressPercent: 0,                 /* 进度条 */
      tableTitleDialogType: '',           /* 弹窗类型：add/edit */
      dialogTitle: '',                    /* 弹窗标题 */
      tableDialogType: '',                /* 弹窗操作对象类型：column/row */
    };
  }
  onChangeRadio = (e) => {
    const { standardTitleData } = this.props
    const { value } = e.target
    const selectedData = standardTitleData.filter(item => item.id === value)
    if (selectedData.length > 0) {
      this.setState({
        selectedStandardTitleData: selectedData[0],
      })
    }
  }
  getFields = () => {
    const { fmFields } = this.props;
    const { disabled } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const compareToFirstPassword = (rule, value, callback) => {
      if (value && value !== getFieldValue('password')) {
        callback('两次输入的密码不一致，请确认');
      } else {
        callback();
      }
    };

    const fmItem = fmFields.map(item => {
      const { modalType } = this.state;
      switch (item.type) {
        case 'text':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [
                    {
                      required: item.required,
                      message: `请输入${item.label}`,
                    },
                  ],
                  initialValue: item.initialValue,
                })(
                  <Input
                    placeholder={modalType === 'check' ? '' : `请输入${item.label}`}
                    disabled={disabled}
                  />
                )}
              </FormItem>
            </Col>
          );
        case 'select':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [
                    {
                      required: item.required,
                      message: `请选择${item.label}`,
                    },
                  ],
                  initialValue: item.initialValue,
                })(
                  <Select disabled={disabled}>
                    {item.data &&
                      item.data.map(selectItem => (
                        <Option value={selectItem.id} key={selectItem.id}>{selectItem.name}</Option>
                      ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          );
        case 'radio':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [
                    {
                      required: item.required,
                      message: `请选择${item.label}`,
                    },
                  ],
                  initialValue: item.initialValue || item.defaultValue,
                })(
                  <RadioGroup name={item.name} disabled={disabled}>
                    {item.data &&
                      item.data.map(radioItem => (
                        <Radio value={radioItem.id} key={radioItem.id}>{radioItem.name}</Radio>
                      ))}
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          );
        case 'password':
          return (
            <div key={item.key}>
              <Col span={24}>
                <FormItem label={item.label} {...formItemLayout}>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: item.required,
                        message: '请输入密码',
                      },
                    ],
                  })(
                    <Input
                      type="password"
                      placeholder={modalType === 'check' ? '' : '请输入密码'}
                      disabled={disabled}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="确认密码" {...formItemLayout}>
                  {getFieldDecorator('comfirmPsw', {
                    rules: [
                      {
                        required: item.required,
                        message: '请再次输入密码',
                      },
                      {
                        validator: compareToFirstPassword,
                      },
                    ],
                  })(
                    <Input
                      type="password"
                      placeholder={modalType === 'check' ? '' : '请再次输入密码'}
                      disabled={disabled}
                    />
                  )}
                </FormItem>
              </Col>
            </div>
          );
        case 'datepicker':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [
                    {
                      required: item.required,
                      message: `请输入${item.label}`,
                    },
                  ],
                  initialValue: item.initialValue,
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
          );
        default:
          break;
      }
    });
    return fmItem;
  };

  validatorNum = (rule, value, callback) => {
    if (isNaN(Number(value))) {
      callback('请输入数字');
    } else {
      this.setState({})
    }
    callback()
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      selectedProductId: '',
      selectedRowKeys: [],
      selected: {},
    });
  };

  showModal = type => {
    switch (type) {
      case 'add':
        this.setState({
          title: '新增',
          disabled: false,
          modalType: 'add',
          selected: {} /* 点击新增的时候，不带入值。防止选中后点击新增把值带入 */,
        });
        break;
      case 'edit':
        if (JSON.stringify(this.state.selected) === '{}') {
          message.warning('请选择数据后再进行操作', 3);
          return;
        }
        this.setState({
          title: '编辑',
          disabled: false,
          modalType: 'edit',
        });
        break;
      case 'check':
        if (JSON.stringify(this.state.selected) === '{}') {
          message.warning('请选择数据后再进行操作', 3);
          return;
        }
        this.setState({
          title: '查看',
          disabled: true,
          modalType: 'check',
        });
        break;
      default:
        break;
    }
    setTimeout(() => {
      const { selected } = this.state;
      if (JSON.stringify(this.state.selected) === '{}') {
        /* 如果 this.state.selected 为空，则说明是 新增 */
        this.props.fmFields.map(fmItem => {
          fmItem.initialValue = null;
          return fmItem;
        });
      } else {
        for (const i in selected) {
          this.props.fmFields.map(fmItem => {
            if (i === fmItem.name) {
              fmItem.initialValue = selected[i];
            }
            return fmItem;
          });
        }
      }
      this.setState({
        visible: true,
      });
    }, 0);
  };
  handleSubmit = modalType => {
    /* 判断标准是否填写完整 */
    const itemIsNull = [];



    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        if (modalType === 'add') {
          this.props.handleCreate({
            ...values,
          });
        } else if (modalType === 'edit') {
          this.props.handleEdit({
            ...values,
            id: this.state.selectedProductId,
          });
        }
        this.setState({
          confirmLoading: true,
          selectedRowKeys: [],
        });
        setTimeout(() => {
          this.setState({
            confirmLoading: false,
          });
        }, 500);
        this.handleCancel();
      }
    });
  };
  handleDelete = () => {
    if (!this.state.selectedProductId) {
      message.warning('请选择数据后再进行操作', 2);
      return;
    }
    confirm({
      title: '删除',
      content: '确定要删除选中的数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.handleDelete(this.state.selectedProductId);
      },
      onCancel() { },
    });
  };
  rowOnChange = (selectedRowKeys, selectedRows) => {
    const selected = selectedRows[0];
    this.setState({
      selectedProductId: selected.id,
      selectedRowKeys,
      selected,
    });
  };

  /* 打开 - 新增 表格标题字段弹窗 */
  handleAddName = (type) => {
    this.props.form.setFieldsValue({
      titleName: '',
    })
    this.setState({
      tableTitleDialogVisible: true,
      tableTitleDialogType: 'add',
      tableDialogType: type,
    })
    if (type === 0) {
      this.setState({
        dialogTitle: '新增行标题',
      })
    } else if (type === 1) {
      this.setState({
        dialogTitle: '新增列标题',
      })
    }
  }
  /* 打开 - 修改 表头字段弹窗 */
  handleEditName = (type) => {
    if (type === 0) {
      this.setState({
        dialogTitle: '编辑行标题',
      })
    } else if (type === 1) {
      this.setState({
        dialogTitle: '编辑列标题',
      })
    }
    this.props.form.setFieldsValue({
      titleName: this.state.selectedStandardTitleData.name,
    })
    this.setState({
      tableTitleDialogVisible: true,
      tableTitleDialogType: 'edit',
      tableDialogType: type,
    })
  }
  /* 新增/修改 表头字段弹窗 - 保存 */
  handleSaveName = (type) => {
    this.props.form.validateFields((err, values) => {
      if (err === null || !err.titleName) {
        const {
          tableTitleDialogType,
          selectedProductId,
        } = this.state
        /* 对标题进行操作 */
        const { standardTitleData } = this.props
        const { selectedStandardTitleData } = this.state
        /* 【新增】列标题 */
        if (tableTitleDialogType === 'add') {
          /* 与后端交互 - 【保存】列标题 */
          this.props.addStandardTitle({
            name: values.titleName,
            type,
            productId: selectedProductId,
            orderSort: standardTitleData.length,
          })
        }
        else if (tableTitleDialogType === 'edit') {
          const { id } = selectedStandardTitleData
          this.props.editStandardTitle({
            name: values.titleName,
            id,
            type,
            productId: selectedProductId,
          })
        }
        this.setState({
          tableTitleDialogVisible: false,
          selectedRowName: '',
        })
      } else if (err.titleName) {
        message.error(err.titleName.errors[0].message, 3)
      }
    })
  }

  /* 新增/修改 表头字段弹窗 - 取消 */
  handleCancelName = () => {
    this.setState({
      tableTitleDialogVisible: false,
    })
  }
  /* 删除 表头字段弹窗 */
  handleDelName = () => {
    const { id, productId, type } = this.state.selectedStandardTitleData
    this.props.delStandardTitle({
      id,
      productId,
      type,
    })
  }
  /* 第一步完成，跳转到 第二步 */
  toStepTwo = () => {
    this.setState({
      progressPercent: 33,
      selectedStandardTitleData: {},
    })
  }
  /* 第二步 跳转到 第一步 */
  toStepOne = () => {
    this.setState({
      progressPercent: 0,
    })
  }
  toStepThree = () => {
    this.setState({
      progressPercent: 66,
    })
  }
  render() {
    const {
      visible,
      title,
      confirmLoading,
      modalType,
      selectedRowKeys,
      rowName,
      selectedStandardTitleData,
      selectedRowName,
      progressPercent,
      dialogTitle,
      tableDialogType,
      tableTitleDialogVisible,
      tableTitleDialogType,
    } = this.state;
    const {
      columns,
      data,
      addBtn,
      updateBtn,
      checkBtn,
      deleteBtn,
      standardTitleData,
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.rowOnChange,
    };
    return (
      <div>
        <div className={styles.btnBar}>
          {addBtn && (
            <Button className={styles.btn} onClick={() => this.showModal('add')}>
              新增
            </Button>
          )}
          {updateBtn && (
            <Button className={styles.btn} onClick={() => this.showModal('edit')}>
              编辑
            </Button>
          )}
          {checkBtn && (
            <Button className={styles.btn} onClick={() => this.showModal('check')}>
              查看
            </Button>
          )}
          {deleteBtn && (
            <Button className={styles.btn} onClick={this.handleDelete}>
              删除
            </Button>
          )}
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={false} />

        <Modal
          title={title}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={null}
          width="80%"
          destroyOnClose
        >
          <Form className={styles.fm}>
            <Row gutter={24}>{this.getFields()}</Row>
            {
              modalType === 'edit' && (
                <Row gutter={24}>
                  <Col span={24}>
                    <FormItem label="标准" {...formItemLayout}>
                      <div className={styles.step}>
                        <div className={styles.progress}>
                          <Progress type="circle" percent={progressPercent} />
                        </div>
                        <div className={styles.stepDetail}>
                          <div>
                            标准创建步骤说明
                          </div>
                          <ul>
                            <li>第一步：新增列，填写表头字段内容</li>
                            <li>第二步：新增行，创建表格</li>
                            <li>第三步：新增数据</li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        {
                          /* 展示 第一步 内容 */
                          progressPercent === 0 && (
                            <div>
                              <div>第一步：新增列，填写表头字段内容</div>
                              <div>
                                <Button onClick={() => this.handleAddName(1)} type="primary" style={{ marginBottom: 16, marginRight: 10 }}>
                                  新增
                                </Button>
                                <Button onClick={() => this.handleEditName(1)} type="default" style={{ marginBottom: 16, marginRight: 10 }} disabled={selectedStandardTitleData.name === undefined}>
                                  修改
                                </Button>
                                <Button onClick={this.handleDelName} type="default" style={{ marginBottom: 16, marginRight: 10 }} disabled={selectedStandardTitleData.name === undefined}>
                                  删除
                                </Button>
                              </div>
                              {/* 展示新增后的列表 */}
                              <RadioGroup name='columnGroup' onChange={this.onChangeRadio}>
                                {
                                  standardTitleData.map(item => item.type === 1 &&
                                    (
                                      <Radio value={item.id} key={item.id}>{item.name}</Radio>
                                    ))
                                }
                              </RadioGroup>
                              <div>
                                <Button disabled={standardTitleData.filter(item => item.type === 1).length < 1} onClick={this.toStepTwo}>
                                  下一步
                                </Button>
                              </div>
                            </div>
                          )
                        }
                        {
                          /* 展示 第二步 内容 */
                          progressPercent === 33 && (
                            <div>
                              <div className={styles.columnNameListWrap}>
                                <div className={styles.columnNameListTitle}>第一步已创建好的表头内容：</div>
                                <ul className={styles.columnNameList}>
                                  {
                                    standardTitleData.map(item => item.type === 1 && (<li key={item.id}>{item.name}</li>))
                                  }
                                </ul>
                              </div>
                              <div>第二步：新增行</div>
                              <div>
                                <Button onClick={() => this.handleAddName(0)} type="primary" style={{ marginBottom: 16, marginRight: 10 }}>
                                  新增
                                </Button>
                                <Button onClick={() => this.handleEditName(0)} type="default" style={{ marginBottom: 16, marginRight: 10 }} disabled={selectedRowName === undefined}>
                                  修改
                                </Button>
                                <Button onClick={this.handleDelName} type="default" style={{ marginBottom: 16, marginRight: 10 }} disabled={selectedRowName === ''}>
                                  删除
                                </Button>
                              </div>
                              {/* 展示新增后的列表 */}
                              <RadioGroup name='columnGroup' onChange={this.onChangeRadio}>
                                {
                                  standardTitleData.map(item => item.type === 0 &&
                                    (
                                      <Radio value={item.id} key={item.id}>{item.name}</Radio>
                                    ))
                                }
                              </RadioGroup>
                              <div>
                                <Button onClick={this.toStepOne} style={{ marginRight: 10 }} >
                                  上一步
                                </Button>
                                <Button onClick={this.toStepThree} disabled={standardTitleData.filter(item => item.type === 0).length < 1} style={{ marginRight: 10 }} >
                                  下一步
                                </Button>
                              </div>
                            </div>
                          )
                        }
                        {
                          /* 展示 第三步 内容 */
                          progressPercent === 66 && (
                            <div>
                              <Button onClick={this.toStepTwo}>
                                上一步
                              </Button>
                            </div>
                          )
                        }
                        {/* 弹窗 - 文本框 */}
                        <Modal
                          title={dialogTitle}
                          visible={tableTitleDialogVisible}
                          onOk={() => this.handleSaveName(tableDialogType)}
                          onCancel={this.handleCancelName}
                        >
                          {
                            getFieldDecorator(
                              'titleName',
                              {
                                rules:
                                  [
                                    {
                                      required: true,
                                      message: '请输入字段内容',
                                    },
                                    {
                                      validator: (rule, value, callback) => {
                                        if (value !== selectedStandardTitleData.name && standardTitleData.some(item => item.name === value && item.type === tableDialogType)) {
                                          message.error('已存在重复的表格列字段，请重新填写', 3);
                                          callback({ message: '已存在重复的表格列字段，请重新填写' })
                                          return
                                        }
                                        callback()
                                      },
                                    },
                                  ],
                              }
                            )
                              (<Input placeholder="请输入字段内容" />)
                          }
                        </Modal>
                      </div>
                    </FormItem>
                  </Col>
                </Row>
              )
            }

            <FormItem className={styles.fmBtn}>
              <Button type="default" onClick={this.handleCancel} className={styles.backBtn}>
                返回
              </Button>
              {this.state.modalType !== 'check' && (
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.submitBtn}
                  onClick={() => this.handleSubmit(modalType)}
                >
                  保存
                </Button>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div >
    );
  }
}
export default Form.create()(BasicDataList);
