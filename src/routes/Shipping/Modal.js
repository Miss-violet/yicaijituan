import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, DatePicker, InputNumber, Button } from 'antd';
import * as moment from 'moment';
import { connect } from 'dva';
import { filterEmpty } from '../../utils/utils';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ productManage }) => ({
  standardColumnTitleData: productManage.standardColumnTitleData,
  productDetail: productManage.productDetail,
}))

class ShippingModal extends Component {
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

  /* 出库单信息 */
  getFields = () => {
    const { getFieldDecorator } = this.props.form;
    const { selectedDetail = {}, disabled } = this.props;

    const {
      productName = '',
      specification = '',
      quantity = '',
      purchaser = '',
      loadPlace = '',
      carNo = '',
      clerker = '',
      picker = '',
      remarks = '',
    } = selectedDetail;

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
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 12 },
      lg: { span: 12 },
    };

    return (
      <div>
        <fieldset>
          <legend> 发货单</legend>
          <Row gutter={24}>
            <Col {...formColLayout}>
              <FormItem label="品名" {...formItemLayout}>
                {getFieldDecorator('productName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写品名',
                    },
                  ],
                  initialValue: productName,
                })(<Input placeholder="请填写品名" disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="规格" {...formItemLayout}>
                {getFieldDecorator('specification', {
                  rules: [
                    {
                      required: true,
                      message: '请填写规格',
                    },
                  ],
                  initialValue: specification,
                })(<Input placeholder="请填写规格" disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="数量（吨/包）" {...formItemLayout}>
                {getFieldDecorator('quantity', {
                  rules: [
                    {
                      required: true,
                      message: '请填写数量',
                    },
                  ],
                  initialValue: quantity,
                })(<Input placeholder="请填写数量" disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="购货单位" {...formItemLayout}>
                {getFieldDecorator('purchaser', {
                  rules: [
                    {
                      required: true,
                      message: '请填写购货单位',
                    },
                  ],
                  initialValue: purchaser,
                })(<Input placeholder="请填写购货单位" disabled={disabled} />)}
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
                })(<Input placeholder="请填写运输车号" disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="装货地点" {...formItemLayout}>
                {getFieldDecorator('loadPlace', {
                  rules: [
                    {
                      required: true,
                      message: '请选择装货地点',
                    },
                  ],
                  initialValue: loadPlace,
                })(<Input placeholder="请填写装货地点" disabled={disabled} />)}
              </FormItem>
            </Col>

            <Col {...formColLayout}>
              <FormItem label="开单员" {...formItemLayout}>
                {getFieldDecorator('clerker', {
                  rules: [
                    {
                      required: true,
                      message: '请填写开单员',
                    },
                  ],
                  initialValue: clerker,
                })(<Input placeholder="请填写开单员" disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="提货（运输）人" {...formItemLayout}>
                {getFieldDecorator('picker', {
                  rules: [
                    {
                      required: true,
                      message: '请填写提货（运输）人',
                    },
                  ],
                  initialValue: picker,
                })(<Input placeholder="请填写提货（运输）人" disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col {...formColLayout}>
              <FormItem label="备注" {...formItemLayout}>
                {getFieldDecorator('remarks', {
                  rules: [
                    {
                      required: false,
                      message: '请填写备注',
                    },
                  ],
                  initialValue: remarks,
                })(<TextArea disabled={disabled} />)}
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
    const { selectedDetail = {}, disabled } = this.props;
    const { accQuantity = '', accepter = '', accTime = '' } = selectedDetail;
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
      lg: { span: 8 },
    };
    return (
      <div>
        <fieldset>
          <legend> 验收信息</legend>
        </fieldset>
        <Row gutter={8}>
          <Col {...formColLayout}>
            <FormItem label="验收数量" {...formItemLayout}>
              {getFieldDecorator('accQuantity', {
                rules: [
                  {
                    required: true,
                    message: '请填写验收数量',
                  },
                ],
                initialValue: accQuantity,
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
            <FormItem label="验收人" {...formItemLayout}>
              {getFieldDecorator('accepter', {
                rules: [
                  {
                    required: true,
                    message: '请填写验收人',
                  },
                ],
                initialValue: accepter,
              })(<Input placeholder="请填写验收人" disabled={disabled} />)}
            </FormItem>
          </Col>
          <Col {...formColLayout}>
            <FormItem label="验收日期" {...formItemLayout}>
              {getFieldDecorator('accTime', {
                rules: [
                  {
                    required: true,
                    message: '请填写验收日期',
                  },
                ],
                initialValue: accTime ? moment(accTime) : '',
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择验收日期"
                  style={{ width: '100%' }}
                  disabled={disabled}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  };

  /* 保存按钮事件 */
  handleSubmit = () => {
    const {
      deliveryNo: shippingNo,
      deliveryId,
      form,
      dispatch,
      type,
      selectedDetail = {},
    } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((err, fmValues) => {
      if (!err) {
        let { accTime } = fmValues;
        accTime = moment(accTime).format('YYYY-MM-DD HH:mm:ss');
        if (type === 'add') {
          dispatch({
            type: 'shipping/create',
            payload: {
              ...fmValues,
              accTime,
              shippingNo,
              deliveryId,
            },
          }).then(res => {
            if (res.code === 0) {
              this.closeModal();
            }
          });
        } else {
          const { id } = selectedDetail;
          dispatch({
            type: 'shipping/edit',
            payload: {
              ...fmValues,
              accTime,
              id,
            },
          }).then(res => {
            if (res.code === 0) {
              this.closeModal();
            }
          });
        }
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
          <Form className={styles.fm} layout="horizontal">
            {this.getFields()}
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
export default Form.create()(ShippingModal);
