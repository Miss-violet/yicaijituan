import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

import { getProductList, getProductInfo, createStandardTitle, delStandardTitle, editStandardTitle, getStandardTitleList, createStandardParams, queryStandardParams } from './mock/productManage'

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/loginSubmit': (req, res) => {
    const { password, loginName, type } = req.body;
    if (password === '888888' && loginName === 'admin') {
      res.send({
        code: 0,
        type,
        currentAuthority: 'admin',
        msg: 'success',
        'success': true,
        data: {
          "id": 41,
          "loginName": "admin",
          "password": null,
          "userName": "平台管理员",
          "sex": 0,
          "birth": null,
          "phone": "",
          "address": null,
          "email": null,
          "role": 0,
          "status": null,
          "companyId": 73,
          "tenantCode": "songneng",
          "token": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0MSIsInN1YiI6InVuaXF1ZSIsImlzcyI6InVuaXF1ZSIsImlhdCI6MTU1MDEyNTYwNCwiZXhwIjoxNTUwMTk3NjA0fQ.5zF-5a-u5agNrvJrPhWLs7MWecWKpOBm4ZR6SaNxv_M",
          "startTime": null,
          "endTime": null
        }
      });
      return;
    }
    if (password === '123456' && loginName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/user/info': (req, res) => {
    res.send({
      code: 0,
      currentAuthority: 'admin',
      msg: 'success',
      success: true,
      data: {
        "id": 41,
        "loginName": "admin",
        "password": null,
        "userName": "平台管理员",
        "sex": 0,
        "birth": 1535644800000,
        "phone": "",
        "address": null,
        "email": null,
        "role": 0,
        "status": 0,
        "companyId": 73,
        "companyName": null,
        "tenantCode": "songneng",
        "createBy": "lld",
        "createTime": 1531185348000,
        "modifyTime": 1535679261000,
        "modifyBy": "admin"
      },
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'POST /api/user/create': (req, res) => {
    console.info('mock')
  },
  'POST /api/product/list': getProductList,
  'POST /api/product/info/*': getProductInfo,
  'POST /api/standardTitle/create': createStandardTitle,
  'POST /api/standardTitle/list/*/*': getStandardTitleList,
  'POST /api/standardTitle/delete/*': delStandardTitle,
  'POST /api/standardTitle/update': editStandardTitle,
  'POST /api/standardParams/create': createStandardParams,
  'POST /api/standardParams/list/*': queryStandardParams,
};

export default (noProxy ? {} : delay(proxy, 1000));
// export default {
//   'GET /api/(.*)': 'http://119.23.210.125:8090/api/',
// };