import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip, Badge, Form, Row, Col, Button, Input, Icon, Select } from 'antd';
import BasicDataList from '../../components/BasicDataList/BasicDataList';
import commonStyles from '../../assets/style/common.less';

const FormItem = Form.Item;
const { Option } = Select;

class CompanyManage extends Component {
  constructor() {
    super();
    this.state = {
      pageSize: 20,
      pageIndex: 0,
      filterValue: {} /* 查询条件 */,
    };
  }

  /**
   * 搜索
   *
   * @memberof CompanyManage
   */
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, params) => {
      this.setState({
        filterValue: params,
      });
      this.props.dispatch({
        type: 'companyManage/queryList',
        payload: {
          params,
          pageIndex: this.state.pageIndex,
          pageSize: this.state.pageSize,
        },
      });
    });
  };

  /**
   * 重置
   *
   * @memberof CompanyManage
   */
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      filterValue: {},
    });
  };

  /**
   * 翻页时触发
   *
   * @memberof CompanyManage
   */
  pageIndexChange = pageIndex => {
    this.setState({
      pageIndex,
    });
  };

  /**
   * 改变页面显示条数时触发
   *
   * @memberof CompanyManage
   */
  pageSizeChange = pageSize => {
    this.setState({
      pageSize,
    });
  };

  render() {
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
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => {
          if (record.status === 1)
            return (
              <span>
                <Tooltip title="此公司已被停用">
                  <Badge status="error" />
                </Tooltip>
                {text}
              </span>
            );
          else return <span>{text}</span>;
        },
      },
      {
        title: '城市',
        dataIndex: 'city',
      },
      {
        title: '地址',
        dataIndex: 'address',
      },
      {
        title: '联系人',
        dataIndex: 'contacts',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text =>
          text === 0 ? <span>启用</span> : <span className={commonStyles.disableState}>停用</span>,
      },
    ];
    const { total } = this.props.companyManage;
    let { data } = this.props.companyManage;
    data = data.map((item, index) => {
      return {
        ...item,
        key: index,
      }
    });
    const fmFields = [
      {
        key: 1,
        label: '名称',
        name: 'name',
        type: 'text',
        required: true,
        verifyUnique: true,
        verifyFunc: companyName => {
          this.props.dispatch({
            type: 'companyManage/vaildateCompanyName',
            payload: {
              companyName,
            },
          });
        },
      },
      {
        key: 2,
        label: '城市',
        name: 'city',
        type: 'text',
        required: false,
      },
      {
        key: 3,
        label: '地址',
        name: 'address',
        type: 'text',
        required: false,
      },
      {
        key: 4,
        label: '联系人',
        name: 'contacts',
        type: 'text',
        required: false,
      },
      {
        key: 5,
        label: '电话',
        name: 'phone',
        type: 'text',
        required: false,
      },
      {
        key: 6,
        label: '备注',
        name: 'remark',
        type: 'text',
        required: false,
      },
      {
        key: 7,
        label: '状态',
        name: 'status',
        type: 'radio',
        required: true,
        defaultValue: 0,
        data: [
          {
            id: 1,
            name: '停用',
          },
          {
            id: 0,
            name: '启用',
          },
        ],
      },
    ];
    const showTotal = () => `共${total}条数据`;
    const companyProps = {
      columns,
      data,
      fmFields,
      scrollY: 600,
      addBtn: true,
      updateBtn: true,
      checkBtn: true,
      deleteBtn: true,
      pagination: {
        pageSize: this.state.pageSize,
        pageSizeOptions: ['10', '20', '30'],
        showSizeChanger: true,
        total,
        showTotal,
        onChange: this.pageIndexChange,
        onShowSizeChange: this.pageSizeChange,
      },
      handleCreate: values => {
        this.props.dispatch({
          type: 'companyManage/create',
          payload: {
            ...values,
          },
        });
      },
      handleEdit: values => {
        this.props.dispatch({
          type: 'companyManage/edit',
          payload: {
            ...values,
          },
        });
      },
      handleDelete: id => {
        this.props.dispatch({
          type: 'companyManage/delete',
          payload: id,
        });
      },
      handleTableChange: pagination => {
        this.setState({
          pageSize: pagination.pageSize,
        });
        this.props.dispatch({
          type: 'companyManage/queryList',
          payload: {
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
            sortField: null,
            sortOrder: null,
            params: this.state.filterValue,
          },
        });
      },
    };
    return (
      <div>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={32} className={commonStyles.form}>
            <Col {...filterFormLayout}>
              <FormItem label="名称" {...formItemLayout} className={commonStyles.formItem}>
                {getFieldDecorator('name')(<Input />)}
              </FormItem>
            </Col>
            <Col {...filterFormLayout}>
              <FormItem label="状态" {...formItemLayout} className={commonStyles.formItem}>
                {getFieldDecorator('status')(
                  <Select allowClear>
                    <Option value="0" key="0">
                      {' '}
                      启用
                    </Option>
                    <Option value="1" key="1">
                      {' '}
                      停用
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...filterFormLayout} style={{ marginTop: '4px' }}>
              <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                <Icon type="search" />查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                <Icon type="reload" />重置
              </Button>
            </Col>
          </Row>
        </Form>
        <BasicDataList {...companyProps} />
      </div>
    );
  }
}
export default connect(({ companyManage }) => ({ companyManage }))(Form.create()(CompanyManage));
