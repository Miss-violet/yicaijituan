import React, { Component } from 'react';
import { Button, Table, Tooltip, Badge, Icon, Spin } from 'antd';
import * as moment from 'moment';
import { Link } from 'dva/router';
import styles from './outbound.less';
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
      total,
      sumNetweight,
      totalRecords,
      rowSelection,
      handleTableChange,
      showModal,
      handleChangeStatus,
      selectedStatus,
      selectedId,
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
            {selectedId === undefined ? (
              <Tooltip title="请先选中一条单据后再查看">
                <span className={styles.btn}>
                  <Icon type="printer" /> 查看合格证
                </span>
              </Tooltip>
            ) : (
                selectedStatus === 0 && (
                  <Link target="_blank" to={`/report/${selectedId}`} className={styles.btn}>
                    <Icon type="printer" /> 查看合格证
                  </Link>
                )
              )}
          </span>
        )}
        <div style={{ marginLeft: '5px', marginTop: '10px' }}>
          <span>共 <span style={{ color: '#f5222d' }}>{Number(total).toLocaleString()} </span>条出库单；</span>
          <span>净重统计：<span style={{ color: '#f5222d' }}>{sumNetweight === '' ? (<Spin />) : (Number(sumNetweight)/1000).toLocaleString()} </span>吨；</span>
          <span>出库车次统计：<span style={{ color: '#f5222d' }}>{totalRecords === '' ? (<Spin />) : Number(totalRecords).toLocaleString()} </span>。</span>
          <span>【数据统计请根据出厂日期筛选统计；若无筛选条件则默认统计当月数据。】</span>
        </div>
      </div>
    );
    const columns = [
      {
        title: '出库编号',
        dataIndex: 'deliveryNo',
        fixed: 'left',
        render: (text, record) => {
          if (record.status === 1)
            return (
              <span>
                <Tooltip title="此出库单已被停用">
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
        title: '出厂时间',
        dataIndex: 'outTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        width: 200,
      },
      {
        title: '生产日期',
        dataIndex: 'deliveryTime',
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
        title: '生厂商',
        dataIndex: 'supplierName',
        width: 150,
      },
      {
        title: '公司名称',
        dataIndex: 'distributorName',
        width: 250,
      },
      {
        title: '客户',
        dataIndex: 'customer',
        width: 250,
      },
      {
        title: '产品',
        dataIndex: 'productName',
        width: 250,
      },
      {
        title: '级别',
        dataIndex: 'level',
        render: text => (text === 0 ? 'I级' : text === 1 ? 'II级' : 'III级'),
        width: 150,
      },
      {
        title: '工艺',
        dataIndex: 'techno',
        render: text => (text === 0 ? '分选' : ''),
        width: 150,
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
        title: '皮重(kg)',
        dataIndex: 'tareWeight',
        width: 150,
      },
      {
        title: '毛重(kg)',
        dataIndex: 'grossWeight',
        width: 150,
      },
      {
        title: '净重(kg)',
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
          scroll={{ x: 2700 }}
        />
      </div>
    );
  }
}
export default List;
