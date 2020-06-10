import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import ShippingModal from '../Shipping/Modal';
import OutboundFilter from './Filter';
import List from './List';
import EditModal from './Modal';

class Outbound extends Component {
  constructor() {
    super();
    this.state = {
      role: sessionStorage.getItem('role'), // 当前用户的角色
      shippingFlag: sessionStorage.getItem('shippingFlag'),    // 当前用户是否有查看发货单权限
      modalVisible: false,
      disabled: false,
      productDisabled: false /* 只有新增产品时才是 false */,
      title: '',
      type: '',
      selectedRows: {},
      selectedRowKeys: [],
      pageSize: 20,
      selectedDetail: {} /* 选中的单据的详情 */,
      selectedStatus: '' /* 选中的单据的状态 */,
      filterValue: {} /* 查询条件 */,
      addShippingModalVisible: false /* 新建发货单弹窗是否可见 */,
    };
  }

  setPagination = pagination => {
    this.setState({
      pageSize: pagination.pageSize,
    });
  };

  /**
   * 打开新增/编辑/查看 合格证数据 的弹窗
   *
   * @memberof Outbound
   */
  showModal = type => {
    const { dispatch } = this.props;
    // 设置弹窗需要的参数
    if (type === 'add') {
      // 如果是新增
      this.setState({
        selectedDetail: {} /* 如果是新增，则打开的弹窗里没有单据详情。防止选中后打开带入数据 */,
        disabled: false,
        productDisabled: false,
        title: '合格证数据新增',
        modalVisible: true,
        type,
      });
    } else {
      // 如果是编辑或查看，需要选择数据后再进行操作。这个页面没有删除功能
      if (this.state.selectedRowKeys.length < 1) {
        message.warning('请选择数据后再进行操作', 2);
        return;
      }
      // 查询单据详情
      dispatch({
        type: 'outbound/info',
        payload: {
          id: this.state.selectedRows.id,
        },
        callback: (code, selectedDetail) => {
          // 如果是新增发货单，则不需要查询下拉框列表
          if (code === 0 && type !== 'shipping') {
            /* selectedDetail     - 获取选中的单据详情 */
            /* 查询列标题 */
            const { productId } = selectedDetail;

            // 查询下拉框列表
            dispatch({
              type: 'productManage/queryStandardTitleList',
              payload: {
                productId,
                type: 1,
              },
            });
            dispatch({
              type: 'productManage/queryStandardTitleList',
              payload: {
                productId,
                type: 0,
              },
            });
            dispatch({
              type: 'productManage/standardParamsQuery',
              payload: {
                productId,
              },
            });
            dispatch({
              type: 'productManage/info',
              payload: {
                productId,
              },
            });
          }

          // 保存详情到 state，准备传值给弹窗
          this.setState({
            selectedDetail,
          });
        },
      });
    }
    // 根据类型（编辑或查看）设置弹窗的标题等
    if (type === 'edit') {
      this.setState({
        title: '合格证数据编辑',
        disabled: false,
        productDisabled: true,
        modalVisible: true,
        type,
      });
    } else if (type === 'check') {
      this.setState({
        title: '合格证数据查看',
        disabled: true,
        productDisabled: true,
        modalVisible: true,
        type,
      });
    } else if (type === 'shipping') {
      // 如果是新增发货单，则不需要查下拉框数据，但是要显示弹窗
      this.setState({
        addShippingModalVisible: true,
      });
    }
  };

  /**
   * 关闭新增/编辑/查看 合格证数据 的弹窗
   *
   * @memberof Outbound
   */
  closeModal = () => {
    this.setState({
      modalVisible: false,
      selectedRowKeys: [],
      selectedDetail: {},
      selectedRows: {},
    });
  };

  /**
   * 关闭 新建发货单 弹窗
   *
   * @memberof Outbound
   */
  closeShippingModal = () => {
    this.setState({
      addShippingModalVisible: false,
    });
  };

  /**
   * 选中行
   *
   * @memberof Outbound
   */
  rowOnChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows: selectedRows[0],
      selectedRowKeys,
      selectedStatus: selectedRows[0].status,
    });
  };

  /* 修改 出库单 状态 */
  changeStatus = () => {
    const { id } = this.state.selectedRows;
    const status = this.state.selectedRows.status === 0 ? 1 : 0;

    this.props.dispatch({
      type: 'outbound/status',
      payload: {
        id,
        status,
      },
      callback: code => {
        if (code === 0) {
          this.setState({
            selectedRowKeys: [],
            selectedStatus: status,
          });
        }
      },
    });
  };

  /**
   * 搜索
   *
   * @memberof Outbound
   */
  handleSearch = values => {
    const { params } = values;
    this.setState({
      filterValue: params,
    });
    this.props.dispatch({
      type: 'outbound/queryList',
      payload: {
        ...values,
      },
    });
  };

  /**
   * 重置
   *
   * @memberof Outbound
   */
  handleReset = () => {
    this.setState({
      filterValue: {},
    });
  };

  render() {
    const {
      manufacturerSelectList,
      companyAllSelectList,
      productSelectList,
      total,
      cars,
      sumNetweight,
      totalRecords,
    } = this.props.outbound;

    let { listData } = this.props.outbound;

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
      selectedStatus,
      role,
      shippingFlag,
      addShippingModalVisible,
    } = this.state;

    const { deliveryNo, id: deliveryId } = selectedDetail;

    const filterProps = {
      companyAllSelectList,
      manufacturerSelectList,
      productSelectList,
      cars,
      role,
      handleSearch: values => this.handleSearch(values),
      handleReset: this.handleReset,
    };
    const showTotal = () => `共${total}条数据`;
    const listProps = {
      role,
      shippingFlag,
      showModal: this.showModal,
      listData,
      total,
      sumNetweight,
      totalRecords,
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
        showTotal,
      },
      handleTableChange: pagination => {
        this.setPagination(pagination);
        this.props.dispatch({
          type: 'outbound/queryList',
          payload: {
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
            sortField: null,
            sortOrder: null,
            params: this.state.filterValue,
          },
        });
      },
      handleChangeStatus: () => {
        if (this.state.selectedRowKeys.length < 1) {
          message.warning('请选择数据后再进行操作', 2);
          return;
        }
        this.changeStatus();
      },
    };
    const modalProps = {
      closeModal: this.closeModal,
      dispatch: this.props.dispatch,
      selectedDetail,
      visible: modalVisible,
      title,
      type,
      companyAllSelectList,
      manufacturerSelectList,
      productSelectList,
      resultOk: true,
      disabled: this.state.disabled,
      productDisabled: this.state.productDisabled,
      cars,
    };
    const shippingModalProps = {
      closeModal: this.closeShippingModal,
      dispatch: this.props.dispatch,
      visible: addShippingModalVisible,
      title: '新建发货单',
      type: 'add',
      deliveryNo,
      deliveryId,
    };
    return (
      <div>
        <OutboundFilter {...filterProps} />
        <List {...listProps} />
        <EditModal {...modalProps} />
        <ShippingModal {...shippingModalProps} />
      </div>
    );
  }
}
export default connect(({ outbound, productManage }) => ({ outbound, productManage }))(Outbound);
