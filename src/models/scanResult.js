import pathToRegexp from 'path-to-regexp';
import { scanResult } from '../services/outbound';

export default {
  namespace: 'scanResult',

  state: {
    detail: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(location => {
        const match = pathToRegexp('/scanResult/:id').exec(location.pathname);
        if (match && Number(match[1])) {
          dispatch({
            type: 'info',
            payload: {
              id: match[1],
            },
          });
        }
      });
    },
  },

  effects: {
    *info({ payload }, { call, put }) {
      const res = yield call(scanResult, payload.id);
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            detail: res.data,
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
