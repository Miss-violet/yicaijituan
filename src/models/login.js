import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeAccountLogout } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { queryCurrent, queryShippingFlag } from '../services/user';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    currentUser: '',
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const userResponse = yield call(queryCurrent);
      if (userResponse) {
        const { data: { tenantCode } } = userResponse
        yield put({
          type: 'shippingFlag',
          payload: {
            tenantCode,
          },
        })
      }
      yield put({
        type: 'saveCurrentUser',
        payload: userResponse.data,
      });
    },
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      // Login successfully
      if (response.code === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...response,
            currentAuthority: 'admin',
          },
        });
        const userResponse = yield call(queryCurrent);
        if (userResponse) {
          const { data: { tenantCode } } = userResponse
          yield put({
            type: 'shippingFlag',
            payload: {
              tenantCode,
            },
          })
        }
        yield put({
          type: 'saveCurrentUser',
          payload: userResponse.data,
        });

        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *logout({ payload }, { call, put, select }) {
      const res = yield call(fakeAccountLogout, payload);
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
    // 查询发货单表示，和 role 一起判断是否展示发货单菜单和发货单相关按钮
    *shippingFlag({ payload }, { call, put }) {
      const shippingFlagRes = yield call(queryShippingFlag, payload)
      const { code, data } = shippingFlagRes
      if (code === 0) {
        const { shippingFlag } = data
        sessionStorage.setItem('shippingFlag', shippingFlag)
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.code === 0) {
        const { data } = payload;
        sessionStorage.setItem('token', `${data.token}`);
        sessionStorage.setItem('role', `${data.role}`);
        sessionStorage.setItem('userId', `${data.id}`);
        sessionStorage.setItem('loginName', `${data.loginName}`);
        sessionStorage.setItem('companyId', `${data.companyId}`);
        sessionStorage.setItem('tenantCode', `${data.tenantCode}`);
      } else {
        sessionStorage.setItem('token', '');
        sessionStorage.setItem('role', '');
        sessionStorage.setItem('userId', '');
        sessionStorage.setItem('loginName', '');
        sessionStorage.setItem('companyId', '');
        sessionStorage.setItem('tenantCode', '');
        sessionStorage.setItem('shippingFlag', '')
      }
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload && action.payload.loginName,
      };
    },
  },
};
