import React, { Component } from 'react'
import { connect } from 'dva'
import { message } from 'antd'
import OutboundFilter from './Filter'
import List from './List'
import EditModal from './Modal'

class Outbound extends Component {
  constructor() {
    super()
    this.state = {
      // role: (document.cookie && document.cookie.split('&&')[1]) || (sessionStorage.getItem('cookie') && sessionStorage.getItem('cookie').split('&&')[1]),   // 当前用户的角色
      role: (sessionStorage.getItem('cookie') && sessionStorage.getItem('cookie').split('&&')[1]),
      modalVisible: false,
      disabled: false,
      title: '',
      type: '',
      selectedRows: {},
      selectedRowKeys: [],
      pageSize: 20,
      selectedDetail: {},         /* 选中的单据的详情 */
      selectedStatus: '',         /* 选中的单据的状态 */
    }
  }

  setPagination = (pagination) => {
    this.setState({
      pageSize: pagination.pageSize,
    })
  }
  showModal = (type) => {
    if (type === 'add') {
      this.setState({
        selectedDetail: {},     /* 如果是新增，则打开的弹窗里没有单据详情。防止选中后打开带入数据 */
        disabled: false,
        title: "合格证数据新增",
        modalVisible: true,
        type,
      })
    }
    else {
      if (this.state.selectedRowKeys.length < 1) {
        message.warning('请选择数据后再进行操作', 2);
        return
      }
      this.props.dispatch({
        type: 'outbound/info',
        payload: {
          id: this.state.selectedRows.id,
        },
        callback: (code, selectedDetail) => {
          if (code === 0) {
            /* selectedDetail     - 获取选中的单据详情 */
            this.setState({
              selectedDetail,
            })
          }
        },
      })
    }
    if (type === 'edit') {
      this.setState({
        title: '合格证数据编辑',
        disabled: false,
        modalVisible: true,
        type,
      })
    } else if (type === 'check') {
      this.setState({
        title: '合格证数据查看',
        disabled: true,
        modalVisible: true,
        type,
      })
    }
  }
  closeModal = () => {
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
      selectedDetail: {},
      selectedRows: {},
    });
  }
  rowOnChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows: selectedRows[0],
      selectedRowKeys,
      selectedStatus: selectedRows[0].status,
    })
  }
  /* 修改 出库单 状态 */
  changeStatus = () => {
    const id = this.state.selectedRows.id
    const status = this.state.selectedRows.status === 0 ? 1 : 0

    this.props.dispatch({
      type: 'outbound/status',
      payload: {
        id,
        status,
      },
      callback: (code) => {
        if (code === 0) {
          this.setState({
            selectedRowKeys: [],
            selectedStatus: status,
          })
        }
      },
    })
  }
  render() {
    const { manufacturerSelectList, companySelectList, productSelectList, listData, total, cars } = this.props.outbound
    const { title, modalVisible, type, selectedRowKeys, selectedDetail, selectedStatus, role } = this.state
    const filterProps = {
      companySelectList,
      manufacturerSelectList,
      productSelectList,
      cars,
      role,
      handleSearch: (values) => {
        this.props.dispatch({
          type: 'outbound/queryList',
          payload: {
            ...values,
          },
        })
      },
    }
    const listProps = {
      role,
      showModal: this.showModal,
      listData,
      selectedStatus,
      selectedId: this.state.selectedRows.id,
      rowSelection: {
        type: 'radio',
        selectedRowKeys,
        onChange: this.rowOnChange,
      },
      pagination: {
        pageSize: this.state.pageSize,
        pageSizeOptions: ['10', '20', '30'],
        showSizeChanger: true,
        total,
      },
      handleTableChange: (pagination) => {
        this.setPagination(pagination)
        this.props.dispatch({
          type: 'outbound/queryList',
          payload: {
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
            sortField: null,
            sortOrder: null,
            params: {},
          },
        })
      },
      handleChangeStatus: () => {
        if (this.state.selectedRowKeys.length < 1) {
          message.warning('请选择数据后再进行操作', 2);
          return
        }
        this.changeStatus()
      },
    }
    const modalProps = {
      closeModal: this.closeModal,
      dispatch: this.props.dispatch,
      selectedDetail,
      visible: modalVisible,
      title,
      type,
      companySelectList,
      manufacturerSelectList,
      productSelectList,
      resultOk: true,
      disabled: this.state.disabled,
      cars,
    }
    return (
      <div>
        <OutboundFilter {...filterProps} />
        <List {...listProps} />
        <EditModal {...modalProps} />
      </div>
    )
  }
}
export default connect(({ outbound }) => ({ outbound }))(Outbound)