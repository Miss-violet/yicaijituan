import React, { Component } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Radio,
  message,
  Popconfirm,
} from 'antd';
import EditableCell from './EditableCell';
import styles from './basicDataList.less';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 20 },
  },
};

class BasicDataList extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      visible: false,
      confirmLoading: false,
      disabled: false,
      modalType: '',
      selectedCompanyId: '',
      selected: {},
      dataSource: [],
      selectedRowKeys: [],
    };
    this.modalColumns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        width: '30%',
        render: (text, record) => {
          return (
            <EditableCell
              value={text}
              onChange={this.onCellChange(record.key, 'name')}
              type="input"
              disabled={this.state.modalType === 'check'}
              name={`name_${record.key}`}
            />
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: '14%',
        render: (text, record) => {
          return (
            <FormItem>
              {this.props.form.getFieldDecorator(`${record.key}`, {
                rules: [{ required: true, message: '此项必填' }],
                initialValue: String(record.type),
              })(
                <Select style={{ width: '100 %' }} placeholder="请选择">
                  <Option value="0">≤（小于等于）</Option>
                  <Option value="1">≥（大于等于）</Option>
                </Select>
                )}
            </FormItem>
          );
        },
      },
      {
        title: 'Ⅰ级指标',
        dataIndex: 'oneLevel',
        width: '12%',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'oneLevel')}
            type="input"
            disabled={this.state.modalType === 'check'}
            name={`oneLevel_${record.key}`}
            validatorNum={this.validatorNum}
          />
        ),
      },
      {
        title: 'Ⅱ级指标',
        dataIndex: 'twoLevel',
        width: '12%',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'twoLevel')}
            type="input"
            disabled={this.state.modalType === 'check'}
            name={`twoLevel_${record.key}`}
            validatorNum={this.validatorNum}
          />
        ),
      },
      {
        title: 'Ⅲ级指标',
        dataIndex: 'threeLevel',
        width: '12%',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'threeLevel')}
            type="input"
            disabled={this.state.modalType === 'check'}
            name={`threeLevel_${record.key}`}
            validatorNum={this.validatorNum}
          />
        ),
      },
      {
        title: '保留小数点位数',
        dataIndex: 'pointNum',
        width: '10%',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'pointNum')}
            type="numberInput"
            disabled={this.state.modalType === 'check'}
            step={1}
            max={4}
            min={0}
            name={`pointNum_${record.key}`}
          />
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record) => {
          return this.state.dataSource.length > 1 && this.state.modalType !== 'check' ? (
            <Popconfirm title="确定要删除这条数据吗?" onConfirm={() => this.onDelete(record.key)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
          ) : null;
        },
      },
    ];
  }
  onCellChange = (key, dataIndex) => {
    return value => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  };

  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  getFields = () => {
    const { fmFields } = this.props;
    const { disabled } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const Option = Select.Option;
    const RadioGroup = Radio.Group;

    const compareToFirstPassword = (rule, value, callback) => {
      if (value && value !== getFieldValue('password')) {
        callback('两次输入的密码不一致，请确认');
      } else {
        callback();
      }
    };

    const fmItem = fmFields.map(item => {
      const { modalType } = this.state;
      switch (item.type) {
        case 'text':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [
                    {
                      required: item.required,
                      message: `请输入${item.label}`,
                    },
                  ],
                  initialValue: item.initialValue,
                })(
                  <Input
                    placeholder={modalType === 'check' ? '' : `请输入${item.label}`}
                    disabled={disabled}
                  />
                  )}
              </FormItem>
            </Col>
          );
        case 'select':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [
                    {
                      required: item.required,
                      message: `请选择${item.label}`,
                    },
                  ],
                  initialValue: item.initialValue,
                })(
                  <Select disabled={disabled}>
                    {item.data &&
                      item.data.map(selectItem => (
                        <Option value={selectItem.id} key={selectItem.id}>{selectItem.name}</Option>
                      ))}
                  </Select>
                  )}
              </FormItem>
            </Col>
          );
        case 'radio':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [
                    {
                      required: item.required,
                      message: `请选择${item.label}`,
                    },
                  ],
                  initialValue: item.initialValue || item.defaultValue,
                })(
                  <RadioGroup name={item.name} disabled={disabled}>
                    {item.data &&
                      item.data.map(radioItem => (
                        <Radio value={radioItem.id} key={radioItem.id}>{radioItem.name}</Radio>
                      ))}
                  </RadioGroup>
                  )}
              </FormItem>
            </Col>
          );
        case 'password':
          return (
            <div key={item.key}>
              <Col span={24}>
                <FormItem label={item.label} {...formItemLayout}>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: item.required,
                        message: '请输入密码',
                      },
                    ],
                  })(
                    <Input
                      type="password"
                      placeholder={modalType === 'check' ? '' : '请输入密码'}
                      disabled={disabled}
                    />
                    )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="确认密码" {...formItemLayout}>
                  {getFieldDecorator('comfirmPsw', {
                    rules: [
                      {
                        required: item.required,
                        message: '请再次输入密码',
                      },
                      {
                        validator: compareToFirstPassword,
                      },
                    ],
                  })(
                    <Input
                      type="password"
                      placeholder={modalType === 'check' ? '' : '请再次输入密码'}
                      disabled={disabled}
                    />
                    )}
                </FormItem>
              </Col>
            </div>
          );
        case 'datepicker':
          return (
            <Col span={24} key={item.key}>
              <FormItem label={item.label} {...formItemLayout}>
                {getFieldDecorator(`${item.name}`, {
                  rules: [
                    {
                      required: item.required,
                      message: `请输入${item.label}`,
                    },
                  ],
                  initialValue: item.initialValue,
                })(
                  <DatePicker
                    format="YYYY-MM-DD"
                    placeholder={modalType === 'check' ? '' : `请选择${item.label}`}
                    disabled={disabled}
                    style={{ width: '100%' }}
                  />
                  )}
              </FormItem>
            </Col>
          );
        default:
          break;
      }
    });
    return fmItem;
  };

  validatorNum = (rule, value, callback) => {
    if (isNaN(Number(value))) {
      callback('请输入数字');
    } else {
      this.setState({})
    }
    callback()
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      selectedCompanyId: '',
      selectedRowKeys: [],
      selected: {},
    });
  };

  showModal = type => {
    let standards = [];
    standards =
      this.state.selected.standards &&
      this.state.selected.standards.map((item, index) => {
        item.key = index;
        return item;
      });
    switch (type) {
      case 'add':
        this.setState({
          title: '新增',
          disabled: false,
          modalType: 'add',
          dataSource: [
            {
              key: new Date().getTime(),
              id: '',
              name: '',
              oneLevel: '',
              pointNum: '',
              threeLevel: '',
              twoLevel: '',
              type: '',
            },
          ],
          selected: {} /* 点击新增的时候，不带入值。防止选中后点击新增把值带入 */,
        });
        break;
      case 'edit':
        if (JSON.stringify(this.state.selected) === '{}') {
          message.warning('请选择数据后再进行操作', 3);
          return;
        }
        this.setState({
          title: '编辑',
          disabled: false,
          modalType: 'edit',
          dataSource: standards,
        });
        break;
      case 'check':
        if (JSON.stringify(this.state.selected) === '{}') {
          message.warning('请选择数据后再进行操作', 3);
          return;
        }
        this.setState({
          title: '查看',
          disabled: true,
          modalType: 'check',
          dataSource: standards,
        });
        break;
      default:
        break;
    }
    setTimeout(() => {
      const { selected } = this.state;
      if (JSON.stringify(this.state.selected) === '{}') {
        /* 如果 this.state.selected 为空，则说明是 新增 */
        this.props.fmFields.map(fmItem => {
          fmItem.initialValue = null;
          return fmItem;
        });
      } else {
        for (const i in selected) {
          this.props.fmFields.map(fmItem => {
            if (i === fmItem.name) {
              fmItem.initialValue = selected[i];
            }
            return fmItem;
          });
        }
      }
      this.setState({
        visible: true,
      });
    }, 0);
  };
  handleSubmit = modalType => {
    /* 判断标准是否填写完整 */
    const itemIsNull = [];
    const isNullErr = this.state.dataSource.some(item => {
      for (const i in item) {
        if (i !== 'id' && i !== 'type') {
          /* 如果 item[i] 为空，则 塞进itemIsNull */
          if (item[i] === '') {
            itemIsNull.push(item[i]);
          }
        }
      }
      if (itemIsNull.length > 0) return true;
      else return false;
    });
    if (isNullErr) {
      Modal.warning({
        title: '警告',
        content: '标准的各个指标不能为空，请填写完整后再保存',
        okText: '知道了',
      });
      return;
    }
    /* 判断标准是否填写了数字 */
    let isNaNErr = false
    isNaNErr = this.state.dataSource.some(item =>
      isNaN(Number(item.oneLevel)) || isNaN(Number(item.twoLevel)) || isNaN(Number(item.threeLevel))
    )
    if (isNaNErr) {
      Modal.warning({
        title: '警告',
        content: '标准的各个指标只能是数字，请修改后再保存',
        okText: '知道了',
      });
      return;
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let standards = this.state.dataSource
        standards = standards.map(item => {
          for (const i in values) {
            if (!isNaN(Number(i)) && i == item.key) {
              item.type = values[i]
              return item
            }
          }
          return item
        })
        if (modalType === 'add') {
          this.props.handleCreate({
            ...values,
            standards: [...this.state.dataSource],
          });
        } else if (modalType === 'edit') {
          this.props.handleEdit({
            ...values,
            id: this.state.selectedCompanyId,
            standards,
          });
        }
        this.setState({
          confirmLoading: true,
          selectedRowKeys: [],
        });
        setTimeout(() => {
          this.setState({
            confirmLoading: false,
          });
        }, 500);
        this.handleCancel();
      }
    });
  };
  handleDelete = () => {
    if (!this.state.selectedCompanyId) {
      message.warning('请选择数据后再进行操作', 2);
      return;
    }
    confirm({
      title: '删除',
      content: '确定要删除选中的数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.handleDelete(this.state.selectedCompanyId);
      },
      onCancel() { },
    });
  };
  rowOnChange = (selectedRowKeys, selectedRows) => {
    const selected = selectedRows[0];
    this.setState({
      selectedCompanyId: selected.id,
      selectedRowKeys,
      selected,
    });
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    const newData = {
      key: new Date().getTime(),
      id: '',
      name: '',
      type: '',
      oneLevel: '',
      twoLevel: '',
      threeLevel: '',
      pointNum: '',
    };
    this.setState({
      dataSource: [...dataSource, newData],
    });
  };
  render() {
    const { visible, title, confirmLoading, modalType, dataSource, selectedRowKeys } = this.state;
    const { columns, data, addBtn, updateBtn, checkBtn, deleteBtn } = this.props;
    const modalColumns = this.modalColumns;

    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.rowOnChange,
    };
    return (
      <div>
        <div className={styles.btnBar}>
          {addBtn && (
            <Button className={styles.btn} onClick={() => this.showModal('add')}>
              新增
            </Button>
          )}
          {updateBtn && (
            <Button className={styles.btn} onClick={() => this.showModal('edit')}>
              编辑
            </Button>
          )}
          {checkBtn && (
            <Button className={styles.btn} onClick={() => this.showModal('check')}>
              查看
            </Button>
          )}
          {deleteBtn && (
            <Button className={styles.btn} onClick={this.handleDelete}>
              删除
            </Button>
          )}
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={false} />

        <Modal
          title={title}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={null}
          width="80%"
          destroyOnClose
        >
          <Form className={styles.fm}>
            <Row gutter={24}>{this.getFields()}</Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem label="标准" {...formItemLayout}>
                  <div>
                    <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                      新增行
                    </Button>
                    <Table
                      bordered
                      dataSource={dataSource}
                      columns={modalColumns}
                      pagination={false}
                    />
                  </div>
                </FormItem>
              </Col>
            </Row>
            <FormItem className={styles.fmBtn}>
              <Button type="default" onClick={this.handleCancel} className={styles.backBtn}>
                返回
              </Button>
              {this.state.modalType !== 'check' && (
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.submitBtn}
                  onClick={() => this.handleSubmit(modalType)}
                >
                  保存
                </Button>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(BasicDataList);
