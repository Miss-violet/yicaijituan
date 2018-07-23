import React, { Component } from 'react'
import { connect } from 'dva'
import { Tooltip, Badge } from 'antd'
import BasicDataList from '../../components/BasicDataList/BasicDataList'
import commonStyles from '../../assets/style/common.less'

class CompanyManage extends Component {
  constructor() {
    super()
    this.state = {
      pageSize: 20,
    }
  }
  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => {
          if (record.status === 1) return <span><Tooltip title="此公司已被停用"><Badge status="error" /></Tooltip>{text}</span>
          else return <span>{text}</span>
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
        render: text => (text === 0 ? <span>启用</span> : <span className={commonStyles.disableState}>停用</span>),
      },
    ]
    const { total } = this.props.companyManage
    let { data } = this.props.companyManage
    data = data.map((item, index) => {
      item.key = index
      return item
    })
    const fmFields = [
      {
        key: 1,
        label: '名称',
        name: 'name',
        type: 'text',
        required: true, verifyUnique: true,
        verifyFunc: (companyName) => {
          this.props.dispatch({
            type: 'companyManage/vaildateCompanyName',
            payload: {
              companyName,
            },
          })
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
          }, {
            id: 0,
            name: '启用',
          },
        ],
      },
    ]
    const companyProps = {
      columns,
      data,
      fmFields,
      addBtn: true,
      updateBtn: true,
      checkBtn: true,
      deleteBtn: true,
      pagination: {
        pageSize: this.state.pageSize,
        pageSizeOptions: ['10', '20', '30'],
        showSizeChanger: true,
        total,
      },
      handleCreate: (values) => {
        this.props.dispatch({
          type: 'companyManage/create',
          payload: {
            ...values,
          },
        })
      },
      handleEdit: (values) => {
        this.props.dispatch({
          type: 'companyManage/edit',
          payload: {
            ...values,
          },
        })
      },
      handleDelete: (id) => {
        this.props.dispatch({
          type: 'companyManage/delete',
          payload: id,
        })
      },
      handleTableChange: (pagination) => {
        this.setState({
          pageSize: pagination.pageSize,
        })
        this.props.dispatch({
          type: 'companyManage/queryList',
          payload: {
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
            sortField: null,
            sortOrder: null,
            params: {},
          },
        })
      },
    }
    return (
      <div>
        <BasicDataList {...companyProps} />
      </div>
    )
  }
}
export default connect(({ companyManage }) => ({ companyManage }))(CompanyManage)