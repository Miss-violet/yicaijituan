import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import styles from './scanResult.less';

class ScanResult extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { detail } = this.props.scanResult;
    return (
      <div className={styles.resultWrap}>
        <div className={styles.alignCenter}>已扫描到以下内容</div>
        <ul className={styles.result}>
          <li>{detail && detail.title}检验报告</li>
          <li>客户名称：{detail && detail.customer}</li>
          <li>品名：{detail && '粉煤灰'}</li>
          <li>
            级别：{detail && detail.columnTitle}
          </li>
          <li>运输车号：{detail && detail.carNo}</li>
          <li>皮重（kg）：{detail && Number(detail.tareWeight).toLocaleString()}</li>
          <li>毛重（kg）：{detail && Number(detail.grossWeight).toLocaleString()}</li>
          <li>净重（kg）：{detail && Number(detail.netWeight).toLocaleString()}</li>
          <li>出厂时间：{detail && moment(detail.outTime).format('YYYY年MM月DD日')}</li>
        </ul>
      </div>
    );
  }
}
export default connect(({ scanResult }) => ({ scanResult }))(ScanResult);
