import React, { Component } from 'react'
import { Form, Row, Col, Button, Input, Select, DatePicker, Icon } from 'antd'
import * as moment from 'moment'
import styles from './outbound.less'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker;

class OutboundFilter extends Component {
  constructor() {
    super()
    this.state = {
      carData: [],
    }
  }

  getFields() {
    const { getFieldDecorator } = this.props.form;
    const { companyAllSelectList, manufacturerSelectList, productSelectList, role } = this.props
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

    /* 车牌 */
    let timeout;
    const options = this.state.carData.map(d => <Option key={d}>{d}</Option>);
    const fetch = (value) => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      const fake = () => {
        const { cars } = this.props
        const data = []

        cars.map(carItem => {
          const reg = new RegExp(value)
          if (carItem.match(reg)) {
            data.push(carItem)
          }
          return carItem
        })
        this.setState({ carData: data })
      }

      timeout = setTimeout(fake, 300);
    }
    const handleChange = (value) => {
      this.props.form.setFieldsValue({
        carNo: value,
      });
      fetch(value);
    }
    const handleFocus = () => {
      const { cars } = this.props
      this.setState({
        // value: cars,
        carData: cars,
      })
    }
    return (
      <Row gutter={32} className={styles.form}>
        <span style={{ padding: 0 }}>
          <Col {...filterFormLayout} >
            <FormItem label='出库编号' {...formItemLayout} className={styles.formItem}>
              {getFieldDecorator('deliveryNo')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col {...filterFormLayout}>
            <FormItem label='出厂日期' {...formItemLayout} className={styles.formItem}>
              {getFieldDecorator('createTime')(
                <RangePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['请选择开始时间', '请选择结束时间']}
                  className={styles.datepicker}
                />
              )}
            </FormItem>
          </Col>
          <Col {...filterFormLayout}>
            <FormItem label='运输车号' {...formItemLayout} className={styles.formItem}>
              {getFieldDecorator('carNo')(
                <Select
                  mode="combobox"
                  placeholder={this.props.placeholder}
                  style={this.props.style}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onChange={handleChange}
                  onFocus={handleFocus}
                >
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
        </span>
        {
          role !== '2' && (
            <span style={{ padding: 0 }}>
              <Col {...filterFormLayout}>
                <FormItem label='公司名称' {...formItemLayout} className={styles.formItem}>
                  {getFieldDecorator('distributorId')(
                    <Select allowClear showSearch optionFilterProp="children">
                      {
                        companyAllSelectList && companyAllSelectList.map(item =>
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...filterFormLayout}>
                <FormItem label='生厂商名称' {...formItemLayout} className={styles.formItem}>
                  {getFieldDecorator('supplierId')(
                    <Select allowClear>
                      {
                        manufacturerSelectList && manufacturerSelectList.map(item =>
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...filterFormLayout}>
                <FormItem label='产品名称' {...formItemLayout} className={styles.formItem}>
                  {getFieldDecorator('productId')(
                    <Select allowClear>
                      {
                        productSelectList && productSelectList.map(item =>
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...filterFormLayout}>
                <FormItem label='状态' {...formItemLayout} className={styles.formItem}>
                  {getFieldDecorator('status')(
                    <Select allowClear>
                      <Option value='0' key='0'> 启用</Option>
                      <Option value='1' key='1'> 停用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...filterFormLayout}>
                <FormItem label='级别' {...formItemLayout} className={styles.formItem}>
                  {getFieldDecorator('level')(
                    <Select allowClear>
                      <Option value='0' key='0'> I级</Option>
                      <Option value='1' key='1'> II级</Option>
                      <Option value='2' key='2'> III级</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </span>
          )
        }
      </Row>
    )
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { createTime, ...rest } = values
      let startTime
      let endTime
      if (createTime === undefined || createTime.length < 1) {
        startTime = ''
        endTime = ''
      } else {
        startTime = moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        endTime = moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      this.props.handleSearch(
        {
          "pageIndex": 0,
          "pageSize": 20,
          "sortField": null,
          "sortOrder": null,
          "params": {
            ...rest,
            startTime,
            endTime,
          },
        }
      )
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset()
  }
  /* 导出 */
  handleExport = () => {
    this.props.form.validateFields((err, values) => {
      const startTime = values.createTime && moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
      const endTime = values.createTime && moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      const token = sessionStorage.getItem('token')
      let url
      if (startTime && endTime) url = `/api/file/delivery/export?startTime=${startTime}&endTime=${endTime}&token=${token}`
      else url = `/api/file/delivery/export&token=${token}`
      document.getElementById("ifile").src = url;
    })
  }

  render() {
    const { role } = this.props
    return (
      <div>
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={24}>{this.getFields()}</Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right', position: 'relative' }}>

              <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit"><Icon type="search" />查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                <Icon type="reload" />重置
              </Button>
              {
                (role === '0' || role === '1') && (
                  <span>
                    <a className={styles.exportBtn} onClick={this.handleExport}>
                      <Icon type="export" /> 导出
                    </a>
                    <iframe title="ifile" id="ifile" style={{ display: 'none' }} />
                  </span>
                )
              }
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create()(OutboundFilter)