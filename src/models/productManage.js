import { routerRedux } from 'dva/router';
import { create, update, del, productList } from '../services/productManage'

export default {
  namespace: 'productManage',

  state: {
    data: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((location) => {
        if (location.pathname === '/productManage') {
          // if (!document.cookie && sessionStorage.getItem('cookie') === '') {
          if (sessionStorage.getItem('cookie') === '') {
            dispatch(routerRedux.push({
              pathname: '/user/login',
            }))
          }
          else {
            dispatch({
              type: 'queryList',
              payload: {},
            })
          }
        }
      })
    },
  },

  effects: {
    *create({ payload }, { call, put }) {
      const res = yield call(create, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            ...res.data,
          },
        })
        yield put({
          type: 'queryList',
          payload: {},
        })
      }
    },
    *edit({ payload }, { call, put }) {
      const res = yield call(update, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            ...res.data,
          },
        })
        yield put({
          type: 'queryList',
          payload: {},
        })
      }
    },
    *delete({ payload }, { call, put }) {
      const res = yield call(del, payload)
      if (res.code === 0) {
        yield put({
          type: 'queryList',
          payload: {},
        })
      }
    },
    *queryList({ payload }, { call, put }) {
      const res = yield call(productList, payload)
      if (res.code === 0) {
        yield put({
          type: 'success',
          payload: {
            data: res.data,
          },
        })
      }
    },
  },

  reducers: {
    success(state, { payload }) {
      return { ...state, ...payload }
    },
  },
};
