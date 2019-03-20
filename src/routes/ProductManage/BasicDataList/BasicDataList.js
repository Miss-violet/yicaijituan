import React, { Component } from 'react';
import { connect } from 'dva'
import classNames from 'classnames'
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
  Progress,
  InputNumber,
} from 'antd';
import styles from './basicDataList.less';
import commonStyles from '../../../assets/style/common.less'

const { Option } = Select
const FormItem = Form.Item;
const { confirm } = Modal
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 22 },
  },
};

class BasicDataList extends Component {
  constructor(props) {
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
      fmFields: props.fmFields,
      tableTitleModalVisible: false,      /* 标准行/列标题 弹窗 - 展示/隐藏 */
      selectedStandardTitleData: {},      /* 记录选中的标题 */
      progressPercent: 0,                 /* 进度条 */
      tableTitleModalType: '',            /* 弹窗类型：add/edit */
      dialogTitle: '',                    /* 弹窗标题 */
      tableDialogType: '',                /* 弹窗操作对象类型：column/row */
      okBtnDisabled: true,                /* 标准行/列标题 弹窗 保存按钮是否可执行 */
      newColumnTitle: [],                  /* 前端保存新增加的列标题 */
      newRowTitle: [],                    /* 前端保存新增加的行标题 */
      autoFocus: true,
    };
  }
  componentWillReceiveProps(nextProps) {
    /* 把查询到的商品详情回填到弹窗中 */
    if (this.props.productDetail !== nextProps.productDetail) {
      const { productDetail } = nextProps
      const { fmFields } = this.props
      for (const i in productDetail) {
        if (productDetail) {
          fmFields.map(fmItem => {
            if (i === fmItem.name) {
              fmItem.initialValue = productDetail[i];
            }
            return fmItem;
          });
        }
      }
      setTimeout(() => {
        this.setState({
          fmFields,
        })
      }, 0)
    }
  }

  /**
   * 产品基本信息
   * 
   * @memberof BasicDataList
   */
  getEditProductFields = () => {
    const { fmFields, disabled } = this.state;
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
      return item
    });
    return fmItem;
  };

  /**
   * 产品标准模板信息
   * 
   * @memberof BasicDataList
   */
  getEditStandardFields = () => {
    const {
      selectedStandardTitleData,
      progressPercent,
      dialogTitle,
      tableDialogType,
      tableTitleModalVisible,
      newColumnTitle,
      newRowTitle,
      selectedProductId,
      autoFocus,
    } = this.state
    const {
      standardColumnTitleData,
      standardRowTitleData,
      standardParams,
    } = this.props
    const { getFieldDecorator } = this.props.form;

    /* 选中字段 */
    const onChangeRadio = (type, e) => {
      const { value } = e.target
      let selectedData = []
      if (type === 0) {
        selectedData = standardRowTitleData.filter(item => item.id === value)
      } else if (type === 1) {
        selectedData = standardColumnTitleData.filter(item => item.id === value)
      }
      if (selectedData.length > 0) {
        this.setState({
          selectedStandardTitleData: selectedData[0],
        })
      }
    }

    /* 打开 - 新增 表格标题字段弹窗 */
    const handleAddName = (type) => {
      this.props.form.setFieldsValue({
        titleName: '',
      })
      this.setState({
        tableTitleModalVisible: true,
        tableTitleModalType: 'add',
        tableDialogType: type,
        autoFocus: true,
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
    const handleEditName = (type) => {
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
        tableTitleModalVisible: true,
        tableTitleModalType: 'edit',
        tableDialogType: type,
      })
    }
    /* 新增/修改 表头字段弹窗 - 保存 */
    const handleSaveName = (type) => {
      this.props.form.validateFields((err, values) => {
        if (err === null || !err.titleName) {
          const {
            tableTitleModalType,
          } = this.state
          /* 【新增】列标题 */
          if (tableTitleModalType === 'add') {
            /* 前端保存列标题（用于生成空的标准值）。与后端交互 - 【保存】列标题 */
            if (type === 1) {
              this.setState({
                newColumnTitle,
              })
              this.props.dispatch({
                type: 'productManage/standardTitleCreate',
                payload: {
                  name: values.titleName,
                  type,
                  productId: selectedProductId,
                  orderSort: standardColumnTitleData.length + 1,
                },
                callback: (data) => {
                  newColumnTitle.push({
                    columnTitle: data.name,
                    columnId: data.id,
                  })
                  this.setState({
                    newColumnTitle,
                  })
                },
              })
            }
            /* 前端保存行标题（用于生成空的标准值）。与后端交互 - 【保存】行标题 */
            else if (type === 0) {
              this.props.dispatch({
                type: 'productManage/standardTitleCreate',
                payload: {
                  name: values.titleName,
                  type,
                  productId: selectedProductId,
                  orderSort: standardRowTitleData.length + 1,
                },
                callback: (data) => {
                  newRowTitle.push({
                    rowTitle: data.name,
                    rowId: data.id,
                  })
                  this.setState({
                    newRowTitle,
                  })
                },
              })
            }
          }
          else if (tableTitleModalType === 'edit') {
            const { id } = selectedStandardTitleData
            this.props.editStandardTitle({
              name: values.titleName,
              id,
              type,
              productId: selectedProductId,
            })
          }
          this.setState({
            tableTitleModalVisible: false,
          })
        } else if (err.titleName) {
          message.error(err.titleName.errors[0].message, 3)
        }
        this.setState({
          autoFocus: false,
        })
      })
    }
    /* 新增/修改 表头字段弹窗 文本框有内容时，确定按钮可点击 */
    const handleChangeName = (e) => {
      if (e.target.value) {
        this.setState({
          okBtnDisabled: false,
        })
      } else {
        this.setState({
          okBtnDisabled: true,
        })
      }
    }
    /* 新增/修改 表头字段弹窗 - 取消 */
    const handleCancelName = () => {
      this.setState({
        tableTitleModalVisible: false,
      })
    }
    /* 删除 表头字段弹窗 */
    const handleDelName = () => {
      const { id, productId, type } = this.state.selectedStandardTitleData
      this.props.delStandardTitle({
        id,
        productId,
        type,
      })
    }
    /* 第一步完成，跳转到 第二步 */
    const toStepTwo = () => {
      /* 拿新创建的列标题，拼凑出空的标准值给后端 */
      const createData = []
      if (standardRowTitleData.length > 0 && newColumnTitle.length > 0) {
        newColumnTitle.forEach(newItem => {
          standardRowTitleData.forEach(rowItem => {
            createData.push({
              rowTitle: rowItem.name,
              id: 0,
              rowId: rowItem.id,
              columnId: newItem.columnId,
              type: 0,
              productId: selectedProductId,
              val: 0,
              pointNum: 0,
            })
          })
        })
        this.props.dispatch({
          type: 'productManage/standardParamsCreate',
          payload: {
            str: JSON.stringify(createData),
          },
        })
      }
      this.setState({
        progressPercent: 33,
        selectedStandardTitleData: {},
        newColumnTitle: [],
      })
    }
    /* 第二步 跳转到 第一步 */
    const toStepOne = () => {
      this.setState({
        progressPercent: 0,
      })
    }
    /* 第二步完成，跳转到 第三步，创建空的标准值数据给后端 */
    const toStepThree = () => {
      /* 拿新创建的行标题，拼凑出空的标准值给后端 */
      const createData = []
      if (standardColumnTitleData.length > 0 && newRowTitle.length > 0) {
        newRowTitle.forEach(newItem => {
          standardColumnTitleData.forEach(columnItem => {
            createData.push({
              rowTitle: newItem.rowTitle,
              id: 0,
              rowId: newItem.rowId,
              columnId: columnItem.id,
              type: 0,
              productId: selectedProductId,
              val: 0,
              pointNum: 0,
            })
          })
        })
        this.props.dispatch({
          type: 'productManage/standardParamsCreate',
          payload: {
            str: JSON.stringify(createData),
          },
        })
      }
      this.props.dispatch({
        type: 'productManage/standardParamsQuery',
        payload: {
          productId: selectedProductId,
        },
      })
      this.setState({
        progressPercent: 66,
        newRowTitle: [],
      })
    }
    const stepOne = classNames({
      [styles.currentStep]: this.state.progressPercent === 0,
      [styles.normalStep]: true,
    })
    const stepTwo = classNames({
      [styles.currentStep]: this.state.progressPercent === 33,
      [styles.normalStep]: true,
    })
    const stepThree = classNames({
      [styles.currentStep]: this.state.progressPercent === 66,
      [styles.normalStep]: true,
    })

    return (
      <Col span={24}>
        <FormItem label="标准" {...formItemLayout}>
          <div className={styles.step}>
            <div className={styles.progress}>
              <Progress type="circle" percent={progressPercent} />
            </div>
            <div className={styles.stepDetail}>
              <div>
                标准模板创建步骤说明
              </div>
              <ul>
                <li className={stepOne}>
                  {progressPercent === 0 && (<span>第一步：新增列标题</span>)}
                  {progressPercent !== 0 && (
                    <div className={styles.columnNameListWrap}>
                      <div className={styles.columnNameListTitle}>第一步已创建好的列标题：</div>
                      <ul className={styles.columnNameList}>
                        {
                          standardColumnTitleData.map(item => <li key={item.id} style={{ fontWeight: 'bold' }}>{item.name}</li>)
                        }
                      </ul>
                    </div>
                  )}
                </li>

                <li className={stepTwo}>
                  {progressPercent !== 66 && (<span>第二步：新增行标题，创建表格</span>)}
                  {progressPercent === 66 && (
                    <div className={styles.columnNameListWrap}>
                      <div className={styles.columnNameListTitle}>第二步已创建好的行标题：</div>
                      <ul className={styles.columnNameList}>
                        {
                          standardRowTitleData.map(item => <li key={item.id} style={{ fontWeight: 'bold' }}>{item.name}</li>)
                        }
                      </ul>
                    </div>
                  )}
                </li>
                <li className={stepThree}>第三步：新增标准模板数据</li>
              </ul>
            </div>
          </div>
          <div>
            {
              /* 展示 第一步 内容 */
              progressPercent === 0 && (
                <div>
                  <div>
                    <Button onClick={() => handleAddName(1)} type="primary" className={styles.editStandardModalBtnBar}>
                      新增
                    </Button>
                    <Button onClick={() => handleEditName(1)} type="default" className={styles.editStandardModalBtnBar} disabled={selectedStandardTitleData.name === undefined}>
                      修改
                    </Button>
                    <Button onClick={handleDelName} type="default" className={styles.editStandardModalBtnBar} disabled={selectedStandardTitleData.name === undefined}>
                      删除
                    </Button>
                  </div>
                  {/* 展示新增后的列表 */}
                  <RadioGroup name='columnGroup' onChange={(event) => onChangeRadio(1, event)}>
                    {
                      standardColumnTitleData.map(item => item.type === 1 &&
                        (
                          <Radio value={item.id} key={item.id}>{item.name}</Radio>
                        ))
                    }
                  </RadioGroup>
                  <div>
                    <Button disabled={standardColumnTitleData.length < 1} onClick={toStepTwo}>
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
                  <div>
                    <Button onClick={() => handleAddName(0)} type="primary" className={styles.editStandardModalBtnBar}>
                      新增
                    </Button>
                    <Button onClick={() => handleEditName(0)} type="default" className={styles.editStandardModalBtnBar} disabled={selectedStandardTitleData.name === undefined}>
                      修改
                    </Button>
                    <Button onClick={handleDelName} type="default" className={styles.editStandardModalBtnBar} disabled={selectedStandardTitleData.name === undefined}>
                      删除
                    </Button>
                  </div>
                  {/* 展示新增后的列表 */}
                  <RadioGroup name='columnGroup' onChange={(event) => onChangeRadio(0, event)}>
                    {
                      standardRowTitleData.map(item => item.type === 0 &&
                        (
                          <Radio value={item.id} key={item.id}>{item.name}</Radio>
                        ))
                    }
                  </RadioGroup>
                  <div>
                    <Button onClick={toStepOne} style={{ marginRight: 10 }} >
                      上一步
                    </Button>
                    <Button onClick={toStepThree} disabled={standardRowTitleData.length < 1} style={{ marginRight: 10 }} >
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
                  <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table className={commonStyles.table} style={{ width: '100%', marginBottom: '10px' }}>
                      <thead>
                        <tr>
                          <th>
                            &nbsp;
                          </th>
                          <th>
                            类型
                          </th>
                          {
                            standardColumnTitleData.map(item => (
                              <th key={item.id}>
                                {item.name}
                              </th>
                            ))
                          }
                          <th>
                            保留小数点位数
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          standardParams.map(standardParamsItem => {
                            /* 通过遍历 standardParams， 找出已知的类型值，填入表格中 */
                            let pointNumValue
                            return (
                              <tr key={standardParamsItem.rowId}>
                                <td>
                                  {standardParamsItem.rowTitle}
                                </td>
                                <td>
                                  <FormItem>
                                    {getFieldDecorator(`type_${standardParamsItem.rowId}`, {
                                      rules: [{ required: true, message: '此项必填' }],
                                      initialValue: standardParamsItem.params[0].type,
                                    })(
                                      <Select style={{ width: '100 %' }} placeholder="请选择">
                                        <Option value={0}>≤（小于等于）</Option>
                                        <Option value={1}>≥（大于等于）</Option>
                                      </Select>
                                      )
                                    }
                                  </FormItem>
                                </td>
                                {
                                  standardParamsItem.params.map(paramsItem => {
                                    const { val, pointNum, columnId, rowId } = paramsItem
                                    pointNumValue = pointNum
                                    return (
                                      <td key={`${columnId}_${rowId}`}>
                                        <FormItem>
                                          {getFieldDecorator(`${columnId}_${rowId}`, {
                                            rules: [{ required: true, message: '此项必填' }, {
                                              validator: this.validatorNum,
                                            }],
                                            initialValue: val,
                                          })(
                                            <InputNumber
                                              onBlur={this.inputNumberCheck}
                                              disabled={this.props.disabled}
                                              step={this.props.step}
                                              min={this.props.min}
                                              max={this.props.max}
                                            />
                                            )}
                                        </FormItem>
                                      </td>
                                    )
                                  })
                                }
                                <td>
                                  <FormItem>
                                    {getFieldDecorator(`pointNum_${standardParamsItem.rowId}`, {
                                      rules: [{ required: true, message: '此项必填' }, {
                                        validator: this.validatorNum,
                                      }],
                                      initialValue: pointNumValue,
                                    })(
                                      <InputNumber
                                        onBlur={this.inputNumberCheck}
                                        disabled={this.props.disabled}
                                        step={this.props.step}
                                        min={this.props.min}
                                        max={this.props.max}
                                      />
                                      )}
                                  </FormItem>
                                </td>
                              </tr>

                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                  <Button onClick={toStepTwo}>
                    上一步
                  </Button>
                </div>
              )
            }
            {/* 弹窗 - 文本框 */}
            <Modal
              title={dialogTitle}
              visible={tableTitleModalVisible}
              onOk={() => handleSaveName(tableDialogType)}
              onCancel={handleCancelName}
              okButtonProps={{ disabled: this.state.okBtnDisabled }}
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
                            if (tableDialogType === 1) {
                              if (value !== selectedStandardTitleData.name && standardColumnTitleData.some(item => item.name === value)) {
                                message.error('已存在重复的表格列字段，请重新填写', 3);
                                callback({ message: '已存在重复的表格列字段，请重新填写' })
                                return
                              }
                            } else if (tableDialogType === 0) {
                              if (value !== selectedStandardTitleData.name && standardRowTitleData.some(item => item.name === value)) {
                                message.error('已存在重复的表格行字段，请重新填写', 3);
                                callback({ message: '已存在重复的表格行字段，请重新填写' })
                                return
                              }
                            }
                            callback()
                          },
                        },
                      ],
                  }
                )
                  (<Input placeholder="请输入字段内容" onChange={handleChangeName} autoFocus={autoFocus} />)
              }
            </Modal>
          </div>
        </FormItem>
      </Col>
    )
  }

  /**
   * 输入校验
   * 
   * @memberof BasicDataList
   */
  validatorNum = (rule, value, callback) => {
    if (isNaN(Number(value))) {
      callback('请输入数字');
    } else {
      this.setState({})
    }
    callback()
  }

  /**
   * 关闭弹窗 - 新增/编辑/查看 产品，编辑产品标准模板
   * 
   * @memberof BasicDataList
   */
  handleCancel = (modalType) => {
    if (modalType === 'editStandard') {
      this.setState({
        progressPercent: 0,
      })
    }

    this.setState({
      visible: false,
      selectedProductId: '',
      selectedRowKeys: [],
      selected: {},
    });
  };

  /**
   * 打开弹窗 - 新增/编辑/查看 产品，编辑产品标准模板
   * 
   * @memberof BasicDataList
   */
  showModal = type => {
    switch (type) {
      case 'add':
        this.setState({
          title: '新增产品',
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
          title: '编辑产品',
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
          title: '查看产品',
          disabled: true,
          modalType: 'check',
        });
        break;
      case 'editStandard':
        if (JSON.stringify(this.state.selected) === '{}') {
          message.warning('请选择数据后再进行操作', 3);
          return;
        }
        this.setState({
          title: '编辑产品模板',
          disabled: true,
          modalType: 'editStandard',
        });
        break;
      default:
        break;
    }
    setTimeout(() => {
      const { selected, modalType, fmFields } = this.state;
      const { id } = selected
      const { handleCheck, dispatch } = this.props
      if (JSON.stringify(this.state.selected) === '{}') {
        /* 如果 this.state.selected 为空，则说明是 新增 */
        fmFields.map(fmItem => {
          fmItem.initialValue = null;
          return fmItem;
        });
      } else {
        if (modalType === 'editStandard') {
          let getTitle
          dispatch({
            type: 'productManage/queryStandardTitleList',
            payload: {
              productId: id,
              type: 0,
            },
            callback: (res) => {
              if (!res.data) getTitle = false
            },
          })
          dispatch({
            type: 'productManage/queryStandardTitleList',
            payload: {
              productId: id,
              type: 1,
            },
            callback: (res) => {
              if (!res.data) getTitle = false
            },
          })
          /* 有 title 时再请求 params */
          if (getTitle) {
            dispatch({
              type: 'productManage/standardParamsQuery',
              payload: {
                productId: id,
              },
            })
          }
        }
        /* 用接口查询商品详情 */
        handleCheck({
          productId: id,
        })
      }
      this.setState({
        visible: true,
      });
    }, 0);
  };

  /**
   * 保存产品信息
   * 
   * @memberof BasicDataList
   */
  handleSubmit = modalType => {
    if (modalType !== 'editStandard') {
      /* 编辑产品信息，不包括标准模板的编辑 */
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err || (Object.keys(err).length === 1 && err.titleName)) {
          switch (modalType) {

            case 'add':
              this.props.handleCreate({
                ...values,
              });
              break;
            case 'edit':
              this.props.handleEdit({
                ...values,
                id: this.state.selectedProductId,
              });
              break;
            default:
              break;
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
      }
      );
    } else {
      /* 标准模板的编辑，校验指标是否填写完整 */
      const values = this.props.form.getFieldsValue()
      for (const i in values) {
        if (values[i] === undefined && i !== 'titleName') {
          Modal.warning({
            title: '警告',
            content: '标准的各个指标不能为空，请填写完整后再保存',
            okText: '知道了',
          });
          return
        }
      }
      this.handleSubmitEditStandard(values)
      this.setState({
        progressPercent: 0,
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
  };

  /**
   * 保存标准模板
   * 
   * @memberof BasicDataList
   */
  handleSubmitEditStandard = (values) => {
    const { standardParams } = this.props.productManage
    /* 填写完整以后 */
    let paramsList = []
    standardParams.forEach(standardItem => {
      standardItem.params.forEach(paramsItem => {
        paramsList.push(paramsItem)
      })
    })

    paramsList = paramsList.map(paramsItem => {
      const { rowId, columnId } = paramsItem
      for (const i in values) {
        if (values[i]) {
          if (i === `${columnId}_${rowId}`) {
            paramsItem.val = String(values[i])
          }
          if (i === `type_${rowId}`) {
            paramsItem.type = values[i]
          }
          if (i === `pointNum_${rowId}`) {
            paramsItem.pointNum = values[i]
          }
        }
      }
      return paramsItem
    })
    this.props.dispatch({
      type: 'productManage/standardParamsUpdate',
      payload: {
        str: JSON.stringify(paramsList),
      },
    })
    this.setState({
      selectedRowKeys: [],
    })
  }

  /**
   * 删除产品信息
   * 
   * @memberof BasicDataList
   */
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

  /**
   * 产品列表 - 选中数据事件
   *
   * @memberof BasicDataList
   */
  rowOnChange = (selectedRowKeys, selectedRows) => {
    const selected = selectedRows[0];
    this.setState({
      selectedProductId: selected.id,
      selectedRowKeys,
      selected,
    });
  };

  render() {
    const {
      visible,
      title,
      confirmLoading,
      modalType,
      selectedRowKeys,
    } = this.state;
    const {
      columns,
      data,
      addBtn,
      updateBtn,
      checkBtn,
      deleteBtn,
    } = this.props;

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
          {updateBtn && (
            <Button className={styles.btn} onClick={() => this.showModal('editStandard')}>
              编辑标准
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
          onCancel={() => this.handleCancel(modalType)}
          footer={null}
          width="80%"
          destroyOnClose
        >
          <Form className={styles.fm}>
            <Row gutter={24}>{this.getEditProductFields()}</Row>
            {
              modalType === 'editStandard' && (
                <Row gutter={24}>{this.getEditStandardFields()}</Row>
              )
            }
            <FormItem className={styles.fmBtn}>
              <Button type="default" onClick={() => this.handleCancel(modalType)} className={styles.backBtn}>
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
export default connect(({ productManage }) => ({ productManage }))(Form.create()(BasicDataList));
