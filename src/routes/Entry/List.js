import React, { Component } from 'react';
import { Button, Table, Tooltip, Badge, Icon, Spin } from 'antd';
import * as moment from 'moment';
import styles from './entry.less';
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
      handleChangeStatus,
      selectedStatus,
      role,
    } = this.props;
    const btnBar = (
      <div className={styles.btnBar}>
        {(role === '0' || role === '1') && (
          <span>
            <Button className={styles.btn} onClick={() => showModal('add')}>
              <Icon type="plus" />新增
            </Button>
            <Button className={styles.btn} onClick={() => showModal('edit')}>
              <Icon type="edit" />修改
            </Button>
            <Button className={styles.btn} onClick={handleChangeStatus}>
              {selectedStatus === 0 ? (
                <span>
                  <Icon type="minus" />停用
                </span>
              ) : (
                  <span>
                    <Icon type="check" />启用
                  </span>
                )}
            </Button>
            <Button className={styles.btn} onClick={() => showModal('check')}>
              <Icon type="eye-o" />查看
            </Button>

          </span>
        )}

      </div>
    );
    const columns = [
      {
        title: '入库编号',
        dataIndex: 'warehouseNo',
        fixed: 'left',
        render: (text, record) => {
          if (record.status === 1)
            return (
              <span>
                <Tooltip title="此入库单已被停用">
                  <Badge status="error" />
                </Tooltip>
                {text}
              </span>
            );
          else return <span>{text}</span>;
        },
        width: 180,
      },
      {
        title: '打灰时间',
        dataIndex: 'checkStartTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        width: 200,
      },
      {
        title: '打灰结束日期',
        dataIndex: 'checkOutTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        width: 200,
        className: role === '2' ? 'hidden' : '',
      },
      {
        title: '运输车号',
        dataIndex: 'carNo',
        width: 150,
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
        width: 250,
      },
      {
        title: '产品',
        dataIndex: 'productName',
        width: 250,
      },
      {
        title: '细度',
        dataIndex: 'fineness',
        width: 250,
      },
      {
        title: '检验员',
        dataIndex: 'checker',
        width: 150,
      },
      {
        title: '审核员',
        dataIndex: 'auditor',
        width: 150,
      },
      {
        title: '皮重(吨)',
        dataIndex: 'tareWeight',
        width: 150,
      },
      {
        title: '毛重(吨)',
        dataIndex: 'grossWeight',
        width: 150,
      },
      {
        title: '净重(吨)',
        dataIndex: 'netWeight',
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text =>
          text === 0 ? <span>启用</span> : <span className={commonStyles.disableState}>停用</span>,
        width: 100,
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
          />
      </div>
    );
  }
}
export default List;
