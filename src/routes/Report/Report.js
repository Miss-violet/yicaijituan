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
            <img src={`http://www.yicaijituan.cn:8090/${detail.qrcodeUrl}`} alt="qrCode" />
          </div>
          <ul className={styles.leftList}>
            <li>
              <span className={styles.label}>级别：</span>
              <div className={styles.content}>
                <span>{detail.level === 0 ? 'I级' : detail.level === 1 ? 'II级' : 'III级'}</span>
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
                      {detail.level === 0 ? 'I类' : detail.level === 1 ? 'II类' : 'III类'}
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
                  <li>
                    <span className={styles.label}>运输车号：</span>
                    <span className={styles.content}>{detail.carNo}</span>
                  </li>
                </ul>
              </Col>
            </Row>
            <div className={styles.qrCode}>
              <img src={`http://www.yicaijituan.cn:8090/${detail.qrcodeUrl}`} alt="qrCode" />
            </div>
          </div>
          <table className={table}>
            <thead>
              <tr>
                <th rowSpan="2">项目</th>
                <th colSpan="3">国家标准</th>
                <th rowSpan="2">检验结果</th>
              </tr>
              <tr>
                <th>I级</th>
                <th>II级</th>
                <th>III级</th>
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
                    GB/T 1596-2017 国家标准F类
                    <span className={styles.resultLevel}>
                      {detail.level === 0 ? 'I' : detail.level === 1 ? 'II' : 'III'}
                    </span>级技术要求。
                  </p>
                  <p style={{ marginLeft: '30px' }}>{detail.remark}</p>
                </td>
              </tr>
            </tfoot>
          </table>
          <Row gutter={16}>
            <Col span={6} offset={8}>
              审核：{detail.auditor}
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
