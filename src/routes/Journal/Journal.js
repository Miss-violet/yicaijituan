import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, Form, Row, Col, DatePicker, Select, Button } from 'antd'
import moment from 'moment'
import styles from './journal.less'

const FormItem = Form.Item
const { RangePicker } = DatePicker;
const { Option } = Select

class Journal extends Component {

  constructor() {
    super()
    this.state = {
      current: 0,
      pageSize: 20,
      filterValue: {},
    }
  }
  onTableChange = (current, pageSize) => {
    const { filterValue: params } = this.state
    this.setState({
      current,
      pageSize,
    })
    this.onSearch({
      pageIndex: current,
      pageSize,
      sortField: null,
      sortOrder: null,
      params,
    })
  }
  onSearch = (params) => {
    this.props.dispatch({
      type: 'journal/log',
      payload: {
        ...params,
      },
    })
  }
  columns = [
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      className: 'journalContent',
    }, {
      title: '操作类型',
      dataIndex: 'operateType',
      key: 'operateType',
      render: text => {
        switch (text) {
          case 0:
            return '新增'
          case 1:
            return '删除'
          case 2:
            return '更新'
          case 3:
            return '其他'
          default:
            return ''
        }
      },
      className: 'journalTd',
    }, {
      title: '关联id',
      dataIndex: 'relationId',
      key: 'relationId',
      className: 'journalTd',
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: text => {
        switch (text) {
          case 0:
            return '用户'
          case 1:
            return '公司'
          case 2:
            return '产品'
          case 3:
            return '出库单'
          case 4:
            return '生厂商'
          case 5:
            return '标准'
          default:
            return ''
        }
      },
      className: 'journalTd',
    }, {
      title: '操作人',
      dataIndex: 'createBy',
      key: 'createBy',
      className: 'journalTd',
    }, {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      className: 'journalTd',
    },
  ]

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

      this.setState({
        current: 0,
        pageSize: 20,
        filterValue: {
          ...rest,
          startTime,
          endTime,
        },
      })

      this.onSearch({
        pageIndex: 0,
        pageSize: 20,
        sortField: null,
        sortOrder: null,
        params: {
          ...rest,
          startTime,
          endTime,
        },
      })
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, pagination } = this.props

    const { current, pageSize } = this.state

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
    const operateType = [
      {
        id: 0,
        name: '新增',
      }, {
        id: 1,
        name: '删除',
      }, {
        id: 2,
        name: '更新',
      }, {
        id: 3,
        name: '其他',
      },
    ]
    const type = [
      {
        id: 0,
        name: '用户',
      }, {
        id: 1,
        name: '公司',
      }, {
        id: 2,
        name: '产品',
      }, {
        id: 3,
        name: '出库单',
      }, {
        id: 4,
        name: '生厂商',
      }, {
        id: 5,
        name: '标准',
      },
    ]

    const tableProps = {
      columns: this.columns,
      dataSource: data,
      pagination: {
        ...pagination,
        current,
        pageSize,
        showSizeChanger: true,
        onChange: this.onTableChange,
      },
      rowKey: record => record.id,
    }

    return (
      <div>
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={24}>
            <Col {...filterFormLayout}>
              <FormItem label='操作时间' {...formItemLayout} className={styles.formItem}>
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
              <FormItem label='操作类型' {...formItemLayout} className={styles.formItem}>
                {getFieldDecorator('operateType')(
                  <Select allowClear>
                    {
                      operateType && operateType.map(item =>
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...filterFormLayout}>
              <FormItem label='类型' {...formItemLayout} className={styles.formItem}>
                {getFieldDecorator('type')(
                  <Select allowClear>
                    {
                      type && type.map(item =>
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...filterFormLayout} style={{ textAlign: 'right' }}>

              <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
        <Table {...tableProps} />
      </div>
    )
  }
}
export default connect(({ journal }) => (journal))(Form.create()(Journal))