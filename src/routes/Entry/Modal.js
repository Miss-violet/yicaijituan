import React, { Component } from 'react';
import { Modal, Form, Row, Col, Select, Input, DatePicker, InputNumber, Button } from 'antd';
import * as moment from 'moment';
import styles from './entry.less';
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
      entrepotName: '',                 /* 选中的库位名称 */
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

  /* 来料信息 */
  getCertificateFields = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      selectedDetail,
      disabled,
      type,
    } = this.props;



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
          <legend> 来料信息</legend>
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
                  <Input disabled={disabled} placeholder="请填写品名" />
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="打灰时间" {...formItemLayout}>
                {getFieldDecorator('outTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择打灰时间',
                    },
                  ],
                  initialValue: moment(selectedDetail.outTime),
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择打灰时间"
                    className={styles.datepicker}
                    disabled
                    />
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="打灰结束日期" {...formItemLayout}>
                {getFieldDecorator('deliveryTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择打灰结束日期',
                    },
                  ],
                  initialValue: type !== 'add'
                    ? moment(selectedDetail.deliveryTime)
                    : '',
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择打灰结束日期"
                    className={styles.datepicker}
                    disabled={disabled}
                    />
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
                  <Input disabled={disabled} placeholder="请填写公司名称" />
                  )}
              </FormItem>
            </Col>
          </Row>
        </fieldset>
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
            <FormItem label="入库批号" {...formItemLayout}>
              {getFieldDecorator('batchNo', {
                rules: [
                  {
                    required: true,
                    message: '请填写入库批号',
                  },
                ],
                initialValue: selectedDetail.batchNo || `HX${moment().format('YYYYMMDD')}`,
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  };

  validateParameter = (rule, value, callback, item) => {
    if (isNaN(Number(value))) {
      callback('请输入数字')
      return
    }
    let standards = '';
    const { levelSelected } = this.state;
    switch (Number(levelSelected)) {
      case 0:
        standards = item.oneLevel;
        break;
      case 1:
        standards = item.twoLevel;
        break;
      case 2:
        standards = item.threeLevel;
        break;
      default:
        break;
    }
    /* 校验是否为空 */
    if (item.standardName !== '强度活性指数（%）' && (value === '' || value === null)) {
      callback({ message: '检验结果不能为空值' });
      return;
    }
    /**
     *  item.type===1：大于等于
     *  item.type===0：小于等于
     */
    if (value !== '' && value !== null) {
      if (item.type === 1 && Number(value) < standards) {
        callback({ message: '检验结果须大于等于国家标准值' });
        return;
      } else if (item.type === 0 && Number(value) > standards) {
        callback({ message: '检验结果须小于等于国家标准值' });
        return;
      }
      /* 校验小数位 */
      if (item.pointNum === 0 && value.indexOf('.') !== -1) {
        callback({ message: `请填写整数` })
        return
      }
      if (item.pointNum > 0 && value.indexOf('.') === -1) {
        callback({ message: `小数位与产品设置不符合，小数点后需保留${item.pointNum}位小数` })
        return
      }
      if (item.pointNum > 0 && value.length - value.indexOf('.') - 1 !== item.pointNum) {
        callback({ message: `小数位与产品设置不符合，小数点后需保留${item.pointNum}位小数` })
        return
      }
    }
    callback();
  };

  /* 保存按钮事件 */
  handleSubmit = () => {
    const {
      productName,
      distributorName,
      supplierName,
      entrepotName,
    } = this.state;
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
            standardsData = standardsData.map(item => {
              if (item.standardId === Number(i)) {
                return {
                  ...item,
                  parameter: String(values[i]),
                }
              }
              return item
            });
          }
        }
        if (this.props.type === 'add') {

          this.props.dispatch({
            type: 'entry/create',
            payload: {
              ...values,
              standards: standardsData,
              productName,
              distributorName,
              entrepotName,
              supplierName,
            },
          });
        } else if (this.props.type === 'edit') {
          this.props.dispatch({
            type: 'entry/edit',
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
