import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeAccountLogout } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      console.info('response->', response);
      // Login successfully
      if (response.code === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...response,
            currentAuthority: 'admin',
          },
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
        console.info('payload->', payload);
        console.info('token->', payload.data.token);
        document.cookie = `${payload.data.token}&&${payload.data.role}`;
        sessionStorage.setItem('cookie', `${payload.data.token}&&${payload.data.role}`);
        console.info('document.cookie->', document.cookie);
        console.info('session->', sessionStorage.getItem('cookie'));
      } else {
        document.cookie = '';
        sessionStorage.setItem('cookie', '');
      }
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
