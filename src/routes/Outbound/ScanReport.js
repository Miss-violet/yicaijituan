import React, { Component } from 'react';
import { Row, Col, Modal, Button, Spin } from 'antd';
import Report_New from '../Report/components/report_new';
import { downloadAsPDF } from '../../utils/screenshot';
import classnames from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import logo from '../../assets/logo.svg';
import styles from '../Report/components/report_new.less';
import commonStyles from '../../assets/style/common.less';
import { TECHNO } from '../../utils/constant';

const QRCode = require('qrcode-generator');

@connect(({ report, productManage }) => ({
    detail: report.detail,
    productDetail: productManage.productDetail,
    standardColumnTitleData: productManage.standardColumnTitleData,
}))

export class ScanReport extends Component {
    constructor(props) {
        super(props);
        this.contentRef = React.createRef();
        this.state = {
            qrDataUrl: '', // 用于存储生成的二维码 data URL
            loading: true, // 页面信息的加载状态
        };
    }

    handleDownload = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        const content = this.contentRef.current;
        if (content) {
            await downloadAsPDF(content, '我的报告.pdf');
        } else {
            console.error('未找到截图区域');
        }
    }

    // 生成二维码的方法
    generateQR = () => {
        if (this.props.detail?.id) {
            this.setState({ loading: false });
        }
        const content = `http://www.yicaijituan.cn/scanResult/${this.props.detail.id}`;

        try {
            // 创建 QRCode 实例（纠错级别 L，版本 0 自动）
            const qr = QRCode(0, 'L');
            qr.addData(content);
            qr.make();
            // 生成 Data URL，尺寸 200x200，边距 0
            const dataUrl = qr.createDataURL(200, 0, 0);
            this.setState({ qrDataUrl: dataUrl });
        } catch (e) {
            console.error('二维码生成失败:', e);
            this.setState({ qrDataUrl: '' });
        }
    };

    componentDidMount() {
        this.generateQR();
    }

    componentDidUpdate(prevProps) {
        if (this.props.detail?.id !== prevProps.detail?.id) {
            this.generateQR();
        }
    }

    render() {
        const { qrDataUrl } = this.state;
        const { visible, closeModal, detail, productDetail, standardColumnTitleData } = this.props;
        const { footContent, footName, headName, headResult, headTitle, styleImpleStandard, printName, remark } = productDetail;
        const footContentArray = footContent && footContent.split('@');
        const startFootContent = footContentArray && footContentArray[0];
        const endFootContent = footContentArray && (footContentArray[1] || '技术要求');
        const table = classnames({
            [commonStyles.table]: true,
            [styles.table]: true,
        });
        const resultLevelStyle = classnames({
            [styles.resultLevel]: true,
            [styles.resultLevel_underline]: detail && detail.productId !== 45,
        });
        return (
            <Modal
                title="扫描报告"
                visible={visible}
                onCancel={closeModal}
                footer={
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Button type="primary" onClick={this.handleDownload}>
                            下载报告
                        </Button>
                        <Button onClick={closeModal}>关闭</Button>
                    </div>
                }
                width={1400}
            >
                <Spin spinning={this.state.loading}>
                    <div ref={this.contentRef} style={{ width: '100%', height: '100%' }}>
                        {/* <Report_New {...restProps} /> */}
                        <Row gutter={16} className={styles.row}>
                            <Col span={10} className={styles.leftCol}>
                                <div className={styles.companyName}>
                                    <img src={logo} className={styles.logo} />
                                    <span>{detail.styleTitleLeft || detail.title || '厦门益材粉煤灰有限责任公司'}</span>
                                </div>
                                <div style={{margin: '20px 0'}}>
                                    <div className={styles.deliveryNo}>No. {detail.deliveryNo}</div>
                                    <h1 className={styles.productName}>
                                        <p className={styles.name}>合格证</p>
                                    </h1>
                                </div>
                                <ul className={styles.leftList}>
                                    {
                                        detail.sealNo &&
                                        <li>
                                            <span className={styles.label}>封签编号：</span>
                                            <div className={styles.content}>
                                                <span>{detail.sealNo}</span>
                                            </div>
                                        </li>
                                    }
                                    <li>
                                        <span className={styles.label}>产品名称：</span>
                                        <div className={styles.content}>
                                            <span>{detail?.feature?.styleProductName || "F类粉煤灰"}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.label}>用户单位：</span>
                                        <div className={styles.content}>
                                            <span>{detail.customer}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.label}>等级：</span>
                                        <div className={styles.content}>
                                            <span>{detail.columnTitle}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.label}>数量：</span>
                                        <div className={styles.content}>
                                            <span>{detail.unitNum || '--'}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.label}>工艺：</span>
                                        <div className={styles.content}>
                                            <span>{TECHNO[detail.techno] || ''}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.label}>出厂日期：</span>
                                        <div className={styles.content}>
                                            <span>{moment(detail.outTime).format('YYYY年MM月DD日')}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.label}>出厂批号：</span>
                                        <div className={styles.content}>
                                            <span>{detail.batchNo}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.label}>车牌号：</span>
                                        <div className={styles.content}>
                                            <span>{detail.carNo}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.label}>执行标准：</span>
                                        <div className={styles.content}>
                                            <span>{styleImpleStandard || headTitle || 'GB/T1596-2017'}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.label}>生产厂家：</span>
                                        <div className={styles.content}>
                                            <span>{detail.supplierName}</span>
                                        </div>
                                    </li>
                                    {detail.produceAddress
                                        && <li>
                                            <span className={styles.label}>生产地址：</span>
                                            <div className={styles.content}>
                                                <span>{detail.produceAddress}</span>
                                            </div>
                                        </li>
                                    }
                                    <li>
                                        <span className={styles.label}>电话：</span>
                                        <div className={styles.content}>
                                            <span>{detail.orderPhone || '--'}</span>
                                        </div>
                                    </li>
                                </ul>
                            </Col>
                            <Col span={14} className={styles.rightCol}>
                                <div>
                                    <div className={styles.topInfoWrap}>
                                        <div className={styles.topInfoLeftWrap}>
                                            <h2 className={styles.name}>{detail.styleTitleRight || remark || '粉煤灰检验报告单'}</h2>
                                            <div className={styles.No}>No：{detail.monthlyBatch || '--'}</div>
                                            <div className={styles.topInfoLeftWrapRow}>
                                                <div className={styles.label}>生产日期：</div>
                                                <div className={styles.content}>{detail.deliveryTime ? moment(detail.deliveryTime).format('YYYY.MM.DD') : '-'}</div>
                                                <div className={styles.label}>生产批号：</div>
                                                <div className={styles.content}>{detail.productBatch || '--'}</div>
                                            </div>
                                            <div className={styles.topInfoLeftWrapRow}>
                                                <div className={styles.label}>出厂日期：</div>
                                                <div className={styles.content}>{moment(detail.outTime).format('YYYY.MM.DD')}</div>
                                                <div className={styles.label}>出厂批号：</div>
                                                <div className={styles.content}> {detail.batchNo}</div>

                                            </div>
                                        </div>
                                        <div className={styles.topInfoRightWrap}>
                                            {/* <img src={`${detail.qrcodeUrl}`} alt="qrCode" className={styles.qrCode} /> */}
                                            {qrDataUrl ?
                                                <img src={qrDataUrl} alt="二维码" className={styles.qrCode}
                                                    onLoad={() => console.log('图片加载成功')}
                                                    onError={() => console.error('二维码加载失败')}
                                                /> : <div style={{ color: '#999' }}>二维码生成中...</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <table className={table}>
                                    <thead>
                                        <tr>
                                            <th colSpan={2} style={{ width: '70%' }}>
                                                {headName}
                                            </th>
                                            <th colSpan={standardColumnTitleData.length} style={{ width: '15%' }}>
                                                标准要求
                                            </th>
                                            <th style={{ width: '15%', whiteSpace: 'nowrap' }}>
                                                {headResult}
                                            </th>
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
                                                    <td colSpan={2} style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                                        {item.standardName}
                                                    </td>
                                                    {item.params.map(paramsItem => (
                                                        <td className={commonStyles.alignRight}>
                                                            {paramsItem.type === 0 ? '≤' : '≥'}
                                                            {paramsItem.val}
                                                        </td>
                                                    ))}
                                                    <td className={commonStyles.alignRight}>{item.parameter || ''}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td style={{ width: '20%' }}>{footName}</td>
                                            <td colSpan={standardColumnTitleData.length + 5}>
                                                <p>
                                                    {startFootContent}
                                                    <span className={resultLevelStyle}>{detail.columnTitle}</span>
                                                    {endFootContent}。
                                                </p>
                                                <p style={{ marginLeft: '30px' }}>{detail.remark}</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">
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
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </Col>
                        </Row>
                    </div>

                </Spin>
            </Modal>
        );
    }
}