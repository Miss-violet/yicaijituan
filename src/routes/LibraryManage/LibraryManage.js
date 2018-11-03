import React, { Component } from 'react'
import { connect } from 'dva'
import { Tooltip, Badge } from 'antd'
import BasicDataList from '../../components/BasicDataList/BasicDataList'
import commonStyles from '../../assets/style/common.less'

class LibraryManage extends Component {
  constructor() {
    super()
    this.state = {
      pageSize: 20,
      pageIndex: 0,
    }
  }
  pageIndexChange = (pageIndex) => {
    this.setState({
      pageIndex,
    })
  }
  pageSizeChange = (pageSize) => {
    this.setState({
      pageSize,
    })
  }
  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => {
          if (record.status === 1) return <span><Tooltip title="此生厂商已被停用"><Badge status="error" /></Tooltip>{text}</span>
          else return <span>{text}</span>
        },
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
    const { total } = this.props.libraryManage
    let { data } = this.props.libraryManage
    const showTotal = () => `共${total}条数据`
    data = data.map((item, index) => {
      item.key = index
      return item
    })
    const fmFields = [{
      key: 1,
      label: '名称',
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      key: 2,
      label: '备注',
      name: 'remark',
      type: 'text',
      required: false,
    },
    {
      key: 3,
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
    }]
    const libraryProps = {
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
        showTotal,
        onChange: this.pageIndexChange,
        onShowSizeChange: this.pageSizeChange,
      },
      handleCreate: (values) => {
        this.props.dispatch({
          type: 'libraryManage/create',
          payload: {
            ...values,
          },
        })
      },
      handleEdit: (values) => {
        this.props.dispatch({
          type: 'libraryManage/edit',
          payload: {
            ...values,
          },
        })
      },
      handleDelete: (id) => {
        this.props.dispatch({
          type: 'libraryManage/delete',
          payload: id,
        })
      },
      handleTableChange: (pagination) => {
        this.setState({
          pageSize: pagination.pageSize,
        })
        this.props.dispatch({
          type: 'libraryManage/queryList',
          payload: {
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
            sortField: null,
            sortOrder: null,
          },
        })
      },
    }
    return (
      <div>
        <BasicDataList {...libraryProps} />
      </div>
    )
  }
}
export default connect(({ libraryManage }) => ({ libraryManage }))(LibraryManage)