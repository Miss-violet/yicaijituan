import React, { Component } from 'react';
import { Form, Row, Col, Button, DatePicker, Icon, Input } from 'antd';
import * as moment from 'moment';
import styles from './index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class OutboundFilter extends Component {

  getFields() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
      },
    };
    const filterFormLayout = {
      xs: { span: 12 },
      sm: { span: 12 },
      md: { span: 8 },
      lg: { span: 8 },
      xl: { span: 6 },
    };

    return (
      <Row gutter={32} className={styles.form}>
        <span style={{ padding: 0 }}>
          <Col {...filterFormLayout}>
            <FormItem label="发货单号" {...formItemLayout} className={styles.formItem}>
              {getFieldDecorator('shippingNo')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col {...filterFormLayout}>
            <FormItem label="车（船）号" {...formItemLayout} className={styles.formItem}>
              {getFieldDecorator('carNo')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col {...filterFormLayout}>
            <FormItem label="验收日期" {...formItemLayout} className={styles.formItem}>
              {getFieldDecorator('accTime')(
                <RangePicker
                  format="YYYY-MM-DD"
                  placeholder={['请选择开始日期', '请选择结束日期']}
                  className={styles.datepicker}
                />
              )}
            </FormItem>
          </Col>
          <Col {...filterFormLayout}>
            <FormItem label="接收人" {...formItemLayout} className={styles.formItem}>
              {getFieldDecorator('accepter')(
                <Input />
              )}
            </FormItem>
          </Col>
        </span>
      </Row>
    );
  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { accTime, ...rest } = values;
      let startTime;
      let endTime;
      if (accTime === undefined || accTime.length < 1) {
        startTime = '';
        endTime = '';
      } else {
        startTime = moment(values.accTime[0]).format('YYYY-MM-DD HH:mm:ss');
        endTime = moment(values.accTime[1]).format('YYYY-MM-DD HH:mm:ss');
      }
      this.props.handleSearch({
        pageIndex: 0,
        pageSize: 20,
        sortField: null,
        sortOrder: null,
        params: {
          ...rest,
          startTime,
          endTime,
        },
      });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
  };

  render() {
    return (
      <div>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>{this.getFields()}</Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right', position: 'relative' }}>
              <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                <Icon type="search" />查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                <Icon type="reload" />重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create()(OutboundFilter);
