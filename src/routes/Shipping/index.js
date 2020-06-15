import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import moment from 'moment'
import InboundFilter from './Filter';
import List from './List';
import EditModal from './Modal';

class Index extends Component {
  constructor() {
    super();
    this.state = {
      role: sessionStorage.getItem('role'), // 当前用户的角色
      modalVisible: false,
      disabled: false,
      title: '',
      type: '',
      selectedRows: {},
      selectedRowKeys: [],
      pageSize: 20,
      pageIndex: 0,
      selectedDetail: {} /* 选中的单据的详情 */,
      filterValue: {} /* 查询条件 */,
    };
  }

  setPagination = pagination => {
    this.setState({
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex,
    });
  };
  showModal = type => {
    const { dispatch } = this.props;

    if (this.state.selectedRowKeys.length < 1) {
      message.warning('请选择数据后再进行操作', 2);
      return;
    }
    dispatch({
      type: 'shipping/info',
      payload: {
        id: this.state.selectedRows.id,
      },
      callback: (code, selectedDetail) => {
        if (code === 0) {
          /* selectedDetail     - 获取选中的单据详情 */
          this.setState({
            selectedDetail,
          });
        }
      },
    });
    if (type === 'edit') {
      this.setState({
        title: '发货单编辑',
        disabled: false,
        modalVisible: true,
        type,
      });
    } else if (type === 'check') {
      this.setState({
        title: '发货单查看',
        disabled: true,
        modalVisible: true,
        type,
      });
    }
  };
  closeModal = () => {
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
      selectedDetail: {},
      selectedRows: {},
    });
  };
  rowOnChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows: selectedRows[0],
      selectedRowKeys,
    });
  };

  handleSearch = values => {
    console.info('values->', values)
    const { params } = values;
    let { startTime = '', endTime = '' } = params
    startTime = startTime && moment(startTime).format('YYYY-MM-DD 00:00:00')
    endTime = endTime && moment(endTime).format('YYYY-MM-DD 23:59:59')
    this.setState({
      filterValue: {
        ...params,
        startTime,
        endTime,
      },
    });
    this.props.dispatch({
      type: 'shipping/queryList',
      payload: {
        ...values,
        params: {
          ...params,
          startTime,
          endTime,
        },
      },
    });
  };
  handleReset = () => {
    this.setState({
      filterValue: {},
    });
  };

  /**
   * 删除
   *
   * @memberof Index
   */
  deleteData = () => {
    const { selectedRowKeys } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'shipping/del',
      payload: {
        id: selectedRowKeys[0],
      },
    }).then(res => {
      if (res.code === 0) {
        message.success('删除成功')
        const { filterValue, pageSize, pageIndex } = this.state
        this.props.dispatch({
          type: 'shipping/queryList',
          payload: {
            ...filterValue,
            pageSize,
            pageIndex,
          },
        });
      } else {
        message.info(res.msg)
      }
    })
  }

  render() {
    const { total, cars, sumNetweight, totalRecords } = this.props.shipping;

    let { listData } = this.props.shipping;

    listData = listData.map((item, index) => {
      return {
        ...item,
        key: index,
      };
    });

    const {
      title,
      modalVisible,
      type,
      selectedRowKeys,
      selectedDetail,
      role,
    } = this.state;
    const filterProps = {
      cars,
      role,
      handleSearch: values => this.handleSearch(values),
      handleReset: this.handleReset,
    };
    const showTotal = () => `共${total}条数据`;
    const listProps = {
      role,
      showModal: this.showModal,
      deleteData: this.deleteData,
      listData,
      total,
      sumNetweight,
      totalRecords,
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
        showTotal,
      },
      handleTableChange: pagination => {
        this.setPagination(pagination);
        this.props.dispatch({
          type: 'shipping/queryList',
          payload: {
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
            params: this.state.filterValue,
          },
        });
      },
    };
    const modalProps = {
      closeModal: this.closeModal,
      dispatch: this.props.dispatch,
      selectedDetail,
      visible: modalVisible,
      title,
      type,
      disabled: this.state.disabled,
    };
    return (
      <div>
        <InboundFilter {...filterProps} />
        <List {...listProps} />
        <EditModal {...modalProps} />
      </div>
    );
  }
}
export default connect(({ shipping, productManage }) => ({ shipping, productManage }))(Index);
