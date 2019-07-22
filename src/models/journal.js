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
          if (sessionStorage.getItem('token') === '') {
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
        const { data } = res
        const { currentPage: current, pageSize, total, rows } = data
        yield put({
          type: 'success',
          payload: {
            data: rows,
            pagination: {
              current,
              pageSize,
              total,
            },
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
