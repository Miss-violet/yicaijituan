import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeAccountLogout } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { queryCurrent } from '../services/user';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    currentUser: '',
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const userResponse = yield call(queryCurrent);
      if (userResponse?.data) {
        const { data: { tenantCode } } = userResponse

        reloadAuthorized();
        yield put(routerRedux.push('/'));
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

        // 必须写在前面，要存 token，不然在这之前的接口会报错
        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...response,
            currentAuthority: 'admin',
          },
        });

        const userResponse = yield call(queryCurrent);

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
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.code === 0) {
        const { data } = payload;
        localStorage.setItem('token', `${data.token}`);
        localStorage.setItem('role', `${data.role}`);
        localStorage.setItem('userId', `${data.id}`);
        localStorage.setItem('loginName', `${data.loginName}`);
        localStorage.setItem('companyId', `${data.companyId}`);
        localStorage.setItem('tenantCode', `${data.tenantCode}`);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('loginName');
        localStorage.removeItem('companyId');
        localStorage.removeItem('tenantCode');
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
