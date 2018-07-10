import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Table, Tooltip, Badge, Button } from 'antd'
import BasicDataList from './BasicDataList/BasicDataList'
import commonStyles from '../../assets/style/common.less'

class ProductManage extends Component {
  constructor() {
    super()
    this.state = {
      standardsData: [],
      standardsVisible: false,
      proName: '',
    }
  }
  check = (record) => {
    this.setState({
      standardsVisible: true,
      standardsData: record.standards,
      proName: record.name,
    })
  }
  handleOk = () => {
    this.setState({
      standardsVisible: false,
    });
  }
  handleCancel = () => {
    this.setState({
      standardsVisible: false,
    });
  }
  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => {
          if (record.status === 1) return <span><Tooltip title="此产品已被停用"><Badge status="error" /></Tooltip>{text}</span>
          else return <span>{text}</span>
        },
      },
      {
        title: '打印抬头',
        dataIndex: 'printName',
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: text => (text === 1 ? '铁路运输' : '粉煤灰'),
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text => (text === 0 ? <span>启用</span> : <span className={commonStyles.disableState}>停用</span>),
      },
      {
        title: '标准',
        dataIndex: 'standards',
        render: (text, record) => (<a href="javascript: void(0)" onClick={() => this.check(record)}>查看标准</a>),
      },
    ]
    const { data } = this.props.productManage
    const standardsColumns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        width: '25%',
      }, {
        title: '类型',
        dataIndex: 'type',
        width: '15%',
        render: text => text === 1 ? '≤（小于等于）' : '≥（大于等于）',
      }, {
        title: 'I级指标',
        dataIndex: 'oneLevel',
        width: '15%',
      }, {
        title: 'II级指标',
        dataIndex: 'twoLevel',
        width: '15%',
      }, {
        title: 'III级指标',
        dataIndex: 'threeLevel',
        width: '15%',
      }, {
        title: '保留小数点位数',
        dataIndex: 'pointNum',
        width: '15%',
      },
    ]

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
          }, {
            id: 1,
            name: '铁路运输',
          },
        ],
      }, {
        key: 3,
        label: '打印抬头',
        name: 'printName',
        type: 'text',
        required: true,
      },
      {
        key: 4,
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
    ]
    const companyProps = {
      columns,
      data,
      fmFields,
      addBtn: true,
      updateBtn: true,
      checkBtn: false,
      deleteBtn: true,
      handleCreate: (values) => {
        this.props.dispatch({
          type: 'productManage/create',
          payload: {
            ...values,
          },
        })
      },
      handleEdit: (values) => {
        this.props.dispatch({
          type: 'productManage/edit',
          payload: {
            ...values,
          },
        })
      },
      handleDelete: (id) => {
        this.props.dispatch({
          type: 'productManage/delete',
          payload: id,
        })
      },
    }
    const { standardsVisible, standardsData, proName } = this.state

    return (
      <div>
        <BasicDataList {...companyProps} />
        <Modal
          title={`${proName} 标准`}
          visible={standardsVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="60%"
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <Table columns={standardsColumns} dataSource={standardsData} pagination={false} bordered />
        </Modal>
      </div>
    )
  }
}
export default connect(({ productManage }) => ({ productManage }))(ProductManage)