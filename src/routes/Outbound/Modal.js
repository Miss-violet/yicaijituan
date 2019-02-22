import React, { Component } from 'react';
import { Modal, Form, Row, Col, Select, Input, DatePicker, InputNumber, Button } from 'antd';
import * as moment from 'moment';
import styles from './outbound.less';
import commonStyles from '../../assets/style/common.less';

const FormItem = Form.Item;
const Option = Select.Option;

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      carData: [],
      standardsData: props.selectedDetail.standards,
      levelSelected: '',
      resultOk: this.props.resultOk || false,
      productName: '',                  /* 选中的产品名称 */
      distributorName: '',              /* 选中的客户名称 */
      supplierName: '',                 /* 选中的生厂商名称 */
      remark: '',                       /* 打印备注 */
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.setState({
        visible: nextProps.visible,
      });
    }

    /* 设置检验结果的初始值 */
    if (this.props.selectedDetail !== nextProps.selectedDetail) {
      this.setState({
        standardsData: nextProps.selectedDetail.standards,
      });
    }

    if (this.props.remark !== nextProps.remark) {
      this.setState({
        remark: nextProps.remark,
      });
    }
  }

  /* 出厂合格证 */
  getCertificateFields = () => {
    const { getFieldDecorator, setFields } = this.props.form;
    const {
      manufacturerSelectList,
      companyAllSelectList,
      productSelectList,
      selectedDetail,
      disabled,
      type,
      standardColumnTitleData,
    } = this.props;
    const manufacturerEnabled = manufacturerSelectList.filter(item => item.status === 0);
    const companyEnabled = companyAllSelectList.filter(item => item.status === 0);
    const productEnabled = productSelectList.filter(item => item.status === 0);


    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 16 },
      },
    };
    const formColLayout = {
      xs: { span: 12 },
      sm: { span: 8 },
      md: { span: 8 },
      lg: { span: 6 },
    };
    /**
     * 产品下拉框变化事件：
     * 1、加载产品对应的标准
     * 2、查询出对应的产品名称
     */
    const handleProductChange = productId => {
      const proSelected = productEnabled.filter(item => item.id === productId);
      let { standards } = proSelected[0]

      if (type === 'add') {
        standards = standards.map(item => {
          /* 防止点击编辑-新增后，新增弹窗内的标准检验值被带入 */
          return {
            ...item,
            parameter: '',
          }
        });
      }
      standards = standards.map(item => {
        /* 如果不进行拷贝，则在修改id时，会将 standardId 也一起改掉 */
        const copyItem = { ...item }
        /* 每次切换产品的时候，把查询产品列表后的标准 id 和 name 分别赋给standardId 和 standardName */
        /* 由于是新的标准，提交给后端保存的标准 id 应该 null */
        return {
          ...item,
          standardId: copyItem.id,
          standardName: copyItem.name,
          id: null,
        }
      })

      const productName = proSelected[0].name;
      const { remark } = proSelected[0];
      const { printName } = proSelected[0];

      setFields({
        title: {
          value: printName,
        },
      });
      this.setState({
        standardsData: standards,
        productName,
        remark,
      });
    };

    /**
     * 级别下拉框变化事件：
     * 查询出当前选中的值，用于后续的判断
     */
    const handleLevelChange = levelSelected => {
      this.setState({
        levelSelected,
      });
    };

    /**
     * 客户名称下拉框变化事件：
     * 查询出当前选中的名称，用于保存
     */
    const handleDistributorChange = distributorId => {
      let distributorName;
      companyAllSelectList.map(item => {
        if (item.id === distributorId) {
          distributorName = item.name;
        }
        return item;
      });
      this.props.form.setFieldsValue({
        customer: distributorName,
      });
      this.setState({
        distributorName,
      });
    };

    /**
     * 生产厂家下拉框变化事件：
     * 查询出当前选中的名称，用于保存
     */
    const handleSupplierChange = supplierId => {
      let supplierName;
      manufacturerSelectList.map(item => {
        if (item.id === supplierId) {
          supplierName = item.name;
        }
        return item
      });
      this.setState({
        supplierName,
      });
    };
    /* 车牌 */
    let timeout;
    const options = this.state.carData.map(d => <Option key={d}>{d}</Option>);
    const fetch = value => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      const fake = () => {
        const { cars } = this.props;
        const data = [];

        cars.map(carItem => {
          const reg = new RegExp(value);
          if (carItem.match(reg)) {
            data.push(carItem);
          }
          return carItem;
        });
        this.setState({ carData: data });
      };

      timeout = setTimeout(fake, 300);
    };
    const handleChange = value => {
      this.props.form.setFieldsValue({
        carNo: value,
      });
      fetch(value);
    };
    const handleFocus = () => {
      const { cars } = this.props
      this.setState({
        carData: cars,
      })
    }
    return (
      <div>
        <fieldset>
          <legend> 出厂合格证</legend>
          <Row gutter={8}>
            <Col {...formColLayout}>
              <FormItem label="品名" {...formItemLayout}>
                {getFieldDecorator('productId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择品名',
                    },
                  ],
                  initialValue: selectedDetail.productId,
                })(
                  <Select onChange={handleProductChange} disabled={disabled}>
                    {productEnabled &&
                      productEnabled.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                  </Select>
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="级别" {...formItemLayout}>
                {getFieldDecorator('columnName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择级别',
                    },
                  ],
                  initialValue:
                    selectedDetail.columnName !== undefined ? String(selectedDetail.columnName) : '',
                })(
                  <Select onChange={handleLevelChange} disabled={disabled}>
                    {
                      standardColumnTitleData.map(
                        item => <Option value={item.id} key={item.id}>{item.name}</Option>
                      )
                    }
                  </Select>
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="公司抬头" {...formItemLayout}>
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '请填写公司抬头',
                    },
                  ],
                  initialValue: selectedDetail.title,
                })(<Input placeholder="请填写公司抬头" disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="出厂时间" {...formItemLayout}>
                {getFieldDecorator('outTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择出厂时间',
                    },
                  ],
                  initialValue: moment(selectedDetail.outTime),
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择出厂时间"
                    className={styles.datepicker}
                    disabled={selectedDetail.allowModifyOutTime === 0}
                  />
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="生产日期" {...formItemLayout}>
                {getFieldDecorator('deliveryTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择生产日期',
                    },
                  ],
                  initialValue: type !== 'add'
                    ? moment(selectedDetail.deliveryTime)
                    : '',
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择生产日期"
                    className={styles.datepicker}
                    disabled={disabled}
                  />
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="生产厂家" {...formItemLayout}>
                {getFieldDecorator('supplierId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择生产厂家',
                    },
                  ],
                  initialValue: selectedDetail.supplierId,
                })(
                  <Select onChange={handleSupplierChange} disabled={disabled}>
                    {manufacturerEnabled &&
                      manufacturerEnabled.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                  </Select>
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="工艺" {...formItemLayout}>
                {getFieldDecorator('techno', {
                  rules: [
                    {
                      required: true,
                      message: '请选择工艺',
                    },
                  ],
                  initialValue: selectedDetail.techno === 0 ? '0' : '',
                })(
                  <Select disabled={disabled}>
                    <Option value="0">分选</Option>
                  </Select>
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="运输车号" {...formItemLayout}>
                {getFieldDecorator('carNo', {
                  rules: [
                    {
                      required: true,
                      message: '请填写运输车号',
                    },
                  ],
                  initialValue: selectedDetail.carNo,
                })(
                  <Select
                    mode="combobox"
                    placeholder={this.props.placeholder}
                    style={this.props.style}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    disabled={disabled}
                  >
                    {options}
                  </Select>
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="公司名称" {...formItemLayout}>
                {getFieldDecorator('distributorId', {
                  rules: [
                    {
                      required: true,
                      message: '请填写公司名称',
                    },
                  ],
                  initialValue: selectedDetail.distributorId,
                })(
                  <Select onChange={handleDistributorChange} disabled={disabled} allowClear showSearch optionFilterProp="children">
                    {companyEnabled &&
                      companyEnabled.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                  </Select>
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="客户名称" {...formItemLayout}>
                {getFieldDecorator('customer', {
                  rules: [
                    {
                      required: true,
                      message: '请填写客户名称',
                    },
                  ],
                  initialValue: selectedDetail.customer,
                })(<Input placeholder="请填写客户名称" disabled={disabled} />)}
              </FormItem>
            </Col>
          </Row>
        </fieldset>
      </div>
    );
  };

  /* 检查结果 */
  getResult = () => {
    const { levelSelected, resultOk, remark, standardsData } = this.state;
    const { disabled, selectedDetail, standardColumnTitleData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { columnName, columnId } = selectedDetail;

    const tableColLayout = {
      xs: { offset: 0 },
      sm: { offset: 0 },
      md: { offset: 2 },
    };
    /* 检验结果 文本框 失焦时的校验 */
    const inputOnBlur = (event, standardsItem) => {
      window.event.cancelBubble = true;

      let levelStandards = 0;
      const { value } = event.target
      const { type, pointNum, standardName } = standardsItem

      standardsItem.params.map(paramsItem => {
        const { val } = paramsItem

        if (paramsItem.columnId === columnId || paramsItem.columnId === levelSelected) {
          levelStandards = Number(val)
        }
        return paramsItem
      })
      /* 检验是否为空 */
      if (standardsItem.standardName !== '强度活性指数（%）' && (value === '' || value === null)) {
        this.setState({
          resultOk: false,
        });
        Modal.warning({
          title: '警告',
          content: `${standardName}的检验结果不能为空值`,
          okText: '知道了',
        });
        return false
      }
      /**
       *  type===1：大于等于
       *  type===0：小于等于
       */
      if (value !== '' && value !== null) {
        if (type === 1 && value && Number(value) < levelStandards) {
          this.setState({
            resultOk: false,
          });
          Modal.warning({
            title: '警告',
            content: `${standardName}的检验结果须大于等于国家标准值`,
            okText: '知道了',
          });
          return
        }
        if (type === 0 && value && Number(value) > levelStandards) {
          this.setState({
            resultOk: false,
          });
          Modal.warning({
            title: '警告',
            content: `${standardName}的检验结果须小于等于国家标准值`,
            okText: '知道了',
          });
          return
        }
        if (pointNum === 0 && value.indexOf('.') !== -1) {
          this.setState({
            resultOk: false,
          });
          Modal.warning({
            title: '警告',
            content: `${standardName}的小数位与产品设置不符合，请填写整数`,
            okText: '知道了',
          });
          return
        }
        if (pointNum > 0 && value.indexOf('.') === -1) {
          this.setState({
            resultOk: false,
          });
          Modal.warning({
            title: '警告',
            content: `${standardName}的小数位与产品设置不符合，小数点后需保留${pointNum}位小数`,
            okText: '知道了',
          });
          return
        }
        if (pointNum > 0 && value.length - value.indexOf('.') - 1 !== pointNum) {
          this.setState({
            resultOk: false,
          });
          Modal.warning({
            title: '警告',
            content: `${standardName}的小数位与产品设置不符合，小数点后需保留${pointNum}位小数`,
            okText: '知道了',
          });
          return
        }
      }
      this.setState({
        resultOk: true,
      });
    };

    return (
      <div>
        <fieldset>
          <legend> 检查结果</legend>
        </fieldset>
        <Row>
          <Col {...tableColLayout}>
            <table className={commonStyles.table}>
              <thead>
                <tr>
                  <th rowSpan="2">项目</th>
                  <th colSpan={standardColumnTitleData.length}>国家标准</th>
                  <th rowSpan="2">检验结果</th>
                </tr>
                <tr>
                  {
                    standardColumnTitleData && standardColumnTitleData.map(item => <th key={item.id}>{item.name}</th>)
                  }
                </tr>
              </thead>
              <tbody>
                {
                  standardsData && standardsData.map(standardsItem => {
                    return (
                      <tr key={standardsItem.standardId}>
                        <td>
                          {standardsItem.standardName}
                        </td>
                        {
                          standardsItem.params.map(item => {
                            return (
                              <td>{item.type === '0' ? '≤' : '≥'}{item.val}</td>
                            )
                          })
                        }
                        <td>
                          <FormItem>
                            {getFieldDecorator(`${standardsItem.id}`, {
                              rules: [
                                {
                                  validator: (rule, value, callback) =>
                                    this.validateParameter(rule, value, callback, standardsItem),
                                },
                              ],
                              initialValue: standardsItem.parameter,
                            })(
                              <Input
                                className={styles.inputNumber}
                                onBlur={e => inputOnBlur(e, standardsItem)}
                                disabled={disabled}
                              />
                              )}
                          </FormItem>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
              <tfoot>
                <tr>
                  <td>结果评定</td>
                  <td colSpan="4">
                    <div>
                      <p>
                        {resultOk ? '符合' : '不符合'}
                        GB/T 1596-2017 国家标准F类
                        <span className={styles.resultLevel}>{columnName || ''}</span>级技术要求。
                      </p>
                      <p>{remark}</p>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </Col>
        </Row>
      </div>
    );
  };

  /* 相关信息 */
  getInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { selectedDetail, disabled } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 16 },
      },
    };
    const formColLayout = {
      xs: { span: 12 },
      sm: { span: 8 },
      md: { span: 8 },
      lg: { span: 6 },
    };
    return (
      <div>
        <fieldset>
          <legend> 相关信息</legend>
        </fieldset>
        <Row gutter={8}>
          <Col {...formColLayout}>
            <FormItem label="毛重（kg）" {...formItemLayout}>
              {getFieldDecorator('grossWeight', {
                rules: [
                  {
                    required: true,
                    message: '请填写毛重',
                  },
                ],
                initialValue: selectedDetail.grossWeight,
              })(
                <InputNumber
                  className={styles.inputNumber}
                  step={0.01}
                  disabled={disabled}
                  style={{ width: '100%' }}
                />
                )}
            </FormItem>
          </Col>
          <Col {...formColLayout}>
            <FormItem label="皮重（kg）" {...formItemLayout}>
              {getFieldDecorator('tareWeight', {
                rules: [
                  {
                    required: true,
                    message: '请填写皮重',
                  },
                ],
                initialValue: selectedDetail.tareWeight,
              })(
                <InputNumber
                  className={styles.inputNumber}
                  step={0.01}
                  disabled={disabled}
                  style={{ width: '100%' }}
                />
                )}
            </FormItem>
          </Col>
          <Col {...formColLayout}>
            <FormItem label="净重（kg）" {...formItemLayout}>
              {getFieldDecorator('netWeight', {
                rules: [
                  {
                    required: true,
                    message: '请填写净重',
                  },
                ],
                initialValue: selectedDetail.netWeight,
              })(
                <InputNumber
                  className={styles.inputNumber}
                  step={0.01}
                  disabled={disabled}
                  style={{ width: '100%' }}
                />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col {...formColLayout}>
            <FormItem label="检验员" {...formItemLayout}>
              {getFieldDecorator('checker', {
                rules: [
                  {
                    required: true,
                    message: '请填写检验员',
                  },
                ],
                initialValue: selectedDetail.checker,
              })(<Input disabled={disabled} />)}
            </FormItem>
          </Col>
          <Col {...formColLayout}>
            <FormItem label="审核" {...formItemLayout}>
              {getFieldDecorator('auditor', {
                rules: [
                  {
                    required: true,
                    message: '请填写审核人',
                  },
                ],
                initialValue: selectedDetail.auditor,
              })(<Input placeholder="请填写审核人" disabled={disabled} />)}
            </FormItem>
          </Col>
          <Col {...formColLayout}>
            <FormItem label="出厂批号" {...formItemLayout}>
              {getFieldDecorator('batchNo', {
                rules: [
                  {
                    required: true,
                    message: '请填写出厂批号',
                  },
                ],
                initialValue: selectedDetail.batchNo,
              })(<Input disabled={disabled} />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  };

  /* 检验结果 文本框 输入时的校验 */
  validateParameter = (rule, value, callback, standardsItem) => {
    if (isNaN(Number(value))) {
      callback('请输入数字')
      return
    }
    let levelStandards = 0;
    const { type, pointNum, standardName } = standardsItem
    const { columnId } = this.props.selectedDetail;
    const { levelSelected } = this.state

    standardsItem.params.map(paramsItem => {
      const { val } = paramsItem

      if (paramsItem.columnId === columnId || paramsItem.columnId === levelSelected) {
        levelStandards = Number(val)
      }
      return paramsItem
    })

    /* 检验是否为空 */
    if (standardName !== '强度活性指数（%）' && (value === '' || value === null)) {
      callback({ message: '检验结果不能为空值' });
      return;
    }

    /**
     *  standardsItem.type===1：大于等于
     *  standardsItem.type===0：小于等于
     */
    if (value !== '' && value !== null) {
      if (type === 1 && value && Number(value) < levelStandards) {
        callback({ message: '检验结果须大于等于国家标准值' });
        return;
      }
      if (type === 0 && value && Number(value) > levelStandards) {
        callback({ message: '检验结果须小于等于国家标准值' });
        return;
      }
      if (pointNum === 0 && value.indexOf('.') !== -1) {
        callback({ message: `请填写整数` })
        return
      }
      if (pointNum > 0 && value.indexOf('.') === -1) {
        callback({ message: `小数位与产品设置不符合，小数点后需保留${pointNum}位小数` })
        return
      }
      if (pointNum > 0 && value.length - value.indexOf('.') - 1 !== pointNum) {
        callback({ message: `小数位与产品设置不符合，小数点后需保留${standardsItem.pointNum}位小数` })
        return
      }
    }
    callback();
  };

  /* 保存按钮事件 */
  handleSubmit = () => {
    const { productName, distributorName, supplierName } = this.state;
    this.setState({
      confirmLoading: true,
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        let { standardsData } = this.state;
        /* 日期格式转化 */
        values = {
          ...values,
          deliveryTime: moment(values.deliveryTime).format('YYYY-MM-DD HH:mm:ss'),
          outTime: moment(values.outTime).format('YYYY-MM-DD HH:mm:ss'),
        }
        /* 把填写的检验结果值填入，传给后端 */
        for (const i in values) {
          if (Number(i)) {
            standardsData = standardsData.map(standardsItem => {
              if (standardsItem.id === Number(i)) {
                const { id, standardId, standardName } = standardsItem
                return {
                  id,
                  standardId,
                  standardName,
                  parameter: String(values[i]),
                }
              }
              return standardsItem
            });
          }
        }
        if (this.props.type === 'add') {

          this.props.dispatch({
            type: 'outbound/create',
            payload: {
              ...values,
              standards: standardsData,
              productName,
              distributorName,
              supplierName,
            },
          });
        } else if (this.props.type === 'edit') {
          this.props.dispatch({
            type: 'outbound/edit',
            payload: {
              ...values,
              standards: standardsData,
              productName,
              distributorName,
              supplierName,
              id: this.props.selectedDetail.id,
            },
          });
        }

        setTimeout(() => {
          this.setState({
            confirmLoading: false,
          });
          this.props.closeModal();
        }, 0);
      } else {
        Modal.warning({
          title: '警告',
          content: '请按照提示修改填写内容后再保存',
          okText: '知道了',
        });
      }
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    const { closeModal, title, type } = this.props;
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={closeModal}
          width="90%"
          className={styles.modal}
          footer={null}
          destroyOnClose
        >
          <Form className={styles.fm}>
            {this.getCertificateFields()}
            {this.getResult()}
            {this.getInfo()}
            <FormItem className={styles.fmBtn}>
              <Button type="default" onClick={closeModal} className={styles.backBtn}>
                返回
              </Button>
              {type !== 'check' && (
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.submitBtn}
                  onClick={() => this.handleSubmit()}
                >
                  保存
                </Button>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(EditModal);
