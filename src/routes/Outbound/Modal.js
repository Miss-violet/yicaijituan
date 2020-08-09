import React, { Component } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  InputNumber,
  Button,
  AutoComplete,
} from 'antd';
import * as moment from 'moment';
import { connect } from 'dva';
import classNames from 'classnames';
import { filterEmpty } from '../../utils/utils';
import styles from './outbound.less';
import commonStyles from '../../assets/style/common.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ productManage }) => ({
  standardColumnTitleData: productManage.standardColumnTitleData,
  productDetail: productManage.productDetail,
}))
class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      carData: [],
      standardsData: '',
      levelSelected: '' /* 选中的级别 id */,
      levelSelectedName: '' /* 选中的级别 name */,
      productName: '' /* 选中的产品名称 */,
      distributorName: '' /* 选中的客户名称 */,
      supplierName: '' /* 选中的生厂商名称 */,
      remark: '' /* 打印备注 */,
      changeLevel: false /* 修改了级别 */,
      validateStatus: [] /* 设置标准值校验提示 */,
      allowApprover: 0,
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
        levelSelected: nextProps.selectedDetail.columnId,
        levelSelectedName: nextProps.selectedDetail.columnTitle,
        allowApprover: nextProps.selectedDetail.allowApprover,
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
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const {
      manufacturerSelectList,
      companyAllSelectList,
      productSelectList,
      selectedDetail,
      disabled,
      productDisabled,
      type,
      standardColumnTitleData,
    } = this.props;

    const {
      productId,
      columnTitle,
      title,
      outTime,
      allowModifyOutTime,
      deliveryTime,
      supplierId,
      techno,
      carNo,
      distributorId,
      customer,
      flyashSource,
      relationCode,
      poundCode,
    } = selectedDetail;

    const manufacturerEnabled = manufacturerSelectList.filter(item => item.status === 0);
    const companyEnabled = companyAllSelectList.filter(item => item.status === 0);
    const productEnabled = productSelectList.filter(
      item => item.status === 0 && item.standardDataFlag !== 0
    );

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
     * 3、级别下拉框的值也需要做修改
     */
    const handleProductChange = proId => {
      const { dispatch, form } = this.props;
      const proSelected = productEnabled.find(item => item.id === proId);
      const { name, id, remark, printName } = proSelected;

      dispatch({
        type: 'productManage/info',
        payload: {
          productId: proId,
        },
        callback: res => {
          if (res.code === 0) {
            this.setState({
              allowApprover: res.data.allowApprover,
            });
          }
        },
      });

      dispatch({
        type: 'productManage/queryStandardTitleList',
        payload: {
          productId: id,
          type: 0,
        },
      });
      dispatch({
        type: 'productManage/queryStandardTitleList',
        payload: {
          productId: id,
          type: 1,
        },
        callback: res => {
          if (res.code === 0) {
            setFieldsValue({ columnTitle: '' });
            this.setState({
              levelSelected: '',
              levelSelectedName: '',
            });
          }
        },
      });
      dispatch({
        type: 'productManage/standardParamsQuery',
        payload: {
          productId: id,
        },
        callback: standardParams => {
          this.setState({
            standardsData: standardParams,
            productName: name,
            remark,
          });
        },
      });

      form.setFields({
        title: {
          value: printName,
        },
      });
    };

    /**
     * 级别下拉框变化事件：
     * 查询出当前选中的值，用于后续的判断
     */
    const handleLevelChange = (levelSelected, option) => {
      this.setState({
        levelSelected,
        levelSelectedName: option.props.children,
        changeLevel: true,
      });
    };

    /**
     * 客户名称下拉框变化事件：
     * 查询出当前选中的名称，用于保存
     */
    const handleDistributorChange = DistributorId => {
      let distributorName;
      companyAllSelectList.map(item => {
        if (item.id === DistributorId) {
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
    const handleSupplierChange = SupplierId => {
      let supplierName;
      manufacturerSelectList.map(item => {
        if (item.id === SupplierId) {
          supplierName = item.name;
        }
        return item;
      });
      this.setState({
        supplierName,
      });
    };
    /* 车牌 */
    let timeout;
    // const options = this.state.carData.map(d => <Option key={d}>{d}</Option>);
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
      const { cars } = this.props;
      this.setState({
        carData: cars,
      });
    };
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
                  initialValue: productId,
                })(
                  <Select onChange={handleProductChange} disabled={productDisabled}>
                    {productEnabled &&
                      productEnabled.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="级别" {...formItemLayout}>
                {getFieldDecorator('columnTitle', {
                  rules: [
                    {
                      required: true,
                      message: '请选择级别',
                    },
                  ],
                  initialValue: columnTitle !== undefined ? String(columnTitle) : '',
                })(
                  <Select onChange={handleLevelChange} disabled={disabled}>
                    {standardColumnTitleData.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
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
                  initialValue: title,
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
                  initialValue: moment(outTime),
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择出厂时间"
                    className={styles.datepicker}
                    disabled={allowModifyOutTime === 0 || disabled}
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
                  initialValue: type !== 'add' ? moment(deliveryTime) : '',
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
                  initialValue: supplierId,
                })(
                  <Select onChange={handleSupplierChange} disabled={disabled}>
                    {manufacturerEnabled &&
                      manufacturerEnabled.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
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
                  initialValue: techno === 0 ? '0' : '',
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
                  initialValue: carNo,
                })(
                  // 在 antd 更高版本中 combobox 属性将被移除 2019/04/27
                  // <Select
                  //   mode="combobox"
                  //   placeholder={this.props.placeholder}
                  //   style={this.props.style}
                  //   defaultActiveFirstOption={false}
                  //   showArrow={false}
                  //   filterOption={false}
                  //   onChange={handleChange}
                  //   onFocus={handleFocus}
                  //   disabled={disabled}
                  // >
                  //   {options}
                  // </Select>

                  <AutoComplete
                    dataSource={this.state.carData}
                    onSelect={handleChange}
                    onSearch={handleChange}
                    onFocus={handleFocus}
                    placeholder={this.props.placeholder}
                    style={this.props.style}
                    disabled={disabled}
                  />
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
                  initialValue: distributorId,
                })(
                  <Select
                    onChange={handleDistributorChange}
                    disabled={disabled}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {companyEnabled &&
                      companyEnabled.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
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
                  initialValue: customer,
                })(<Input placeholder="请填写客户名称" disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="灰源" {...formItemLayout}>
                {getFieldDecorator('flyashSource', {
                  rules: [
                    {
                      required: false,
                      message: '请填写灰源',
                    },
                  ],
                  initialValue: flyashSource,
                })(
                  <Select disabled={disabled}>
                    <Option value="麦特">麦特</Option>
                    <Option value="嵩屿">嵩屿</Option>
                    <Option value="后石">后石</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="关联编号" {...formItemLayout}>
                {getFieldDecorator('relationCode', {
                  rules: [
                    {
                      required: false,
                      message: '请填写关联编号',
                    },
                  ],
                  initialValue: relationCode,
                })(<Input placeholder="请填写关联编号" disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="磅单号" {...formItemLayout}>
                {getFieldDecorator('poundCode', {
                  rules: [
                    {
                      required: false,
                      message: '请填写磅单号',
                    },
                  ],
                  initialValue: poundCode,
                })(<Input placeholder="请填写磅单号" disabled={disabled} />)}
              </FormItem>
            </Col>
          </Row>
        </fieldset>
      </div>
    );
  };

  /* 检查结果 */
  getResult = () => {
    const { levelSelected, levelSelectedName, remark, standardsData, validateStatus } = this.state;
    const { disabled, selectedDetail, standardColumnTitleData, productDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { columnId, productId } = selectedDetail;

    const { footContent, footName, headName, headResult, headTitle } = productDetail;
    const footContentArray = footContent && footContent.split('@');
    const startFootContent = footContentArray && footContentArray[0];
    const endFootContent = footContentArray && (footContentArray[1] || '技术要求');

    const tableColLayout = {
      xs: { offset: 0 },
      sm: { offset: 0 },
      md: { offset: 2 },
    };
    /* 检验结果 文本框 失焦时的校验 */
    const inputOnBlur = (event, standardsItem) => {
      window.event.cancelBubble = true;

      if (!levelSelected) {
        Modal.warning({
          title: '警告',
          content: `请先选择级别`,
          okText: '知道了',
        });
        return;
      }

      let levelStandards = 0;
      const { value } = event.target;

      let { type, pointNum, standardName } = standardsItem;
      /* 如果修改了品名，standardsItem 中没有standardName,则需要取 rowTitle 的值 */
      standardName = standardName || standardsItem.rowTitle;

      /* 如果修改了品名，standardsItem 中没有 type 和 pointNum */
      type = type || standardsItem.params[0].type;
      pointNum = pointNum || standardsItem.params[0].pointNum;

      standardsItem.params.map(paramsItem => {
        if (paramsItem.columnId === columnId || paramsItem.columnId === levelSelected) {
          const { val } = paramsItem;
          levelStandards = Number(val);
        }
        return paramsItem;
      });
      /* 检验是否为空 */
      if (
        standardName !== '强度活性指数（%）' &&
        standardName !== '强度活性指数(%)' &&
        (value === '' || value === null)
      ) {
        validateStatus[standardsItem.orderSort - 1] = {
          status: 'error',
          help: `${standardName}的检验结果不能为空值`,
        };
        this.setState({
          validateStatus,
        });
        Modal.warning({
          title: '警告',
          content: `${standardName}的检验结果不能为空值`,
          okText: '知道了',
        });
        return false;
      }
      /**
       *  type===1：大于等于
       *  type===0：小于等于
       */
      if (Number(value) === 0 || value) {
        if (type === 1 && value && Number(value) < levelStandards) {
          validateStatus[standardsItem.orderSort - 1] = {
            status: 'error',
            help: `${standardName}的检验结果须大于等于国家标准值${levelStandards}`,
          };
          this.setState({
            validateStatus,
          });
          Modal.warning({
            title: '警告',
            content: `${standardName}的检验结果须大于等于国家标准值${levelStandards}`,
            okText: '知道了',
          });
          return;
        }
        if (type === 0 && value && Number(value) > levelStandards) {
          validateStatus[standardsItem.orderSort - 1] = {
            status: 'error',
            help: `${standardName}的检验结果须小于等于国家标准值${levelStandards}`,
          };
          this.setState({
            validateStatus,
          });
          Modal.warning({
            title: '警告',
            content: `${standardName}的检验结果须小于等于国家标准值${levelStandards}`,
            okText: '知道了',
          });
          return;
        }
        if (pointNum === 0 && value && value.indexOf('.') !== -1) {
          validateStatus[standardsItem.orderSort - 1] = {
            status: 'error',
            help: `${standardName}的小数位与产品设置不符合，请填写整数`,
          };
          this.setState({
            validateStatus,
          });
          Modal.warning({
            title: '警告',
            content: `${standardName}的小数位与产品设置不符合，请填写整数`,
            okText: '知道了',
          });
          return;
        }
        if (pointNum > 0 && value && value.indexOf('.') === -1) {
          validateStatus[standardsItem.orderSort - 1] = {
            status: 'error',
            help: `${standardName}的小数位与产品设置不符合，小数点后需保留${pointNum}位小数`,
          };
          this.setState({
            validateStatus,
          });
          Modal.warning({
            title: '警告',
            content: `${standardName}的小数位与产品设置不符合，小数点后需保留${pointNum}位小数`,
            okText: '知道了',
          });
          return;
        }
        if (pointNum > 0 && value && value.length - value.indexOf('.') - 1 !== pointNum) {
          validateStatus[standardsItem.orderSort - 1] = {
            status: 'error',
            help: `${standardName}的小数位与产品设置不符合，小数点后需保留${pointNum}位小数`,
          };
          this.setState({
            validateStatus,
          });
          Modal.warning({
            title: '警告',
            content: `${standardName}的小数位与产品设置不符合，小数点后需保留${pointNum}位小数`,
            okText: '知道了',
          });
          return;
        }
      }
      this.setState({
        validateStatus: [],
      });
    };

    const tableStyle = classNames({
      [commonStyles.table]: true,
      [commonStyles.standardsTable]: true,
    });
    const resultLevelStyle = classNames({
      [styles.resultLevel]: true,
      [styles.resultLevel_underline]: productId !== 45,
    });
    return (
      <div>
        <fieldset>
          <legend> 检查结果</legend>
        </fieldset>
        <Row>
          <Col {...tableColLayout}>
            <table className={tableStyle}>
              <thead>
                <tr>
                  <th rowSpan="2" style={{ width: '16%' }}>
                    {headName}
                  </th>
                  <th colSpan={standardColumnTitleData.length} style={{ width: '74%' }}>
                    {headTitle}
                  </th>
                  <th rowSpan="2" style={{ width: '10%' }}>
                    {headResult}
                  </th>
                </tr>
                <tr>
                  {standardColumnTitleData &&
                    standardColumnTitleData.map(item => (
                      <th
                        key={item.id}
                        style={{ width: `${74 / standardColumnTitleData.length}%` }}
                      >
                        {item.name}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {standardsData &&
                  standardsData.map((standardsItem, index) => {
                    const {
                      id,
                      rowId,
                      rowTitle,
                      standardName,
                      standardId,
                      params,
                      parameter,
                    } = standardsItem;
                    const parameterId = id || rowId;
                    return (
                      <tr key={rowId || standardId}>
                        <td>{rowTitle || standardName}</td>
                        {params.map(item => {
                          const { id: itemId, val, type } = item;
                          return (
                            <td key={itemId}>
                              {type === 0 ? '≤' : '≥'}
                              {val}
                            </td>
                          );
                        })}
                        <td>
                          <FormItem
                            validateStatus={validateStatus[index] && validateStatus[index].status}
                            help={validateStatus[index] && validateStatus[index].help}
                          >
                            {getFieldDecorator(`${parameterId}`, {
                              rules: [
                                {
                                  validator: (rule, value, callback) =>
                                    this.validateParameter(rule, value, callback, standardsItem),
                                },
                              ],
                              initialValue: parameter,
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
                    );
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <td>{footName}</td>
                  <td colSpan={standardColumnTitleData.length + 4}>
                    <div>
                      <p>
                        {startFootContent}{' '}
                        <span className={resultLevelStyle}>{levelSelectedName}</span>
                        {endFootContent}。
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
    const {
      grossWeight,
      tareWeight,
      netWeight,
      checker,
      auditor,
      batchNo,
      approver,
    } = selectedDetail;
    const { allowApprover } = this.state;
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
                initialValue: grossWeight,
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
                initialValue: tareWeight,
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
                initialValue: netWeight,
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
                initialValue: checker,
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
                initialValue: auditor,
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
                initialValue: batchNo,
              })(<Input disabled={disabled} />)}
            </FormItem>
          </Col>
          {allowApprover === 1 && (
            <Col {...formColLayout}>
              <FormItem label="审批员" {...formItemLayout}>
                {getFieldDecorator('approver', {
                  rules: [
                    {
                      required: true,
                      message: '请填写审批员',
                    },
                  ],
                  initialValue: approver,
                })(<Input disabled={disabled} />)}
              </FormItem>
            </Col>
          )}
        </Row>
      </div>
    );
  };

  /* 检验结果 文本框 输入时的校验  */
  validateParameter = (rule, value, callback, standardsItem) => {
    if (
      standardsItem.rowTitle !== '强度活性指数（%）' &&
      standardsItem.rowTitle !== '强度活性指数(%)' &&
      isNaN(Number(value))
    ) {
      callback('请输入数字');
      return;
    }
    const { levelSelected } = this.state;
    if (!levelSelected) {
      callback('请先选择级别');
      return;
    }
    let levelStandards = 0;
    let { type, pointNum, standardName } = standardsItem;
    const { columnId } = this.props.selectedDetail;
    standardsItem.params.forEach(paramsItem => {
      if (paramsItem.columnId === columnId || paramsItem.columnId === levelSelected) {
        const { val } = paramsItem;
        levelStandards = Number(val);
      }
    });

    /* 如果修改了品名，standardsItem 中没有standardName,则需要取 rowTitle 的值 */
    standardName = standardName || standardsItem.rowTitle;

    /* 如果修改了品名，standardsItem 中没有 type 和 pointNum */
    type = type || standardsItem.params[0].type;
    pointNum = pointNum || standardsItem.params[0].pointNum;

    /* 检验是否为空 */
    if (
      standardName !== '强度活性指数（%）' &&
      standardName !== '强度活性指数(%)' &&
      (value === '' || value === null)
    ) {
      callback({ message: '检验结果不能为空值' });
      return;
    }

    /**
     *  standardsItem.type===1：大于等于
     *  standardsItem.type===0：小于等于
     */
    if (Number(value) === 0 || value) {
      if (type === 1 && value && Number(value) < levelStandards) {
        callback({ message: `检验结果须大于等于国家标准值${levelStandards}` });
        return;
      }
      if (type === 0 && value && Number(value) > levelStandards) {
        callback({ message: `检验结果须小于等于国家标准值${levelStandards}` });
        return;
      }
      if (pointNum === 0 && value && value.indexOf('.') !== -1) {
        callback({ message: `请填写整数` });
        return;
      }
      if (pointNum > 0 && value && value.indexOf('.') === -1) {
        callback({ message: `小数位与产品设置不符合，小数点后需保留${pointNum}位小数` });
        return;
      }
      if (pointNum > 0 && value && value.length - value.indexOf('.') - 1 !== pointNum) {
        callback({ message: `小数位与产品设置不符合，小数点后需保留${pointNum}位小数` });
        return;
      }
    }
    callback();
  };

  /* 保存按钮事件 */
  handleSubmit = () => {
    let { productName, distributorName, supplierName } = this.state;
    this.setState({
      confirmLoading: true,
    });
    this.props.form.validateFieldsAndScroll((err, fmValues) => {
      if (!err) {
        let { standardsData } = this.state;
        const { validateStatus } = this.state;
        const filterFmValues = filterEmpty(fmValues);

        /* 日期格式转化 */
        const values = {
          ...filterFmValues,
          deliveryTime: moment(fmValues.deliveryTime).format('YYYY-MM-DD HH:mm:ss'),
          outTime: moment(fmValues.outTime).format('YYYY-MM-DD HH:mm:ss'),
        };

        const { standardColumnTitleData } = this.props;
        const { columnTitle, ...restValue } = values;
        let columnName = '';
        standardColumnTitleData.forEach(item => {
          if (item.id === columnTitle) {
            columnName = item.name;
          }
        });
        const { changeLevel } = this.state;
        /* 如果级别被做了修改，则需要在提交前校验一遍 */
        if (changeLevel) {
          const validateName = [];
          for (const i in values) {
            if (Number(i)) {
              standardsData.forEach(dataItem => {
                if (Number(i) === dataItem.id) {
                  const { params, standardName } = dataItem;
                  const { val, type } = params.find(
                    paramsItem => paramsItem.columnId === values.columnTitle
                  );
                  /**
                   *  type===1：大于等于
                   *  type===0：小于等于
                   */
                  if ((type === 0 && values[i] > val) || (type === 1 && values[i] < val)) {
                    validateName.push(standardName);
                    validateStatus.push({
                      status: 'error',
                      help: `${values[i]}的值应该${type === 0 ? '小于等于' : '大于等于'}${val}`,
                    });
                  } else {
                    validateStatus.push({ status: 'success' });
                  }
                }
              });
            }
          }
          if (validateName.length > 0) {
            this.setState({
              validateStatus,
            });
            Modal.warning({
              title: '警告',
              content: `请检查以下标准值${validateName.join(',')}后再保存`,
              okText: '知道了',
            });
            return;
          }
        }

        if (this.props.type === 'add') {
          /* 把填写的检验结果值填入，传给后端 */
          const standards = [];
          for (const i in values) {
            if (Number(i)) {
              standardsData.forEach(standardsItem => {
                if (standardsItem.rowId === Number(i)) {
                  const { rowTitle, params } = standardsItem;
                  standards.push({
                    id: '',
                    standardId: params.find(item => item.columnId === columnTitle).id,
                    standardName: rowTitle,
                    parameter: String(values[i]) || '',
                  });
                }
              });
            }
          }
          this.props.dispatch({
            type: 'outbound/create',
            payload: {
              ...restValue,
              columnName,
              columnId: columnTitle,
              standards,
              productName,
              distributorName,
              supplierName,
            },
          });
        } else if (this.props.type === 'edit') {
          const { companyAllSelectList, manufacturerSelectList, productSelectList } = this.props;
          const { distributorId, supplierId, productId } = values;
          if (distributorName === '') {
            companyAllSelectList.map(item => {
              if (item.id === distributorId) {
                distributorName = item.name;
              }
              return item;
            });
          }
          if (supplierName === '') {
            manufacturerSelectList.map(item => {
              if (item.id === supplierId) {
                supplierName = item.name;
              }
              return item;
            });
          }
          if (productName === '') {
            productSelectList.map(item => {
              if (item.id === productId) {
                productName = item.name;
              }
              return item;
            });
          }

          /* 把填写的检验结果值填入，传给后端 */
          for (const i in values) {
            if (Number(i)) {
              standardsData = standardsData.map(standardsItem => {
                if (standardsItem.id === Number(i)) {
                  const { id, standardId, standardName } = standardsItem;
                  return {
                    id,
                    standardId,
                    standardName,
                    parameter: String(values[i]) || '',
                  };
                }
                return standardsItem;
              });
            }
          }
          this.props.dispatch({
            type: 'outbound/edit',
            payload: {
              ...this.props.selectedDetail,
              ...values,
              standards: standardsData,
              productName,
              distributorName,
              supplierName,
            },
          });
        }

        setTimeout(() => {
          this.setState({
            confirmLoading: false,
            changeLevel: false,
            validateStatus: [],
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

  closeModal = () => {
    const { closeModal } = this.props;
    this.setState({
      changeLevel: false,
      validateStatus: [],
    });
    closeModal();
  };

  render() {
    const { visible, confirmLoading } = this.state;
    const { title, type } = this.props;
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.closeModal}
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
              <Button type="default" onClick={this.closeModal} className={styles.backBtn}>
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
