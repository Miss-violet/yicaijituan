import React, { Component } from 'react';
import { Button, Table, Tooltip, Badge, Icon, Spin, Popconfirm } from 'antd';
import * as moment from 'moment';
import { Link } from 'dva/router';
import styles from './index.less';
import commonStyles from '../../assets/style/common.less';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: props.pagination,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.pagination !== nextProps.pagination) {
      setTimeout(() => {
        this.setState({
          pagination: {
            ...nextProps.pagination,
          },
        });
      }, 0);
    }
  }
  render() {
    const {
      listData,
      rowSelection,
      handleTableChange,
      showModal,
      deleteData,
      selectedId,
      role,
    } = this.props;
    const btnBar = (
      <div className={styles.btnBar}>
        {(role === '0' || role === '1') && (
          <span>
            <Button className={styles.btn} onClick={() => showModal('edit')}>
              <Icon type="edit" />修改
            </Button>
            <Button className={styles.btn} onClick={() => showModal('check')}>
              <Icon type="eye-o" />查看
            </Button>
            <Popconfirm
              title="确定要删除所选数据吗？"
              onConfirm={deleteData}
              okText="确定"
              cancelText="取消"
            >
              <Button className={styles.btn}><Icon type="delete" />删除</Button>
            </Popconfirm>,
            {selectedId === undefined ? (
              <Tooltip title="请先选中一条单据后再查看">
                <span className={styles.btn}>
                  <Icon type="printer" /> 查看发货单
                </span>
              </Tooltip>
            ) : (
                <Link target="_blank" to={`/shippingReport/${selectedId}`} className={styles.btn}>
                  <Icon type="printer" /> 查看发货单
                </Link>
              )}
          </span>
        )}
      </div>
    );
    const columns = [
      {
        title: '发货单号',
        dataIndex: 'shippingNo',
        width: 180,
        fixed: 'left',
      },
      {
        title: '购货单位',
        dataIndex: 'purchaser',
        width: 180,
      },
      {
        title: '品名',
        dataIndex: 'productName',
        width: 150,
      },
      {
        title: '规格',
        dataIndex: 'specification',
        width: 250,
      },
      {
        title: '数量（吨/包）',
        dataIndex: 'quantity',
        width: 250,
      },
      {
        title: '车（船）号',
        dataIndex: 'carNo',
        width: 150,
      },
      {
        title: '装货地点',
        dataIndex: 'loadPlace',
        width: 250,
      },
      {
        title: '开单员',
        dataIndex: 'clerker',
        width: 150,
      },
      {
        title: '提货（运输）人',
        dataIndex: 'picker',
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        width: 150,
      },
      {
        title: '发货日期',
        dataIndex: 'time',
        render: (text, record) => moment(record.accTime).format('YYYY-MM-DD HH:mm:ss'),
        width: 200,
      },
      {
        title: '验收数量',
        dataIndex: 'accQuantity',
        width: 150,
      },
      {
        title: '验收人',
        dataIndex: 'accepter',
        width: 150,
      },
      {
        title: '验收日期',
        dataIndex: 'accTime',
        render: text => moment(text).format('YYYY-MM-DD'),
        width: 200,
      },
    ];

    return (
      <div>
        {btnBar}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={listData}
          bordered
          pagination={this.state.pagination}
          onChange={handleTableChange}
          scroll={{ x: 2400, y: 600 }}
          rowKey={record => record.id}
        />
      </div>
    );
  }
}
export default List;
