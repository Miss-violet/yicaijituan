import React, { Component } from 'react';
import { Modal, Form, Row, Col, Select, Input, DatePicker, InputNumber, Button } from 'antd';
import * as moment from 'moment';
import styles from './entry.less';

const FormItem = Form.Item;
const Option = Select.Option;

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.setState({
        visible: nextProps.visible,
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

    return (
      <div>
        <fieldset>
          <legend> 来料信息</legend>
          <Row gutter={8}>
            <Col {...formColLayout}>
              <FormItem label="品名" {...formItemLayout}>
                {getFieldDecorator('productName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择品名',
                    },
                  ],
                  initialValue: selectedDetail.productName,
                })(
                  <Input disabled={disabled} placeholder="请填写品名" />
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="打灰时间" {...formItemLayout}>
                {getFieldDecorator('checkStartTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择打灰时间',
                    },
                  ],
                  initialValue: moment(selectedDetail.checkStartTime),
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择打灰时间"
                    className={styles.datepicker}
                    disabled={disabled}
                  />
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="打灰结束日期" {...formItemLayout}>
                {getFieldDecorator('checkOutTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择打灰结束日期',
                    },
                  ],
                  initialValue: type !== 'add'
                    ? moment(selectedDetail.checkOutTime)
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
                  <Input placeholder='请填写运输车号' disabled={disabled} />
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="公司名称" {...formItemLayout}>
                {getFieldDecorator('companyName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写公司名称',
                    },
                  ],
                  initialValue: selectedDetail.companyName,
                })(
                  <Input disabled={disabled} placeholder="请填写公司名称" />
                  )}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="细度" {...formItemLayout}>
                {getFieldDecorator('fineness', {
                  rules: [
                    {
                      required: true,
                      message: '请填写细度',
                    },
                  ],
                  initialValue: selectedDetail.fineness,
                })(<Input placeholder="请填写细度" disabled={disabled} />)}
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
            <FormItem label="毛重（吨）" {...formItemLayout}>
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
            <FormItem label="皮重（吨）" {...formItemLayout}>
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
            <FormItem label="净重（吨）" {...formItemLayout}>
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
              })(<Input placeholder="请填写检验员" disabled={disabled} />)}
            </FormItem>
          </Col>
          <Col {...formColLayout}>
            <FormItem label="审核员" {...formItemLayout}>
              {getFieldDecorator('auditor', {
                rules: [
                  {
                    required: true,
                    message: '请填写审核员',
                  },
                ],
                initialValue: selectedDetail.auditor,
              })(<Input placeholder="请填写审核员" disabled={disabled} />)}
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
                initialValue: selectedDetail.batchNo || `HX_${moment().format('YYYYMMDD')}`,
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  };


  /* 保存按钮事件 */
  handleSubmit = () => {
    this.setState({
      confirmLoading: true,
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        /* 日期格式转化 */
        values = {
          ...values,
          checkOutTime: moment(values.checkOutTime).format('YYYY-MM-DD HH:mm:ss'),
          checkStartTime: moment(values.checkStartTime).format('YYYY-MM-DD HH:mm:ss'),
        }
        if (this.props.type === 'add') {

          this.props.dispatch({
            type: 'entry/create',
            payload: {
              ...values,
            },
          });
        } else if (this.props.type === 'edit') {
          this.props.dispatch({
            type: 'entry/edit',
            payload: {
              ...values,
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
