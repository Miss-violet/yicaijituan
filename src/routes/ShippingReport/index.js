import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import styles from './index.less'

@connect(({ shippingReport }) => ({
  detail: shippingReport.detail,
}))

class ShippingReport extends PureComponent {
  render() {
    const { detail } = this.props
    console.info('detail->', detail)
    const { shippingNo, purchaser, productName, specification, quantity, carNo, loadPlace, clerker, picker, remarks, accQuantity, accepter, accTime } = detail
    const column = [{
      label: '品名',
      value: productName,
      letterSpacing: 30,
    }, {
      label: '规格',
      value: specification,
      letterSpacing: 30,
    }, {
      label: '数量（吨/包）',
      value: quantity,
    }, {
      label: '车（船）号',
      value: carNo,
    }, {
      label: '装货地点',
      value: loadPlace,
    }, {
      label: '开单员',
      value: clerker,
      letterSpacing: 20,
    }, {
      label: '提货（运输人）',
      value: picker,
    }, {
      label: '备注',
      value: remarks,
      letterSpacing: 30,
    }]

    const accInfo = [{
      label: '验收数量',
      value: accQuantity,
    }, {
      label: '验收人',
      value: accepter,
    }, {
      label: '日期',
      value: moment(accTime).format('YYYY年MM月DD日'),
    }]
    return (
      <div className={styles.wrap}>
        <h1 className={styles.title}>发货单</h1>
        <div className={styles.No}>{shippingNo}</div>
        <div className={styles.purchaser}>
          <div>购货单位：{purchaser}</div>
          <div>{moment(accTime).format('YYYY  年  MM  月  DD  日  hh  时')}</div>
        </div>
        <div className={styles.tableWrap}>
          <div className={styles.table}>
            {
              column.map(item => {
                const { label, value, letterSpacing = 0 } = item
                return (
                  <div className={styles.td}>
                    <div style={{ letterSpacing, textIndent: letterSpacing }} className={styles.tdLabel}>{label}</div>
                    <div className={styles.tdValue}>{value}</div>
                  </div>
                )
              })
            }
          </div>
          <div className={styles.accInfo}>
            {accInfo.map(item => {
              const { label, value } = item
              return (
                <div>
                  {label}：
                  {value}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default ShippingReport