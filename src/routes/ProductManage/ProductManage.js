import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Tooltip, Badge, Button } from 'antd';

import classNames from 'classnames'

import BasicDataList from './BasicDataList/BasicDataList';
import commonStyles from '../../assets/style/common.less';

class ProductManage extends Component {
  constructor() {
    super();
    this.state = {
      standardsVisible: false,
      proName: '',
    };
  }
  check = record => {
    const { id } = record
    this.props.dispatch({
      type: 'productManage/queryStandardTitleList',
      payload: {
        productId: id,
        type: 0,
      },
    })
    this.props.dispatch({
      type: 'productManage/queryStandardTitleList',
      payload: {
        productId: id,
        type: 1,
      },
    })
    this.props.dispatch({
      type: 'productManage/standardParamsQuery',
      payload: {
        productId: id,
      },
    })
    this.setState({
      standardsVisible: true,
      proName: record.name,
    });
  };
  handleOk = () => {
    this.setState({
      standardsVisible: false,
    });
  };
  handleCancel = () => {
    this.setState({
      standardsVisible: false,
    });
  };
  render() {
    const { dispatch } = this.props
    let { data } = this.props.productManage
    const {
      standardRowTitleData,
      standardColumnTitleData,
      standardParams,
      productDetail,
    } = this.props.productManage
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => {
          if (record.status === 1)
            return (
              <span>
                <Tooltip title="此产品已被停用">
                  <Badge status="error" />
                </Tooltip>
                {text}
              </span>
            );
          else return <span>{text}</span>;
        },
      },
      {
        title: '打印抬头',
        dataIndex: 'printName',
      },
      {
        title: '打印备注',
        dataIndex: 'remark',
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: text => (text === 1 ? '铁路运输' : '粉煤灰'),
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text =>
          text === 0 ? <span>启用</span> : <span className={commonStyles.disableState}>停用</span>,
      },
      {
        title: '标准',
        dataIndex: 'standards',
        render: (text, record) => {
          if (!record.standardDataFlag) return (
            <Tooltip title="请先编辑标准后再查看">
              <span>
                查看标准
              </span>
            </Tooltip>
          )
          else return (
            <a href="javascript: void(0)" onClick={() => this.check(record)}>
              查看标准
            </a>
          )
        },
      },
    ];

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
        required: true,
      },
      {
        key: 2,
        label: '类型',
        name: 'type',
        type: 'radio',
        required: true,
        defaultValue: 0,
        data: [
          {
            id: 0,
            name: '粉煤灰',
          },
          {
            id: 1,
            name: '铁路运输',
          },
        ],
      },
      {
        key: 3,
        label: '打印抬头',
        name: 'printName',
        type: 'text',
        required: true,
      },
      {
        key: 4,
        label: '打印备注',
        name: 'remark',
        type: 'text',
        required: false,
      },
      {
        key: 5,
        label: '状态',
        name: 'status',
        type: 'radio',
        required: true,
        defaultValue: 0,
        data: [
          {
            id: 1,
            name: '停用',
          },
          {
            id: 0,
            name: '启用',
          },
        ],
      },
    ];
    const productProps = {
      columns,
      data,
      fmFields,
      addBtn: true,
      updateBtn: true,
      checkBtn: false,
      deleteBtn: true,
      standardColumnTitleData,
      standardRowTitleData,
      standardParams,
      productDetail,
      handleCreate: values => {
        dispatch({
          type: 'productManage/create',
          payload: {
            ...values,
          },
        });
      },
      handleEdit: values => {
        dispatch({
          type: 'productManage/edit',
          payload: {
            ...values,
          },
        });
      },
      handleDelete: id => {
        dispatch({
          type: 'productManage/delete',
          payload: id,
        });
      },
      handleCheck: payload => {
        dispatch({
          type: 'productManage/info',
          payload,
        })
      },
      addStandardTitle: payload => {
        dispatch({
          type: 'productManage/standardTitleCreate',
          payload,
        })
      },
    };
    const { standardsVisible, proName } = this.state;

    const tableStyle =
      classNames({
        [commonStyles.table]: true,
        [commonStyles.standardsTable]: true,
      })


    return (
      <div>
        <BasicDataList {...productProps} />
        <Modal
          title={`${proName} 标准`}
          visible={standardsVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="80%"
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <table className={tableStyle}>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>项目名称</th>
                <th style={{ width: '15%' }}>类型</th>
                {
                  standardColumnTitleData && standardColumnTitleData.map(columnItem => (
                    <th key={columnItem.id} style={{ width: `${60 / standardColumnTitleData.length}%` }}>
                      {columnItem.name}
                    </th>
                  ))
                }
                <th style={{ width: '10%' }}>保留的小数点位数</th>
              </tr>
            </thead>
            <tbody>
              {
                standardParams && standardParams.map(dataItem => {
                  return (
                    <tr key={dataItem.id}>
                      <td>
                        {dataItem.rowTitle}
                      </td>
                      <td >
                        {dataItem.params[0].type === 0 ? '≤（小于等于）' : '≥（大于等于）'}
                      </td>
                      {
                        dataItem.params.map(item => {
                          return (
                            <td key={item.id}>
                              {item.val}
                            </td>
                          )
                        })
                      }
                      <td>
                        {dataItem.params[0].pointNum}
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </Modal>
      </div>
    );
  }
}
export default connect(({ productManage }) => ({ productManage }))(ProductManage);
