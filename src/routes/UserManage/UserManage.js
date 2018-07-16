import React, { Component } from 'react'
import { connect } from 'dva'
import { Tooltip, Badge } from 'antd'
import * as moment from 'moment'
import BasicDataList from '../../components/BasicDataList/BasicDataList'
import commonStyles from '../../assets/style/common.less'

class UserManage extends Component {
  constructor() {
    super()
    this.state = {
      pageSize: 20,
    }
  }

  render() {
    const { data, total } = this.props.userManage
    const columns = [
      {
        title: '登录名',
        dataIndex: 'loginName',
        fixed: 'left',
        width: 150,
        render: (text, record) => {
          if (record.status === 1) return <span><Tooltip title="此用户已被停用"><Badge status="error" /></Tooltip>{text}</span>
          else return <span>{text}</span>
        },
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        width: 150,
      },
      {
        title: '角色',
        dataIndex: 'role',
        render: text => (text === 0 ? '超级管理员' : (text === 1 ? '管理员' : '成员')),
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text => (text === 0 ? <span>启用</span> : <span className={commonStyles.disableState}>停用</span>),
        width: 100,
      },
      {
        title: '所属公司',
        dataIndex: 'companyName',
        width: 150,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: text => (text === 0 ? '女' : '男'),
        width: 100,
      },
      {
        title: '生日',
        dataIndex: 'birth',
        render: text => text ? moment(text).format('YYYY-MM-DD') : '',
        width: 150,
      },
      {
        title: '电话',
        dataIndex: 'phone',
        width: 150,
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        width: 150,
      },
      {
        title: '编辑时间',
        dataIndex: 'editTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        width: 150,
      },
    ]
    const fmFields = [
      {
        key: 1,
        label: '登录名',
        name: 'loginName',
        type: 'text',
        required: true,
        verifyUnique: true,
        verifyFunc: (loginName) => {
          this.props.dispatch({
            type: 'userManage/vaildateLoginName',
            payload: {
              loginName,
            },
          })
        },
      }, {
        key: 2,
        label: '用户名',
        name: 'userName',
        type: 'text',
        required: false,
      },
      {
        key: 3,
        label: '角色',
        name: 'role',
        type: 'radio',
        required: true,
        defaultValue: 2,
        data: function roleDataFunc() {
          /**
           * 根据 登录账号的角色 - role 来给予该账号可新建的用户角色
           * 超级管理员('0') - 可新建 超级管理员、管理员 和 成员
           * 管理员('1')     - 可新建 成员 （20180706 - 对管理员暂不开放用户管理菜单操作权限）
           */
          const cookie = sessionStorage.getItem('cookie').split('&&')
          const role = cookie && cookie[1]
          let roleData
          switch (role) {
            case '0':
              roleData = [
                {
                  id: 0,
                  name: '超级管理员',
                },
                {
                  id: 1,
                  name: '管理员',
                }, {
                  id: 2,
                  name: '成员',
                },
              ]
              break;
            case '1':
              roleData = [
                {
                  id: 2,
                  name: '成员',
                },
              ]
              break;
            default:
              break;
          }
          return roleData
        }(),
      },
      {
        key: 5,
        label: '密码',
        name: 'password',
        type: 'password',
        required: true,
      },
      {
        key: 6,
        label: '性别',
        name: 'sex',
        type: 'radio',
        required: false,
        defaultValue: 1,
        data: [
          {
            id: 1,
            name: '男',
          }, {
            id: 0,
            name: '女',
          },
        ],
      },
      {
        key: 7,
        label: '生日',
        name: 'birth',
        type: 'datepicker',
        required: false,
      },
      {
        key: 8,
        label: '电话',
        name: 'phone',
        type: 'text',
        required: false,
      },
      {
        key: 9,
        label: '地址',
        name: 'address',
        type: 'text',
        required: false,
      },
      {
        key: 10,
        label: '邮件',
        name: 'email',
        type: 'text',
        required: false,
      },
      {
        key: 11,
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
      {
        key: 12,
        label: '所属公司',
        name: 'companyId',
        type: 'select',
        required: true,
        data: this.props.userManage.companySelectList.filter(item => item.status === 0),
      },
    ]
    const userProps = {
      columns,
      scrollX: 2000,
      data,
      fmFields,
      addBtn: true,
      updateBtn: true,
      checkBtn: true,
      deleteBtn: false,
      pagination: {
        pageSize: this.state.pageSize,
        pageSizeOptions: ['10', '20', '30'],
        showSizeChanger: true,
        total,
      },
      handleCreate: (values) => {
        this.props.dispatch({
          type: 'userManage/create',
          payload: {
            ...values,
          },
        })
      },
      handleEdit: (values) => {
        const { birth, ...rest } = values
        this.props.dispatch({
          type: 'userManage/edit',
          payload: {
            ...rest,
            birth: moment(birth).format('YYYY-MM-DD'),
          },
        })
      },
      handleTableChange: (pagination) => {
        this.setState({
          pageSize: pagination.pageSize,
        })
        this.props.dispatch({
          type: 'userManage/queryList',
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
        <BasicDataList {...userProps} />
      </div>
    )
  }
}
export default connect(({ userManage }) => ({ userManage }))(UserManage)