import { routerRedux } from 'dva/router';
import { log } from '../services/journal';

export default {
  namespace: 'journal',

  state: {
    data: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(location => {
        if (location.pathname === '/journal') {
          if (!document.cookie && sessionStorage.getItem('cookie') === '') {
            dispatch(
              routerRedux.push({
                pathname: '/user/login',
              })
            );
          } else {
            dispatch({
              type: 'log',
              payload: {},
            });
          }
        }
      });
    },
  },

  effects: {
    *log({ payload }, { call, put }) {
      const res = yield call(log, payload);
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            data: res.data.rows,
          },
        });
      }
    },
  },

  reducers: {
    success(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
