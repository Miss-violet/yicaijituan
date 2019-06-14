import React, { Component } from 'react';
import { Row, Col } from 'antd';
import classnames from 'classnames';
import { connect } from 'dva';
import * as moment from 'moment';
import styles from './report.less';
import commonStyles from '../../assets/style/common.less';

@connect(({ report, productManage }) => ({
  detail: report.detail,
  productDetail: productManage.productDetail,
  standardColumnTitleData: productManage.standardColumnTitleData,
}))

export default class Report extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { detail, productDetail, standardColumnTitleData } = this.props
    const { footContent, footName, headName, headResult, headTitle } = productDetail
    const table = classnames({
      [commonStyles.table]: true,
      [styles.table]: true,
    });
    return (
      <Row gutter={16} className={styles.row}>
        <Col span={8} className={styles.leftCol}>
          <div className={styles.deliveryNo}>
            No. {detail.deliveryNo}
          </div>
          <h1 className={styles.productName}>
            <div>{detail.title}</div>
            <p className={styles.name}>出厂合格证</p>
          </h1>
          <div className={styles.qrCode}>
            <img src={`${detail.qrcodeUrl}`} alt="qrCode" />
          </div>
          <ul className={styles.leftList}>
            <li>
              <span className={styles.label}>级别：</span>
              <div className={styles.content}>
                <span>{detail.columnTitle}</span>
              </div>
            </li>
            <li>
              <span className={styles.label}>出厂批号：</span>
              <div className={styles.content}>
                <span>{detail.batchNo}</span>
              </div>
            </li>
            <li>
              <span className={styles.label}>出厂日期：</span>
              <div className={styles.content}>
                <span>{moment(detail.outTime).format('YYYY年MM月DD日')}</span>
              </div>
            </li>
            <li>
              <span className={styles.label}>检验结论：</span>
              <div className={styles.content}>
                <span>合格</span>
              </div>
            </li>
            <li>
              <span className={styles.label}>生产厂家：</span>
              <div className={styles.content}>
                <span>{detail.supplierName}</span>
              </div>
            </li>
            <li>
              <span className={styles.label}>检验员：</span>
              <div className={styles.content}>
                <span>{detail.checker}</span>
              </div>
            </li>
          </ul>
        </Col>
        <Col span={16} className={styles.rightCol}>
          <h2 className={styles.name}>{detail.title}检验报告</h2>
          <div className={styles.infoWrap}>
            <Row className={styles.rightList}>
              <Col span={12}>
                <ul>
                  <li>
                    <span className={styles.label}>生产日期：</span>
                    <span className={styles.content}>
                      {moment(detail.deliveryTime).format('YYYY年MM月DD日')}
                    </span>
                  </li>
                  <li>
                    <span className={styles.label}>取样点：</span>
                    <span className={styles.content}>现场</span>
                  </li>
                  <li>
                    <span className={styles.label}>类别：</span>
                    <span className={styles.content}>
                      {detail.columnTitle}
                    </span>
                  </li>
                </ul>
              </Col>
              <Col span={12}>
                <ul>
                  <li>
                    <span className={styles.label}>出厂批号：</span>
                    <span className={styles.content}>{detail.batchNo}</span>
                  </li>
                  <li>
                    <span className={styles.label}>工艺：</span>
                    <span className={styles.content}>{detail.techno === 0 ? '分选' : ''}</span>
                  </li>
                  {
                    detail.allowShowCarNo === 1 && (
                      <li>
                        <span className={styles.label}>运输车号：</span>
                        <span className={styles.content}>{detail.carNo}</span>
                      </li>
                    )
                  }
                </ul>
              </Col>
            </Row>
            <div className={styles.qrCode}>
              <img src={`${detail.qrcodeUrl}`} alt="qrCode" />
            </div>
          </div>
          <table className={table}>
            <thead>
              <tr>
                <th rowSpan="2" style={{ width: '16%' }}>{headName}</th>
                <th colSpan={standardColumnTitleData.length} style={{ width: '74%' }}>{headTitle}</th>
                <th rowSpan="2" style={{ width: '10%' }}>{headResult}</th>
              </tr>
              <tr>
                {
                  standardColumnTitleData && standardColumnTitleData.map(columnItem => (
                    <th key={columnItem.id} style={{ width: `${74 / standardColumnTitleData.length}%` }}>
                      {columnItem.name}
                    </th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {
                /**
                 *  item.type===1：大于等于
                 *  item.type===0：小于等于
                 */
                detail.standards &&
                detail.standards.map(item => (
                  <tr>
                    <td>{item.standardName}</td>
                    {
                      item.params.map(paramsItem => (
                        <td className={commonStyles.alignRight}>
                          {paramsItem.type === 0 ? '≤' : '≥'}
                          {paramsItem.val}
                        </td>
                      ))
                    }
                    <td className={commonStyles.alignRight}>{item.parameter || ''}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td>{footName}</td>
                <td colSpan={standardColumnTitleData.length + 4}>
                  <p>
                    {footContent}
                    <span className={styles.resultLevel}>
                      {detail.columnTitle}
                    </span>技术要求。
                  </p>
                  <p style={{ marginLeft: '30px' }}>{detail.remark}</p>
                </td>
              </tr>
            </tfoot>
          </table>
          <Row gutter={16}>
            {detail.allowApprover === 1 && (
              <Col span={6} offset={2}>
                审批员：{detail.approver}
              </Col>
            )}
            <Col span={6} offset={2}>
              审核：{detail.auditor}
            </Col>
            <Col span={6} offset={2}>
              检验员：{detail.checker}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

