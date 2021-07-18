import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import { getRoutes } from '../utils/utils';

const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

const copyright = (
  <Fragment>
    <div>
      Copyright <Icon type="copyright" /> 2021 益材集团
    </div>
    <div>
      备案号：
      <a href="https://beian.miit.gov.cn/" target="_blank">
        闽ICP备18014922号-1
      </a>
    </div>
  </Fragment>
);

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '益材';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 益材`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <a href="http://www.xmyicai.cn/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>益材</span>
                </a>
              </div>

              {/*
                <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
              */}
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
