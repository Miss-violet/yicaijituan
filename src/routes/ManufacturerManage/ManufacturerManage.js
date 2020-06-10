import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip, Badge } from 'antd';
import BasicDataList from '../../components/BasicDataList/BasicDataList';
import commonStyles from '../../assets/style/common.less';

class ManufacturerManage extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => {
          if (record.status === 1)
            return (
              <span>
                <Tooltip title="此生厂商已被停用">
                  <Badge status="error" />
                </Tooltip>
                {text}
              </span>
            );
          else return <span>{text}</span>;
        },
      },
      {
        title: '信息',
        dataIndex: 'info',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text =>
          text === 0 ? <span>启用</span> : <span className={commonStyles.disableState}>停用</span>,
      },
    ];
    let { data } = this.props.manufacturerManage;
    data = data.map((item, index) => {
      return {
        ...item,
        key: index,
      }
    });
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
        label: '信息',
        name: 'info',
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
          },
          {
            id: 0,
            name: '启用',
          },
        ],
      },
    ];
    const companyProps = {
      columns,
      data,
      fmFields,
      addBtn: true,
      updateBtn: true,
      checkBtn: true,
      deleteBtn: true,
      pagination: false,
      handleCreate: values => {
        this.props.dispatch({
          type: 'manufacturerManage/create',
          payload: {
            ...values,
          },
        });
      },
      handleEdit: values => {
        this.props.dispatch({
          type: 'manufacturerManage/edit',
          payload: {
            ...values,
          },
        });
      },
      handleDelete: id => {
        this.props.dispatch({
          type: 'manufacturerManage/delete',
          payload: id,
        });
      },
    };
    return (
      <div>
        <BasicDataList {...companyProps} />
      </div>
    );
  }
}
export default connect(({ manufacturerManage }) => ({ manufacturerManage }))(ManufacturerManage);
