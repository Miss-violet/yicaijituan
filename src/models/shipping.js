import { routerRedux } from 'dva/router';
import { shippingList, create, update, info, del } from '../services/shipping';

export default {
  namespace: 'shipping',

  state: {
    listData: [],
    total: '',
    selectedDetail: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(location => {
        if (location.pathname === '/shipping') {
          if (sessionStorage.getItem('token') === '') {
            dispatch(
              routerRedux.push({
                pathname: '/user/login',
              })
            );
          } else {
            dispatch({
              type: 'queryList',
              payload: {
                pageIndex: 0,
                pageSize: 20,
              },
            });
          }
        }
      });
    },
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const queryRes = yield call(shippingList, payload);
      if (queryRes.code === 0) {
        yield put({
          type: 'success',
          payload: {
            listData: queryRes.data.rows,
            total: queryRes.data.total,
          },
        });
      }
    },
    *create({ payload }, { call, put }) {
      const res = yield call(create, payload);
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            ...res.data,
          },
        });
        yield put({
          type: 'queryList',
          payload: {},
        });
      }
      return res;
    },
    *edit({ payload }, { call, put }) {
      const res = yield call(update, payload);
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            ...res.data,
          },
        });
        yield put({
          type: 'queryList',
          payload: {},
        });
      }
      return res;
    },
    *info({ payload, callback }, { call, put }) {
      const res = yield call(info, payload.id);
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            selectedDetail: res.data,
          },
        });
        if (callback) callback(res.code, res.data);
      }
    },
    *del({ payload }, { call }) {
      const res = yield call(del, payload)
      return res
    },
  },

  reducers: {
    success(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
