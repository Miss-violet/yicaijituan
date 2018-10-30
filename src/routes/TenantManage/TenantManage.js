import React, { Component } from 'react'
import { connect } from 'dva'
import { Tooltip, Badge } from 'antd'
import BasicDataList from '../../components/BasicDataList/BasicDataList'
import commonStyles from '../../assets/style/common.less'

class TenantManage extends Component {
  constructor() {
    super()
    this.state = {
      validateTenantCode:0,
    }
  }
  render() {
    const columns = [
      {
        title: '租户名称',
        dataIndex: 'name',
        render: (text, record) => {
          if (record.status === 1) return <span><Tooltip title="此生厂商已被停用"><Badge status="error" /></Tooltip>{text}</span>
          else return <span>{text}</span>
        },
      },
      {
        title: '租户编码',
        dataIndex: 'tenantCode',
      },
      {
        title: '租户信息',
        dataIndex: 'info',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text => (text === 0 ? <span>启用</span> : <span className={commonStyles.disableState}>停用</span>),
      },
      {
        title: '是否可修改出厂时间',
        dataIndex: 'modifyOutTimeFlag',
        render: text => (text === 0 ? <span>不可修改</span> : <span className={commonStyles.disableState}>可修改</span>),
      },
    ]
    let { data } = this.props.tenantManage
    data = data.map((item, index) => {
      item.key = index
      return item
    })
    const fmFields = [{
      key: 1,
      label: '租户名称',
      name: 'name',
      type: 'text',
      required: true,
    },{
    key: 2,
    label: '租户编码',
    name: 'tenantCode',
    type: 'text',
      required: true,
      verifyUnique: true,
        verifyFunc: (tenantCode) => {
          this.props.dispatch({
            type: 'tenantManage/validateTenantCode',
            payload: {
              tenantCode,
            },
            callback: (code)=>{
              this.setState({
                validateTenantCode: code,
              })
            },
          })
        },
  },
    {
      key: 3,
      label: '租户信息',
      name: 'info',
      type: 'text',
      required: false,
    },
    {
      key: 4,
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
  },{
    key: 5,
      label: '是否可修改出厂时间',
      name: 'modifyOutTimeFlag',
      type: 'radio',
      required: true,
      defaultValue: 0,
      data: [
        {
          id: 1,
          name: '可修改',
        }, {
          id: 0,
          name: '不可修改',
        },
      ],
  }]
    const tenantProps = {
      columns,
      data,
      fmFields,
      validateUnique: this.state.validateTenantCode,
      addBtn: true,
      updateBtn: true,
      checkBtn: true,
      deleteBtn: true,
      pagination: false,
      handleCreate: (values) => {
        this.props.dispatch({
          type: 'tenantManage/create',
          payload: {
            ...values,
          },
        })
      },
      handleEdit: (values) => {
        this.props.dispatch({
          type: 'tenantManage/edit',
          payload: {
            ...values,
          },
        })
      },
      handleDelete: (id) => {
        this.props.dispatch({
          type: 'tenantManage/delete',
          payload: id,
        })
      },
    }
    return (
      <div>
        <BasicDataList {...tenantProps} />
      </div>
    )
  }
}
export default connect(({ tenantManage }) => ({ tenantManage }))(TenantManage)