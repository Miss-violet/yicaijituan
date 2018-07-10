import React, { Component } from 'react'
import * as moment from 'moment'
import { connect } from 'dva'
import styles from './scanResult.less'

class ScanResult extends Component {
  constructor() {
    super()
    this.state = {

    }
  }
  render() {
    const {detail} = this.props.scanResult
    return (
      <div className={styles.resultWrap}>
        <div className={styles.alignCenter}>
          已扫描到以下内容
        </div>
        <ul className={styles.result}>
          <li>
            {detail && detail.title}检验报告
          </li>
          <li>
            客户名称：{detail && detail.customer}
          </li>
          <li>
            品名：{detail && detail.productName}
          </li>
          <li>
            级别：{detail && (detail.level === 0 ? 'I级' : (detail.level === 1 ? 'II级' : 'III级'))}
          </li>
          <li>
            运输车号：{detail && detail.carNo}
          </li>
          <li>
            皮重（kg）：{detail && detail.tareWeight}
          </li>
          <li>
            毛重（kg）：{detail && detail.grossWeight}
          </li>
          <li>
            净重（kg）：{detail && detail.netWeight}
          </li>
          <li>
            出厂时间：{detail && moment(detail.createTime).format('YYYY年MM月DD日')}
          </li>
        </ul>
      </div>
    )
  }
}
export default connect(({scanResult}) => ({ scanResult }))(ScanResult)