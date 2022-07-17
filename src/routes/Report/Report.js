import React, { Component } from 'react';
import { Row, Col } from 'antd';
import classnames from 'classnames';
import { connect } from 'dva';
import * as moment from 'moment';
import styles from './report.less';
import commonStyles from '../../assets/style/common.less';

class Report extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { detail } = this.props.report;
    const table = classnames({
      [commonStyles.table]: true,
      [styles.table]: true,
      [styles.fontSize12]: detail.standards && detail.standards.length > 10,
    });
    const supplierNameStyle = classnames({
      [styles.content]: true,
      [styles.fontSize12]: detail.supplierName && detail.supplierName.length > 12,
    });
    let techno = '';
    let level = '';
    switch (detail.techno) {
      case 0:
        techno = '分选';
        break;
      case 1:
        techno = '加工灰（Ⅰ级）';
        break;
      case 2:
        techno = '加工灰（Ⅱ级）';
        break;
      case 3:
        techno = '原灰';
        break;
      case 4:
        techno = '其他';
        break;
      default:
        break;
    }
    switch (detail.level) {
      case 0:
        level = 'Ⅰ级';
        break;
      case 1:
        level = 'Ⅱ级';
        break;
      case 2:
        level = 'Ⅲ级';
        break;
      case 3:
        level = 'Ⅲw级';
        break;
      case 4:
        level = '干渣';
        break;
      case 5:
        level = '调湿灰';
        break;
      default:
        break;
    }
    return (
      <Row gutter={16} className={styles.row}>
        <Col span={8} className={styles.leftCol}>
          <div className={styles.deliveryNo}>No. {detail.deliveryNo}</div>
          <h1 className={styles.productName}>
            <div>{detail.title}</div>
            <p className={styles.name}>出厂合格证</p>
          </h1>
          <div className={styles.qrCode}>
            {detail.qrcodeUrl !== null ? <img src={`${detail.qrcodeUrl}`} alt="qrCode" /> : ''}
          </div>
          <ul className={styles.leftList}>
            <li>
              <span className={styles.label}>级别：</span>
              <div className={styles.content}>
                <span>{level}</span>
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
              <span className={styles.label}>库位：</span>
              <div className={styles.content}>
                <span>{detail.entrepotName}</span>
              </div>
            </li>
            <li>
              <span className={styles.label}>装车时间：</span>
              <div className={styles.content}>
                <span>{moment(detail.loadTime).format('YYYY年MM月DD日')}</span>
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
              <div className={supplierNameStyle}>
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
                    <span className={styles.content}>{level}</span>
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
                    <span className={styles.content}>{techno}</span>
                  </li>
                  <li>
                    <span className={styles.label}>运输车号：</span>
                    <span className={styles.content}>{detail.carNo}</span>
                  </li>
                </ul>
              </Col>
            </Row>
            <div className={styles.qrCode}>
              {detail.qrcodeUrl ? <img src={`${detail.qrcodeUrl}`} alt="qrCode" /> : ''}
            </div>
          </div>
          {(detail.level === 0 || detail.level === 1 || detail.level === 2) && (
            <table className={table}>
              <thead>
                <tr>
                  <th rowSpan="2" className={styles.standardName}>
                    项目
                  </th>
                  <th colSpan="3" className={styles.standards}>
                    国家标准
                  </th>
                  <th rowSpan="2" className={styles.standardsResult}>
                    检验结果
                  </th>
                </tr>
                <tr>
                  <th>Ⅰ级</th>
                  <th>Ⅱ级</th>
                  <th>Ⅲ级</th>
                </tr>
              </thead>
              <tbody>
                {/**
                 *  item.type===1：大于等于
                 *  item.type===0：小于等于
                 */
                detail.standards &&
                  detail.standards.map(item => (
                    <tr>
                      <td>{item.standardName}</td>
                      <td className={commonStyles.alignRight}>
                        {item.type === 0 ? '≤' : '≥'}
                        {item.oneLevel}
                      </td>
                      <td className={commonStyles.alignRight}>
                        {item.type === 0 ? '≤' : '≥'}
                        {item.twoLevel}
                      </td>
                      <td className={commonStyles.alignRight}>
                        {item.type === 0 ? '≤' : '≥'}
                        {item.threeLevel}
                      </td>
                      <td className={commonStyles.alignRight}>{item.parameter}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>结果评定</td>
                  <td colSpan="4">
                    <p>
                      所检项目符合 GB/T 1596-2017 国家标准F类
                      <span className={styles.resultLevel}>{level}</span>技术要求。
                    </p>
                    <p style={{ marginLeft: '30px' }}>{detail.remark}</p>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
          <Row gutter={16}>
            <Col span={6} offset={8}>
              审核员：{detail.auditor}
            </Col>
            <Col span={6} offset={4}>
              检验员：{detail.checker}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
export default connect(({ report }) => ({ report }))(Report);
