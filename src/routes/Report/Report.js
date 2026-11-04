import React, { Component } from 'react';
import { connect } from 'dva';
import Report_Old from './components/report_old';
import Report_New from './components/report_new';

@connect(({ report }) => ({
    detail: report.detail,
}))

export default class Report extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { detail } = this.props;
    return detail.styleNum?<Report_New />:
      <Report_Old />
    ;
  }
}
